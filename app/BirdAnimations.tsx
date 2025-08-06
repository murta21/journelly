import React from 'react';

/**
 * A component that renders multiple flying bird animations.
 * These animations are only visible in light mode via CSS.
 */
const BirdAnimations = () => {
  // The number of birds you want to animate
  const birdCount = 5;
  const birds = [];

  for (let i = 0; i < birdCount; i++) {
    // We use CSS variables to give each bird a unique animation delay,
    // duration, and vertical position. This makes the animation feel more natural.
    const birdStyle = {
      '--animation-delay': `${2 + Math.random() * 10}s`,
      '--animation-duration': `${33 + Math.random() * 15}s`, // Fly across in 15-33 seconds
      top: `${11 + Math.random() * 48}%`, // Position birds in the top 10% to 50% of the screen
    } as React.CSSProperties;

    birds.push(<div key={i} className="bird" style={birdStyle}></div>);
  }

  return <div className="bird-container">{birds}</div>;
};

export default BirdAnimations;
