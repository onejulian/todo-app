const I18n = (function (Storage) {
    const languageButton = document.getElementById('languageButton');
    const languageButtonMobile = document.getElementById('languageButtonMobile');
    const languageModal = document.getElementById('languageModal');
    const selectEnglish = document.getElementById('selectEnglish');
    const selectSpanish = document.getElementById('selectSpanish');
    const closeLanguageModal = document.getElementById('closeLanguageModal');

    let currentLanguage = 'en';
    let translations = {};

    function getPreferredLanguage() {
        let navLang = navigator.language || navigator.userLanguage;
        navLang = navLang.toLowerCase();
        if (navLang.indexOf('es') > -1) {
            Storage.saveLanguage('es')
            return 'es';
        } else if (navLang.indexOf('en') > -1) {
            Storage.saveLanguage('en')
            return 'en';
        } else {
            return 'en'; // Inglés por defecto si no es español ni inglés
        }
    }

    // Cargar las traducciones desde los archivos JSON
    async function loadTranslations(lang) {
        try {
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`No se pudo cargar el archivo de idioma: ${lang}`);
            }
            const data = await response.json();
            translations = data;
        } catch (error) {
            console.error('Error cargando las traducciones:', error);
        }
    }

    // Aplicar las traducciones al DOM
    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                // Si el elemento es countdownMessage, no lo actualices directamente
                if (key !== 'countdownMessage') {
                    element.textContent = translations[key];
                } else {
                    // Actualizar el texto antes de los placeholders
                    const countdownMessage = translations[key].split('h:m:s')[0];
                    element.textContent = countdownMessage;
                }
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[key]) {
                element.setAttribute('placeholder', translations[key]);
            }
        });

        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            if (translations[key]) {
                element.setAttribute('title', translations[key]);
            }
        });
    }

    // Cambiar el idioma
    async function changeLanguage(lang) {
        await loadTranslations(lang);
        applyTranslations();
        currentLanguage = lang;
        Storage.saveLanguage(lang);
    }

    // Mostrar el modal de selección de idioma
    function showLanguageModal() {
        languageModal.classList.remove('hidden');
        languageModal.classList.add('flex');
    }

    // Cerrar el modal de selección de idioma
    function hideLanguageModal() {
        languageModal.classList.remove('flex');
        languageModal.classList.add('hidden');
    }

    function getTranslation(key) {
        return translations[key] || ''; // Devuelve la traducción o una cadena vacía si no existe
    }

    function init() {
        // Obtener el idioma guardado en localStorage
        let savedLanguage = Storage.getLanguage();
        if (!savedLanguage) {
            savedLanguage = getPreferredLanguage();
        } else {
            currentLanguage = savedLanguage;
        }

        // Cargar las traducciones iniciales
        loadTranslations(currentLanguage).then(() => {
            applyTranslations();
        });

        // Event Listeners para los botones de selección de idioma
        if (languageButton) {
            languageButton.addEventListener('click', showLanguageModal);
        }
        if (languageButtonMobile) {
            languageButtonMobile.addEventListener('click', showLanguageModal);
        }
        if (selectEnglish) {
            selectEnglish.addEventListener('click', () => {
                changeLanguage('en');
                hideLanguageModal();
            });
        }
        if (selectSpanish) {
            selectSpanish.addEventListener('click', () => {
                changeLanguage('es');
                hideLanguageModal();
            });
        }
        if (closeLanguageModal) {
            closeLanguageModal.addEventListener('click', hideLanguageModal);
        }

        // Escuchar eventos personalizados para abrir el modal desde otros módulos
        document.addEventListener('openLanguageModal', showLanguageModal);
    }

    return {
        init,
        showLanguageModal,
        hideLanguageModal,
        getTranslation
    };
})(Storage);