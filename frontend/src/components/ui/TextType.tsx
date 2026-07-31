import React, { useState, useEffect } from 'react';

interface TextTypeProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  initialDelay?: number;
  loop?: boolean;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursor?: string;
  cursorColor?: string;
  className?: string;
  variableSpeed?: { min: number; max: number } | false;
}

export const TextType: React.FC<TextTypeProps> = ({
  texts,
  typingSpeed = 55,
  deletingSpeed = 30,
  pauseDuration = 2200,
  initialDelay = 300,
  loop = true,
  showCursor = true,
  hideCursorWhileTyping = false,
  cursor = "|",
  cursorColor = "#F97316",
  className = "",
  variableSpeed = false,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const i = loopNum % texts.length;
    const fullText = texts[i];

    if (!isDeleting && displayedText === fullText) {
      // Reached the end of the word, wait then start deleting
      setIsTyping(false);
      if (!loop && loopNum === texts.length - 1) return;
      
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && displayedText === "") {
      // Finished deleting, move to next word
      setIsTyping(false);
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      
      timer = setTimeout(() => {}, 100);
    } else {
      setIsTyping(true);
      const nextText = isDeleting
        ? fullText.substring(0, displayedText.length - 1)
        : fullText.substring(0, displayedText.length + 1);
      
      let speed = isDeleting ? deletingSpeed : typingSpeed;
      if (!isDeleting && variableSpeed) {
        speed = Math.random() * (variableSpeed.max - variableSpeed.min) + variableSpeed.min;
      }
      
      timer = setTimeout(() => {
        setDisplayedText(nextText);
      }, displayedText === "" && !isDeleting ? initialDelay : speed);
    }
    
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, texts, loopNum, typingSpeed, deletingSpeed, pauseDuration, initialDelay, loop, variableSpeed]);

  const displayCursor = showCursor && (!hideCursorWhileTyping || !isTyping);

  return (
    <span className={className}>
      {displayedText}
      {displayCursor && (
        <span 
          style={{ color: cursorColor }}
          className="animate-[blink_1s_step-end_infinite]"
        >
          {cursor}
        </span>
      )}
    </span>
  );
};
