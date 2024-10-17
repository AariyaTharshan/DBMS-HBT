import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Statsi = () => {
  const [stats, setStats] = useState([]);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Block scrolling when component mounts
    document.body.style.overflow = 'hidden';

    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        const token = localStorage.getItem('accessToken');
        try {
          const response = await axios.get(`https://dbms-hbt.onrender.com/income-stats/${encodeURIComponent(username)}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setStats(response.data);
          setMessage('');
        } catch (error) {
          setMessage('Error fetching stats');
          console.error('Error fetching stats:', error);
        }
      }
    };
    fetchData();

    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [username]);

  const data = {
    labels: stats.map(stat => stat.memberUsername),
    datasets: [
      {
        label: 'Total Income',
        data: stats.map(stat => stat.totalIncome),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Income Statistics</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-semibold mb-2">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500"
          />
        </div>
        {message && <p className="text-red-500">{message}</p>}
        {stats.length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <p className="text-sm mt-4">Enter a username to view income statistics.</p>
        )}
        <a href="/dashboard" className="block text-center font-semibold text-blue-500 mt-4 hover:underline">Back to Dashboard</a>
      </div>
    </div>
  );
};

export default Statsi;
