import React from 'react';
import { motion } from 'motion/react';

interface SectionReveal3DProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function SectionReveal3D({
  children,
  className = '',
  delay = 0,
}: SectionReveal3DProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 6 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={`will-change-transform ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
}
