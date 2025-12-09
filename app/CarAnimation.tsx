'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * A component that renders animated cars driving along the bottom of the screen.
 * After all cars complete their pass, they swap lanes and reverse direction.
 */
const CarAnimation = () => {
  const [cycle, setCycle] = useState(0); // Track which cycle we're on (even = original, odd = swapped)
  const [carsFinished, setCarsFinished] = useState({ car1: false, car2: false, car3: false });
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const car1Ref = useRef<HTMLDivElement>(null);
  const car2Ref = useRef<HTMLDivElement>(null);
  const car3Ref = useRef<HTMLDivElement>(null);

  // Check if all cars have finished
  useEffect(() => {
    if (carsFinished.car1 && carsFinished.car2 && carsFinished.car3 && !isTransitioning) {
      setIsTransitioning(true);
      
      // Small delay before swapping to ensure cars are off-screen
      setTimeout(() => {
        setCycle(prev => prev + 1);
        setCarsFinished({ car1: false, car2: false, car3: false });
        setIsTransitioning(false);
      }, 100);
    }
  }, [carsFinished, isTransitioning]);

  // Listen for animation end (when drive animation completes)
  useEffect(() => {
    const handleCar1Finish = (e: AnimationEvent) => {
      if (e.animationName.startsWith('drive')) {
        setCarsFinished(prev => ({ ...prev, car1: true }));
      }
    };
    const handleCar2Finish = (e: AnimationEvent) => {
      if (e.animationName.startsWith('drive')) {
        setCarsFinished(prev => ({ ...prev, car2: true }));
      }
    };
    const handleCar3Finish = (e: AnimationEvent) => {
      if (e.animationName.startsWith('drive')) {
        setCarsFinished(prev => ({ ...prev, car3: true }));
      }
    };

    const car1El = car1Ref.current;
    const car2El = car2Ref.current;
    const car3El = car3Ref.current;

    car1El?.addEventListener('animationend', handleCar1Finish as EventListener);
    car2El?.addEventListener('animationend', handleCar2Finish as EventListener);
    car3El?.addEventListener('animationend', handleCar3Finish as EventListener);

    return () => {
      car1El?.removeEventListener('animationend', handleCar1Finish as EventListener);
      car2El?.removeEventListener('animationend', handleCar2Finish as EventListener);
      car3El?.removeEventListener('animationend', handleCar3Finish as EventListener);
    };
  }, [cycle]); // Re-attach listeners after cycle change

  // Determine lanes and directions based on cycle
  const isSwapped = cycle % 2 === 1;
  
  // Original: car1 in lane-0 going right, car2 & car3 in lane-1 going left
  // Swapped: car1 in lane-1 going left, car2 & car3 in lane-0 going right
  const car1Lane = isSwapped ? 'lane-1' : 'lane-0';
  const car1Dir = isSwapped ? 'dir-left' : 'dir-right';
  
  const car2Lane = isSwapped ? 'lane-0' : 'lane-1';
  const car2Dir = isSwapped ? 'dir-right' : 'dir-left';
  
  const car3Lane = isSwapped ? 'lane-0' : 'lane-1';
  const car3Dir = isSwapped ? 'dir-right' : 'dir-left';

  return (
    <div className="car-container">
      <div 
        ref={car1Ref} 
        key={`car1-${cycle}`}
        className={`car car1 ${car1Lane} ${car1Dir}`} 
      />
      <div 
        ref={car2Ref} 
        key={`car2-${cycle}`}
        className={`car car2 ${car2Lane} ${car2Dir}`} 
      />
      <div 
        ref={car3Ref} 
        key={`car3-${cycle}`}
        className={`car car3 ${car3Lane} ${car3Dir}`} 
      />
    </div>
  );
};

export default CarAnimation;
