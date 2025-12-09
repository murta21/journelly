'use client';

import React from 'react';

/**
 * A component that renders animated cars driving along the bottom of the screen.
 */
const CarAnimation = () => {
  return (
    <div className="car-container">
      <div className="car car1 lane-0" />
      <div className="car car2 lane-1" />
      <div className="car car3 lane-1" />
    </div>
  );
};

export default CarAnimation;
