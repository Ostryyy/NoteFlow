import React, { useEffect, useState } from 'react';
import { dbActions } from './db';
import NoteForm from './components/NoteForm';
import { FaStar, FaRegStar, FaTrash, FaEdit } from 'react-icons/fa';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const data = await dbActions.getAllNotes();
    data.sort((a, b) => {
        if (a.isFavorite === b.isFavorite) {
            return new Date(b.modifiedAt) - new Date(a.modifiedAt);
        }
        return a.isFavorite ? -1 : 1;
    });
    setNotes(data);
  };

  const handleSave = async (note) => {
    if (note.id) {
      await dbActions.updateNote(note);
    } else {
      await dbActions.addNote(note);
    }
    setEditingNote(null);
    loadNotes();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę notatkę?")) {
      await dbActions.deleteNote(id);
      loadNotes();
    }
  };

  const handleToggleFavorite = async (note) => {
    await dbActions.toggleFavorite(note.id, note.isFavorite);
    loadNotes();
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="app-container">
      <div className="header">
        <h1>NoteFlow 📝</h1>
      </div>

      <input 
        type="text" 
        className="search-bar" 
        placeholder="Szukaj po tytule lub tagach..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <NoteForm 
        onSave={handleSave} 
        editingNote={editingNote} 
        onCancel={() => setEditingNote(null)} 
      />

      <div className="note-grid">
        {filteredNotes.map(note => (
          <div key={note.id} className={`note-card ${note.isFavorite ? 'favorite' : ''}`}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h3>{note.title}</h3>
                <button onClick={() => handleToggleFavorite(note)} className="btn btn-fav">
                    {note.isFavorite ? <FaStar color="gold"/> : <FaRegStar />}
                </button>
            </div>
            <p style={{whiteSpace: 'pre-wrap'}}>{note.content}</p>
            
            <div className="note-tags">
              {note.tags.map((tag, index) => (
                <span key={index}>#{tag}</span>
              ))}
            </div>
            
            <small style={{display:'block', marginTop: '10px', color: '#888'}}>
                {new Date(note.modifiedAt).toLocaleDateString()} {new Date(note.modifiedAt).toLocaleTimeString()}
            </small>

            <div className="actions">
              <button onClick={() => setEditingNote(note)} className="btn"><FaEdit /> Edytuj</button>
              <button onClick={() => handleDelete(note.id)} className="btn btn-danger"><FaTrash /></button>
            </div>
          </div>
        ))}
        {filteredNotes.length === 0 && <p style={{textAlign: 'center', width: '100%'}}>Brak notatek.</p>}
      </div>
    </div>
  );
}

export default App;