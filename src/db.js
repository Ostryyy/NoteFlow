import { openDB } from 'idb';

const DB_NAME = 'NoteFlowDB';
const STORE_NAME = 'notes';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('title', 'title');
        store.createIndex('tags', 'tags', { multiEntry: true });
        store.createIndex('isFavorite', 'isFavorite');
      }
    },
  });
};

export const dbActions = {
  async getAllNotes() {
    const db = await initDB();
    return db.getAll(STORE_NAME);
  },
  async addNote(note) {
    const db = await initDB();
    return db.add(STORE_NAME, {
      ...note,
      createdAt: new Date(),
      modifiedAt: new Date(),
      isFavorite: false
    });
  },
  async updateNote(note) {
    const db = await initDB();
    const updatedNote = { ...note, modifiedAt: new Date() };
    return db.put(STORE_NAME, updatedNote);
  },
  async deleteNote(id) {
    const db = await initDB();
    return db.delete(STORE_NAME, id);
  },
  async toggleFavorite(id, currentState) {
      const db = await initDB();
      const note = await db.get(STORE_NAME, id);
      note.isFavorite = !currentState;
      return db.put(STORE_NAME, note);
  }
};