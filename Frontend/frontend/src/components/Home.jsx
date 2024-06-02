import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    // Block scrolling when component mounts
    document.body.style.overflow = 'hidden';

    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200 dark:bg-gray-800">
      <h1 className="text-4xl font-semibold mb-8 text-gray-900 dark:text-gray-100">Welcome to Home Budget Tracker</h1>
      <div className="flex space-x-4">
        <Link to="/login">
          <button className="px-6 py-3 bg-blue-600 text-white text-lg rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="px-6 py-3 bg-green-600 text-white text-lg rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200">
            Signup
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
