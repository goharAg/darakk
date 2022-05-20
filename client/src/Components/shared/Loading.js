import taskLoading from '../../Assets/Images/taskLoading.gif';
import './Loading.css';

const Loading = ({ isLoading, src, width, className, children, ...props }) => {
  return (
    <>
      {isLoading ? (
        <div className="loading-container">
          <img src={src} style={{ width }} className={className} {...props} />
        </div>
      ) : (
        children
      )}
    </>
  );
};

Loading.defaultProps = {
  src: taskLoading,
  width: '200px',
};

export default Loading;
