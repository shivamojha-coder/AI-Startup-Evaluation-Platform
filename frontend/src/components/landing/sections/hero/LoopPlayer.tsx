import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface LoopPlayerProps {
  visible: boolean;
}

const LoopPlayer: React.FC<LoopPlayerProps> = ({ visible }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (visible && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [visible]);

  return (
    <motion.video
      ref={videoRef}
      src="/videos/hero-loop.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute inset-0 w-full h-full object-cover rounded-2xl"
      style={{
        pointerEvents: visible ? "auto" : "none",
        filter: "brightness(1.05) contrast(1.05)",
        willChange: "opacity",
      }}
    />
  );
};

export default LoopPlayer;
