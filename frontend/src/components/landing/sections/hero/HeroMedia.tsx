import React, { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import LoopPlayer from "./LoopPlayer";
import DemoPlayer from "./DemoPlayer";
import PlayOverlay from "./PlayOverlay";

const HeroMedia: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handlePlay = useCallback(() => setShowDemo(true), []);
  const handleClose = useCallback(() => setShowDemo(false), []);
  const handleEnded = useCallback(() => setShowDemo(false), []);

  return (
    <div
      className="w-full max-w-[800px] relative aspect-video rounded-2xl overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 40px 120px rgba(0,0,0,0.45)",
        willChange: "transform",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Black base to prevent flash */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Looping hero animation */}
      <LoopPlayer visible={!showDemo} />

      {/* Demo video player */}
      <DemoPlayer visible={showDemo} onEnded={handleEnded} onClose={handleClose} />

      {/* Play overlay */}
      <AnimatePresence>
        {!showDemo && (
          <PlayOverlay onClick={handlePlay} visible isHovering={isHovering} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroMedia;
