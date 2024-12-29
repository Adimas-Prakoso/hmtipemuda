'use client';
import { useEffect, useState } from 'react';
import { useIsClient } from '../hooks/useIsClient';

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
  const isClient = useIsClient();
  const [ripples, setRipples] = useState<RippleEffect[]>([]);

  useEffect(() => {
    if (!isClient) return;

    const handleClick = (e: MouseEvent) => {
      const newRipple = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now()
      };

      setRipples(prevRipples => [...prevRipples, newRipple]);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples(prevRipples => prevRipples.slice(1));
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [ripples, duration, isClient]);

  if (!isClient) return null;

  return (
    <>
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          style={{
            position: 'fixed',
            left: ripple.x - 5,
            top: ripple.y - 5,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: color,
            pointerEvents: 'none',
            animation: `ripple ${duration}ms linear`,
            zIndex: 9999
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.7;
          }
          100% {
            transform: scale(40);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
