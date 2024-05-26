import React, { useState } from 'react';
import axios from 'axios';

const AddMemberForm = ({ handleBackButtonClick }) => {
  const [username, setUsername] = useState('');
  const [memberUsername, setMemberUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/add-member', { username, memberUsername });
      setMessage(response.data.msg);
      setUsername('');
      setMemberUsername('');
    } catch (error) {
      setMessage(error.response.data.msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Add Member</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold mb-2">Your Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="memberUsername" className="block text-sm font-semibold mb-2">Member's Username:</label>
            <input
              type="text"
              id="memberUsername"
              value={memberUsername}
              onChange={(e) => setMemberUsername(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Member</button>
          {/* Back button */}
          <a href="/dashboard" className="block text-center font-semibold text-blue-500 mt-4 hover:underline">Back to Dashboard</a>
        </form>
        {message && <p className="text-sm mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default AddMemberForm;
