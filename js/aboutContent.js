const AboutContent = (function () {
    function getAboutContent() {
        return `
            <div id="aboutContent-en" class="language-content">
                <h4>Features:</h4>
                <ul class="list-disc list-inside">
                    <li>Add, Edit, and Delete Tasks: Easily manage your daily tasks with intuitive controls.</li>
                    <li>Points System: Earn 25 points for every completed task and lose 50 points for tasks not
                        completed within 24 hours. Stay motivated and track your progress!</li>
                    <li>Backup Your Tasks: Safeguard your tasks by exporting and importing them whenever you need.</li>
                    <li>Customizable Themes: Personalize your experience by changing the app’s color theme to suit your
                        style.</li>
                    <li>Multilingual Support: Use it in your preferred language with our comprehensive language
                        support.</li>
                    <li>Mobile-Friendly: Access and manage your tasks on the go with our fully optimized mobile version.
                    </li>
                </ul>
    
                <br>
    
                <h4>Upcoming Updates:</h4>
                <ul class="list-disc list-inside">
                    <li>User Authentication: Soon, you’ll be able to create an account and securely log in to access
                        your tasks from any device.</li>
                    <li>Advanced Task Sorting: Organize your tasks effortlessly by sorting them based on various
                        criteria.</li>
                    <li>Task Descriptions: Add optional descriptions to each task for more detailed planning.</li>
                </ul>
                <br>
                <p>
                    <a href="https://github.com/onejulian/todo-app" target="_blank" rel="noopener noreferrer"
                        class="text-blue-500 hover:underline">
                        Collaborate with this project
                    </a>
                </p>
            </div>
            <!-- Contenido en Español -->
            <div id="aboutContent-es" class="language-content hidden">
                <h4>Características:</h4>
                <ul class="list-disc list-inside">
                    <li>Agregar, Editar y Eliminar Tareas: Gestiona fácilmente tus tareas diarias con controles
                        intuitivos.</li>
                    <li>Sistema de Puntos: Gana 25 puntos por cada tarea completada y pierde 50 puntos por tareas no
                        completadas en 24 horas. ¡Mantente motivado y sigue tu progreso!</li>
                    <li>Respaldo de tus Tareas: Protege tus tareas exportándolas e importándolas cuando lo necesites.
                    </li>
                    <li>Temas Personalizables: Personaliza tu experiencia cambiando el tema de color de la app según tu
                        estilo.</li>
                    <li>Soporte Multilingüe: Úsalo en tu idioma preferido con nuestro completo soporte de
                        idiomas.</li>
                    <li>Compatible con Móviles: Accede y gestiona tus tareas en cualquier lugar con nuestra versión
                        móvil totalmente optimizada.</li>
                </ul>
    
                <br>
    
                <h4>Próximas Actualizaciones:</h4>
                <ul class="list-disc list-inside">
                    <li>Autenticación de Usuarios: Próximamente, podrás crear una cuenta e iniciar sesión de forma
                        segura para acceder a tus tareas desde cualquier dispositivo.</li>
                    <li>Ordenamiento Avanzado de Tareas: Organiza tus tareas sin esfuerzo ordenándolas según diferentes
                        criterios.</li>
                    <li>Descripciones de Tareas: Agrega descripciones opcionales a cada tarea para una planificación más
                        detallada.</li>
                </ul>
                <br>
                <p>
                    <a href="https://github.com/onejulian/todo-app" target="_blank" rel="noopener noreferrer"
                        class="text-blue-500 hover:underline">
                        Colabora con este proyecto
                    </a>
                </p>
            </div>
            <!-- Contenu en Français -->
            <div id="aboutContent-fr" class="language-content hidden">
                <h4>Fonctionnalités :</h4>
                <ul class="list-disc list-inside">
                    <li>Ajouter, Modifier et Supprimer des Tâches : Gérez facilement vos tâches quotidiennes avec des contrôles intuitifs.</li>
                    <li>Système de Points : Gagnez 25 points pour chaque tâche complétée et perdez 50 points pour les tâches non
                        complétées dans les 24 heures. Restez motivé et suivez vos progrès !</li>
                    <li>Sauvegarde de vos Tâches : Protégez vos tâches en les exportant et en les important chaque fois que vous en avez besoin.</li>
                    <li>Thèmes Personnalisables : Personnalisez votre expérience en changeant le thème de couleur de l'application selon votre style.</li>
                    <li>Support Multilingue : Utilisez-le dans votre langue préférée grâce à notre support linguistique complet.</li>
                    <li>Compatible Mobile : Accédez et gérez vos tâches en déplacement avec notre version mobile entièrement optimisée.</li>
                </ul>
    
                <br>
    
                <h4>Mises à Jour à Venir :</h4>
                <ul class="list-disc list-inside">
                    <li>Authentification des Utilisateurs : Bientôt, vous pourrez créer un compte et vous connecter en toute sécurité pour accéder à vos tâches depuis n'importe quel appareil.</li>
                    <li>Tri Avancé des Tâches : Organisez vos tâches sans effort en les triant selon divers critères.</li>
                    <li>Descriptions des Tâches : Ajoutez des descriptions optionnelles à chaque tâche pour une planification plus détaillée.</li>
                </ul>
                <br>
                <p>
                    <a href="https://github.com/onejulian/todo-app" target="_blank" rel="noopener noreferrer"
                        class="text-blue-500 hover:underline">
                        Collaborez avec ce projet
                    </a>
                </p>
            </div>
        `;
    }

    return {
        getAboutContent
    }
})();
