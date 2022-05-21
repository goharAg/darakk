import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

import logo from '../../Assets/Images/darakk.png';
import './StartPage.css';

const StartPage = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="start-container bg-dark">
      <a className="brand" href="/">
        <img className="logo" src={logo} />
      </a>
      <div className="flex-form-holder">
        <Outlet />
      </div>
    </div>
  );
};

export default StartPage;
