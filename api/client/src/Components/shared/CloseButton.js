import React from 'react';
import closeBtn from '../../Assets/Images/closeBtn.svg';

const CloseButton = ({ onClick }) => {
  return <img src={closeBtn} className="close-btn" onClick={onClick} />;
};

export default CloseButton;
