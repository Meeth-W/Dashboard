import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const fetchNotes = () => {
    fetch("http://127.0.0.1:8000/api/v1/notes/fetch?username=Ghostyy&password=Secure123")
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          const notesArray = Object.entries(data.notes).map(([title, content]) => ({ title, content }));
          setNotes(notesArray);
        }
      });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setContent(note.content);
    setTitle(note.title);
    setIsEditing(false);
  };

  const handleSave = () => {
    fetch(`http://127.0.0.1:8000/api/v1/notes/add?username=Ghostyy&password=Secure123&title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`)
      .then(() => {
        fetchNotes();
        setIsEditing(false);
      });
  };

  const handleDelete = () => {
    fetch(`http://127.0.0.1:8000/api/v1/notes/delete?username=Ghostyy&password=Secure123&title=${encodeURIComponent(title)}`)
      .then(() => {
        fetchNotes();
        setSelectedNote(null);
        setContent("");
        setTitle("");
      });
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-slate-800 p-4 overflow-y-auto">
        <button
          className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded-md mb-4"
          onClick={() => {
            setSelectedNote(null);
            setIsEditing(true);
            setTitle("");
            setContent("");
          }}
        >
          Create New
        </button>
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.title}
              className={`p-2 cursor-pointer rounded-md transition duration-200 ${selectedNote?.title === note.title ? "bg-blue-700" : "bg-slate-700 hover:bg-slate-600"}`}
              onClick={() => handleSelectNote(note)}
            >
              {note.title}
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="w-3/4 p-6">
        {selectedNote || isEditing ? (
          <div>
            {isEditing ? (
              <input
                className="w-full p-2 mb-2 bg-slate-700 border border-gray-500 rounded-md text-white"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title"
              />
            ) : (
              <h1 className="text-2xl font-bold">{title}</h1>
            )}
            {isEditing ? (
              <textarea
                className="w-full h-64 p-2 bg-slate-700 border border-gray-500 rounded-md text-white"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            ) : (
              <ReactMarkdown className="prose prose-invert max-w-none">{content}</ReactMarkdown>
            )}
            <div className="mt-4 space-x-2">
              <button className="p-2 bg-green-600 hover:bg-green-700 rounded-md" onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
                {isEditing ? "Save" : "Edit"}
              </button>
              <button className="p-2 bg-red-600 hover:bg-red-700 rounded-md" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Select a note to view or create a new one.</p>
        )}
      </div>
    </div>
  );
}

export default Notes;