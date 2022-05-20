import React, { useEffect, useState } from 'react';
import deleteIcon from '../../../Assets/Images/deleteIcon.png';

const DeleteButton = ({ handleClick }) => {
  return (
    <div className="edit-btn delete-btn" onClick={handleClick}>
      <img src={deleteIcon} />
    </div>
  );
};

export default DeleteButton;
