import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListOfChanges = ({ username }) => {
  const [changes, setChanges] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchChanges = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No token found');
        return;
      }

      try {
        let url = `http://localhost:3000/change-logs/${username}`;
        if (filter !== 'all') {
          // Adjusted the filter options to match the backend types
          if (filter === 'income') {
            url += `?type=income addition`;
          } else if (filter === 'expense') {
            url += `?type=expense addition`;
          } else {
            url += `?type=${filter}`;
          }
        }
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChanges(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.msg : 'Error fetching changes');
      }
    };

    fetchChanges();
  }, [username, filter]);

  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Change Logs</h1>
        {error && <p className="text-red-600 mb-6">{error}</p>}
        <div className="flex justify-center mb-4 space-x-4">
          <button className={`px-4 py-2 bg-white rounded-lg border border-gray-300 ${filter === 'all' ? 'bg-gray-300' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`px-4 py-2 bg-white rounded-lg border border-gray-300 ${filter === 'income' ? 'bg-gray-300' : ''}`} onClick={() => setFilter('income')}>Income</button>
          <button className={`px-4 py-2 bg-white rounded-lg border border-gray-300 ${filter === 'expense' ? 'bg-gray-300' : ''}`} onClick={() => setFilter('expense')}>Expense</button>
        </div>
        <ul className="space-y-6">
          {changes.map(change => (
            <li key={change._id} className="p-6 bg-white border border-gray-300 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-semibold text-gray-700">Type:</p>
                <p className="text-lg font-normal text-gray-900">{change.changeType}</p>
              </div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-semibold text-gray-700">Description:</p>
                <p className="text-lg font-normal text-gray-900">{change.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-700">Date:</p>
                <p className="text-lg font-normal text-gray-900">{new Date(change.date).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListOfChanges;
