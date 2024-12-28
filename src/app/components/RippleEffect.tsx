'use client';
import { useEffect, useState } from 'react';

interface RippleProps {
  color?: string;
  duration?: number;
}

interface RippleEffect {
  x: number;
  y: number;
  id: number;
}

export default function RippleEffect({ color = 'rgba(0, 122, 255, 0.7)', duration = 850 }: RippleProps) {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
      };

      setRipples((prevRipples) => [...prevRipples, newRipple]);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    if (ripples.length > 0) {
      const timeoutId = setTimeout(() => {
        setRipples((prevRipples) => prevRipples.slice(1));
      }, duration);

      return () => clearTimeout(timeoutId);
    }
  }, [ripples.length, duration]);

  return (
    <>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: 'fixed',
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: color,
            pointerEvents: 'none',
            transform: 'scale(0)',
            animation: `rippleEffect ${duration}ms ease-out`,
          }}
        />
      ))}
    </>
  );
}
