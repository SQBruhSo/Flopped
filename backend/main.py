from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
from validator import validar_codigo_11_digitos

app = FastAPI(title="StripeID API")

# Permite conectar el backend con el celular/frontend en la misma red local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EXCEL_PATH = "inventario.xlsx"

def buscar_en_excel(codigo: str):
    if not os.path.exists(EXCEL_PATH):
        return None
    try:
        # Forzamos a leer la columna 'codigo' como string para mantener los ceros a la izquierda
        df = pd.read_excel(EXCEL_PATH, dtype={"codigo": str})
        producto = df[df["codigo"] == codigo]
        if not producto.empty:
            return producto.iloc[0].to_dict()
        return None
    except Exception as e:
        print(f"Error procesando el Excel: {e}")
        return None

@app.get("/scan/{codigo}")
async def escanear_codigo(codigo: str):
    if len(codigo) != 11:
        raise HTTPException(status_code=400, detail="Formato incorrecto. Deben ser 11 dígitos.")
        
    if not validar_codigo_11_digitos(codigo):
        raise HTTPException(status_code=422, detail="Código inválido. Falló la confirmación real.")
        
    datos_producto = buscar_en_excel(codigo)
    if not datos_producto:
        raise HTTPException(status_code=404, detail="Producto inexistente en la tabla.")
        
    return {
        "status": "success",
        "producto": datos_producto
    }
