// js/tasks.js

const Tasks = (function (Storage, Points, Modal) {
    const todoList = document.getElementById('todoList');
    const addButton = document.getElementById('addButton');
    const todoInput = document.getElementById('todoInput');

    function init() {
        addButton.addEventListener('click', handleAddTask);
        todoInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                handleAddTask();
            }
        });

        // Cargar tareas existentes
        loadTasks();
    }

    function handleAddTask() {
        const taskText = todoInput.value.trim();
        if (taskText) {
            addTask({ text: taskText });
            todoInput.value = '';
            saveTasks();
        }
    }

    function addTask(taskData) {
        const li = document.createElement('li');
        li.className = 'task group flex items-center justify-between p-3 bg-gray-200 rounded dark:bg-gray-700 dark:text-white transition-colors duration-300';
        li.dataset.createdAt = taskData.createdAt || new Date().toISOString();

        if (taskData.completed) {
            li.classList.add('completed', 'line-through', 'opacity-50');
        }

        if (taskData.overdue) {
            li.classList.add('overdue', 'bg-red-500', 'dark:bg-red-700');
        }

        // Condicionar la inclusión del botón de editar
        const editButtonHTML = taskData.completed ? '' : `
            <button class="edit-button text-blue-500 hover:text-blue-600 focus:outline-none" title="Editar">
                <i class="fas fa-pencil-alt text-lg"></i>
            </button>
        `;

        li.innerHTML = `
            <div class="flex items-center space-x-3">
                <input type="checkbox" class="complete-checkbox" ${taskData.completed ? 'checked' : ''}>
                <span class="task-text text-lg">${taskData.text}</span>
            </div>
            <div class="opacity-100 sm:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 flex space-x-4">
                ${editButtonHTML}
                <button class="delete-button text-red-500 hover:text-red-600 focus:outline-none" title="Eliminar">
                    <i class="fas fa-trash text-lg"></i>
                </button>
            </div>
        `;
        // Usar prepend para agregar la tarea al inicio
        todoList.prepend(li);

        // Evento para marcar como completada una tarea
        li.querySelector('.complete-checkbox').addEventListener('change', function () {
            if (this.checked) {
                li.classList.add('completed', 'line-through', 'opacity-50');
                Points.addPoints(25);
                // Eliminar el botón de editar
                const editButton = li.querySelector('.edit-button');
                if (editButton) {
                    editButton.remove();
                }
            } else {
                li.classList.remove('completed', 'line-through', 'opacity-50');
                // Opcional: Restar puntos si se desmarca una tarea completada
                Points.subtractPoints(25);
                // Reagregar el botón de editar
                const deleteButton = li.querySelector('.delete-button');
                const editButton = document.createElement('button');
                editButton.className = 'edit-button text-blue-500 hover:text-blue-600 focus:outline-none';
                editButton.title = 'Editar';
                editButton.innerHTML = '<i class="fas fa-pencil-alt text-lg"></i>';
                // Insertar el botón de editar antes del botón de eliminar
                li.querySelector('.opacity-100').insertBefore(editButton, deleteButton);

                // Añadir el evento para editar nuevamente
                editButton.addEventListener('click', function () {
                    const span = li.querySelector('.task-text');
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = span.textContent;
                    input.className = 'w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white dark:bg-gray-700 text-lg';
                    span.replaceWith(input);
                    input.focus();

                    input.addEventListener('blur', function () {
                        const nuevoTexto = input.value.trim();
                        if (nuevoTexto) {
                            const newSpan = document.createElement('span');
                            newSpan.className = 'task-text text-lg';
                            newSpan.textContent = nuevoTexto;
                            input.replaceWith(newSpan);
                            saveTasks();
                        } else {
                            // Si el texto está vacío, eliminar la tarea
                            li.remove();
                            saveTasks();
                        }
                    });

                    input.addEventListener('keypress', function (e) {
                        if (e.key === 'Enter') {
                            input.blur();
                        }
                    });
                });
            }
            saveTasks();
        });

        // Evento para editar una tarea
        if (!taskData.completed) {
            li.querySelector('.edit-button').addEventListener('click', function () {
                const span = li.querySelector('.task-text');
                const input = document.createElement('input');
                input.type = 'text';
                input.value = span.textContent;
                input.className = 'w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white dark:bg-gray-700 text-lg';
                span.replaceWith(input);
                input.focus();

                input.addEventListener('blur', function () {
                    const nuevoTexto = input.value.trim();
                    if (nuevoTexto) {
                        const newSpan = document.createElement('span');
                        newSpan.className = 'task-text text-lg';
                        newSpan.textContent = nuevoTexto;
                        input.replaceWith(newSpan);
                        saveTasks();
                    } else {
                        // Si el texto está vacío, eliminar la tarea
                        li.remove();
                        saveTasks();
                    }
                });

                input.addEventListener('keypress', function (e) {
                    if (e.key === 'Enter') {
                        input.blur();
                    }
                });
            });
        }

        // Evento para eliminar una tarea con confirmación
        li.querySelector('.delete-button').addEventListener('click', function (event) {
            event.stopPropagation(); // Evita que el click propague al documento

            if (!li.classList.contains('deleting')) {
                // Marcar la tarea para eliminación
                li.classList.add('deleting', 'bg-red-500', 'dark:bg-red-700');

                // Ocultar el botón de editar si existe
                const editButton = li.querySelector('.edit-button');
                if (editButton) {
                    editButton.style.display = 'none';
                }

                // Cambiar el color del botón de eliminar a negro
                const deleteButton = li.querySelector('.delete-button');
                deleteButton.classList.remove('text-red-500', 'hover:text-red-600');
                deleteButton.classList.add('text-black', 'hover:text-gray-700');

                // Agregar una referencia al listener para poder eliminarlo después
                const cancelDeletion = function (e) {
                    if (!li.contains(e.target)) {
                        // Cancelar la eliminación
                        li.classList.remove('deleting', 'bg-red-500', 'dark:bg-red-700');

                        // Mostrar nuevamente el botón de editar si la tarea no está completada
                        if (editButton && !li.classList.contains('completed')) {
                            editButton.style.display = 'inline-block';
                        }

                        // Restaurar el color original del botón de eliminar
                        deleteButton.classList.remove('text-black', 'hover:text-gray-700');
                        deleteButton.classList.add('text-red-500', 'hover:text-red-600');

                        // Remover el listener de cancelación
                        document.removeEventListener('click', cancelDeletion);
                    }
                };

                // Agregar el listener para cancelar la eliminación al hacer clic fuera
                document.addEventListener('click', cancelDeletion);
            } else {
                // Confirmar y eliminar la tarea definitivamente
                // Si la tarea estaba completada, restar los puntos correspondientes
                if (li.classList.contains('completed')) {
                    Points.subtractPoints(25);
                }

                li.remove();
                saveTasks();
            }
        });

        saveTasks();
    }

    function saveTasks() {
        const tasks = Array.from(todoList.querySelectorAll('.task')).map(task => ({
            text: task.querySelector('.task-text').textContent,
            createdAt: task.dataset.createdAt,
            completed: task.classList.contains('completed'),
            overdue: task.classList.contains('overdue')
        }));
        Storage.saveTasks(tasks);
    }

    function loadTasks() {
        const tasks = Storage.loadTasks();
        tasks.forEach(task => addTask(task));
    }

    return {
        init,
        addTask
    };
})(Storage, Points, Modal);