// js/nav.js

const Nav = (function() {
    const hamburgerButton = document.getElementById('hamburgerButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const exportButtonMobile = document.getElementById('exportButtonMobile');
    const importButtonMobile = document.getElementById('importButtonMobile');
    const toggleModeMobile = document.getElementById('toggleModeMobile');

    function init() {
        // Evento para mostrar el menú móvil
        hamburgerButton.addEventListener('click', openMobileMenu);

        // Evento para cerrar el menú móvil con el botón de cierre
        closeMobileMenu.addEventListener('click', closeMobileMenuFunc);

        // Evento para cerrar el menú móvil al hacer clic en el overlay
        overlay.addEventListener('click', closeMobileMenuFunc);

        // Opcional: Cerrar el menú móvil al hacer clic en una opción
        exportButtonMobile.addEventListener('click', () => {
            closeMobileMenuFunc();
        });

        importButtonMobile.addEventListener('click', () => {
            closeMobileMenuFunc();
        });

        toggleModeMobile.addEventListener('click', () => {
            closeMobileMenuFunc();
        });
    }

    function openMobileMenu() {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('show');
        overlay.classList.remove('hidden');
        overlay.classList.add('show');
    }

    function closeMobileMenuFunc() {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('show');
        overlay.classList.add('hidden');
        overlay.classList.remove('show');
    }

    return {
        init
    };
})();
