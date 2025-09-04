import React from 'react';
import './Working.scss';
import section3 from '../assets/section3.jpg';
import More from './More';

const Working = () => {
  return (
    <div className="working-section">
      <img src={section3} alt="Working Section" className="working-image" />
      <More />
    </div>
  );
};

export default Working;
