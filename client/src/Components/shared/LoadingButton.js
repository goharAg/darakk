import { useEffect, useState } from 'react';
import loadingSpinner from '../../Assets/Images/loadingSpinner.svg';
import './LoadingButton.css';

const LoadingButton = ({ loading, disabled, onClick, text, className, ...props }) => {
  const [isLoading, setIsLoading] = useState(loading || false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleClick = async () => {
    if (mounted) {
      setIsLoading(true);
      await onClick();
      setIsLoading(false);
    }
  };
  return (
    <button disabled={isLoading || disabled} onClick={handleClick} className={`btn btn-outline-secondary loading-btn ${className}`} {...props}>
      {isLoading && <img className="loading-spinner" src={loadingSpinner} />}
      {text}
    </button>
  );
};

LoadingButton.defaultProps = {
  onClick: () => {},
};

export default LoadingButton;
