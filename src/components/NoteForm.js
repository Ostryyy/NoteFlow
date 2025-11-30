import React, { useState, useEffect } from 'react';

const NoteForm = ({ onSave, editingNote, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setTags(editingNote.tags.join(', '));
      setAttachment(editingNote.attachment || null);
    }
  }, [editingNote]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    onSave({
      id: editingNote ? editingNote.id : undefined,
      title,
      content,
      tags: tagsArray,
      isFavorite: editingNote ? editingNote.isFavorite : false,
      attachment: attachment
    });

    setTitle('');
    setContent('');
    setTags('');
    setAttachment(null);
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
      
      <div style={{margin: '10px 0'}}>
        <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9em'}}>Załącznik (np. zdjęcie):</label>
        <input type="file" onChange={handleFileChange} accept="image/*,application/pdf" />
        
        {attachment && (
          <div style={{marginTop: '10px', padding: '5px', background: '#e9ecef', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <span style={{fontSize: '0.8em', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                📎 {attachment.name ? attachment.name : 'Załączony plik'}
            </span>
            <button type="button" onClick={removeAttachment} className="btn btn-danger" style={{padding: '2px 5px', fontSize: '0.7em'}}>Usuń</button>
          </div>
        )}
      </div>

      <div style={{display: 'flex', gap: '10px'}}>
        <button type="submit" className="btn btn-primary">Zapisz</button>
        {editingNote && <button type="button" onClick={onCancel} className="btn">Anuluj</button>}
      </div>
    </form>
  );
};

export default NoteForm;