import React, { useState, useEffect } from 'react';
import './Warning.css';

const Warning = ({ text }) => {
  return <div className="warning">{text}</div>;
};

export default Warning;
