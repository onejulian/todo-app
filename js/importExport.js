// js/importExport.js

const ImportExport = (function(Storage, Tasks, Modal) {
    const exportButton = document.getElementById('exportButton');
    const importButton = document.getElementById('importButton');
    const importFileInput = document.getElementById('importFileInput');

    function init() {
        exportButton.addEventListener('click', exportTasks);
        importButton.addEventListener('click', () => {
            importFileInput.click();
        });
        importFileInput.addEventListener('change', handleImport);
    }

    function exportTasks() {
        const tasks = Array.from(document.querySelectorAll('.task')).map(task => ({
            text: task.querySelector('.task-text').textContent,
            createdAt: task.dataset.createdAt,
            completed: task.classList.contains('completed'),
            overdue: task.classList.contains('overdue')
        }));
        const dataStr = JSON.stringify(tasks, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tasks.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function handleImport(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                importTasks(content);
            };
            reader.readAsText(file);
        }
        // Reiniciar el input para permitir importar el mismo archivo nuevamente si es necesario
        event.target.value = '';
    }

    function importTasks(fileContent) {
        try {
            const importedTasks = JSON.parse(fileContent);
            if (!Array.isArray(importedTasks)) {
                throw new Error('El archivo JSON no es válido.');
            }

            // Validar la estructura de cada tarea
            importedTasks.forEach(task => {
                if (typeof task.text !== 'string' || typeof task.createdAt !== 'string' ||
                    typeof task.completed !== 'boolean' || typeof task.overdue !== 'boolean') {
                    throw new Error('El archivo JSON tiene una estructura inválida.');
                }
            });

            // Mostrar el modal de confirmación para reemplazar tareas
            Modal.showConfirmImportModal();

            // Al confirmar la importación
            document.getElementById('confirmImportYes').addEventListener('click', function() {
                // Reemplazar las tareas actuales
                document.getElementById('todoList').innerHTML = '';
                // Invertir para mantener el orden de las tareas (nuevas arriba)
                importedTasks.slice().reverse().forEach(task => Tasks.addTask(task));
                Storage.saveTasks(Storage.loadTasks());

                // Cerrar los modales
                Modal.hideConfirmImportModal();
                Modal.showImportSuccessModal('Tus tareas han sido importadas exitosamente.');
            }, { once: true });

            // Al cancelar la importación
            document.getElementById('confirmImportNo').addEventListener('click', function() {
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
})(Storage, Tasks, Modal);
