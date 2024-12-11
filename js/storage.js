// js/storage.js

const Storage = (function() {
    const POINTS_KEY = 'points';
    const TASKS_KEY = 'tasks';
    const MODE_KEY = 'mode';

    function savePoints(points) {
        localStorage.setItem(POINTS_KEY, points);
    }

    function loadPoints() {
        const savedPoints = parseInt(localStorage.getItem(POINTS_KEY), 10);
        return isNaN(savedPoints) ? 0 : savedPoints;
    }

    function saveTasks(tasks) {
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem(TASKS_KEY));
        return Array.isArray(tasks) ? tasks : [];
    }

    function saveMode(mode) {
        localStorage.setItem(MODE_KEY, mode);
    }

    function loadMode() {
        return localStorage.getItem(MODE_KEY);
    }

    return {
        savePoints,
        loadPoints,
        saveTasks,
        loadTasks,
        saveMode,
        loadMode
    };
})();
