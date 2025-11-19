
import React, { useState, useEffect } from 'react';
import { BookOpenIcon, PlusIcon, XIcon, CheckCircle, CalendarIcon } from '../components/icons.tsx';
import Textarea from '../components/Textarea.tsx';
import Input from '../components/Input.tsx';

interface Note {
    id: string;
    title: string;
    content: string;
    date: string;
    tags: string[];
}

const Observacoes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });

  // Carregar notas do LocalStorage ao iniciar
  useEffect(() => {
    const savedNotes = localStorage.getItem('lexmoura_notes');
    if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Salvar notas no LocalStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem('lexmoura_notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const note: Note = {
        id: Date.now().toString(),
        title: newNote.title,
        content: newNote.content,
        date: new Date().toLocaleDateString('pt-BR'),
        tags: newNote.tags.split(',').map(t => t.trim()).filter(t => t)
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: '', content: '', tags: '' });
    setIsAdding(false);
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta anotação?')) {
        setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BookOpenIcon className="w-8 h-8 text-amber-600" />
                Caderno de Observações
            </h1>
            <p className="text-slate-500 mt-1">Anotações locais, lembretes e rascunhos rápidos.</p>
        </div>
        <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
            {isAdding ? <XIcon className="w-5 h-5"/> : <PlusIcon className="w-5 h-5"/>}
            {isAdding ? 'Cancelar' : 'Nova Nota'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddNote} className="bg-white p-6 rounded-lg shadow-md border border-amber-200 mb-8 animate-fade-in">
            <h3 className="font-bold text-gray-800 mb-4">Criar Nova Anotação</h3>
            <div className="space-y-4">
                <Input 
                    id="noteTitle" 
                    label="Título" 
                    value={newNote.title} 
                    onChange={e => setNewNote({...newNote, title: e.target.value})} 
                    placeholder="Ex: Pendências do processo X"
                    required
                />
                <Textarea 
                    id="noteContent" 
                    label="Conteúdo" 
                    value={newNote.content} 
                    onChange={e => setNewNote({...newNote, content: e.target.value})} 
                    placeholder="Escreva seus detalhes aqui..."
                    required
                />
                <Input 
                    id="noteTags" 
                    label="Tags (separadas por vírgula)" 
                    value={newNote.tags} 
                    onChange={e => setNewNote({...newNote, tags: e.target.value})} 
                    placeholder="Ex: urgente, inss, reunião"
                />
                <div className="flex justify-end">
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-bold shadow flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Salvar Nota
                    </button>
                </div>
            </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 && !isAdding && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <BookOpenIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhuma anotação encontrada.</p>
                <button onClick={() => setIsAdding(true)} className="text-amber-600 font-semibold hover:underline mt-2">Criar a primeira nota</button>
            </div>
        )}
        
        {notes.map(note => (
            <div key={note.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full relative group">
                <button 
                    onClick={() => handleDeleteNote(note.id)}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Excluir nota"
                >
                    <XIcon className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <CalendarIcon className="w-3 h-3" />
                    {note.date}
                </div>
                
                <h3 className="font-bold text-gray-800 text-lg mb-2">{note.title}</h3>
                <p className="text-gray-600 text-sm whitespace-pre-wrap flex-grow mb-4">{note.content}</p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                    {note.tags.map((tag, i) => (
                        <span key={i} className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Observacoes;
