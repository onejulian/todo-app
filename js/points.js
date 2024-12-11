// js/points.js

const Points = (function(Storage) {
    let points = 0;
    const pointsDisplay = document.getElementById('pointsDisplay');
    const pointsModalDisplay = document.getElementById('pointsModalDisplay');

    function init() {
        loadPoints();
        updatePointsDisplay();
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

    function loadPoints() {
        points = Storage.loadPoints();
    }

    function updatePointsDisplay() {
        pointsDisplay.textContent = points;
        pointsModalDisplay.textContent = points;
    }

    return {
        init,
        addPoints,
        subtractPoints,
        resetPoints
    };
})(Storage);
