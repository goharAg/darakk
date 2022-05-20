import LoadingButton from './LoadingButton';

import './NetworkError.css';
import networkErrorIcon from '../../Assets/Images/networkError.png';

const NetworkError = ({ tryAgainCallback }) => {
  return (
    <div className="network-error">
      <img src={networkErrorIcon} />
      <h1 className="conn-err-header">Connection failed</h1>
      <h5>Please check your connection or try again later</h5>
      <LoadingButton onClick={tryAgainCallback} text="Try again" />
    </div>
  );
};

NetworkError.defaultProps = {
  tryAgainCallback: () => {},
};

export default NetworkError;
