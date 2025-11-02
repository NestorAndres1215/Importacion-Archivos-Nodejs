// --- Selección de elementos ---
const searchInput = document.getElementById('searchInput');
const filesTableBody = document.getElementById('filesTableBody');
const noResultsMessage = document.getElementById('noResultsMessage'); // mensaje opcional

if (searchInput && filesTableBody) {

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = filesTableBody.querySelectorAll('tr');
        let visibleRows = 0;

        rows.forEach(row => {
            const fileNameCell = row.querySelector('.file-name');
            if (!fileNameCell) return;

            const fileName = fileNameCell.textContent.toLowerCase();
            const match = fileName.includes(searchTerm);

            row.style.display = match ? '' : 'none';
            if (match) visibleRows++;
        });

        // Mostrar mensaje si no hay resultados
        if (noResultsMessage) {
            noResultsMessage.style.display = visibleRows === 0 ? 'block' : 'none';
        }
    });
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