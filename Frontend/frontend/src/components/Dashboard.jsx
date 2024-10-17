import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faDollarSign, faMoneyBillWave, faChartLine, faChartPie, faBalanceScale, faListAlt } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [totals, setTotals] = useState({ totalIncome: 0, totalExpense: 0 });

  useEffect(() => {
    const fetchTotalStats = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('https://dbms-hbt.onrender.com/total-stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTotals(response.data);
      } catch (error) {
        console.error('Error fetching total stats:', error);
      }
    };

    fetchTotalStats();

    // Block scrolling when component mounts
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, []);


  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
          <Link
            to="/addmemberform"
            className="dashboard-link bg-white shadow-md hover:shadow-lg rounded-lg text-center text-lg font-semibold text-gray-700 transition duration-300 flex items-center justify-center p-6"
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> Add Persons
          </Link>
          <Link
            to="/addincome"
            className="dashboard-link bg-green-200 hover:bg-green-300 shadow-md hover:shadow-lg rounded-lg text-center text-lg font-semibold text-green-700 transition duration-300 flex items-center justify-center p-6"
          >
            <FontAwesomeIcon icon={faDollarSign} className="mr-2" /> Add Income
          </Link>
          <Link
            to="/addexpense"
            className="dashboard-link bg-red-200 hover:bg-red-300 shadow-md hover:shadow-lg rounded-lg text-center text-lg font-semibold text-red-700 transition duration-300 flex items-center justify-center p-6"
          >
            <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" /> Add Expense
          </Link>
          <Link
            to="/statsi"
            className="dashboard-link bg-white shadow-md hover:shadow-lg rounded-lg text-center text-lg font-semibold text-gray-700 transition duration-300 flex items-center justify-center p-6"
          >
            <FontAwesomeIcon icon={faChartLine} className="mr-2" /> Statistics of Income
          </Link>
          <Link
            to="/statse"
            className="dashboard-link bg-white shadow-md hover:shadow-lg rounded-lg text-center text-lg font-semibold text-gray-700 transition duration-300 flex items-center justify-center p-6"
          >
            <FontAwesomeIcon icon={faChartPie} className="mr-2" /> Statistics of Expense
          </Link>
          <Link
            to="/comparestats"
            className="dashboard-link bg-white shadow-md hover:shadow-lg rounded-lg text-center text-lg font-semibold text-gray-700 transition duration-300 flex items-center justify-center p-6"
          >
            <FontAwesomeIcon icon={faBalanceScale} className="mr-2" /> Comparison of Income vs Expense
          </Link>
          <Link
            to="/listofchanges"
            className="dashboard-link bg-white shadow-md hover:shadow-lg rounded-lg text-center text-lg font-semibold text-gray-700 transition duration-300 flex items-center justify-center p-6"
          >
            <FontAwesomeIcon icon={faListAlt} className="mr-2" /> List Of Changes
          </Link>
        </div>
        <div className="flex justify-center space-x-8">
          <div className="text-center border border-gray-200 bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-green-700 mb-4">Total Income</p>
            <p className="text-3xl font-bold text-green-800">{totals.totalIncome}</p>
          </div>
          <div className="text-center border border-gray-200 bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-red-700 mb-4">Total Expense</p>
            <p className="text-3xl font-bold text-red-800">{totals.totalExpense}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
