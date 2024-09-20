let notes = [];
let noteId = 0;
const board = document.getElementById("board");
const addNoteBtn = document.getElementById("addNoteBtn");
// Charger les notes depuis le localStorage lors du chargement de la page
window.onload = ()=>{
    const savedNotes = JSON.parse(localStorage.getItem("notes"));
    if (savedNotes) {
        notes = savedNotes;
        notes.forEach((note)=>{
            createNoteElement(note);
            if (note.id >= noteId) noteId = note.id + 1;
        });
    }
};
// Fonction pour ajouter un nouveau post-it
addNoteBtn.addEventListener("click", ()=>{
    const note = {
        id: noteId++,
        content: "",
        top: 100,
        left: 100
    };
    notes.push(note);
    createNoteElement(note);
    saveNotes();
});
// Fonction pour créer l'élément DOM d'une note
function createNoteElement(note) {
    // Créer l'élément du post-it
    const noteElem = document.createElement("div");
    noteElem.classList.add("note");
    noteElem.style.top = note.top + "px";
    noteElem.style.left = note.left + "px";
    noteElem.setAttribute("data-id", note.id);
    // Appliquer la couleur du post-it
    noteElem.style.backgroundColor = note.color || "#fff475";
    // Créer le bouton de suppression
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "\xd7";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", (e)=>{
        e.stopPropagation(); // Empêche le clic de se propager au post-it
        board.removeChild(noteElem);
        notes = notes.filter((n)=>n.id !== note.id);
        saveNotes();
    });
    // Créer la zone de texte
    const textarea = document.createElement("textarea");
    textarea.value = note.content;
    textarea.addEventListener("input", ()=>{
        note.content = textarea.value;
        saveNotes();
    });
    noteElem.appendChild(deleteBtn);
    noteElem.appendChild(textarea);
    board.appendChild(noteElem);
    // Gérer le déplacement de la note
    noteElem.addEventListener("mousedown", (e)=>{
        const shiftX = e.clientX - noteElem.getBoundingClientRect().left;
        const shiftY = e.clientY - noteElem.getBoundingClientRect().top;
        function moveAt(pageX, pageY) {
            note.left = pageX - shiftX;
            note.top = pageY - shiftY;
            noteElem.style.left = note.left + "px";
            noteElem.style.top = note.top + "px";
        }
        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", ()=>{
            document.removeEventListener("mousemove", onMouseMove);
            saveNotes();
        }, {
            once: true
        });
    });
    noteElem.ondragstart = ()=>{
        return false;
    };
}
// Fonction pour sauvegarder les notes dans le localStorage
function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

//# sourceMappingURL=index.f68744d1.js.map
