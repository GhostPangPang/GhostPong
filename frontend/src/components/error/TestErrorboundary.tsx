import React, { useState } from 'react';

const BuggyCounter = () => {
  const [counter, setCounter] = useState(0);

  const handleClick = () => {
    setCounter(counter + 1);
  };

  if (counter === 5) {
    // Simulate a JS error
    throw new Error('💥 CABOOM 💥');
  }

  return <button onClick={handleClick}>{counter}</button>;
};

export default BuggyCounter;
