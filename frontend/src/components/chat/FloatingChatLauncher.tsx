import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../store/chatStore';

export const FloatingChatLauncher: React.FC = () => {
  const { toggleChat, unreadCount } = useChatStore();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="fixed bottom-6 right-6 z-[9999]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false) }
    
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-3 right-0 bg-[#1C1C1C] text-[#FAFAFA] text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border border-[rgba(255,255,255,0.08)] whitespace-nowrap"
          >
            Ask VentureAI
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.20 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#FE9638] to-[#E28528] text-[#0A0A0A] shadow-xl hover:shadow-[#FE9638]/40 transition-shadow focus:outline-none cursor-pointer"
        aria-label="Toggle VentureAI Chat"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>

        {unreadCount > 0 && (
          <>
            <div className="absolute top-0 right-0 w-4 h-4 bg-[#EF4444] rounded-full border-2 border-[#141414] animate-pulse" />
            <div className="absolute top-0 right-0 w-4 h-4 bg-[#EF4444] rounded-full border-2 border-[#141414] flex items-center justify-center text-[8px] font-black text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          </>
        )}
      </motion.button>
    </div>
  );
};
