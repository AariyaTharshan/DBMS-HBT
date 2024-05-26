import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if password contains at least one special character
      const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      if (!specialCharacters.test(password)) {
        setErrorMessage('Password must contain at least one special character.');
        return;
      }

      const response = await axios.post('http://localhost:3000/signup', { username, password });
      console.log(response.data);
      
      // Check if signup was successful
      if (response.status === 201) {
        // Redirect to login page
        window.location.href = '/login';
      }
    } catch (error) {
      console.error(error);
      // Check if username already exists
      if (error.response && error.response.status === 400 && error.response.data.msg === 'User already exists') {
        setErrorMessage('Username already exists. Please choose a different username.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="username">Username:</label>
            <input
              className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500 transition duration-200 ease-in-out"
              type="text"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out" type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
