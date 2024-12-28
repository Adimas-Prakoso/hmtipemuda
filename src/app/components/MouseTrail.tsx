'use client';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface Point {
  x: number;
  y: number;
  id: number;
}

interface MouseTrailProps {
  color?: string;
  trailLength?: number;
  fadeTime?: number;
}

export default function MouseTrail({
  color = 'rgba(0, 122, 255, 0.7)',
  trailLength = 25,
  fadeTime = 30
}: MouseTrailProps) {
  const [points, setPoints] = useState<Point[]>([]);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    if (!isDesktop) {
      setPoints([]);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;
      
      // Calculate distance between last point and current point
      const distance = Math.sqrt(
        Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2)
      );
      
      // Only add point if mouse has moved enough
      if (distance > 5) {
        const newPoint = {
          x: currentX,
          y: currentY,
          id: Date.now(),
        };

        setPoints((prevPoints) => {
          const updatedPoints = [...prevPoints, newPoint];
          return updatedPoints.slice(-trailLength);
        });

        lastX = currentX;
        lastY = currentY;
      }
    };

    const cleanPoints = () => {
      setPoints((prevPoints) => {
        if (prevPoints.length > 0) {
          return prevPoints.slice(1);
        }
        return prevPoints;
      });
      timeoutId = setTimeout(cleanPoints, fadeTime);
    };

    document.addEventListener('mousemove', handleMouseMove);
    timeoutId = setTimeout(cleanPoints, fadeTime);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [trailLength, fadeTime, isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      {points.map((point, index) => {
        if (index === 0) return null;
        const prevPoint = points[index - 1];
        
        // Calculate line properties
        const dx = point.x - prevPoint.x;
        const dy = point.y - prevPoint.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        return (
          <div
            key={point.id}
            style={{
              position: 'fixed',
              left: prevPoint.x,
              top: prevPoint.y,
              width: `${length}px`,
              height: '6px',
              background: color,
              transform: `rotate(${angle}rad)`,
              transformOrigin: '0 50%',
              pointerEvents: 'none',
              opacity: (index / points.length) * 0.5 + 0.5,
              transition: 'opacity 0.1s ease-out',
              borderRadius: '5px',
            }}
          />
        );
      })}
    </>
  );
}
