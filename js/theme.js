const Theme = (function (Storage) {
    const toggleButton = document.getElementById('toggleMode');
    const toggleButtonMobile = document.getElementById('toggleModeMobile');
    const modeIcon = document.getElementById('modeIcon');
    const modeIconMobile = document.getElementById('modeIconMobile');

    function init() {
        if (toggleButton) {
            toggleButton.addEventListener('click', toggleTheme);
        }
        if (toggleButtonMobile) {
            toggleButtonMobile.addEventListener('click', toggleTheme);
        }
        updateModeIcons();
    }

    function toggleTheme() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        Storage.saveMode(isDark ? 'dark' : 'light');
        updateModeIcons();
    }

    function updateModeIcons() {
        const isDark = document.documentElement.classList.contains('dark');
        if (modeIcon) {
            modeIcon.className = isDark ? 'fas fa-sun text-lg' : 'fas fa-moon text-lg';
        }
        if (modeIconMobile) {
            modeIconMobile.className = isDark ? 'fas fa-sun text-lg' : 'fas fa-moon text-lg';
        }
    }

    return {
        init
    };
})(Storage);