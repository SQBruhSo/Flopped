def validar_codigo_11_digitos(codigo_str: str) -> bool:
    """
    Valida si el código de 11 dígitos cumple con la regla matemática de confirmación.
    """
    if len(codigo_str) != 11 or not codigo_str.isdigit():
        return False
        
    digitos_base = [int(d) for d in codigo_str[:10]]
    digito_verificador_real = int(codigo_str[10])
    
    # Algoritmo de control: Suma ponderada de posiciones pares e impares
    suma_impares = sum(digitos_base[0::2])  # 1ra, 3ra, 5ta...
    suma_pares = sum(digitos_base[1::2])    # 2da, 4ta, 6ta...
    
    resultado_calculado = ((suma_impares * 3) + suma_pares) % 10
    
    return resultado_calculado == digito_verificador_real
