'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  sensitivity?: number;
  enable3D?: boolean;
  onClick?: () => void;
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({
  children,
  className = '',
  sensitivity = 0.7,
  enable3D = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coords mapped from -0.5 to 0.5
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for buttery smooth 3D tilt recovery
  const springConfig = { damping: 20, stiffness: 260 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // Rotation angles based on sensitivity
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [enable3D ? 12 * sensitivity : 0, enable3D ? -12 * sensitivity : 0]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [enable3D ? -14 * sensitivity : 0, enable3D ? 14 * sensitivity : 0]);

  // Specular lighting glare position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !enable3D) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="relative select-none"
      onClick={onClick}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: enable3D ? 1.018 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`relative overflow-hidden rounded-2xl transition-shadow duration-300 ${className}`}
      >
        {/* Specular sheen glare */}
        {enable3D && isHovered && (
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-40 transition-opacity duration-300 z-30"
            style={{
              background: `radial-gradient(400px circle at ${glareX} ${glareY}, rgba(255,255,255,0.18), transparent 70%)`,
            }}
          />
        )}
        <div style={{ transform: 'translateZ(0px)' }} className="h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
