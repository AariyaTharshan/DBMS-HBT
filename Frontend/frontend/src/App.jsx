import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AddMemberForm from './components/AddMemberForm';
import AddIncome from './components/AddIncome';
import AddExpense from './components/AddExpense';
import Statsi from './components/Statsi';
import Statse from './components/Statse';
import CompareStats from './components/CompareStats';
import ListOfChanges from './components/ListOfChanges';
import Header from './components/Header';

const App = () => {
  const location = useLocation();
  const shouldDisplayHeader = !['/', '/login', '/signup'].includes(location.pathname);

  return (
    <div>
      {shouldDisplayHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addmemberform" element={<AddMemberForm />} />
        <Route path="/addincome" element={<AddIncome />} />
        <Route path="/addexpense" element={<AddExpense />} />
        <Route path="/statsi" element={<Statsi />} />
        <Route path="/statse" element={<Statse />} />
        <Route path="/comparestats" element={<CompareStats />} />
        <Route path="/listofchanges" element={<ListOfChanges/>} />
      </Routes>
    </div>
  );
};

export default App;
