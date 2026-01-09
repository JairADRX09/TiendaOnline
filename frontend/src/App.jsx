import React, { useState, useEffect } from 'react'

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [isCarritoOpen, setIsCarritoOpen] = useState(false);
  
  // --- NUEVOS ESTADOS PARA LOGIN ---
  const [user, setUser] = useState(null); // Guarda el usuario si está logueado
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/productos");
      const data = await res.json();
      setProductos(data);
    } catch (err) { console.error(err); }
  };

  // --- LÓGICA DE LOGIN (Simulada para esta estructura protegida) ---
  const manejarLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setUser({ email: email }); // Simulamos el éxito del login
      setIsLoginOpen(false);
      alert("Bienvenido, " + email);
    }
  };

  const cerrarSesion = () => {
    setUser(null);
    setEmail("");
    setPassword("");
  };

  const agregarAlCarrito = (p) => {
    setCarrito([...carrito, p]);
    setIsCarritoOpen(true);
  };

  const eliminarDelCarrito = (index) => {
    const nuevo = [...carrito];
    nuevo.splice(index, 1);
    setCarrito(nuevo);
  };

  const total = carrito.reduce((sum, item) => sum + item.precio, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans relative overflow-x-hidden">
      
      {/* --- MODAL DE LOGIN --- */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsLoginOpen(false)}></div>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative z-[110] shadow-2xl">
            <h2 className="text-2xl font-black uppercase mb-6 italic">Iniciar Sesión</h2>
            <form onSubmit={manejarLogin} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400">Email</label>
                <input 
                  type="email" 
                  className="w-full border-b-2 border-gray-100 focus:border-red-500 outline-none py-2 transition-colors"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400">Contraseña</label>
                <input 
                  type="password" 
                  className="w-full border-b-2 border-gray-100 focus:border-red-500 outline-none py-2 transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-red-600 transition-all mt-4">
                Entrar a la tienda
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- SIDEBAR DEL CARRITO --- */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[60] transform transition-transform duration-300 ${isCarritoOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-black uppercase italic">Carrito</h2>
            <button onClick={() => setIsCarritoOpen(false)} className="text-2xl">✕</button>
          </div>
          <div className="flex-grow overflow-y-auto space-y-4">
            {carrito.map((item, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-bold text-sm uppercase">{item.nombre}</p>
                  <p className="text-red-500 font-bold">${item.precio}</p>
                </div>
                <button onClick={() => eliminarDelCarrito(i)} className="text-gray-300 hover:text-red-500">✕</button>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between font-black text-xl uppercase mb-4">
              <span>Total:</span>
              <span>${total}</span>
            </div>
            <button className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-tighter">Pagar Ahora</button>
          </div>
        </div>
      </div>

      {/* --- HEADER --- */}
      <header className="bg-white shadow-sm sticky top-0 z-50 p-4 border-b">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">LOGO</div>
            <span className="text-xl font-black italic">MI TIENDA</span>
          </div>

          <nav className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase hidden md:block">{user.email}</span>
                <button onClick={cerrarSesion} className="text-red-500 font-bold text-sm uppercase">Salir</button>
              </div>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="text-gray-600 font-bold hover:text-red-500 text-sm uppercase">Login</button>
            )}
            
            <button onClick={() => setIsCarritoOpen(true)} className="relative">
              <span className="text-2xl">🛒</span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                {carrito.length}
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* --- CUERPO --- */}
      <main className="flex-grow max-w-4xl mx-auto w-full p-6">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-8">Catálogo</h2>
        <div className="space-y-4">
          {productos.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border p-4 flex gap-6 items-center hover:shadow-xl transition-all">
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-300">IMAGEN</div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <h3 className="text-xl font-black uppercase">{p.nombre}</h3>
                  {/* SOLO EL ADMIN (LOGUEADO) VE EL BOTÓN DE ELIMINAR */}
                  {user && (
                    <button className="text-gray-200 hover:text-red-500 transition-colors">🗑️</button>
                  )}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-black text-red-500">${p.precio}</span>
                  <button onClick={() => agregarAlCarrito(p)} className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors">
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-white border-t p-10 text-center">
        <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">Tienda Online Protegida 2026</p>
      </footer>
    </div>
  )
}

export default App