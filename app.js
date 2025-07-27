// Simple To‑Do/Notes app built with plain React (no JSX) using CDN

// Wrap in an IIFE to avoid polluting the global scope
(function () {
  const { useState } = React;

  /**
   * TodoItem component renders a single note entry with controls.
   * Using a component makes the main App function cleaner and easier to follow.
   */
  function TodoItem({ item, onToggle, onEdit, onDelete }) {
    return React.createElement(
      'li',
      { key: item.id },
      React.createElement('input', {
        type: 'checkbox',
        checked: item.completed,
        onChange: () => onToggle(item.id)
      }),
      React.createElement('span', {
        style: { textDecoration: item.completed ? 'line-through' : 'none' }
      }, item.text),
      React.createElement('button', {
        className: 'edit',
        onClick: () => onEdit(item.id)
      }, 'Edit'),
      React.createElement('button', {
        onClick: () => onDelete(item.id)
      }, 'Delete')
    );
  }

  function App() {
    const [items, setItems] = useState([
      { id: Date.now(), text: 'Sample note', completed: false }
    ]);
    const [filter, setFilter] = useState('all');
    const [inputValue, setInputValue] = useState('');
    const [editingId, setEditingId] = useState(null);

    // Add a new note or update existing note
    const handleAddOrUpdate = () => {
      const text = inputValue.trim();
      if (!text) return;
      if (editingId !== null) {
        // Update existing item
        setItems(items.map(item => item.id === editingId ? { ...item, text } : item));
        setEditingId(null);
      } else {
        // Add new item
        const newItem = { id: Date.now(), text, completed: false };
        setItems([...items, newItem]);
      }
      setInputValue('');
    };

    // Delete item
    const handleDelete = id => {
      setItems(items.filter(item => item.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setInputValue('');
      }
    };

    // Toggle completion status
    const handleToggleCompleted = id => {
      setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    };

    // Begin editing an item
    const handleEditStart = id => {
      const target = items.find(item => item.id === id);
      if (target) {
        setEditingId(id);
        setInputValue(target.text);
      }
    };

    const handleFilterChange = (value) => {
      setFilter(value);
    };

    const filteredItems = items.filter(item => {
      if (filter === 'active') return !item.completed;
      if (filter === 'completed') return item.completed;
      return true;
    });

    return React.createElement(
      'div',
      { className: 'app' },
      React.createElement('h1', null, 'To‑Do / Notes App'),
      // Controls for adding/updating
      React.createElement(
        'div',
        { className: 'controls' },
        React.createElement('input', {
          type: 'text',
          value: inputValue,
          placeholder: editingId !== null ? 'Edit note' : 'Enter note…',
          onChange: (e) => setInputValue(e.target.value)
        }),
        React.createElement(
          'button',
          { onClick: handleAddOrUpdate },
          editingId !== null ? 'Update' : 'Add'
        )
      ),
      // Filter buttons
      React.createElement(
        'div',
        { className: 'filter' },
        ['all', 'active', 'completed'].map(value =>
          React.createElement(
            'button',
            {
              key: value,
              className: filter === value ? 'active' : '',
              onClick: () => handleFilterChange(value)
            },
            value.charAt(0).toUpperCase() + value.slice(1)
          )
        )
      ),
      // List of notes using TodoItem component
      React.createElement(
        'ul',
        null,
        filteredItems.map(item =>
          React.createElement(TodoItem, {
            key: item.id,
            item,
            onToggle: handleToggleCompleted,
            onEdit: handleEditStart,
            onDelete: handleDelete
          })
        )
      )
    );
  }

  // Render the app
  ReactDOM.render(
    React.createElement(App),
    document.getElementById('root')
  );
})();