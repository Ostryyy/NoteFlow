import React, { useState, useEffect } from 'react';

const NoteForm = ({ onSave, editingNote, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setTags(editingNote.tags.join(', '));
    }
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    onSave({
      id: editingNote ? editingNote.id : undefined,
      title,
      content,
      tags: tagsArray,
      isFavorite: editingNote ? editingNote.isFavorite : false
    });

    setTitle('');
    setContent('');
    setTags('');
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h3>{editingNote ? 'Edytuj notatkę' : 'Nowa notatka'}</h3>
      <input 
        type="text" 
        placeholder="Tytuł" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        required 
      />
      <textarea 
        placeholder="Treść notatki..." 
        rows="4" 
        value={content} 
        onChange={e => setContent(e.target.value)} 
        required 
      />
      <input 
        type="text" 
        placeholder="Tagi (oddzielone przecinkami)" 
        value={tags} 
        onChange={e => setTags(e.target.value)} 
      />
      <div style={{display: 'flex', gap: '10px'}}>
        <button type="submit" className="btn btn-primary">Zapisz</button>
        {editingNote && <button type="button" onClick={onCancel} className="btn">Anuluj</button>}
      </div>
    </form>
  );
};

export default NoteForm;