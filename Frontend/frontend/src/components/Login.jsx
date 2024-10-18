import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://dbms-hbt.onrender.com/login', { username, password });
      console.log(response.data);

      if (response.status === 200) {
        console.log('Login successful');
        // Save token to localStorage
        localStorage.setItem('accessToken', response.data.token);
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Show error message
      setShowError(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="username">Username:</label>
            <input
              className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500 transition duration-200 ease-in-out"
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="password">Password:</label>
            <input
              className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500 transition duration-200 ease-in-out"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {showError && (
            <p className="text-red-500 text-sm mb-4">Username or password is incorrect. Please try again.</p>
          )}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
