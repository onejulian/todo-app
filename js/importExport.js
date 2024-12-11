// js/importExport.js

const ImportExport = (function (Storage, Tasks, Points, Modal) {
    const exportButton = document.getElementById('exportButton');
    const importButton = document.getElementById('importButton');
    const exportButtonMobile = document.getElementById('exportButtonMobile');
    const importButtonMobile = document.getElementById('importButtonMobile');
    const importFileInput = document.getElementById('importFileInput');

    function init() {
        // Asignar eventos a los botones de escritorio
        if (exportButton) {
            exportButton.addEventListener('click', exportData);
        }
        if (importButton) {
            importButton.addEventListener('click', () => {
                importFileInput.click();
            });
        }

        // Asignar eventos a los botones móviles
        if (exportButtonMobile) {
            exportButtonMobile.addEventListener('click', exportData);
        }
        if (importButtonMobile) {
            importButtonMobile.addEventListener('click', () => {
                importFileInput.click();
            });
        }

        // Evento para manejar la importación
        if (importFileInput) {
            importFileInput.addEventListener('change', handleImport);
        }
    }

    // Función para exportar puntos y tareas a un archivo JSON
    function exportData() {
        const points = Points.getPoints(); // Acceder a los puntos actuales usando el getter
        const tasks = Array.from(document.querySelectorAll('.task')).map(task => ({
            text: task.querySelector('.task-text').textContent,
            createdAt: task.dataset.createdAt,
            completed: task.classList.contains('completed'),
            overdue: task.classList.contains('overdue')
        }));
        const data = {
            points, // Incluir los puntos en el JSON
            tasks
        };
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json'; // Cambiado a data.json para reflejar que contiene puntos
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Manejar la importación de puntos y tareas desde un archivo JSON
    function handleImport(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const content = e.target.result;
                importData(content);
            };
            reader.readAsText(file);
        }
        // Reiniciar el input para permitir importar el mismo archivo nuevamente si es necesario
        event.target.value = '';
    }

    function importData(fileContent) {
        try {
            const importedData = JSON.parse(fileContent);
            if (typeof importedData !== 'object' || !importedData) {
                throw new Error('errorImportMessage');
            }

            // Validar puntos
            if (typeof importedData.points !== 'number' || importedData.points < 0) {
                throw new Error('errorImportMessage');
            }

            // Validar tareas
            if (!Array.isArray(importedData.tasks)) {
                throw new Error('errorImportMessage');
            }

            importedData.tasks.forEach(task => {
                if (typeof task.text !== 'string' || typeof task.createdAt !== 'string' ||
                    typeof task.completed !== 'boolean' || typeof task.overdue !== 'boolean') {
                    throw new Error('errorImportMessage');
                }
            });

            // Mostrar el modal de confirmación para reemplazar puntos y tareas
            Modal.showConfirmImportModal();

            // Al confirmar la importación
            document.getElementById('confirmImportYes').addEventListener('click', function () {
                // Reemplazar las tareas actuales
                document.getElementById('todoList').innerHTML = '';
                // Añadir las tareas importadas
                importedData.tasks.slice().reverse().forEach(task => Tasks.addTask(task));
                // Establecer los puntos importados
                Points.setPoints(importedData.points);

                // Cerrar los modales
                Modal.hideConfirmImportModal();
                Modal.showImportSuccessModal('importSuccessMessage');
            }, { once: true });

            // Al cancelar la importación
            document.getElementById('confirmImportNo').addEventListener('click', function () {
                Modal.hideConfirmImportModal();
            }, { once: true });

        } catch (error) {
            // Mostrar el modal de error
            Modal.showErrorImportModal(error.message);
        }
    }

    return {
        init
    };
})(Storage, Tasks, Points, Modal);