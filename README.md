📝 TextPro Editor - Éditeur de Texte Moderne
https://img.shields.io/badge/version-2.0.0-blue
https://img.shields.io/badge/license-MIT-green
https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white
https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white
https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black

Un éditeur de texte riche et moderne avec interface professionnelle, développé en HTML, CSS et JavaScript pur.

🚀 Installation
Méthode 1 - Git Clone (Recommandée)
bash
# Cloner le repository
git clone https://github.com/ilyass-ch10/word_prject.git

# Se déplacer dans le dossier
cd word_prject

# Ouvrir l'application
# Double-cliquez sur index.html ou utilisez un serveur local
Méthode 2 - Serveur Local
bash
# Avec Python
python -m http.server 8000

# Avec PHP
php -S localhost:8000

# Avec Node.js (si installé)
npx http-server
Puis visitez http://localhost:8000

Méthode 3 - Téléchargement Direct
Téléchargez les fichiers depuis GitHub

Extrayez l'archive

Ouvrez index.html dans votre navigateur

📞 Contact
👨‍💻 GitHub : github.com/ilyass-ch10

📷 Instagram : @ily1ss_04

📧 Email : ilyassmino1@gmail.com

✨ Fonctionnalités Principales
🎯 Édition Avancée
Édition WYSIWYG en temps réel

Gestion multi-pages avec système d'onglets

Formatage complet : gras, italique, souligné

Couleurs et polices personnalisables

Alignement (gauche, centre, droite, justifié)

Listes à puces et numérotées

Indentation avancée

🖼️ Support Multimédia
Insertion d'images depuis votre appareil

Liens hypertextes avec validation

Tableaux personnalisables

Support vidéo et audio (fichiers locaux)

🔍 Outils Intelligents
Recherche et remplacement avancé

Compteur de mots en temps réel

Historique annuler/refaire illimité

Sauvegarde automatique toutes les 30 secondes

Raccourcis clavier complets

💾 Import/Export
Export TXT pour texte brut

Export PDF via impression navigateur

Import fichiers TXT existants

Sauvegarde locale automatique

🎨 Interface Moderne
Thème clair/sombre adaptable

Design 100% responsive

Animations fluides

Barre d'outils organisée

Notifications élégantes

⌨️ Raccourcis Clavier
Raccourci	Action
Ctrl + B	Texte en gras
Ctrl + I	Texte en italique
Ctrl + U	<u>Texte souligné</u>
Ctrl + Z	↶ Annuler
Ctrl + Y	↷ Refaire
Ctrl + F	🔍 Rechercher
Ctrl + S	💾 Sauvegarder
Ctrl + N	📄 Nouvelle page
Ctrl + T	🌙 Changer thème
F3	▶️ Occurrence suivante
Shift + F3	◀️ Occurrence précédente
Escape	❌ Fermer recherche
🛠️ Utilisation
Démarrage Immédiat
Ouvrez index.html dans votre navigateur

Commencez à taper dans la zone d'édition

Utilisez la barre d'outils pour formater votre texte

Ajoutez des pages avec le bouton "Nouvelle Page"

Exportez votre travail quand nécessaire

Fonctionnalités Avancées
🌙 Thème sombre : Cliquez sur l'icône lune dans l'en-tête

🖥️ Plein écran : Icône d'agrandissement pour plus d'espace

🔍 Recherche : Ctrl+F pour ouvrir le panneau de recherche

💾 Sauvegarde auto : Vos modifications sont sauvegardées automatiquement

📁 Structure du Projet
text
word_prject/
├── 📄 index.html          # Page principale
├── 🎨 styles.css          # Styles CSS complets
├── ⚡ script.js           # JavaScript principal
│
├── 📖 README.md          # Documentation

🌐 Compatibilité Navigateurs
Navigateur	Version	Support	Notes
Chrome	90+	✅ Excellent	Recommandé
Firefox	85+	✅ Excellent	Pleinement supporté
Safari	14+	✅ Excellent	Compatible
Edge	90+	✅ Excellent	Basé sur Chromium
Opera	75+	✅ Excellent	Pleinement supporté
✅ Supporte tous les navigateurs modernes avec JavaScript activé.

🐛 Dépannage
Problèmes Courants & Solutions
📄 L'export PDF ne fonctionne pas

Utilisez la fonction d'impression de votre navigateur

Choisissez "Enregistrer au format PDF" dans les destinations

Alternative : Exportez en TXT et convertissez avec un autre outil

🖼️ Les images ne s'affichent pas

Vérifiez la taille des fichiers (maximum 5MB)

Utilisez des formats standards : JPG, PNG, GIF

Réduisez la taille des images si nécessaire

💾 Perte de données

La sauvegarde automatique prévient la perte

Le système propose de charger la sauvegarde auto au démarrage

Exportez régulièrement votre travail

⚡ Problèmes de performance

Évitez les documents très volumineux (>10,000 mots)

Fermez les onglets inutilisés

Utilisez le thème sombre pour économiser la batterie

📱 Affichage mobile

L'interface s'adapte automatiquement

Utilisez le mode paysage pour plus d'espace

Les boutons sont optimisés pour le tactile

🔧 Personnalisation
Modifier les couleurs
Éditez styles.css et modifiez les variables CSS :

css
:root {
  --primary-color: #2563eb;    /* Couleur principale bleue */
  --background-color: #f8fafc; /* Arrière-plan clair */
  --surface-color: #ffffff;    /* Couleur des surfaces */
  --text-primary: #1e293b;     /* Texte principal */
  /* Ajoutez vos couleurs personnalisées */
}
Ajouter des fonctionnalités
Le code est modulaire et facile à étendre :

javascript
// Dans script.js - TextEditor class
addCustomFeature() {
    // Votre code ici
    this.showNotification('Nouvelle fonctionnalité ajoutée !', 'success');
}
📄 Licence
Ce projet est sous licence MIT - vous êtes libre de l'utiliser, modifier et distribuer.

🤝 Contribution
Les contributions sont les bienvenues !

Fork le projet

Créez une branche (git checkout -b feature/AmazingFeature)

Commitez vos changements (git commit -m 'Add AmazingFeature')

Push (git push origin feature/AmazingFeature)

Ouvrez une Pull Request

🎯 Améliorations Planifiées
Synchronisation cloud (Google Drive, Dropbox)

Mode collaboration en temps réel

Templates de documents prédéfinis

Système de plugins extensible

Mode hors-ligne avancé (PWA)

Intégration AI (correcteur, suggestions)

🙏 Remerciements
Font Awesome pour les icônes de qualité

Google Fonts pour les polices web

Communauté open-source pour l'inspiration

Tous les testeurs pour leurs retours précieux

📊 Statistiques
📏 Taille : ~500 lignes de code

⚡ Performance : Chargement < 2 secondes

📱 Responsive : Mobile, tablette, desktop

🔧 Maintenance : Code propre et documenté

<div align="center">
✨ Développé avec passion par Ilyass ✨

https://img.shields.io/badge/GitHub-ilyass--ch10-181717?logo=github
https://img.shields.io/badge/Instagram-@ily1ss_04-E4405F?logo=instagram
https://img.shields.io/badge/ilyassmino1@gmail.com-D14836?logo=gmail

⭐ N'hésitez pas à donner une étoie sur GitHub !

</div>
Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}
