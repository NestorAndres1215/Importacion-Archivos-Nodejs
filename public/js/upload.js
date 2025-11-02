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
const alertContainer = document.getElementById('alert-container');

// --- Eventos de arrastre ---
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev =>
    dropArea.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); })
);

['dragenter', 'dragover'].forEach(ev =>
    dropArea.addEventListener(ev, () => {
        dropArea.style.borderColor = '#3498db';
        dropArea.style.background = '#f0f8ff';
        dropArea.classList.add('highlight');
    })
);

['dragleave', 'drop'].forEach(ev =>
    dropArea.addEventListener(ev, () => {
        dropArea.style.borderColor = '#e0e0e0';
        dropArea.style.background = '#fafafa';
        dropArea.classList.remove('highlight');
    })
);

// --- Abrir selector al hacer clic ---
dropArea.addEventListener('click', () => fileInput.click());

// --- Manejo archivos ---
dropArea.addEventListener('drop', e => {
    fileInput.files = e.dataTransfer.files;
    validateFile();
});

fileInput.addEventListener('change', validateFile);

function validateFile() {
    const file = fileInput.files[0];
    if (!file) return;

    // Limpiar alertas previas
    alertContainer.innerHTML = '';

    // Validar tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
        showAlert('Tipo de archivo no permitido. Solo: JPG, PNG, PDF, DOC, DOCX.', 'danger');
        resetForm();
        return;
    }

    // Validar tamaño
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
        showAlert(`El archivo es muy grande. Máximo: ${MAX_FILE_SIZE_MB} MB.`, 'danger');
        resetForm();
        return;
    }

    // Éxito
    showFileDetails(file);
    submitBtn.disabled = false;
    showAlert('Archivo válido. ¡Puedes subirlo!', 'success');
}

function showFileDetails(file) {
    fileName.textContent = `Archivo: ${file.name}`;
    fileSize.textContent = `Tamaño: ${sizeMB(file.size)} MB`;
    fileDetails.classList.add('show');
}

function resetForm() {
    fileInput.value = "";
    submitBtn.disabled = true;
    fileDetails.classList.remove('show');
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
    alertContainer.appendChild(alert);
}

function sizeMB(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2);
}

tailwind.config = {
    theme: {
        extend: {
            fontFamily: { sans: ['Poppins', 'sans-serif'] },
            keyframes: {
                float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
                pulseGlow: { '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }, '50%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)' } }
            },
            animation: { float: 'float 3s ease-in-out infinite', pulseGlow: 'pulseGlow 2s ease-in-out infinite' }
        }
    }
}