import React from 'react';
import { FloatingChatLauncher } from './FloatingChatLauncher';
import { ChatWidget } from './ChatWidget';
import { useChatStore } from '../../store/chatStore';
import { useAuth } from '../../context/AuthContext';

export const GlobalFloatingChat: React.FC = () => {
  const { currentStartupId } = useChatStore();
  const { user } = useAuth();

  // Only show the chatbot if there's a startup context AND the user is an investor
  if (!currentStartupId || user?.role !== 'investor') {
  return null;
  }

  return (
    <>
      <FloatingChatLauncher />
      <ChatWidget />
    </>
  );
};
