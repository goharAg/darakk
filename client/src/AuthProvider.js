import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import client from './services/requests.service';
import loading from './Assets/Images/taskLoading.gif';
import ErrorWrapper from './Components/shared/ErrorWrapper';

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    user: null,
    isLoading: true,
    error: null,
  });

  const handleLogin = async (payload) => {
    try {
      await client.login(payload);
      const user = await client.authenticate();

      setState({ isLoading: false, user });
      navigate('/dashboard');
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSignup = async (payload) => {
    try {
      await client.signup(payload);

      const user = await client.authenticate();
      setState({ isLoading: false, user });
      navigate('/dashboard');
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await client.logout();
      setState({ isLoading: false, user: null });
      navigate('/signin');
    } catch (error) {
      return false;
    }
  };

  const setUser = (user) => {
    setState({ ...state, user });
  };

  const value = {
    user: state.user,
    setUser,
    handleLogin,
    handleLogout,
    handleSignup,
  };

  const fetchUser = async () => {
    try {
      const user = await client.authenticate();
      setState({ isLoading: false, user, error: null });
    } catch (error) {
      const errorData = error.response?.data.messages[0];
      if (errorData === 'no login information') {
        setState({ isLoading: false, user: null, error: null });
      } else {
        setState({ isLoading: false, user: state.user, error });
      }
    }
  };

  useEffect(fetchUser, []);

  return (
    <>
      {state.isLoading ? (
        <img className="loading" src={loading}></img>
      ) : (
        <AuthContext.Provider value={value}>
          <ErrorWrapper error={state.error} tryAgainCallback={fetchUser}>
            {children}
          </ErrorWrapper>
        </AuthContext.Provider>
      )}
    </>
  );
};

export default AuthProvider;
