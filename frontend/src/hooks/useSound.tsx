import { useState, useEffect } from 'react';

export const useSound = (soundFile: string) => {
  const [audio] = useState(new Audio(soundFile));

  useEffect(() => {
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  const playSound = () => {
    audio.play();
  };

  return playSound;
};
