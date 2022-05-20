import LoadingButton from './LoadingButton';
import { Link, useNavigate } from 'react-router-dom';
import './BoardAccessError.css';
import accessDeniedIcon from '../../Assets/Images/accessDenied.png';
import goBackIcon from '../../Assets/Images/goBack.svg';

const BoardAccessError = () => {
  const navigate = useNavigate();
  const returnCallback = () => navigate('/dashboard');

  return (
    <div className="board-access-error">
      <img src={accessDeniedIcon} />
      <h1>Access Denied</h1>
      <h5>You do not have access to this board.</h5>
      <Link className="back-to-board btn btn-outline-success" to="/dashboard">
        <span>Back to dashboard</span>
      </Link>
    </div>
  );
};

export default BoardAccessError;
