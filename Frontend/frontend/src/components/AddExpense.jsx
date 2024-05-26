import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddExpense = () => {
  const [username, setUsername] = useState('');
  const [memberUsername, setMemberUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (username) {
      const fetchMembers = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/members/${username}`);
          setMembers(response.data);
        } catch (error) {
          console.error('Error fetching members:', error);
          setMembers([]);
        }
      };
      fetchMembers();
    }
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/add-expense', {
        username,
        memberUsername,
        amount,
        category,
        description
      });
      setMessage(response.data.msg);
      setUsername('');
      setMemberUsername('');
      setAmount('');
      setCategory('');
      setDescription('');
      setMembers([]);
    } catch (error) {
      setMessage(error.response?.data?.msg || 'Error adding expense');
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Add Expense</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold mb-2">Username:</label>
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
            <label htmlFor="memberUsername" className="block text-sm font-semibold mb-2">Member Username:</label>
            <select
              id="memberUsername"
              value={memberUsername}
              onChange={(e) => setMemberUsername(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500"
              required
              disabled={!members.length}
            >
              <option value="" disabled>Select Member</option>
              {members.map(member => (
                <option key={member._id} value={member.username}>{member.username}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-semibold mb-2">Amount:</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-semibold mb-2">Category:</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-semibold mb-2">Description:</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Expense</button>
          <a href="/dashboard" className="block text-center font-semibold text-blue-500 mt-4 hover:underline">Back to Dashboard</a>
        </form>
        {message && <p className="text-sm mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default AddExpense;