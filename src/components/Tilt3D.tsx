import React, { useRef, useState } from 'react';

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  maxAngle?: number;
  perspective?: number;
  scale?: number;
  glare?: boolean;
  style?: React.CSSProperties;
}

export default function Tilt3D({
  children,
  className = '',
  maxTilt = 10,
  maxAngle,
  perspective = 1000,
  scale = 1.02,
  glare = true,
  style = {},
}: Tilt3DProps) {
  const effectiveTilt = maxAngle !== undefined ? maxAngle : maxTilt;
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -effectiveTilt;
    const rotateY = ((x - centerX) / centerX) * effectiveTilt;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransform({
      rotateX,
      rotateY,
      scale,
      glareX,
      glareY,
      glareOpacity: 0.18,
    });
  };

  const handleMouseLeave = () => {
    setTransform({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform: `perspective(${perspective}px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale3d(${transform.scale}, ${transform.scale}, 1)`,
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {children}

      {glare && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-200 z-30"
          style={{
            background: `radial-gradient(circle at ${transform.glareX}% ${transform.glareY}%, rgba(255, 255, 255, ${transform.glareOpacity}), transparent 65%)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
