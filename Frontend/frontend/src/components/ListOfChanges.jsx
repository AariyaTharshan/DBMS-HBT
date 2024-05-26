import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListOfChanges = () => {
  const [changes, setChanges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchChanges = async (username) => {
    try {
      const response = await axios.get(`http://localhost:3000/changes/${username}`);
      setChanges(response.data);
    } catch (error) {
      console.error('Error fetching changes:', error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchChanges(username);
    }
  }, [username]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredChanges = changes.filter(change => 
    (change.username && change.username.includes(searchTerm)) || 
    (change.description && change.description.includes(searchTerm))
  );

  const paginatedChanges = filteredChanges.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">List of Changes</h1>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username to filter changes..."
          className="border border-gray-300 rounded-md py-2 px-4 w-full max-w-xs focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search changes..."
          className="border border-gray-300 rounded-md py-2 px-4 w-full max-w-xs focus:outline-none focus:border-blue-500 ml-4"
        />
      </div>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">User</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Description</th>
          </tr>
        </thead>
        <tbody>
          {paginatedChanges.map((change, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{new Date(change.date).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{change.username}</td>
              <td className={`py-2 px-4 border-b capitalize ${change.type === 'income' ? 'text-green-500' : change.type === 'expense' ? 'text-red-500' : ''}`}>
                {change.type}
              </td>
              <td className="py-2 px-4 border-b">{change.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex flex-col items-center">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mr-2"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page * itemsPerPage >= filteredChanges.length}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Next
          </button>
        </div>
        <a href="/dashboard" className="block text-center font-semibold text-blue-500 mt-4 hover:underline">Back to Dashboard</a>
      </div>
    </div>
  );
};

export default ListOfChanges;
