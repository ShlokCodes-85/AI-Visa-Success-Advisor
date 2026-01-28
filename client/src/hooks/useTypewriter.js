import { useState, useEffect } from 'react';

function useTypewriter(text, speed = 50, startAnimation = true, delay = 600) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!startAnimation) return;

    const timeoutId = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayedText(text.substring(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [text, speed, startAnimation, delay]);

  return displayedText;
}

export default useTypewriter;
