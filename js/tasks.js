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

        // Load existing tasks
        loadTasks();

        // Calculate net points on initialization
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

        // Conditionally include the edit button
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
        // Use prepend to add the task at the beginning
        todoList.prepend(li);

        // Event to mark a task as completed
        li.querySelector('.complete-checkbox').addEventListener('change', function () {
            if (this.checked) {
                li.classList.add('completed', 'line-through', 'opacity-50');
                // Set completedAt to current time
                li.dataset.completedAt = new Date().toISOString();
                Points.addPoints(25);
                // Remove the edit button
                const editButton = li.querySelector('.edit-button');
                if (editButton) {
                    editButton.remove();
                }
            } else {
                li.classList.remove('completed', 'line-through', 'opacity-50');
                // Remove completedAt
                delete li.dataset.completedAt;
                // Optionally: Subtract points if unmarking a completed task
                Points.subtractPoints(25);
                // Re-add the edit button
                const deleteButton = li.querySelector('.delete-button');
                const editButton = document.createElement('button');
                editButton.className = 'edit-button text-blue-500 hover:text-blue-600 focus:outline-none';
                editButton.title = 'Edit';
                editButton.innerHTML = '<i class="fas fa-pencil-alt text-lg"></i>';
                // Insert the edit button before the delete button
                li.querySelector('.opacity-100').insertBefore(editButton, deleteButton);

                // Add the event to edit again
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
                            // If text is empty, remove the task
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

        // Event to edit a task
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
                        // If text is empty, remove the task
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

        // Event to delete a task with confirmation
        li.querySelector('.delete-button').addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent click from propagating to the document

            if (!li.classList.contains('deleting')) {
                // Mark the task for deletion
                li.classList.add('deleting', 'bg-red-500', 'dark:bg-red-700');

                // Hide the edit button if it exists
                const editButton = li.querySelector('.edit-button');
                if (editButton) {
                    editButton.style.display = 'none';
                }

                // Change the delete button color to black
                const deleteButton = li.querySelector('.delete-button');
                deleteButton.classList.remove('text-red-500', 'hover:text-red-600');
                deleteButton.classList.add('text-black', 'hover:text-gray-700');

                // Add a reference to the listener to remove it later
                const cancelDeletion = function (e) {
                    if (!li.contains(e.target)) {
                        // Cancel the deletion
                        li.classList.remove('deleting', 'bg-red-500', 'dark:bg-red-700');

                        // Show the edit button again if the task is not completed
                        if (editButton && !li.classList.contains('completed')) {
                            editButton.style.display = 'inline-block';
                        }

                        // Restore the original color of the delete button
                        deleteButton.classList.remove('text-black', 'hover:text-gray-700');
                        deleteButton.classList.add('text-red-500', 'hover:text-red-600');

                        // Remove the cancellation listener
                        document.removeEventListener('click', cancelDeletion);
                    }
                };

                // Add the listener to cancel deletion when clicking outside
                document.addEventListener('click', cancelDeletion);
            } else {
                // Confirm and permanently delete the task
                // If the task was completed, subtract the corresponding points
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
        tasks.forEach(task => addTask(task));
    }

    // Function to get the last completed task
    function getLastCompletedTask() {
        const completedTasks = Array.from(todoList.querySelectorAll('.task.completed'));
        if (completedTasks.length === 0) return null;

        // Sort completed tasks by completedAt descending
        completedTasks.sort((a, b) => {
            const dateA = new Date(a.dataset.completedAt);
            const dateB = new Date(b.dataset.completedAt);
            return dateB - dateA;
        });

        return completedTasks[0];
    }

    // Function to calculate the number of 24-hour periods since last completion
    function calculatePeriodsSinceLastCompletion(completedAt) {
        const lastCompletionDate = new Date(completedAt);
        const now = new Date();
        const diffInMs = now - lastCompletionDate;
        const diffInHours = diffInMs / (1000 * 60 * 60);
        return Math.floor(diffInHours / 24);
    }

    // Function to calculate and set net points
    function calculateNetPoints() {
        const tasks = Storage.loadTasks();
        const totalCompleted = tasks.filter(task => task.completed).length;
        const brutoPoints = totalCompleted * 25;

        const lastCompletedTask = tasks
            .filter(task => task.completed && task.completedAt)
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];

        let periods = 0;
        if (lastCompletedTask && lastCompletedTask.completedAt) {
            periods = calculatePeriodsSinceLastCompletion(lastCompletedTask.completedAt);
        }

        const netPoints = brutoPoints - (50 * periods);

        // Assuming Points has a method to set the total points directly
        // If not, you might need to adjust this based on your Points implementation
        Points.setPoints(netPoints);
    }

    return {
        init,
        addTask
    };
})(Storage, Points, Modal);
