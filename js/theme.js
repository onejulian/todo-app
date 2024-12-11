// js/theme.js

const Theme = (function(Storage) {
    const toggleButton = document.getElementById('toggleMode');
    const modeIcon = document.getElementById('modeIcon');

    function init() {
        toggleButton.addEventListener('click', toggleTheme);
        updateModeIcon();
    }

    function toggleTheme() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        Storage.saveMode(isDark ? 'dark' : 'light');
        updateModeIcon();
    }

    function updateModeIcon() {
        if (document.documentElement.classList.contains('dark')) {
            modeIcon.className = 'fas fa-sun text-lg';
        } else {
            modeIcon.className = 'fas fa-moon text-lg';
        }
    }

    return {
        init
    };
})(Storage);
