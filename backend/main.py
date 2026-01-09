import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client

# 1. CARGA DE CONFIGURACIÓN
load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

# 2. INICIALIZACIÓN
app = FastAPI()
supabase: Client = create_client(url, key)

# 3. PERMISOS DE SEGURIDAD (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo para recibir datos del frontend
class ItemProducto(BaseModel):
    nombre: str
    precio: int

# 4. RUTAS (API)

@app.get("/")
def home():
    return {"status": "Servidor Online"}

# Obtener todos los productos
@app.get("/productos")
def obtener_productos():
    res = supabase.table("Productos").select("*").order("id").execute()
    return res.data

# Crear un producto nuevo
@app.post("/productos")
def crear_producto(item: ItemProducto):
    res = supabase.table("Productos").insert({
        "nombre": item.nombre, 
        "precio": item.precio
    }).execute()
    return {"mensaje": "Guardado", "dato": res.data}

# Eliminar un producto por ID
@app.delete("/productos/{producto_id}")
def eliminar_producto(producto_id: int):
    res = supabase.table("Productos").delete().eq("id", producto_id).execute()
    return {"mensaje": "Eliminado"}