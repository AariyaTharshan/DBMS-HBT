import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faDollarSign, faMoneyBillWave, faChartLine, faChartPie, faBalanceScale, faListAlt, faUser } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(null);
  const [totalExpense, setTotalExpense] = useState(null);
  const [username, setUsername] = useState('');
  const [inputUsername, setInputUsername] = useState('');

  useEffect(() => {
    if (username) {
      const fetchTotalIncome = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/total-income/${username}`);
          setTotalIncome(response.data.totalIncome);
        } catch (error) {
          console.error('Error fetching total income:', error);
        }
      };

      const fetchTotalExpense = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/total-expense/${username}`);
          setTotalExpense(response.data.totalExpense);
        } catch (error) {
          console.error('Error fetching total expense:', error);
        }
      };

      fetchTotalIncome();
      fetchTotalExpense();
    }
  }, [username]);

  const handleFetchStats = () => {
    setUsername(inputUsername);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/addmemberform"
            className="bg-white shadow p-6 rounded-lg text-center text-lg font-semibold text-gray-700 hover:text-blue-600 transition duration-300 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> Add Persons
          </Link>
          <Link
            to="/addincome"
            className="bg-white shadow p-6 rounded-lg text-center text-lg font-semibold text-gray-700 hover:text-blue-600 transition duration-300 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faDollarSign} className="mr-2" /> Add Income
          </Link>
          <Link
            to="/addexpense"
            className="bg-white shadow p-6 rounded-lg text-center text-lg font-semibold text-gray-700 hover:text-blue-600 transition duration-300 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" /> Add Expense
          </Link>
          <Link
            to="/statsi"
            className="bg-white shadow p-6 rounded-lg text-center text-lg font-semibold text-gray-700 hover:text-blue-600 transition duration-300 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faChartLine} className="mr-2" /> Statistics of Income
          </Link>
          <Link
            to="/statse"
            className="bg-white shadow p-6 rounded-lg text-center text-lg font-semibold text-gray-700 hover:text-blue-600 transition duration-300 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faChartPie} className="mr-2" /> Statistics of Expense
          </Link>
          <Link
            to="/comparestats"
            className="bg-white shadow p-6 rounded-lg text-center text-lg font-semibold text-gray-700 hover:text-blue-600 transition duration-300 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faBalanceScale} className="mr-2" /> Comparison of Income vs Expense
          </Link>
          <Link
            to="/listofchanges"
            className="bg-white shadow p-6 rounded-lg text-center text-lg font-semibold text-gray-700 hover:text-blue-600 transition duration-300 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faListAlt} className="mr-2" /> List of Changes
          </Link>
          <div className="bg-white shadow p-6 rounded-lg text-center">
            <label htmlFor="username" className="block text-sm font-semibold mb-2">
              <FontAwesomeIcon icon={faUser} className="mr-2" /> Enter Username:
            </label>
            <input
              type="text"
              id="username"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleFetchStats}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 w-full"
            >
              Fetch Stats
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-green-100 shadow p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-green-700 mb-4 text-center">Total Income</h2>
            <p className="text-center text-3xl text-green-700">
              {totalIncome !== null ? `$${totalIncome.toFixed(2)}` : 'Loading...'}
            </p>
          </div>
          <div className="bg-red-100 shadow p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-red-700 mb-4 text-center">Total Expense</h2>
            <p className="text-center text-3xl text-red-700">
              {totalExpense !== null ? `$${totalExpense.toFixed(2)}` : 'Loading...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
