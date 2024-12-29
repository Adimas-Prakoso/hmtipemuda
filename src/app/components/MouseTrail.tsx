'use client';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useIsClient } from '../hooks/useIsClient';

interface Point {
  x: number;
  y: number;
  id: string;
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
  const isClient = useIsClient();
  const [points, setPoints] = useState<Point[]>([]);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (!isClient || isMobile) return;

    let pointCount = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const newPoint = {
        x: e.clientX,
        y: e.clientY,
        id: `${Date.now()}-${pointCount++}`
      };

      setPoints(prevPoints => {
        const updatedPoints = [...prevPoints, newPoint];
        if (updatedPoints.length > trailLength) {
          return updatedPoints.slice(updatedPoints.length - trailLength);
        }
        return updatedPoints;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [trailLength, isClient, isMobile]);

  useEffect(() => {
    if (!isClient || isMobile) return;

    const interval = setInterval(() => {
      setPoints(prevPoints => {
        if (prevPoints.length <= 1) return prevPoints;
        return prevPoints.slice(1);
      });
    }, fadeTime);

    return () => {
      clearInterval(interval);
    };
  }, [fadeTime, isClient, isMobile]);

  if (!isClient || isMobile) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
      {points.map((point, index) => {
        if (index === 0) return null;
        const prevPoint = points[index - 1];
        
        // Calculate line properties
        const dx = point.x - prevPoint.x;
        const dy = point.y - prevPoint.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const opacity = (index / points.length) * 0.5 + 0.5;
        
        return (
          <div
            key={`${point.id}-${index}`}
            style={{
              position: 'fixed',
              left: prevPoint.x,
              top: prevPoint.y,
              width: `${length}px`,
              height: '4px',
              backgroundColor: color,
              transform: `rotate(${angle}rad)`,
              transformOrigin: '0 50%',
              opacity,
              transition: 'opacity 0.1s ease-out'
            }}
          />
        );
      })}
    </div>
  );
}
