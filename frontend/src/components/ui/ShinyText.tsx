import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  delay?: number;
  spread?: number;
  direction?: 'left' | 'right';
  yoyo?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  baseColor?: string;
  shineColor?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 3,
  delay = 2,
  spread = 120,
  direction = 'left',
  yoyo = false,
  pauseOnHover = false,
  className = '',
  baseColor = '#F97316',
  shineColor = '#FFFFFF'
}) => {
  const animationDuration = `${speed}s`;
  const animationDelay = `${delay}s`;
  const angle = direction === 'left' ? `-${spread}deg` : `${spread}deg`;
  
  const style = {
    '--shiny-speed': animationDuration,
    '--shiny-delay': animationDelay,
    '--base-color': baseColor,
    '--shine-color': shineColor,
    backgroundImage: `linear-gradient(${angle}, var(--base-color) 40%, var(--shine-color) 50%, var(--base-color) 60%)`,
    backgroundSize: '200% auto',
    color: 'transparent',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    animation: disabled ? 'none' : `shine ${animationDuration} linear infinite ${yoyo ? 'alternate' : 'normal'}`,
    animationDelay,
    display: 'inline-block',
  } as React.CSSProperties;

  return (
    <span
      className={`${className} ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
      style={style}
    >
      {text}
      <style>{`
        @keyframes shine {
          0% {
            background-position: ${direction === 'left' ? '200%' : '-200%'} center;
          }
          100% {
            background-position: ${direction === 'left' ? '-200%' : '200%'} center;
          }
        }
      `}</style>
    </span>
  );
};
