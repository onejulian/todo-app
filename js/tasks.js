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
        removeCheckboxFromOldCompletedTasks();

        // Calcular puntos netos al iniciar
        calculateNetPoints();
    }

    function handleAddTask() {
        const taskText = todoInput.value.trim();
        if (taskText) {
            addTask({ text: taskText });
            todoInput.value = '';
            saveTasks();
            calculateNetPoints();
        }
    }

    function addTask(taskData) {
        const li = document.createElement('li');
        li.className = 'task group flex items-center justify-between p-3 bg-gray-200 rounded dark:bg-gray-700 dark:text-white transition-colors duration-300';
        li.dataset.createdAt = taskData.createdAt || new Date().toISOString();

        if (taskData.completed) {
            li.classList.add('completed', 'line-through', 'opacity-50');
            li.dataset.completedAt = taskData.completedAt || new Date().toISOString();
        }

        if (taskData.overdue) {
            li.classList.add('overdue', 'bg-red-500', 'dark:bg-red-700');
        }

        // Incluir condicionalmente el botón de edición
        const editButtonHTML = taskData.completed ? '' : `
          <button class="edit-button text-blue-500 hover:text-blue-600 focus:outline-none" title="Edit">
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
              <button class="delete-button text-red-500 hover:text-red-600 focus:outline-none" title="Delete">
                  <i class="fas fa-trash text-lg"></i>
              </button>
          </div>
      `;
        // Usar prepend para agregar la tarea al inicio
        todoList.prepend(li);

        // Evento para marcar una tarea como completada
        li.querySelector('.complete-checkbox').addEventListener('change', function () {
            if (this.checked) {
                li.classList.add('completed', 'line-through', 'opacity-50');
                // Establecer completedAt al tiempo actual
                li.dataset.completedAt = new Date().toISOString();
                Points.addPoints(25);
                // Eliminar el botón de edición
                const editButton = li.querySelector('.edit-button');
                if (editButton) {
                    editButton.remove();
                }
            } else {
                li.classList.remove('completed', 'line-through', 'opacity-50');
                // Eliminar completedAt
                delete li.dataset.completedAt;
                // Opcional: Restar puntos si se desmarca una tarea completada
                Points.subtractPoints(25);
                // Re-agregar el botón de edición
                const deleteButton = li.querySelector('.delete-button');
                const editButton = document.createElement('button');
                editButton.className = 'edit-button text-blue-500 hover:text-blue-600 focus:outline-none';
                editButton.title = 'Edit';
                editButton.innerHTML = '<i class="fas fa-pencil-alt text-lg"></i>';
                // Insertar el botón de edición antes del botón de eliminación
                li.querySelector('.opacity-100').insertBefore(editButton, deleteButton);

                // Agregar el evento para editar nuevamente
                editButton.addEventListener('click', function () {
                    const span = li.querySelector('.task-text');
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = span.textContent;
                    input.className = 'w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white dark:bg-gray-700 text-lg';
                    span.replaceWith(input);
                    input.focus();

                    input.addEventListener('blur', function () {
                        const newText = input.value.trim();
                        if (newText) {
                            const newSpan = document.createElement('span');
                            newSpan.className = 'task-text text-lg';
                            newSpan.textContent = newText;
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
            calculateNetPoints();
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
                    const newText = input.value.trim();
                    if (newText) {
                        const newSpan = document.createElement('span');
                        newSpan.className = 'task-text text-lg';
                        newSpan.textContent = newText;
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
            event.stopPropagation(); // Prevenir que el clic se propague al documento

            if (!li.classList.contains('deleting')) {
                // Marcar la tarea para eliminación
                li.classList.add('deleting', 'bg-red-500', 'dark:bg-red-700');

                // Ocultar el botón de edición si existe
                const editButton = li.querySelector('.edit-button');
                if (editButton) {
                    editButton.style.display = 'none';
                }

                // Cambiar el color del botón de eliminación a negro
                const deleteButton = li.querySelector('.delete-button');
                deleteButton.classList.remove('text-red-500', 'hover:text-red-600');
                deleteButton.classList.add('text-black', 'hover:text-gray-700');

                // Agregar una referencia al listener para eliminarlo más tarde
                const cancelDeletion = function (e) {
                    if (!li.contains(e.target)) {
                        // Cancelar la eliminación
                        li.classList.remove('deleting', 'bg-red-500', 'dark:bg-red-700');

                        // Mostrar nuevamente el botón de edición si la tarea no está completada
                        if (editButton && !li.classList.contains('completed')) {
                            editButton.style.display = 'inline-block';
                        }

                        // Restaurar el color original del botón de eliminación
                        deleteButton.classList.remove('text-black', 'hover:text-gray-700');
                        deleteButton.classList.add('text-red-500', 'hover:text-red-600');

                        // Eliminar el listener de cancelación
                        document.removeEventListener('click', cancelDeletion);
                    }
                };

                // Agregar el listener para cancelar la eliminación al hacer clic fuera
                document.addEventListener('click', cancelDeletion);
            } else {
                // Confirmar y eliminar permanentemente la tarea
                // Si la tarea estaba completada, restar los puntos correspondientes
                if (li.classList.contains('completed')) {
                    Points.subtractPoints(25);
                }

                li.remove();
                saveTasks();
                calculateNetPoints();
            }
        });

        saveTasks();
    }

    function saveTasks() {
        const tasks = Array.from(todoList.querySelectorAll('.task')).map(task => ({
            text: task.querySelector('.task-text').textContent,
            createdAt: task.dataset.createdAt,
            completed: task.classList.contains('completed'),
            completedAt: task.dataset.completedAt || null,
            overdue: task.classList.contains('overdue')
        }));
        Storage.saveTasks(tasks);
    }

    function loadTasks() {
        const tasks = Storage.loadTasks();
        // Ordenar las tareas por fecha de creación (createdAt) en orden ascendente
        tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        tasks.forEach(task => addTask(task));
    }

    function getLastCompletedTask() {
        const completedTasks = Array.from(todoList.querySelectorAll('.task.completed'));
        if (completedTasks.length === 0) return null;

        // Ordenar las tareas completadas por completedAt descendente
        completedTasks.sort((a, b) => {
            const dateA = new Date(a.dataset.completedAt);
            const dateB = new Date(b.dataset.completedAt);
            return dateB - dateA;
        });

        return completedTasks[0];
    }

    function removeCheckboxFromOldCompletedTasks() {
        const tasks = Array.from(todoList.querySelectorAll('.task.completed'));
        const now = new Date();
        tasks.forEach(task => {
            const completedAt = new Date(task.dataset.completedAt);
            const diffInMs = now - completedAt;
            const diffInHours = diffInMs / (1000 * 60 * 60);

            if (diffInHours >= 24) {
                // Eliminar el checkbox
                const checkbox = task.querySelector('.complete-checkbox');
                if (checkbox) {
                    checkbox.remove();
                }
            }
        });
    }

    // Función para calcular el número de periodos de 24 horas desde la última finalización
    function calculatePeriodsSinceLastCompletion(completedAt) {
        const lastCompletionDate = new Date(completedAt);
        const now = new Date();
        const diffInMs = now - lastCompletionDate;
        const diffInDays = diffInMs / (24 * 60 * 60 * 1000);
        return Math.floor(diffInDays);
    }

    // Función mejorada para calcular y establecer puntos netos
    function calculateNetPoints() {
        const tasks = Storage.loadTasks();

        // Filtrar todas las tareas completadas con una fecha de finalización válida
        const completedTasks = tasks
            .filter(task => task.completed && task.completedAt)
            .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt)); // Ordenar ascendentemente

        // Calcular puntos brutos
        const brutoPoints = completedTasks.length * 25;

        let totalPenalties = 0;

        if (completedTasks.length > 0) {
            // Iterar a través de las tareas completadas para calcular las penalizaciones
            for (let i = 1; i < completedTasks.length; i++) {
                const previousCompletion = new Date(completedTasks[i - 1].completedAt);
                const currentCompletion = new Date(completedTasks[i].completedAt);
                const gapInMs = currentCompletion - previousCompletion;
                const gapInDays = gapInMs / (24 * 60 * 60 * 1000);

                // Calcular periodos completos de 24 horas
                const penalties = Math.floor(gapInDays);
                totalPenalties += penalties;
            }

            // Calcular el gap desde la última tarea completada hasta ahora
            const lastCompletion = new Date(completedTasks[completedTasks.length - 1].completedAt);
            const now = new Date();
            const finalGapInMs = now - lastCompletion;
            const finalGapInDays = finalGapInMs / (24 * 60 * 60 * 1000);
            const finalPenalties = Math.floor(finalGapInDays);
            totalPenalties += finalPenalties;
        }

        // Calcular puntos netos
        const netPoints = brutoPoints - (50 * totalPenalties);

        // Asegurarse de que los puntos netos no sean negativos
        Points.setPoints(Math.max(netPoints, 0));
    }

    return {
        init,
        addTask,
        getLastCompletedTask,
        removeCheckboxFromOldCompletedTasks
    };
})(Storage, Points, Modal);
