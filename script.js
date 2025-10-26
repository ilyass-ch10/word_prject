// Text Editor Application
class TextEditor {
    constructor() {
        this.currentPage = 1;
        this.pagesContainer = document.getElementById('pages');
        this.pageTabs = document.getElementById('pageTabs');
        this.searchResults = [];
        this.currentSearchIndex = -1;
        this.isFullscreen = false;
        this.autoSaveInterval = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupEditor('editor1');
        this.loadTheme();
        this.loadAutoSave();
        this.startAutoSave();
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 60000);
        
        // Setup initial close buttons
        this.setupCloseButtons();
    }

    setupEventListeners() {
        // Formatting buttons
        document.getElementById('bold').addEventListener('click', () => this.execCommand('bold'));
        document.getElementById('italic').addEventListener('click', () => this.execCommand('italic'));
        document.getElementById('underline').addEventListener('click', () => this.execCommand('underline'));
        document.getElementById('alignLeft').addEventListener('click', () => this.execCommand('justifyLeft'));
        document.getElementById('alignCenter').addEventListener('click', () => this.execCommand('justifyCenter'));
        document.getElementById('alignRight').addEventListener('click', () => this.execCommand('justifyRight'));
        document.getElementById('justify').addEventListener('click', () => this.execCommand('justifyFull'));

        // Font controls
        document.getElementById('fontFamily').addEventListener('change', (e) => {
            this.execCommand('fontName', false, e.target.value);
        });
        
        document.getElementById('fontSize').addEventListener('change', (e) => {
            this.execCommand('fontSize', false, e.target.value);
        });

        // Color picker
        document.getElementById('textColor').addEventListener('input', (e) => {
            this.execCommand('foreColor', false, e.target.value);
        });

        // List and indentation
        document.getElementById('insertUnorderedList').addEventListener('click', () => this.execCommand('insertUnorderedList'));
        document.getElementById('insertOrderedList').addEventListener('click', () => this.execCommand('insertOrderedList'));
        document.getElementById('outdent').addEventListener('click', () => this.execCommand('outdent'));
        document.getElementById('indent').addEventListener('click', () => this.execCommand('indent'));

        // Media buttons
        document.getElementById('insertImage').addEventListener('click', () => this.insertImage());
        document.getElementById('insertLink').addEventListener('click', () => this.insertLink());
        document.getElementById('insertTable').addEventListener('click', () => this.insertTable());

        // Actions
        document.getElementById('undo').addEventListener('click', () => this.execCommand('undo'));
        document.getElementById('redo').addEventListener('click', () => this.execCommand('redo'));
        document.getElementById('search').addEventListener('click', () => this.openSearchDialog());

        // Page management
        document.getElementById('addPage').addEventListener('click', () => this.addNewPage());

        // File actions
        document.getElementById('openBtn').addEventListener('click', () => this.openTxtFile());
        document.getElementById('saveTxtBtn').addEventListener('click', () => this.saveAsTxt());
        document.getElementById('savePdfBtn').addEventListener('click', () => this.exportToPDF());

        // UI controls
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('fullscreenToggle').addEventListener('click', () => this.toggleFullscreen());

        // Search modal
        document.getElementById('closeSearchBtn').addEventListener('click', () => this.closeSearchModal());
        document.getElementById('modalOverlay').addEventListener('click', () => this.closeSearchModal());
        document.getElementById('findBtn').addEventListener('click', () => this.findText());
        document.getElementById('replaceBtn').addEventListener('click', () => this.replaceText());
        document.getElementById('replaceAllBtn').addEventListener('click', () => this.replaceAllText());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Handle tab close buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tab-close')) {
                const tab = e.target.closest('.page-tab');
                if (tab) {
                    this.deletePage(tab.dataset.page);
                }
            }
        });

        // Handle beforeunload for auto-save
        window.addEventListener('beforeunload', () => this.performAutoSave());
    }

    setupCloseButtons() {
        document.querySelectorAll('.tab-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tab = e.target.closest('.page-tab');
                if (tab) {
                    this.deletePage(tab.dataset.page);
                }
            });
        });
    }

    // Editor Core Functions
    execCommand(command, showUI = false, value = null) {
        const activeEditor = this.getActiveEditor();
        if (activeEditor) {
            document.execCommand(command, showUI, value);
            activeEditor.focus();
            this.updateWordCounter();
        }
    }

    getActiveEditor() {
        return document.querySelector('.page.active .editor');
    }

    getAllEditors() {
        return document.querySelectorAll('.editor');
    }

    setupEditor(editorId) {
        const editor = document.getElementById(editorId);
        if (!editor) return;

        editor.addEventListener('click', () => editor.focus());
        editor.addEventListener('input', () => this.updateWordCounter());
        editor.addEventListener('paste', (e) => this.handlePaste(e));
        
        this.updateWordCounter();
    }

    handlePaste(e) {
        // Handle plain text paste to remove formatting
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        document.execCommand('insertText', false, text);
    }

    // Page Management
    addNewPage() {
        this.currentPage++;
        const newPageId = `page${this.currentPage}`;
        const newEditorId = `editor${this.currentPage}`;

        // Create new page
        const newPage = document.createElement('div');
        newPage.className = 'page';
        newPage.id = newPageId;
        newPage.innerHTML = `
            <div id="${newEditorId}" class="editor" contenteditable="true">
                <p>Commencez à taper votre contenu ici...</p>
            </div>
        `;
        this.pagesContainer.appendChild(newPage);

        // Create new tab
        const newTab = document.createElement('div');
        newTab.className = 'page-tab';
        newTab.dataset.page = newPageId;
        newTab.innerHTML = `
            <span>Document ${this.currentPage}</span>
            <button class="tab-close" data-page="${newPageId}">
                <i class="fas fa-times"></i>
            </button>
        `;

        newTab.addEventListener('click', (e) => {
            if (!e.target.closest('.tab-close')) {
                this.switchPage(newPageId);
            }
        });

        this.pageTabs.appendChild(newTab);
        this.switchPage(newPageId);
        this.setupEditor(newEditorId);
        this.setupCloseButtons();
    }

    deletePage(pageId) {
        if (document.querySelectorAll('.page').length <= 1) {
            this.showNotification('Impossible de supprimer : au moins une page doit rester', 'error');
            return;
        }

        const pageElement = document.getElementById(pageId);
        const tabElement = document.querySelector(`.page-tab[data-page="${pageId}"]`);

        if (pageElement && tabElement) {
            // Check if this is the active page
            const isActive = pageElement.classList.contains('active');
            
            pageElement.remove();
            tabElement.remove();

            // Switch to remaining page if active page was deleted
            if (isActive) {
                const remainingTabs = document.querySelectorAll('.page-tab');
                if (remainingTabs.length > 0) {
                    this.switchPage(remainingTabs[remainingTabs.length - 1].dataset.page);
                }
            }
        }
    }

    switchPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update tabs
        document.querySelectorAll('.page-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        const targetTab = document.querySelector(`.page-tab[data-page="${pageId}"]`);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        this.updateWordCounter();
    }

    // Media Insertion
    insertImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    this.showNotification('L\'image est trop volumineuse (max 5MB)', 'error');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    const activeEditor = this.getActiveEditor();
                    if (activeEditor) {
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        img.style.maxWidth = '100%';
                        img.style.borderRadius = 'var(--radius)';
                        img.style.margin = '10px 0';
                        activeEditor.appendChild(img);
                        this.updateWordCounter();
                    }
                };
                reader.onerror = () => {
                    this.showNotification('Erreur lors du chargement de l\'image', 'error');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    insertVideo() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Check file size (max 50MB)
                if (file.size > 50 * 1024 * 1024) {
                    this.showNotification('La vidéo est trop volumineuse (max 50MB)', 'error');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    const activeEditor = this.getActiveEditor();
                    if (activeEditor) {
                        const videoContainer = document.createElement('div');
                        videoContainer.className = 'video-container';
                        const video = document.createElement('video');
                        video.src = event.target.result;
                        video.controls = true;
                        video.style.width = '100%';
                        videoContainer.appendChild(video);
                        activeEditor.appendChild(videoContainer);
                    }
                };
                reader.onerror = () => {
                    this.showNotification('Erreur lors du chargement de la vidéo', 'error');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    insertAudio() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const activeEditor = this.getActiveEditor();
                    if (activeEditor) {
                        const audio = document.createElement('audio');
                        audio.src = event.target.result;
                        audio.controls = true;
                        audio.style.width = '100%';
                        audio.style.margin = '10px 0';
                        activeEditor.appendChild(audio);
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    insertLink() {
        const url = prompt('Entrez l\'URL du lien :', 'https://');
        if (url) {
            // Validate URL
            try {
                new URL(url);
                this.execCommand('createLink', false, url);
                this.showNotification('Lien inséré avec succès', 'success');
            } catch (e) {
                this.showNotification('URL invalide', 'error');
            }
        }
    }

    insertTable() {
        const rows = parseInt(prompt('Nombre de lignes :', '3')) || 3;
        const cols = parseInt(prompt('Nombre de colonnes :', '3')) || 3;
        
        if (rows > 20 || cols > 10) {
            this.showNotification('Le tableau est trop grand (max 20 lignes, 10 colonnes)', 'warning');
            return;
        }
        
        let tableHTML = '<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">';
        
        for (let i = 0; i < rows; i++) {
            tableHTML += '<tr>';
            for (let j = 0; j < cols; j++) {
                tableHTML += `<td style="border: 1px solid var(--border-color); padding: 8px;">&nbsp;</td>`;
            }
            tableHTML += '</tr>';
        }
        tableHTML += '</table>';
        
        this.execCommand('insertHTML', false, tableHTML);
        this.showNotification('Tableau inséré', 'success');
    }

    // Search and Replace
    openSearchDialog() {
        document.getElementById('searchModal').style.display = 'block';
        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('searchInput').focus();
        
        // Populate with selected text if any
        const selection = window.getSelection();
        if (selection.toString().trim()) {
            document.getElementById('searchInput').value = selection.toString();
        }
    }

    closeSearchModal() {
        document.getElementById('searchModal').style.display = 'none';
        document.getElementById('modalOverlay').style.display = 'none';
        this.clearHighlights();
    }

    findText() {
        const searchTerm = document.getElementById('searchInput').value;
        if (!searchTerm.trim()) {
            this.showNotification('Veuillez entrer un terme de recherche', 'warning');
            return;
        }

        const activeEditor = this.getActiveEditor();
        if (!activeEditor) return;

        // Clear previous highlights
        this.clearHighlights();

        // Highlight matches
        const content = activeEditor.innerHTML;
        const regex = new RegExp(this.escapeRegex(searchTerm), 'gi');
        const highlightedContent = content.replace(regex, '<mark class="search-highlight">$&</mark>');
        activeEditor.innerHTML = highlightedContent;

        // Store positions for navigation
        this.searchResults = [];
        const marks = activeEditor.querySelectorAll('mark.search-highlight');
        marks.forEach((mark, index) => {
            this.searchResults.push({ element: mark, index });
        });

        this.currentSearchIndex = 0;
        
        if (this.searchResults.length > 0) {
            this.scrollToMatch();
            this.showNotification(`Trouvé ${this.searchResults.length} occurrence(s)`, 'success');
        } else {
            this.showNotification('Aucune occurrence trouvée', 'warning');
        }
    }

    replaceText() {
        const searchTerm = document.getElementById('searchInput').value;
        const replaceTerm = document.getElementById('replaceInput').value;
        
        if (!searchTerm.trim()) {
            this.showNotification('Veuillez entrer un terme de recherche', 'warning');
            return;
        }

        const activeEditor = this.getActiveEditor();
        if (!activeEditor) return;

        // If there are highlighted matches, replace the current one
        if (this.searchResults.length > 0 && this.currentSearchIndex < this.searchResults.length) {
            const currentMatch = this.searchResults[this.currentSearchIndex];
            currentMatch.element.outerHTML = replaceTerm;
            
            // Update search results
            this.findText();
            
            if (this.searchResults.length > 0) {
                this.scrollToMatch();
            }
        } else {
            // Fallback to simple replacement
            const selection = window.getSelection();
            if (selection.toString().toLowerCase() === searchTerm.toLowerCase()) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(replaceTerm));
                this.findText(); // Update highlights
            }
        }
    }

    replaceAllText() {
        const searchTerm = document.getElementById('searchInput').value;
        const replaceTerm = document.getElementById('replaceInput').value;
        
        if (!searchTerm.trim()) {
            this.showNotification('Veuillez entrer un terme de recherche', 'warning');
            return;
        }

        const activeEditor = this.getActiveEditor();
        if (!activeEditor) return;

        const content = activeEditor.innerHTML;
        const regex = new RegExp(this.escapeRegex(searchTerm), 'gi');
        const matches = content.match(regex);
        
        if (!matches) {
            this.showNotification('Aucune occurrence trouvée', 'warning');
            return;
        }

        const newContent = content.replace(regex, replaceTerm);
        activeEditor.innerHTML = newContent;

        this.showNotification(`Remplacé ${matches.length} occurrence(s)`, 'success');
        this.clearHighlights();
    }

    clearHighlights() {
        const activeEditor = this.getActiveEditor();
        if (activeEditor) {
            const highlights = activeEditor.querySelectorAll('mark.search-highlight');
            highlights.forEach(highlight => {
                highlight.outerHTML = highlight.innerHTML;
            });
        }
        this.searchResults = [];
        this.currentSearchIndex = -1;
    }

    scrollToMatch() {
        if (this.searchResults.length === 0 || this.currentSearchIndex >= this.searchResults.length) return;
        
        const currentMatch = this.searchResults[this.currentSearchIndex];
        currentMatch.element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
        });
        
        // Highlight current match
        this.searchResults.forEach((result, index) => {
            result.element.style.backgroundColor = index === this.currentSearchIndex ? '#f59e0b' : '#fef3c7';
        });
    }

    findNext() {
        if (this.searchResults.length === 0) {
            this.findText();
            return;
        }
        
        this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchResults.length;
        this.scrollToMatch();
    }

    findPrevious() {
        if (this.searchResults.length === 0) {
            this.findText();
            return;
        }
        
        this.currentSearchIndex = this.currentSearchIndex > 0 ? this.currentSearchIndex - 1 : this.searchResults.length - 1;
        this.scrollToMatch();
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // File Operations
    saveAsTxt() {
        const activeEditor = this.getActiveEditor();
        if (!activeEditor) {
            this.showNotification('Aucun éditeur actif', 'error');
            return;
        }

        const text = activeEditor.innerText || activeEditor.textContent;
        if (!text.trim()) {
            this.showNotification('Le document est vide', 'warning');
            return;
        }

        try {
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `document-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showNotification('Document sauvegardé en TXT', 'success');
        } catch (error) {
            this.showNotification('Erreur lors de la sauvegarde: ' + error.message, 'error');
        }
    }

    openTxtFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,text/plain';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                this.showNotification('Fichier trop volumineux (max 10MB)', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const activeEditor = this.getActiveEditor();
                    if (activeEditor) {
                        activeEditor.innerHTML = '';
                        const text = event.target.result;
                        const paragraphs = text.split('\n').filter(p => p.trim());
                        
                        if (paragraphs.length === 0) {
                            activeEditor.innerHTML = '<p>Document chargé (vide)</p>';
                        } else {
                            paragraphs.forEach(paragraph => {
                                const p = document.createElement('p');
                                p.textContent = paragraph;
                                activeEditor.appendChild(p);
                            });
                        }
                        
                        this.updateWordCounter();
                        this.showNotification('Fichier chargé avec succès', 'success');
                    }
                } catch (error) {
                    this.showNotification('Erreur lors du chargement du fichier', 'error');
                }
            };
            reader.onerror = () => {
                this.showNotification('Erreur lors de la lecture du fichier', 'error');
            };
            reader.readAsText(file);
        };
        input.click();
    }

    exportToPDF() {
        const activeEditor = this.getActiveEditor();
        if (!activeEditor) {
            this.showNotification('Aucun éditeur actif', 'error');
            return;
        }

        const content = activeEditor.innerText || activeEditor.textContent;
        if (!content.trim()) {
            this.showNotification('Le document est vide', 'warning');
            return;
        }

        // Use browser's print to PDF functionality
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Document Exporté</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        margin: 2cm;
                        color: #333;
                    }
                    h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                    .metadata { 
                        color: #7f8c8d; 
                        font-size: 14px; 
                        margin-bottom: 20px;
                        border-bottom: 1px solid #bdc3c7;
                        padding-bottom: 10px;
                    }
                    @media print {
                        body { margin: 1.5cm; }
                    }
                    @page {
                        margin: 1.5cm;
                        @bottom-right {
                            content: "Page " counter(page) " sur " counter(pages);
                            font-size: 12px;
                            color: #7f8c8d;
                        }
                    }
                </style>
            </head>
            <body>
                <h1>Document Exporté</h1>
                <div class="metadata">
                    Exporté le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')} |
                    ${this.getWordCount()} mots
                </div>
                <div>${content.replace(/\n/g, '<br>')}</div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
            this.showNotification('Utilisez "Imprimer vers PDF" dans la boîte de dialogue d\'impression', 'info');
        }, 500);
    }

    // UI Features
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        
        this.showNotification(`Thème ${isDark ? 'sombre' : 'clair'} activé`, 'success');
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            const themeIcon = document.querySelector('#themeToggle i');
            themeIcon.className = 'fas fa-sun';
        }
    }

    toggleFullscreen() {
        const appContainer = document.querySelector('.app-container');
        
        if (!this.isFullscreen) {
            if (appContainer.requestFullscreen) {
                appContainer.requestFullscreen();
            } else if (appContainer.webkitRequestFullscreen) {
                appContainer.webkitRequestFullscreen();
            } else if (appContainer.msRequestFullscreen) {
                appContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    updateWordCounter() {
        const activeEditor = this.getActiveEditor();
        if (!activeEditor) return;

        const text = activeEditor.innerText || activeEditor.textContent;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        const charsNoSpaces = text.replace(/\s/g, '').length;

        const wordCounter = document.getElementById('wordCounter');
        if (wordCounter) {
            wordCounter.innerHTML = `
                <span class="word-count">${words} mots</span>
                <span class="char-count">${chars} caractères</span>
            `;
        }
    }

    getWordCount() {
        const activeEditor = this.getActiveEditor();
        if (!activeEditor) return 0;
        
        const text = activeEditor.innerText || activeEditor.textContent;
        return text.trim() ? text.trim().split(/\s+/).length : 0;
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const dateString = now.toLocaleDateString('fr-FR');
        
        const currentTimeElement = document.getElementById('currentTime');
        if (currentTimeElement) {
            currentTimeElement.textContent = `${dateString} ${timeString}`;
        }
    }

    // Auto Save
    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.performAutoSave();
        }, 30000); // Save every 30 seconds
    }

    performAutoSave() {
        const activeEditor = this.getActiveEditor();
        if (activeEditor) {
            const content = activeEditor.innerHTML;
            const pageId = document.querySelector('.page.active').id;
            const autoSaveData = {
                content: content,
                timestamp: new Date().toISOString(),
                pageId: pageId
            };
            localStorage.setItem('textEditorAutoSave', JSON.stringify(autoSaveData));
        }
    }

    loadAutoSave() {
        try {
            const saved = localStorage.getItem('textEditorAutoSave');
            if (saved) {
                const autoSaveData = JSON.parse(saved);
                const savedTime = new Date(autoSaveData.timestamp);
                const now = new Date();
                const diffMinutes = (now - savedTime) / (1000 * 60);
                
                // Only offer to load if saved within last 2 hours
                if (diffMinutes < 120) {
                    if (confirm(`Une sauvegarde automatique du ${savedTime.toLocaleString('fr-FR')} a été trouvée. Voulez-vous la charger ?`)) {
                        const activeEditor = this.getActiveEditor();
                        if (activeEditor) {
                            activeEditor.innerHTML = autoSaveData.content;
                            this.updateWordCounter();
                            this.showNotification('Sauvegarde automatique chargée', 'success');
                        }
                    }
                } else {
                    // Clear old auto-save
                    localStorage.removeItem('textEditorAutoSave');
                }
            }
        } catch (error) {
            console.warn('Erreur lors du chargement de la sauvegarde automatique:', error);
        }
    }

    clearAutoSave() {
        localStorage.removeItem('textEditorAutoSave');
        this.showNotification('Sauvegarde automatique effacée', 'success');
    }

    // Keyboard Shortcuts
    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'b':
                    e.preventDefault();
                    this.execCommand('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    this.execCommand('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    this.execCommand('underline');
                    break;
                case 'z':
                    e.preventDefault();
                    this.execCommand('undo');
                    break;
                case 'y':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.execCommand('redo');
                    }
                    break;
                case 'f':
                    e.preventDefault();
                    this.openSearchDialog();
                    break;
                case 's':
                    e.preventDefault();
                    this.saveAsTxt();
                    break;
                case 'n':
                    e.preventDefault();
                    this.addNewPage();
                    break;
                case 't':
                    e.preventDefault();
                    this.toggleTheme();
                    break;
            }
        }

        // Search navigation
        if (e.key === 'F3' || (e.ctrlKey && e.key === 'g')) {
            e.preventDefault();
            this.findNext();
        }

        if (e.shiftKey && e.key === 'F3') {
            e.preventDefault();
            this.findPrevious();
        }

        // Escape key
        if (e.key === 'Escape') {
            this.closeSearchModal();
        }
    }

    // Utility Functions
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notif => notif.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to document
        document.body.appendChild(notification);

        // Add close button event
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds for success/info, 8 seconds for warnings/errors
        const duration = type === 'success' || type === 'info' ? 5000 : 8000;
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    // Cleanup
    destroy() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        this.performAutoSave();
    }
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--surface-color);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        border-left: 4px solid #3b82f6;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        z-index: 1002;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
        min-width: 300px;
    }
    
    .notification-success {
        border-left-color: #10b981;
    }
    
    .notification-error {
        border-left-color: #ef4444;
    }
    
    .notification-warning {
        border-left-color: #f59e0b;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 2px;
        opacity: 0.7;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .search-highlight {
        background-color: #fef3c7 !important;
        color: #92400e !important;
        padding: 0.125rem 0.25rem;
        border-radius: 2px;
        transition: background-color 0.2s;
    }

    .dark-theme .search-highlight {
        background-color: #f59e0b !important;
        color: #ffffff !important;
    }
`;
document.head.appendChild(notificationStyles);

// Initialize the editor when DOM is loaded
let textEditor;
document.addEventListener('DOMContentLoaded', () => {
    textEditor = new TextEditor();
});

// Handle fullscreen changes
document.addEventListener('fullscreenchange', () => {
    const fullscreenBtn = document.getElementById('fullscreenToggle');
    const icon = fullscreenBtn.querySelector('i');
    
    textEditor.isFullscreen = !!document.fullscreenElement;
    
    if (textEditor.isFullscreen) {
        icon.className = 'fas fa-compress';
    } else {
        icon.className = 'fas fa-expand';
    }
});

// Handle page unload
window.addEventListener('beforeunload', (e) => {
    if (textEditor) {
        textEditor.performAutoSave();
    }
});

// Export for global access (optional)
window.TextEditor = TextEditor;