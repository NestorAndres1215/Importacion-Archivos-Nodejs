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
