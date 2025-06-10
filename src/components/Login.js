import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Изменено с useHistory на useNavigate

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [statusCode, setStatusCode] = useState(null);
  
  const navigate = useNavigate(); // Используем useNavigate вместо useHistory

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatusCode(null);

    try {
      const response = await axios.post(
        'https://demo2.z-bit.ee/users/get-token',
        {
          username: formData.username,
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          validateStatus: () => true
        }
      );

      setStatusCode(response.status);

      if (response.status === 200) {
        if (response.data.access_token) {
          if (onLogin) onLogin(response.data.access_token);
          
          // Выводим приветствие в консоль
          console.log(`Welcome back, ${response.data.firstname} ${response.data.lastname}!`);
          
          // Перенаправляем на другую страницу с помощью navigate
          navigate('/'); // Изменено с history.push на navigate
        } else {
          setError('Access token not found in response');
        }
      } else {
        handleApiError(response);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Network error');
      if (err.response) {
        setStatusCode(err.response.status);
      }
    }
  };

  const handleApiError = (response) => {
    let errorMessage = 'Login failed';
    
    if (response.data && response.data.message) {
      errorMessage = response.data.message;
    } else if (response.status === 400) {
      errorMessage = 'Invalid username or password';
    } else if (response.status === 401) {
      errorMessage = 'Unauthorized access';
    } else if (response.status === 404) {
      errorMessage = 'Resource not found';
    } else if (response.status === 500) {
      errorMessage = 'Internal server error - please try again later';
    }
    
    setError(`${errorMessage} (Status: ${response.status})`);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
      <h2>Login</h2>
      
      {statusCode && (
        <p style={{ 
          color: statusCode === 200 ? '#3c763d' : 
                 statusCode >= 400 && statusCode < 500 ? '#a94442' : '#31708f',
          backgroundColor: statusCode === 200 ? '#dff0d8' : 
                          statusCode >= 400 && statusCode < 500 ? '#f2dede' : '#d9edf7',
          padding: '10px',
          borderRadius: '4px'
        }}>
          API Status: {statusCode}
        </p>
      )}
      
      {error && (
        <p style={{ 
          color: '#a94442', 
          backgroundColor: '#f2dede', 
          padding: '10px',
          borderRadius: '4px'
        }}>
          {error}
        </p>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            type="email"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        
        <button 
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#337ab7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;