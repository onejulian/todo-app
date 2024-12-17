const Points = (function (Storage) {
    let points = 0;
    const pointsDisplay = document.getElementById('pointsDisplay');
    const pointsModalDisplay = document.getElementById('pointsModalDisplay');
    let countdownInterval;

    function init() {
        loadPoints();
        updatePointsDisplay();
        initCountdown();
    }

    function addPoints(amount) {
        points += amount;
        updatePointsDisplay();
        Storage.savePoints(points);
    }

    function subtractPoints(amount) {
        points = Math.max(0, points - amount);
        updatePointsDisplay();
        Storage.savePoints(points);
    }

    function resetPoints() {
        points = 0;
        updatePointsDisplay();
        Storage.savePoints(points);
    }

    function setPoints(newPoints) {
        points = Math.max(0, parseInt(newPoints, 10)) || 0;
        updatePointsDisplay();
        Storage.savePoints(points);
    }

    function getPoints() { // Método getter para puntos
        return points;
    }

    function loadPoints() {
        points = Storage.loadPoints();
    }

    function updatePointsDisplay() {
        pointsDisplay.textContent = points;
        pointsModalDisplay.textContent = points;
        updateCountdownDisplay();
    }

    function initCountdown() {
        clearInterval(countdownInterval); // Limpiar cualquier intervalo existente
        countdownInterval = setInterval(updateCountdownDisplay, 1000);
    }

    function getNextPointDeductionTime() {
        const lastCompletedTask = Tasks.getLastCompletedTask();
        if (!lastCompletedTask) return null;

        const lastCompletionDate = new Date(lastCompletedTask.dataset.completedAt);
        const nextDeductionTime = new Date(lastCompletionDate.getTime() + 24 * 60 * 60 * 1000); // Sumar 24 horas
        return nextDeductionTime;
    }

    function updateCountdownDisplay() {
        const nextDeductionTime = getNextPointDeductionTime();
        if (!nextDeductionTime) {
            // Ocultar el temporizador si no hay una tarea completada
            // document.getElementById('countdownDisplay').textContent = '';
            return;
        }

        const now = new Date();
        const timeLeft = nextDeductionTime - now;

        if (timeLeft <= 0) {
            // Si el tiempo ha expirado, desmarcar la tarea y recalcular
            Tasks.uncheckCompletedTasks();
            initCountdown(); // Reiniciar el temporizador
            return;
        }

        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById('countdownHours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('countdownMinutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('countdownSeconds').textContent = seconds.toString().padStart(2, '0');
    }

    return {
        init,
        addPoints,
        subtractPoints,
        resetPoints,
        setPoints,
        getPoints,
        getNextPointDeductionTime,
        updateCountdownDisplay,
        initCountdown
    };
})(Storage);