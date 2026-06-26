// CONFIGURACIÓN: Cambiá esto por la IP local de tu PC ejecutando el backend (Ej: 'http://111.111.1.11:8000')
const API_BASE_URL = 'http://127.0.0.1:8000'; 

const video = document.getElementById('webcam');
const productCard = document.getElementById('product-card');
const scannerBox = document.getElementById('scanner-box');

let escaneoBloqueado = false;

// 1. Encender la cámara del Celular
async function inicializarCamara() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: "environment" } }, // Intenta usar la cámara trasera obligatoriamente
            audio: false
        });
        video.srcObject = stream;
    } catch (err) {
        console.warn("No se detectó cámara trasera, usando cámara disponible/frontal.");
        try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            video.srcObject = fallbackStream;
        } catch (e) {
            alert("Error crítico: No se pudo acceder a ninguna cámara.");
        }
    }
}

// 2. Enviar código detectado a la API backend
async function procesarCodigoDetectado(codigo) {
    if (escaneoBloqueado) return;
    escaneoBloqueado = true;

    // Efecto visual de captura exitosa
    scannerBox.classList.add('box-success');
    if (navigator.vibrate) navigator.vibrate(60); // Vibración háptica en celulares

    try {
        const response = await fetch(`${API_BASE_URL}/scan/${codigo}`);
        const data = await response.json();

        if (response.ok) {
            mostrarTarjetaProducto(data.producto);
        } else {
            alert(`Error: ${data.detail || 'Código inválido'}`);
            reiniciarEscaner();
        }
    } catch (error) {
        alert("Error de conexión con el servidor backend.");
        reiniciarEscaner();
    }
}

// 3. Renderizar y mostrar el Bottom Sheet de Apple
function mostrarTarjetaProducto(producto) {
    document.getElementById('prod-nombre').innerText = producto.nombre;
    document.getElementById('prod-precio').innerText = `$${producto.precio.toLocaleString('es-AR')}`;
    document.getElementById('prod-stock').innerText = `Stock: ${producto.stock} u.`;
    document.getElementById('prod-id').innerText = `ID: ${producto.codigo}`;
    
    productCard.classList.add('sheet-open');
}

function reiniciarEscaner() {
    productCard.classList.remove('sheet-open');
    scannerBox.classList.remove('box-success');
    setTimeout(() => {
        escaneoBloqueado = false;
    }, 400); // Pequeño delay de gracia antes del próximo escaneo
}

// Event Listeners para cerrar la tarjeta
document.getElementById('btn-close').addEventListener('click', reiniciarEscaner);
document.getElementById('btn-close-bar').addEventListener('click', reiniciarEscaner);

// Botón de prueba para simular lectura real sin usar la lógica visual compleja de la cámara
document.getElementById('btn-manual').addEventListener('click', () => {
    procesarCodigoDetectado('00000000013');
});

// Arrancar cámara al cargar la página
window.addEventListener('load', inicializarCamara);
