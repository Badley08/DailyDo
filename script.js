// script.js

// === MODULE DE GESTION DE L'APPLICATION ===
const DailyDoApp = (function () {
    // === ÉTAT DE L'APPLICATION ===
    let state = {
        tasks: JSON.parse(localStorage.getItem('tasks')) || [],
        currentTheme: localStorage.getItem('theme') || 'light',
        userPseudo: localStorage.getItem('pseudo') || 'Utilisateur',
        notes: localStorage.getItem('notes') || ''
    };

    // === ÉLÉMENTS DOM ===
    let domElements = {}; // Sera rempli dans init()

    // === INITIALISATION ===
    function init() {
        // Récupérer les éléments DOM après le chargement du HTML
        domElements = {
            taskForm: document.getElementById('task-form'),
            taskInput: document.getElementById('task-input'),
            deadlineInput: document.getElementById('deadline-input'),
            taskList: document.getElementById('task-list'),
            searchInput: document.getElementById('search-input'),
            menuToggle: document.getElementById('menu-toggle'), // ID corrigé
            sideMenu: document.getElementById('side-menu'),
            userGreeting: document.getElementById('user-greeting'),
            notesSection: document.getElementById('notes-section'),
            notesTextarea: document.getElementById('notes-textarea'),
            themesSection: document.getElementById('themes-section'),
            themeButtons: document.querySelectorAll('.theme-btn'),
            notesLink: document.getElementById('notes-link'),
            themeSelectorLink: document.getElementById('theme-selector-link'),
            settingsLink: document.getElementById('settings-link'),
            pseudoInput: document.getElementById('pseudo-input'),
            savePseudoBtn: document.getElementById('save-pseudo-btn'),
            saveNotesBtn: document.getElementById('save-notes-btn')
        };

        // Vérifier que tous les éléments essentiels sont présents
        if (!domElements.taskForm || !domElements.taskList || !domElements.searchInput ||
            !domElements.menuToggle || !domElements.sideMenu) {
            console.error("Certains éléments DOM n'ont pas été trouvés. Vérifiez les ID dans le HTML.");
            return; // Arrêter l'initialisation si des éléments critiques manquent
        }

        applyTheme(state.currentTheme);
        domElements.pseudoInput.value = state.userPseudo;
        domElements.userGreeting.textContent = `Bonjour, ${state.userPseudo}`;
        domElements.notesTextarea.value = state.notes;
        renderTasks();
        checkOverdueTasks(); // Vérifier les tâches en retard au démarrage
        attachEventListeners();
    }

    // === GESTIONNAIRES D'ÉVÉNEMENTS ===
    function attachEventListeners() {
        // Formulaire d'ajout de tâche
        domElements.taskForm.addEventListener('submit', handleAddTask);

        // Recherche
        domElements.searchInput.addEventListener('input', handleSearch);

        // Menu Hamburger
        domElements.menuToggle.addEventListener('click', toggleSideMenu);
        document.addEventListener('click', handleOutsideClick);

        // Navigation dans le menu
        domElements.notesLink.addEventListener('click', showNotesSection);
        domElements.themeSelectorLink.addEventListener('click', showThemesSection);
        domElements.settingsLink.addEventListener('click', showSettings);

        // Gestion du pseudo
        domElements.savePseudoBtn.addEventListener('click', savePseudo);

        // Gestion des notes
        domElements.saveNotesBtn.addEventListener('click', saveNotes);

        // Gestion des thèmes
        domElements.themeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const theme = button.dataset.theme;
                changeTheme(theme);
            });
        });
    }

    // === GESTION DES TÂCHES ===
    function handleAddTask(e) {
        e.preventDefault();
        const taskText = domElements.taskInput.value.trim();
        if (taskText === '') return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            priority: false, // Priorité non implémentée dans cette version du HTML, mais conservée dans l'état
            pinned: false,
            deadline: domElements.deadlineInput.value || null,
            createdAt: new Date().toISOString()
        };

        state.tasks.unshift(newTask);
        saveTasks();
        renderTasks();
        domElements.taskInput.value = '';
        domElements.deadlineInput.value = '';
        showToast('Tâche ajoutée avec succès !', 'success');
    }

    function renderTasks(filter = '') {
        domElements.taskList.innerHTML = '';

        let filteredTasks = state.tasks;
        if (filter) {
            const searchTerm = filter.toLowerCase();
            filteredTasks = state.tasks.filter(task =>
                task.text.toLowerCase().includes(searchTerm) ||
                (task.deadline && new Date(task.deadline).toLocaleString().toLowerCase().includes(searchTerm))
            );
        }

        if (filteredTasks.length === 0) {
            domElements.taskList.innerHTML = '<li class="no-tasks">Aucune tâche trouvée.</li>';
            return;
        }

        // Trier : épinglées en premier, puis par date de création (desc)
        filteredTasks.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            if (task.pinned) li.classList.add('pinned');

            const formattedDeadline = task.deadline ? new Date(task.deadline).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : '';

            // Note : Le HTML généré ici doit correspondre exactement à la structure du HTML fourni
            // Surtout pour les attributs data-id et les classes
            li.innerHTML = `
                <div class="task-header">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                    ${task.priority ? '<span class="task-priority">!</span>' : ''}
                    <span class="task-text ${task.completed ? 'completed' : ''}" data-id="${task.id}">${escapeHtml(task.text)}</span>
                    ${formattedDeadline ? `<span class="task-deadline">${formattedDeadline}</span>` : ''}
                </div>
                <div class="task-actions">
                    <button class="task-btn pin-btn" data-id="${task.id}">
                        <i class="fas fa-thumbtack"></i>
                    </button>
                    <button class="task-btn edit-btn" data-id="${task.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-btn delete-btn" data-id="${task.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="task-btn share-btn" data-id="${task.id}">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button class="task-btn save-btn" data-id="${task.id}"> <!-- Caché par défaut, visible au survol -->
                        <i class="fas fa-save"></i>
                    </button>
                </div>
                <textarea class="task-edit-input hidden" data-id="${task.id}">${escapeHtml(task.text)}</textarea>
            `;
            domElements.taskList.appendChild(li);
        });

        // Attacher les écouteurs d'événements pour les nouvelles tâches
        attachTaskEventListeners();
    }

    function attachTaskEventListeners() {
        // Checkbox (Terminer)
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const id = Number(e.target.dataset.id);
                toggleTaskCompletion(id);
            });
        });

        // Bouton Épingler
        document.querySelectorAll('.pin-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = Number(e.currentTarget.dataset.id);
                toggleTaskPin(id);
            });
        });

        // Bouton Éditer
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = Number(e.currentTarget.dataset.id);
                const taskItem = e.currentTarget.closest('.task-item');
                const taskText = taskItem.querySelector('.task-text');
                const editInput = taskItem.querySelector('.task-edit-input');
                
                taskText.classList.add('hidden');
                editInput.classList.remove('hidden');
                editInput.focus();
            });
        });

        // Bouton Sauvegarder (visible au survol)
        document.querySelectorAll('.save-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = Number(e.currentTarget.dataset.id);
                const taskItem = e.currentTarget.closest('.task-item');
                const editInput = taskItem.querySelector('.task-edit-input');
                const newText = editInput.value.trim();

                if (newText) {
                    updateTaskText(id, newText);
                    const taskText = taskItem.querySelector('.task-text');
                    taskText.textContent = newText; // Met à jour le texte affiché
                    taskText.classList.remove('hidden');
                    editInput.classList.add('hidden');
                    showToast('Tâche modifiée avec succès !', 'info');
                }
            });
        });

        // Bouton Supprimer
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = Number(e.currentTarget.dataset.id);
                deleteTask(id);
            });
        });

        // Bouton Partager
        document.querySelectorAll('.share-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = Number(e.currentTarget.dataset.id);
                const task = state.tasks.find(t => t.id === id);
                if (task) {
                    shareTask(task);
                }
            });
        });
    }

    function toggleTaskCompletion(id) {
        state.tasks = state.tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
        saveTasks();
        renderTasks(domElements.searchInput.value);
    }

    function toggleTaskPin(id) {
        state.tasks = state.tasks.map(task => task.id === id ? { ...task, pinned: !task.pinned } : task);
        saveTasks();
        renderTasks(domElements.searchInput.value);
        const task = state.tasks.find(t => t.id === id);
        showToast(task.pinned ? 'Tâche épinglée.' : 'Tâche désépinglée.', 'info');
    }

    function updateTaskText(id, newText) {
        state.tasks = state.tasks.map(task => task.id === id ? { ...task, text: newText } : task);
        saveTasks();
    }

    function deleteTask(id) {
        state.tasks = state.tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks(domElements.searchInput.value);
        showToast('Tâche supprimée.', 'warning');
    }

    // === GESTION DE LA RECHERCHE ===
    function handleSearch(e) {
        const filter = e.target.value;
        renderTasks(filter);
    }

    // === GESTION DU MENU HAMBURGER ===
    function toggleSideMenu() {
        domElements.sideMenu.classList.toggle('open');
    }

    function handleOutsideClick(e) {
        // Fermer le menu si on clique en dehors
        if (domElements.sideMenu && domElements.sideMenu.classList.contains('open') &&
            !domElements.sideMenu.contains(e.target) &&
            e.target !== domElements.menuToggle &&
            !domElements.menuToggle.contains(e.target)) {
            domElements.sideMenu.classList.remove('open');
        }
    }

    // === GESTION DES SECTIONS (Notes, Thèmes) ===
    function showNotesSection(e) {
        e.preventDefault();
        if (domElements.themesSection) domElements.themesSection.classList.add('hidden');
        if (domElements.notesSection) domElements.notesSection.classList.remove('hidden');
        if (domElements.sideMenu) domElements.sideMenu.classList.remove('open');
    }

    function showThemesSection(e) {
        e.preventDefault();
        if (domElements.notesSection) domElements.notesSection.classList.add('hidden');
        if (domElements.themesSection) domElements.themesSection.classList.remove('hidden');
        if (domElements.sideMenu) domElements.sideMenu.classList.remove('open');
    }

    function showSettings(e) {
        e.preventDefault();
        if (domElements.notesSection) domElements.notesSection.classList.add('hidden');
        if (domElements.themesSection) domElements.themesSection.classList.add('hidden');
        // Ici, on pourrait ouvrir une modale de paramètres
        showToast('Paramètres (à implémenter)', 'info');
        if (domElements.sideMenu) domElements.sideMenu.classList.remove('open');
    }

    // === GESTION DU PSEUDO ===
    function savePseudo() {
        const newPseudo = domElements.pseudoInput.value.trim();
        if (newPseudo) {
            state.userPseudo = newPseudo;
            localStorage.setItem('pseudo', state.userPseudo);
            domElements.userGreeting.textContent = `Bonjour, ${state.userPseudo}`;
            showToast('Pseudo mis à jour avec succès !', 'success');
        } else {
            showToast('Veuillez entrer un pseudo valide.', 'warning');
        }
    }

    // === GESTION DES NOTES ===
    function saveNotes() {
        state.notes = domElements.notesTextarea.value; // Récupère la valeur actuelle
        localStorage.setItem('notes', state.notes);
        showToast('Notes sauvegardées !', 'success');
    }

    // === GESTION DES THÈMES ===
    function changeTheme(theme) {
        state.currentTheme = theme;
        localStorage.setItem('theme', theme);
        applyTheme(theme);
        showToast(`Thème "${theme}" appliqué.`, 'info');
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    // === GESTION DU PARTAGE DE TÂCHES ===
    function shareTask(task) {
        const textToShare = `Tâche: ${task.text}${task.deadline ? `\nDate limite: ${new Date(task.deadline).toLocaleString('fr-FR')}` : ''}`;

        if (navigator.share) {
            navigator.share({
                title: 'Partager une tâche - DailyDo',
                text: textToShare
            }).catch(error => {
                console.log('Erreur lors du partage:', error);
                // Fallback: copier dans le presse-papier
                copyToClipboard(textToShare);
            });
        } else {
            // Fallback: copier dans le presse-papier
            copyToClipboard(textToShare);
        }
    }

    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('Tâche copiée dans le presse-papier !', 'info');
            }).catch(err => {
                console.error('Erreur lors de la copie: ', err);
                showToast('Impossible de copier la tâche.', 'error');
            });
        } else {
            // Fallback très basique pour les anciens navigateurs
            const textArea = document.createElement("textarea");
            textArea.value = text;
            // Ajouter temporairement à la page
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showToast('Tâche copiée dans le presse-papier !', 'info');
                } else {
                    showToast('Impossible de copier la tâche.', 'error');
                }
            } catch (err) {
                showToast('Impossible de copier la tâche.', 'error');
            }
            // Retirer de la page
            document.body.removeChild(textArea);
        }
    }

    // === GESTION DES NOTIFICATIONS TOAST ===
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
             console.warn("Conteneur de toast non trouvé (#toast-container)");
             return; // Ne pas afficher si le conteneur n'existe pas
        }
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let iconClass = 'fa-info-circle';
        if (type === 'success') iconClass = 'fa-check-circle';
        if (type === 'warning') iconClass = 'fa-exclamation-circle';
        if (type === 'error') iconClass = 'fa-times-circle';

        toast.innerHTML = `<i class="fas ${iconClass}"></i> ${message}`;
        toastContainer.appendChild(toast);

        // Supprimer le toast après l'animation
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // === GESTION DE LA PERSistance DES DONNÉES ===
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
    }

    // === SÉCURITÉ ===
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '<',
            '>': '>',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // === VÉRIFICATION DES TÂCHES EN RETARD ===
    function checkOverdueTasks() {
        const now = new Date();
        state.tasks.forEach(task => {
            if (task.deadline && !task.completed) {
                const deadlineDate = new Date(task.deadline);
                if (deadlineDate < now) {
                    showToast(`La tâche "${task.text}" est en retard !`, 'warning');
                }
            }
        });
    }

    // === EXPOSITION PUBLIQUE ===
    return {
        init,
        getState: () => state, // Pour debug ou accès externe
        renderTasks // Pour permettre un re-rendu depuis app.js si nécessaire
    };

})();

// === ATTENTE DU CHARGEMENT DU DOM AVANT INITIALISATION ===
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', DailyDoApp.init);
} else {
    // DOM déjà chargé
    DailyDoApp.init();
}