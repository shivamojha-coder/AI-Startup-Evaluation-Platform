import React from "react";
import "./AnimatedBorder.css";

export const AnimatedBorder: React.FC = () => {
  return (
    <div className="animated-border-overlay">
      <div className="animated-border-beam" />
    </div>
  );
};
