import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function BlurZoomBg({
  src,
  alt = '',
  duration = 2.5,
  ease = [0.22, 1, 0.36, 1],
  startScale = 2.5,
  startBlur = 18,
  className = '',
}) {
  const [ready, setReady] = useState(false);

  return (
    <motion.img
      src={src}
      alt={alt}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
      initial={{ scale: startScale, filter: `blur(${startBlur}px)` }}
      animate={ready ? { scale: 1, filter: 'blur(0px)' } : { scale: startScale, filter: `blur(${startBlur}px)` }}
      transition={{ duration, ease }}
      onLoad={() => setReady(true)}
      style={{ willChange: 'transform, filter' }}
    />
  );
}
