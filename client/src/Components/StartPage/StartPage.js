import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

import womanWithLaptop from '../../Assets/Images/womanWithLaptop.png';
import manWithLaptop from '../../Assets/Images/manWithLaptop.png';
import logo from '../../Assets/Images/AlmostTrello.png';
import './StartPage.css';

const StartPage = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      <a className="brand" href="/">
        <img className="logo" src={logo} />
      </a>
      <div className="flex-form-holder">
        <img className="character" src={manWithLaptop} />

        <Outlet />

        <img className="character" src={womanWithLaptop} />
      </div>
    </div>
  );
};

export default StartPage;
