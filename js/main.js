document.addEventListener('DOMContentLoaded', function () {
    // Inicializar Módulos
    I18n.init();
    Theme.init();
    Points.init();
    Modal.init(Points, Tasks);
    Tasks.init();
    ImportExport.init();
    Nav.init();
});