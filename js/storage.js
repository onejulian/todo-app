// js/storage.js

const Storage = (function () {
    const POINTS_KEY = 'points';
    const TASKS_KEY = 'tasks';
    const MODE_KEY = 'mode';
    const LANGUAGE_KEY = 'language';

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

    function saveLanguage(lang) {
        localStorage.setItem(LANGUAGE_KEY, lang);
    }

    function getLanguage() {
        return localStorage.getItem(LANGUAGE_KEY) || ''; // Devuelve una cadena vacía en lugar de null
    }

    return {
        savePoints,
        loadPoints,
        saveTasks,
        loadTasks,
        saveMode,
        loadMode,
        saveLanguage,
        getLanguage
    };
})();