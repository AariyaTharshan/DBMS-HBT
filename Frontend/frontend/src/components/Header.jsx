import React from 'react';

const Header = ({ onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Home Budget Tracker</h1>
        <button className="text-white px-4 py-2 rounded-md bg-red-600 hover:bg-red-700" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

const Home = () => {
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  };

  return (
    <div>
      <Header onLogout={handleLogout} />
    </div>
  );
};

export default Home;
