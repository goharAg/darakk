import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import darakk from '../../Assets/Images/darakk.png';
import './MainPage.css';
import { useAuth } from '../../AuthContext';
import profilePicture from '../../Assets/Images/profilePicture.png';
import CloseButton from '../shared/CloseButton';
import client from '../../services/requests.service';

const MainPage = () => {
  const profileDropdown = useRef(null);

  const { user, handleLogout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      const dropdown = profileDropdown.current;
      if (dropdown && !dropdown.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    // add a listener for click outside of dropdown

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleDropdownIconClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCloseBtnClick = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div>
      <nav className="d-flex justify-content-start navbar navbar-expand-lg navbar-light bg-light ">
        {/* <div> */}
        <a className="navbar-brand" href="/">
          <img style={{ maxWidth: '300px' }} src={darakk} />
        </a>
        <Link to="/dashboard" className="nav-link link-dark">
          Dashboard
        </Link>
        <Link to="/profile" className="nav-link link-dark">
          Profile
        </Link>
        {/* </div> */}
        <div ref={profileDropdown} className="profile-dropdown">
          <div onClick={handleDropdownIconClick} className="profile-dropdown-icon">
            <img className="rounded-circle" src={user.image_name ? `${client.HOST_NAME}/${user.image_name}` : profilePicture} />
          </div>
          {isDropdownOpen && (
            <div className="profile-dropdown-menu">
              <span className="profile-dropdown-title">Account</span>
              <CloseButton onClick={handleCloseBtnClick} />
              <hr className="h-line" />
              <div className="d-flex align-items-center profile-info">
                <div>
                  <img className="rounded-circle profile-picture" src={user.image_name ? `${client.HOST_NAME}/${user.image_name}` : profilePicture} />
                </div>
                <div className="">
                  <div className="profile-info-name">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="profile-info-email">{user.email}</div>
                </div>
              </div>
              <hr className="h-line" />
              <Link onClick={handleCloseBtnClick} className="dropdown-item" to="/profile">
                Profile
              </Link>

              <Link onClick={handleCloseBtnClick} className="dropdown-item" to="/dashboard">
                Dashboard
              </Link>
              <hr className="h-line" />
              <button className="logout-btn dropdown-item" onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </nav>
      <div className="main-page-content">
        <Outlet />
      </div>
    </div>
  );
};

export default MainPage;
