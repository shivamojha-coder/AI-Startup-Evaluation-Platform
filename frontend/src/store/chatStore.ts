import { create } from 'zustand';
import type { ChatSession, ChatMessageDB } from '../api/startups';
import {
  getChatSessions,
  getChatSessionMessages,
  updateChatSession,
  deleteChatSession,
} from '../api/startups';

export type ChatMessage = {
  role: 'user' | 'ai';
  content: string;
};

interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  unreadCount: number;
  isTyping: boolean;
  currentStartupId: string | null;

  // Session state
  sessions: ChatSession[];
  activeSessionId: string | null;
  sessionsLoading: boolean;

  // Actions
  toggleChat: () => void;
  setOpen: (isOpen: boolean) => void;
  addMessage: (msg: ChatMessage) => void;
  setTyping: (isTyping: boolean) => void;
  setContextStartupId: (id: string | null) => void;
  clearChat: () => void;
  resetUnread: () => void;

  // Session actions
  setActiveSessionId: (id: string | null) => void;
  loadSessions: () => Promise<void>;
  loadSessionMessages: (sessionId: string) => Promise<void>;
  pinSession: (sessionId: string, pinned: boolean) => Promise<void>;
  removeSession: (sessionId: string) => Promise<void>;
  addSessionToList: (session: ChatSession) => void;
  updateActiveSessionId: (id: string) => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  isOpen: false,
  messages: [],
  unreadCount: 0,
  isTyping: false,
  currentStartupId: null,
  sessions: [],
  activeSessionId: null,
  sessionsLoading: false,

  toggleChat: () =>
    set((state) => {
      const newIsOpen = !state.isOpen;
      return {
        isOpen: newIsOpen,
        unreadCount: newIsOpen ? 0 : state.unreadCount,
      };
    }),

  setOpen: (isOpen: boolean) =>
    set((state) => ({
      isOpen,
      unreadCount: isOpen ? 0 : state.unreadCount,
    })),

  addMessage: (msg: ChatMessage) =>
    set((state) => ({
      messages: [...state.messages, msg],
      unreadCount:
        !state.isOpen && msg.role === 'ai'
          ? state.unreadCount + 1
          : state.unreadCount,
    })),

  setTyping: (isTyping: boolean) => set({ isTyping }),

  setContextStartupId: (id: string | null) =>
    set((state) => {
      if (state.currentStartupId !== id) {
        // When switching to a new startup, clear current messages & session
        return { currentStartupId: id, messages: [], activeSessionId: null, unreadCount: 0 };
      }
      return { currentStartupId: id };
    }),

  clearChat: () => set({ messages: [], unreadCount: 0, activeSessionId: null }),

  resetUnread: () => set({ unreadCount: 0 }),

  // ─── Session actions ────────────────────────────────────────────────────────

  setActiveSessionId: (id: string | null) => set({ activeSessionId: id }),

  updateActiveSessionId: (id: string) => set({ activeSessionId: id }),

  addSessionToList: (session: ChatSession) =>
    set((state) => ({
      sessions: [session, ...state.sessions],
    })),

  loadSessions: async () => {
    set({ sessionsLoading: true });
    try {
      const sessions = await getChatSessions();
      set({ sessions });
    } catch (e) {
      console.error('Failed to load chat sessions', e);
    } finally {
      set({ sessionsLoading: false });
    }
  },

  loadSessionMessages: async (sessionId: string) => {
    set({ isTyping: true, messages: [], activeSessionId: sessionId });
    try {
      const dbMessages: ChatMessageDB[] = await getChatSessionMessages(sessionId);
      const messages: ChatMessage[] = dbMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      set({ messages });
    } catch (e) {
      console.error('Failed to load messages', e);
    } finally {
      set({ isTyping: false });
    }
  },

  pinSession: async (sessionId: string, pinned: boolean) => {
    try {
      await updateChatSession(sessionId, { is_pinned: pinned });
      set((state) => ({
        sessions: state.sessions.map((s) =>
          s.id === sessionId ? { ...s, is_pinned: pinned } : s
        ),
      }));
    } catch (e) {
      console.error('Failed to pin session', e);
    }
  },

  removeSession: async (sessionId: string) => {
    try {
      await deleteChatSession(sessionId);
      set((state) => {
        const sessions = state.sessions.filter((s) => s.id !== sessionId);
        const isActive = state.activeSessionId === sessionId;
        return {
          sessions,
          activeSessionId: isActive ? null : state.activeSessionId,
          messages: isActive ? [] : state.messages,
        };
      });
    } catch (e) {
      console.error('Failed to delete session', e);
    }
  },
}));
