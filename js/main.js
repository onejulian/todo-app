// js/main.js

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Módulos
    Theme.init();
    Points.init();
    Modal.init(Points, Tasks);
    Tasks.init();
    ImportExport.init();
    Nav.init(); // Inicializar el módulo de navegación
});
