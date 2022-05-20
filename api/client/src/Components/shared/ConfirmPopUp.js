import React from 'react';
import CloseButton from './CloseButton';
import './ConfirmPopUp.css';
const ConfirmPopUp = ({ removePopUp, handleAction, event = undefined }) => {
  return (
    <div className="confirm-pop-up" onClick={(e) => removePopUp(e)}>
      <div className="confirm-pop-up-content">
        <CloseButton onClick={(e) => removePopUp(e)} />
        <div className="confirm-text">Are you sure ?</div>
        <div className="">
          <button className="btn btn-danger" onClick={() => handleAction(event)}>
            Yes
          </button>
          <button className="btn btn-light">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopUp;
