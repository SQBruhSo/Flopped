const video = document.getElementById('webcam');
const scannerLaser = document.getElementById('scanner-laser');
const productCard = document.getElementById('product-card');

// Elementos de la tarjeta de producto
const prodNombre = document.getElementById('prod-nombre');
const prodPrecio = document.getElementById('prod-precio');
const prodStock = document.getElementById('prod-stock');

let scanningActive = true;

// 1. Activar la cámara del celular (Usando la cámara trasera por defecto)
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // Fuerza la cámara trasera
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error al acceder a la cámara: ", err);
        alert("Por favor, permite el acceso a la cámara para usar el escáner.");
    }
}

// 2. Simulación y lectura del sistema de muescas/líneas rectangulares
// En producción, aquí se procesarían los fotogramas del canvas leyendo transiciones de blanco/negro
function iniciarBucleEscaneo() {
    setInterval(() => {
        if (!scanningActive) return;

        // Aquí el algoritmo detectaría tu patrón rectangular. 
        // Para pruebas en el navegador, si presionas la tecla "S" o tocas la pantalla simulamos una lectura exitosa de prueba
    }, 1000);
}

// Función para enviar los 11 dígitos al backend de Python
async function procesarCodigoEscaneado(codigo11Digitos) {
    if (!scanningActive) return;
    scanningActive = false; // Pausamos el escaneo para no saturar

    try {
        // Cambia localhost por la IP local de tu PC cuando pruebes desde el celular
        const response = await fetch(`http://localhost:8000/scan/${codigo11Digitos}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Error en el servidor");
        }

        const data = await response.json();
        mostrarProducto(data.producto);

    } catch (error) {
        console.error("Error al escanear:", error.message);
        // Feedback visual de error (Parpadeo rojo rápido)
        scannerLaser.style.borderColor = "#ef4444";
        setTimeout(() => {
            scannerLaser.style.borderColor = "rgba(255,255,255,0.6)";
            scanningActive = true;
        }, 1500);
    }
}

function mostrarProducto(producto) {
    // Feedback háptico (Vibración corta si estás en celular)
    if (navigator.vibrate) navigator.vibrate(60);

    // Feedback visual verde
    scannerLaser.classList.add('scanner-success');

    // Inyectar datos en el Bottom Sheet estilo Apple
    prodNombre.textContent = producto.nombre;
    prodPrecio.textContent = `$${producto.precio.toLocaleString('es-AR')}`;
    prodStock.textContent = `Stock: ${producto.stock} u.`;

    // Desplegar tarjeta animada
    productCard.classList.add('sheet-open');
}

function cerrarTarjeta() {
    productCard.classList.remove('sheet-open');
    scannerLaser.classList.remove('scanner-success');
    
    // Esperamos a que termine la animación de bajada para reactivar la cámara
    setTimeout(() => {
        scanningActive = true;
    }, 400);
}

// Permitir simular un escaneo haciendo click en el cuadro del visor (Ideal para desarrollo/testeo)
scannerLaser.addEventListener('click', () => {
    // Enviamos el código de la Remera Oversize generado por el backend
    procesarCodigoEscaneado("00000000013"); 
});

// Arrancar la app
initCamera();
iniciarBucleEscaneo();
