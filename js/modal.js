const Modal = (function () {
    const pointsModal = document.getElementById('pointsModal');
    const closePointsModalBtn = document.getElementById('closePointsModal');
    const successModal = document.getElementById('successModal');
    const confirmImportModal = document.getElementById('confirmImportModal');
    const confirmImportYes = document.getElementById('confirmImportYes');
    const confirmImportNo = document.getElementById('confirmImportNo');
    const errorImportModal = document.getElementById('errorImportModal');
    const closeErrorImportModalBtn = document.getElementById('closeErrorImportModal');
    const importSuccessModal = document.getElementById('importSuccessModal');
    const closeImportSuccessModalBtn = document.getElementById('closeImportSuccessModal');

    // **Referencias para la Modal "About"**
    const aboutButton = document.getElementById('aboutButton');
    const aboutButtonMobile = document.getElementById('aboutButtonMobile');
    const aboutModal = document.getElementById('aboutModal');
    const closeAboutModal = document.getElementById('closeAboutModal');

    function init(Points) {
        // Mostrar Modal de Puntos
        document.getElementById('showPoints').addEventListener('click', () => {
            const currentPoints = Points.getPoints();
            if (currentPoints < 50) {
                return;
            }
            pointsModal.classList.remove('hidden');
            Points.updateCountdownDisplay();
        });

        // Cerrar Modal de Puntos
        closePointsModalBtn.addEventListener('click', () => {
            pointsModal.classList.add('hidden');
        });

        // Cerrar Modal de Error en Importación
        closeErrorImportModalBtn.addEventListener('click', () => {
            hideErrorImportModal();
        });

        // Cerrar Modal de Éxito en Importación
        closeImportSuccessModalBtn.addEventListener('click', () => {
            hideImportSuccessModal();
        });

        aboutButton.addEventListener('click', () => {
            aboutModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Deshabilita el scroll en el body

            // Obtén el contenido del about desde aboutContent.js
            const aboutContent = AboutContent.getAboutContent();
            const existingContent = aboutModal.querySelector('#aboutContent-en, #aboutContent-es');

            // Inserta el contenido en el modal, después del botón de cerrar
            const aboutModalContentContainer = aboutModal.querySelector('.flex.justify-between.items-center.mb-4').parentNode;
            if (!existingContent) {
                aboutModalContentContainer.insertAdjacentHTML('beforeend', aboutContent);
            }

            // Asegúrate de que el contenido se muestre en el idioma correcto
            updateAboutContentLanguage();
        });

        // **Eventos para la Modal "About"**
        if (aboutButton && closeAboutModal && aboutButtonMobile) {
            // Abrir Modal de About desde la versión de Escritorio
            aboutButton.addEventListener('click', () => {
                openAboutModal();
            });

            // Abrir Modal de About desde la versión Móvil
            aboutButtonMobile.addEventListener('click', () => {
                openAboutModal();
                const aboutContent = AboutContent.getAboutContent();
                const existingContent = aboutModal.querySelector('#aboutContent-en');

                // Inserta el contenido en el modal, después del botón de cerrar
                const aboutModalContentContainer = aboutModal.querySelector('.flex.justify-between.items-center.mb-4').parentNode;
                if (!existingContent) {
                    aboutModalContentContainer.insertAdjacentHTML('beforeend', aboutContent);
                }

                // Asegúrate de que el contenido se muestre en el idioma correcto
                updateAboutContentLanguage();
                // Opcional: Cerrar el menú móvil después de abrir la modal
                hideMobileMenu();
            });

            // Cerrar Modal de About
            closeAboutModal.addEventListener('click', () => {
                hideAboutModal();
            });

            // Cerrar Modal al hacer clic fuera del contenido
            aboutModal.addEventListener('click', (event) => {
                if (event.target === aboutModal) {
                    hideAboutModal();
                }
            });
        }
    }

    function showSuccessModal(message) {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = message;
        successModal.classList.remove('hidden');
    }

    function hideSuccessModal() {
        successModal.classList.add('hidden');
    }

    function showConfirmImportModal() {
        confirmImportModal.classList.remove('hidden');
    }

    function hideConfirmImportModal() {
        confirmImportModal.classList.add('hidden');
    }

    function showErrorImportModal(translationKey) {
        const errorImportMessage = document.getElementById('errorImportMessage');
        errorImportMessage.setAttribute('data-i18n', translationKey);
        errorImportModal.classList.remove('hidden');
    }

    function hideErrorImportModal() {
        errorImportModal.classList.add('hidden');
    }

    function showImportSuccessModal(translationKey) {
        const importSuccessMessage = document.getElementById('importSuccessMessage');
        importSuccessMessage.setAttribute('data-i18n', translationKey);
        importSuccessModal.classList.remove('hidden');
    }

    function hideImportSuccessModal() {
        importSuccessModal.classList.add('hidden');
    }

    // **Funciones para la Modal "About"**
    function openAboutModal() {
        Points.updateCountdownDisplay();
        aboutModal.classList.remove('hidden');
    }

    function hideAboutModal() {
        aboutModal.classList.add('hidden');
    }

    // **Funciones para Manejar el Menú Móvil (Si Existe)**
    function hideMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('overlay');
        if (mobileMenu && overlay) {
            mobileMenu.classList.add('hidden');
            overlay.classList.add('hidden');
        }
    }

    function updateAboutContentLanguage() {
        const selectedLanguage = localStorage.getItem('language') || 'en';
        const aboutContents = aboutModal.querySelectorAll('.language-content');
        aboutContents.forEach(content => {
            if (content.id === `aboutContent-${selectedLanguage}`) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });
    }

    return {
        init,
        showSuccessModal,
        showErrorImportModal,
        showImportSuccessModal,
        showConfirmImportModal,
        hideConfirmImportModal,
        openAboutModal,
        hideAboutModal
    };
})();
