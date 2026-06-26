import pandas as pd
from validator import validar_codigo_11_digitos

def calcular_digito_11(codigo_10_digitos: str) -> str:
    """Calcula el dígito verificador matemático para un identificador de 10 números."""
    digitos_base = [int(d) for d in codigo_10_digitos]
    suma_impares = sum(digitos_base[0::2])
    suma_pares = sum(digitos_base[1::2])
    
    resultado_calculado = ((suma_impares * 3) + suma_pares) % 10
    return str(resultado_calculado)

def generar_inventario_ejemplo():
    """Genera de forma automática el Excel con códigos válidos."""
    productos_base = [
        {"id_corto": "1", "nombre": "Remera Oversize Black", "precio": 25000, "stock": 15},
        {"id_corto": "2", "nombre": "Gorra Streetwear Nylon", "precio": 12000, "stock": 8},
        {"id_corto": "3", "nombre": "Pantalón Cargo Beige", "precio": 42000, "stock": 20},
        {"id_corto": "4", "nombre": "Buzo Hoodie Heavyweight", "precio": 38000, "stock": 5},
        {"id_corto": "99", "nombre": "Media Premium Pack", "precio": 4500, "stock": 50},
    ]
    
    inventario_final = []
    
    for prod in productos_base:
        codigo_10 = prod["id_corto"].zfill(10)  # Agrega ceros: "1" -> "0000000001"
        digito_11 = calcular_digito_11(codigo_10)
        codigo_completo = codigo_10 + digito_11
        
        # Validación de control interna
        assert validar_codigo_11_digitos(codigo_completo) == True
        
        inventario_final.append({
            "codigo": codigo_completo,
            "nombre": prod["nombre"],
            "precio": prod["precio"],
            "stock": prod["stock"]
        })
    
    df = pd.DataFrame(inventario_final)
    df.to_excel("inventario.xlsx", index=False)
    print("¡Excel 'inventario.xlsx' creado exitosamente con códigos válidos!")
    print("\nCódigos generados para pruebas de escaneo:")
    for item in inventario_final:
        print(f"-> {item['nombre']}: {item['codigo']}")

if __name__ == "__main__":
    generar_inventario_ejemplo()
