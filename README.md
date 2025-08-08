# DailyDo - To-Do List Progressive Web App

![DailyDo Screenshot](screenshot.png) *(Remplacez par un vrai screenshot si vous en avez un)*

**DailyDo** est une application web de gestion de tâches quotidienne (To-Do List) moderne, complète et conçue comme une **Progressive Web App (PWA)**. Elle vous permet de gérer efficacement vos tâches, de prendre des notes et de rester organisé, le tout avec un style personnalisable.

## 🌟 Fonctionnalités

*   **Gestion de Tâches :**
    *   Ajout, suppression, édition et marquage des tâches comme terminées.
    *   Épinglage des tâches importantes pour qu'elles restent en haut de la liste.
    *   Ajout d'une date limite à chaque tâche.
    *   Marquage des tâches comme prioritaires.
*   **Notifications :**
    *   Notifications Toast pour les rappels et les messages d'information (succès, avertissements).
    *   Alerte lorsqu'une tâche avec date limite est en retard.
*   **Personnalisation :**
    *   Choix et sauvegarde d'un pseudo personnel.
    *   7 thèmes visuels intégrés (Light, Dark, Neon, Hacker, Retro, Monochrome, Royal) sélectionnables via un menu hamburger.
*   **Notes :**
    *   Bloc-notes intégré pour prendre des notes rapides, avec sauvegarde automatique et manuelle.
*   **Recherche :**
    *   Recherche rapide et efficace dans les tâches (texte et date).
*   **Partage :**
    *   Partagez facilement une tâche via l'API Web Share (ou copiez-la dans le presse-papier).
*   **PWA (Progressive Web App) :**
    *   Installable sur votre ordinateur ou mobile comme une application native.
    *   Fonctionne hors ligne grâce à un Service Worker et un système de cache intelligent.
*   **Bonus :**
    *   Mode Motivation : Affiche une citation inspirante à l'ouverture.
    *   Suggestions automatiques : Propose des tâches en fonction de l'heure de la journée.

## 🚀 Technologies Utilisées

*   **Front-End :** HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6+)
*   **APIs Web :** localStorage, Web Share API, Service Workers
*   **Bibliothèques :** Font Awesome (pour les icônes)
*   **Outils :** Aucun framework ou bibliothèque tierce (Vanilla JS)

## 🛠️ Installation et Utilisation

1.  **Cloner ou Télécharger :** Ne pas clonez ce dépôt ou téléchargez les fichiers sources.
2.  **Serveur Local :** Pour un développement et un test optimaux, utilisez un serveur local (comme Live Server dans VS Code) pour servir les fichiers via `http://localhost:...`. Les Service Workers nécessitent un environnement sécurisé (`https://` ou `localhost`).
3.  **Ouvrir dans le Navigateur :** Accédez au fichier `index.html` via votre serveur local.
4.  **Installation PWA :** Sur les navigateurs compatibles, vous devriez pouvoir "installer" l'application (généralement via un bouton dans la barre d'adresse ou le menu du navigateur).

## 📁 Structure du Projet

*   `index.html` : Structure principale de l'application.
*   `styles.css` : Tous les styles, y compris les 7 thèmes.
*   `script.js` : Logique principale de l'application (gestion des tâches, du DOM, des thèmes, etc.).
*   `app.js` : Fonctionnalités bonus (Mode Motivation, Suggestions).
*   `service-worker.js` : Gestion du cache pour le fonctionnement hors ligne.
*   `manifest.json` : Fichier de configuration pour la PWA.
*   `/icons/` : Dossier contenant les icônes de l'application (192x192.png, 512x512.png).
*   `README.md` : Ce fichier.

## ⚠️ Important



## 🤝 Contribution

Les contributions ne sont pas ouvertes sur ce dépôt.

## 📄 Licence

Ce projet est distribué sans licence spécifique. Tous droits réservés par l'auteur du projet.

## 📞 Contact

Pour toute question concernant ce projet, veuillez vous référer maitre du projet.
