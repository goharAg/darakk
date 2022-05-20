import React, { useEffect, useState } from 'react';
import editIcon from '../../../Assets/Images/editIcon.svg';

const EditButton = ({ handleClick }) => {
  return (
    <div className="edit-btn" onClick={handleClick}>
      <img src={editIcon} />
    </div>
  );
};

export default EditButton;
