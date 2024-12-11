// js/modal.js

const Modal = (function() {
    const pointsModal = document.getElementById('pointsModal');
    const closePointsModalBtn = document.getElementById('closePointsModal');
    const resetPointsButton = document.getElementById('resetPointsButton');
    const confirmResetModal = document.getElementById('confirmResetModal');
    const confirmResetYes = document.getElementById('confirmResetYes');
    const confirmResetNo = document.getElementById('confirmResetNo');
    const successModal = document.getElementById('successModal');
    const closeSuccessModalBtn = document.getElementById('closeSuccessModal');
    const confirmImportModal = document.getElementById('confirmImportModal');
    const confirmImportYes = document.getElementById('confirmImportYes');
    const confirmImportNo = document.getElementById('confirmImportNo');
    const errorImportModal = document.getElementById('errorImportModal');
    const closeErrorImportModalBtn = document.getElementById('closeErrorImportModal');
    const importSuccessModal = document.getElementById('importSuccessModal');
    const closeImportSuccessModalBtn = document.getElementById('closeImportSuccessModal');

    function init(Points, Tasks) {
        // Mostrar Modal de Puntos
        document.getElementById('showPoints').addEventListener('click', () => {
            pointsModal.classList.remove('hidden');
        });

        // Cerrar Modal de Puntos
        closePointsModalBtn.addEventListener('click', () => {
            pointsModal.classList.add('hidden');
        });

        // Reiniciar Puntos - Abrir Confirmación
        resetPointsButton.addEventListener('click', () => {
            showConfirmResetModal();
        });

        // Confirmar Reinicio de Puntos
        confirmResetYes.addEventListener('click', () => {
            Points.resetPoints();
            hideConfirmResetModal();
            hidePointsModal();
            showSuccessModal('Tus puntos han sido reiniciados a 0.');
        });

        // Cancelar Reinicio de Puntos
        confirmResetNo.addEventListener('click', () => {
            hideConfirmResetModal();
        });

        // Cerrar Modal de Éxito
        closeSuccessModalBtn.addEventListener('click', () => {
            hideSuccessModal();
        });

        // Cerrar Modal de Error en Importación
        closeErrorImportModalBtn.addEventListener('click', () => {
            hideErrorImportModal();
        });

        // Cerrar Modal de Éxito en Importación
        closeImportSuccessModalBtn.addEventListener('click', () => {
            hideImportSuccessModal();
        });
    }

    function showConfirmResetModal() {
        confirmResetModal.classList.remove('hidden');
    }

    function hideConfirmResetModal() {
        confirmResetModal.classList.add('hidden');
    }

    function hidePointsModal() {
        pointsModal.classList.add('hidden');
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

    function showErrorImportModal(message) {
        const errorImportMessage = document.getElementById('errorImportMessage');
        errorImportMessage.textContent = message;
        errorImportModal.classList.remove('hidden');
    }

    function hideErrorImportModal() {
        errorImportModal.classList.add('hidden');
    }

    function showImportSuccessModal(message) {
        const importSuccessMessage = document.getElementById('importSuccessMessage');
        importSuccessMessage.textContent = message;
        importSuccessModal.classList.remove('hidden');
    }

    function hideImportSuccessModal() {
        importSuccessModal.classList.add('hidden');
    }

    return {
        init,
        showSuccessModal,
        showErrorImportModal,
        showImportSuccessModal,
        showConfirmImportModal,
        hideConfirmImportModal
    };
})();
