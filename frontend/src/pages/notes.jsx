// TEMPORARY IMPLEMENTATION 
// Until i actually figure out the backend and make this actually work bro :sob:

import React, { useState } from 'react';

const Notes = () => {
    const [notes, setNotes] = useState([
        { id: 1, title: 'Note 1', content: 'This is the first note.' },
        { id: 2, title: 'Note 2', content: 'This is the second note.' },
        { id: 3, title: 'Note 3', content: 'This is the third note.' },
    ]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [editorContent, setEditorContent] = useState('');

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        setEditorContent(note.content);
    };

    const handleCreateNew = () => {
        setSelectedNote(null);
        setEditorContent('');
    };

    const handleSave = () => {
        if (selectedNote) {
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === selectedNote.id ? { ...note, content: editorContent } : note
                )
            );
        } else {
            const newNote = {
                id: notes.length + 1,
                title: `Note ${notes.length + 1}`,
                content: editorContent,
            };
            setNotes((prevNotes) => [...prevNotes, newNote]);
        }
        setEditorContent('');
        setSelectedNote(null);
    };

    const handleDelete = () => {
        if (selectedNote) {
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== selectedNote.id));
            setEditorContent('');
            setSelectedNote(null);
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen flex">
            {/* Sidebar */}
            <div className="bg-slate-800 w-1/4 p-4 overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-4">Notes</h2>
                <button
                    onClick={handleCreateNew}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 hover:bg-blue-500 transition"
                >
                    Create New
                </button>
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className={`bg-gray-700 p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-600 ${
                            selectedNote && selectedNote.id === note.id ? 'bg-blue-500' : ''
                        }`}
                        onClick={() => handleNoteClick(note)}
                    >
                        <h3 className="text-white">{note.title}</h3>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-slate-800 w-3/4 p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">
                        {selectedNote ? selectedNote.title : 'New note...'}
                    </h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition"
                        >
                            {selectedNote ? 'Update' : 'Save'}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500 transition"
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <div className="flex-grow mb-4">
                    <textarea
                        className="bg-gray-700 text-white p-2 rounded-lg w-full h-full"
                        value={editorContent}
                        onChange={(e) => setEditorContent(e.target.value)}
                        placeholder="Write your note here..."
                    />
                </div>
            </div>
        </div>
    );
};

export default Notes;