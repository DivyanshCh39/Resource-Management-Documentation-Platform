import React, { useState, useEffect } from 'react';
import './App.css';

// Simple Authentication Component
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username);
    }
  };

  return (
    <div className="login-container">
      <h2>Resource Management Platform</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

// Dashboard Component
function Dashboard({ user, onLogout }) {
  const [files, setFiles] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState('');
  const [activeTab, setActiveTab] = useState('files');

  useEffect(() => {
    // Load files from localStorage
    const savedFiles = JSON.parse(localStorage.getItem('files') || '[]');
    setFiles(savedFiles);

    // Load tickets from localStorage
    const savedTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    setTickets(savedTickets);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newFile = {
        id: Date.now(),
        name: file.name,
        size: file.size,
        uploadedBy: user,
        uploadedAt: new Date().toISOString(),
        type: file.type
      };
      const updatedFiles = [...files, newFile];
      setFiles(updatedFiles);
      localStorage.setItem('files', JSON.stringify(updatedFiles));
    }
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (newTicket) {
      const ticket = {
        id: Date.now(),
        description: newTicket,
        status: 'Open',
        createdBy: user,
        createdAt: new Date().toISOString(),
        priority: 'Medium'
      };
      const updatedTickets = [...tickets, ticket];
      setTickets(updatedTickets);
      localStorage.setItem('tickets', JSON.stringify(updatedTickets));
      setNewTicket('');
    }
  };

  const resolveTicket = (ticketId) => {
    const updatedTickets = tickets.map(t =>
      t.id === ticketId ? { ...t, status: 'Resolved' } : t
    );
    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
  };

  const deleteFile = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    localStorage.setItem('files', JSON.stringify(updatedFiles));
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Resource Management Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'files' ? 'active' : ''}
          onClick={() => setActiveTab('files')}
        >
          Files ({files.length})
        </button>
        <button
          className={activeTab === 'tickets' ? 'active' : ''}
          onClick={() => setActiveTab('tickets')}
        >
          Support Tickets ({tickets.filter(t => t.status === 'Open').length})
        </button>
        <button
          className={activeTab === 'docs' ? 'active' : ''}
          onClick={() => setActiveTab('docs')}
        >
          Documentation
        </button>
      </nav>

      {activeTab === 'files' && (
        <div className="content">
          <h2>File Management</h2>
          <div className="upload-section">
            <input
              type="file"
              onChange={handleFileUpload}
              id="file-upload"
            />
            <label htmlFor="file-upload">Upload File</label>
          </div>

          <table className="file-table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Size</th>
                <th>Uploaded By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map(file => (
                <tr key={file.id}>
                  <td>{file.name}</td>
                  <td>{(file.size / 1024).toFixed(2)} KB</td>
                  <td>{file.uploadedBy}</td>
                  <td>{new Date(file.uploadedAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => deleteFile(file.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="content">
          <h2>Support Tickets</h2>
          <form onSubmit={handleTicketSubmit} className="ticket-form">
            <textarea
              placeholder="Describe your issue or request..."
              value={newTicket}
              onChange={(e) => setNewTicket(e.target.value)}
              required
            />
            <button type="submit">Submit Ticket</button>
          </form>

          <div className="tickets-list">
            {tickets.map(ticket => (
              <div key={ticket.id} className={`ticket ${ticket.status.toLowerCase()}`}>
                <h3>Ticket #{ticket.id}</h3>
                <p>{ticket.description}</p>
                <div className="ticket-meta">
                  <span>Priority: {ticket.priority}</span>
                  <span>Status: {ticket.status}</span>
                  <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                {ticket.status === 'Open' && (
                  <button onClick={() => resolveTicket(ticket.id)}>Resolve</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="content">
          <h2>Documentation Library</h2>
          <div className="doc-links">
            <div className="doc-card">
              <h3>📖 User Guide</h3>
              <p>Complete guide for using the platform</p>
              <a href="/docs/USER_GUIDE.md">View Guide</a>
            </div>
            <div className="doc-card">
              <h3>📋 Standard Operating Procedures</h3>
              <p>SOPs for all platform processes</p>
              <a href="/sops/">View SOPs</a>
            </div>
            <div className="doc-card">
              <h3>🧪 Testing Documentation</h3>
              <p>Test plans, cases, and results</p>
              <a href="/docs/TESTING_DOCUMENTATION.md">View Tests</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main App Component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    localStorage.removeItem('currentUser');
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
