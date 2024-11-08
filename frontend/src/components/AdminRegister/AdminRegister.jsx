import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { URL } from '../../utils/constants/constants';
import './AdminRegister.css'; // Import the CSS file


const AdminRegister = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${URL}/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
  
      const data = await response.json();
  
      // Save the token to localStorage
      localStorage.setItem('adminToken', data.token);
  
      setMessage(data.message);
      setError('');
  
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setMessage('');
      setError(err.message);
    }
  };
  
  return (
    <div className="admin-container">
      <div className="admin-form">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Login: </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password: </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default AdminRegister;
