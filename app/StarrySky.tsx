import React from 'react';

/**
 * A component that renders a field of twinkling stars and occasional shooting stars.
 * These are only visible in dark mode via CSS.
 */
const StarrySky = () => {
  const starCount = 100;
  const shootingStarCount = 5; // We'll add 5 shooting stars
  const stars = [];
  const shootingStars = [];

  // Loop for regular twinkling stars
  for (let i = 0; i < starCount; i++) {
    const starStyle = {
      '--star-size': `${1 + Math.random() * 2}px`,
      '--animation-delay': `${Math.random() * 10}s`,
      '--animation-duration': `${2 + Math.random() * 3}s`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    } as React.CSSProperties;
    stars.push(<div key={`star-${i}`} className="star" style={starStyle}></div>);
  }

  // Loop for the new shooting stars
  for (let i = 0; i < shootingStarCount; i++) {
    const shootingStarStyle = {
      // Give them a very long, random animation duration to make them appear infrequently
      '--animation-duration': `${10 + Math.random() * 20}s`, 
      '--animation-delay': `${5 + Math.random() * 10}s`,
      // Randomize the starting vertical position
      top: `${Math.random() * 50}%`, // Appear in the top half of the sky
    } as React.CSSProperties;
    shootingStars.push(<div key={`shooting-star-${i}`} className="shooting-star" style={shootingStarStyle}></div>);
  }

  return (
    <div className="starry-sky-container">
      {stars}
      {shootingStars}
    </div>
  );
};

export default StarrySky;
