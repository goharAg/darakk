import NetworkError from './NetworkError';
import NotFoundError from './NotFoundError';
import BoardAccessError from './BoardAccessError';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { useEffect } from 'react';

const ErrorWrapper = ({ error, children, ...props }) => {
  const { setUser } = useAuth();

  if (error) {
    const errorMessage = error.message;
    const errorData = error.response?.data.messages[0];
    // const errorCode = error.response?.errorCode;  //  22000 => BoardAccessError ; 22001 => BoardNotFoundError

    if (errorMessage === 'Network Error') {
      return <NetworkError {...props} />;
    }
    // if (errorMessage === 'Not Found') {
    //   return <NotFoundError error={error} {...props} />;
    // }
    if (errorData === 'User has no access to board') {
      return <BoardAccessError {...props} />;
    }
    if (errorData === 'no login information') {
      setUser(null);

      return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
};

export default ErrorWrapper;
