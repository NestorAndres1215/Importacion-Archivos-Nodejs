// --- Constantes ---
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = [
    "image/jpeg", "image/png", "application/pdf",
    "application/msword", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

// --- Elementos ---
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const fileDetails = document.getElementById('file-details');
const fileName = document.getElementById('file-name');
const fileSize = document.getElementById('file-size');
const submitBtn = document.getElementById('submit-btn');

// --- Eventos de arrastre ---
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev =>
    dropArea.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); })
);

['dragenter', 'dragover'].forEach(ev =>
    dropArea.addEventListener(ev, () => {
        dropArea.style.borderColor = '#3498db';
        dropArea.style.background = '#f0f8ff';
    })
);

['dragleave', 'drop'].forEach(ev =>
    dropArea.addEventListener(ev, () => {
        dropArea.style.borderColor = '#e0e0e0';
        dropArea.style.background = '#fafafa';
    })
);

// --- Manejo archivos ---
dropArea.addEventListener('drop', e => {
    fileInput.files = e.dataTransfer.files;
    validateFile();
});
fileInput.addEventListener('change', validateFile);

function validateFile() {
    const file = fileInput.files[0];
    if (!file) return;

    // Validar tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
        Swal.fire("Advertencia", "El tipo de archivo no está permitido.", "warning");
        fileInput.value = "";
        submitBtn.disabled = true;
        fileDetails.style.display = 'none';
        return;
    }

    // Validar tamaño
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
        Swal.fire("Archivo muy grande", "El archivo supera los 10MB.", "error");
        fileInput.value = "";
        submitBtn.disabled = true;
        fileDetails.style.display = 'none';
        return;
    }

    // Si pasa validaciones ✔️
    showFileDetails(file);
    submitBtn.disabled = false;

    Swal.fire("Listo ✅", "Archivo listo para subir.", "success");
}

function showFileDetails(file) {
    fileName.textContent = `Archivo: ${file.name}`;
    fileSize.textContent = `Tamaño: ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    fileDetails.style.display = 'block';
}
