import  { useState, useEffect } from 'react';

const useTypewriter = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        if(text.substring(i, i + 1) !== '<') {
            setDisplayText(text.substring(0, i + 1) + "|");
        } else {
            while(text.substring(i, i+1) !== '>') {
                i++;
            }
        }
        i++;
      } else {
        setDisplayText(text.substring(0, i));
        clearInterval(typingInterval);
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed]);

  return displayText;
};

export default useTypewriter;