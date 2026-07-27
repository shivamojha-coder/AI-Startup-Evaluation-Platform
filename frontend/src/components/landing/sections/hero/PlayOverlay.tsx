import React from "react";
import { motion } from "framer-motion";

interface PlayOverlayProps {
  onClick: () => void;
  visible: boolean;
  isHovering: boolean;
}

const PlayOverlay: React.FC<PlayOverlayProps> = ({ onClick, visible, isHovering }) => {
  if (!visible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      aria-label="Play product demo"
      className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d] rounded-2xl"
    >
      <motion.div
        animate={{
          opacity: isHovering ? 1 : 0.85,
          scale: isHovering ? 1.08 : 1,
          boxShadow: isHovering
            ? "0 20px 50px rgba(0,0,0,0.35), 0 0 40px rgba(245,158,11,0.35)"
            : "0 20px 50px rgba(0,0,0,0.35)",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border border-white/15"
        style={{
          backgroundColor: "rgba(18,18,18,0.42)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-0.5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </motion.div>
    </motion.button>
  );
};

export default PlayOverlay;
