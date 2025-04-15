import { useState, useEffect } from 'react';
import './App.css';

const storageService = {
  save: (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
  },
  load: () => {
    const data = localStorage.getItem('todos');
    return data ? JSON.parse(data) : [];
  }
};

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    const loaded = storageService.load();
    setTodos(loaded);
  }, []);

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), title: input.trim(), done: false }]);
      setInput('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const toggleDone = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
  };

  const saveEdit = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, title: editingText } : t));
    setEditingId(null);
    setEditingText('');
  };

  const filtered = todos.filter(todo => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'completed' && todo.done) ||
      (activeTab === 'not-completed' && !todo.done);

    const matchesSearch = todo.title.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="container">
      <h1>Todo App</h1>

      <div className="input-group">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New task"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <div className="tabs">
        {['all', 'completed', 'not-completed'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all' ? 'All' : tab === 'completed' ? 'Completed' : 'Not Completed'}
          </button>
        ))}
      </div>

      <input
        className="search"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="todo-list">
        {filtered.map(todo => (
          <li key={todo.id} className={todo.done ? 'done' : ''}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleDone(todo.id)}
            />
            {editingId === todo.id ? (
              <>
                <input
                  className="edit-input"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => saveEdit(todo.id)}>💾</button>
              </>
            ) : (
              <>
                <span onDoubleClick={() => startEdit(todo)}>{todo.title}</span>
                <button onClick={() => deleteTodo(todo.id)}>🗑</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <button className="save-btn" onClick={() => storageService.save(todos)}>
        Save to LocalStorage
      </button>
    </div>
  );
}

export default App;
