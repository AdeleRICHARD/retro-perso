let notes = [];
let noteId = 0;
let selectedNote = null;

const board = document.getElementById('board');
const addNoteBtn = document.getElementById('addNoteBtn');

// Charger les notes depuis le localStorage lors du chargement de la page
window.onload = () => {
    const savedNotes = JSON.parse(localStorage.getItem('notes'));
    if (savedNotes) {
        notes = savedNotes;
        notes.forEach(note => {
            createNoteElement(note);
            if (note.id >= noteId) {
                noteId = note.id + 1;
            }
        });
    }
};

// Fonction pour ajouter un nouveau post-it
addNoteBtn.addEventListener('click', () => {
    const note = {
        id: noteId++,
        content: '',
        top: 100,
        left: 100,
        color: '#fff475' // Couleur par défaut
    };
    notes.push(note);
    createNoteElement(note);
    saveNotes();
});

// Fonction pour créer l'élément DOM d'une note
function createNoteElement(note) {
    const noteElem = document.createElement('div');
    noteElem.classList.add('note');
    noteElem.style.top = note.top + 'px';
    noteElem.style.left = note.left + 'px';
    noteElem.setAttribute('data-id', note.id);

    // Appliquer la couleur du post-it
    noteElem.style.backgroundColor = note.color || '#fff475';

    // Créer le bouton de suppression
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêche le clic de se propager au post-it
        board.removeChild(noteElem);
        notes = notes.filter(n => n.id !== note.id);
        saveNotes();
    });

    // Créer la zone de texte
    const textarea = document.createElement('textarea');
    textarea.value = note.content;

    textarea.addEventListener('input', () => {
        note.content = textarea.value;
        saveNotes();
    });

    noteElem.appendChild(deleteBtn);
    noteElem.appendChild(textarea);
    board.appendChild(noteElem);

    // Gestion de la sélection du post-it
    noteElem.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêche le clic de se propager au parent
        selectNote(noteElem, note);
    });

    // Gérer le déplacement de la note
    noteElem.addEventListener('mousedown', (e) => {
        const shiftX = e.clientX - noteElem.getBoundingClientRect().left;
        const shiftY = e.clientY - noteElem.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            note.left = pageX - shiftX;
            note.top = pageY - shiftY;
            noteElem.style.left = note.left + 'px';
            noteElem.style.top = note.top + 'px';
        }

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMouseMove);
            saveNotes();
        }, { once: true });
    });

    noteElem.ondragstart = () => {
        return false;
    };
}

// Fonction pour sauvegarder les notes dans le localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Fonction pour sélectionner un post-it
function selectNote(noteElem, note) {
    // Désélectionner le post-it précédent
    if (selectedNote && selectedNote.elem !== noteElem) {
        selectedNote.elem.classList.remove('selected');
    }

    // Sélectionner le nouveau post-it
    noteElem.classList.add('selected');
    selectedNote = { elem: noteElem, data: note };
}

// Désélectionner le post-it si on clique en dehors
document.addEventListener('click', () => {
    if (selectedNote) {
        selectedNote.elem.classList.remove('selected');
        selectedNote = null;
    }
});

// Gérer le clic sur les boutons de couleur
const colorPickers = document.querySelectorAll('.color-picker');
colorPickers.forEach(picker => {
    picker.addEventListener('click', () => {
        if (selectedNote) {
            const color = picker.getAttribute('data-color');
            selectedNote.elem.style.backgroundColor = color;
            selectedNote.data.color = color;
            saveNotes();
        }
    });
});
