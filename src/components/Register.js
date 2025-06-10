import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [statusCode, setStatusCode] = useState(null);
  const navigate = useNavigate();

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
        'https://demo2.z-bit.ee/users',
        {
          username: formData.username,
          firstname: formData.firstname,
          lastname: formData.lastname,
          newPassword: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          validateStatus: () => true // Для обработки всех статусов как успешных
        }
      );

      setStatusCode(response.status);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      if (response.status === 201) {
        setSuccess(true);
      } else {
        handleApiError(response);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Network error');
    }
  };

  const handleApiError = (response) => {
    let errorMessage = 'Registration failed';
    
    switch (response.status) {
      case 400:
        errorMessage = response.data?.message || 'Invalid request data';
        break;
      case 401:
        errorMessage = response.data?.message || 'Invalid credentials';
        break;
      case 404:
        errorMessage = response.data?.message || 'Resource not found';
        break;
      default:
        errorMessage = `Server error: ${response.status}`;
    }
    
    setError(`${errorMessage} (Status: ${response.status})`);
  };
  

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>User Registration</h2>
      
      {statusCode && (
        <p style={{ color: '#31708f', backgroundColor: '#d9edf7', padding: '10px' }}>
          API Status: {statusCode}
        </p>
      )}
      
      {error && (
        <p style={{ color: '#a94442', backgroundColor: '#f2dede', padding: '10px' }}>
          {error}
        </p>
      )}
      
      {success ? (
        <div style={{ color: '#3c763d', backgroundColor: '#dff0d8', padding: '15px' }}>
          <p>Registration successful!</p>
          <button 
            onClick={() => navigate('/login')}
            style={{
              padding: '8px 15px',
              background: '#5cb85c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Proceed to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>First Name:</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Last Name:</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
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
              minLength="6"
              style={{ width: '100%', padding: '8px' }}
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
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
