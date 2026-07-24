import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChatStore } from '../../store/chatStore';
import { startupAiChat } from '../../api/startups';
import type { ChatSession } from '../../api/startups';

const SUGGESTED_PROMPTS = [
  'Analyze Market Size',
  'Identify Investment Risks',
  'Evaluate Business Model',
  'Review Competition',
];

// ─── Utility: group sessions by time ─────────────────────────────────────────
function groupSessions(sessions: ChatSession[]) {
  const now = new Date();
  const pinned: ChatSession[] = [];
  const today: ChatSession[] = [];
  const week: ChatSession[] = [];
  const older: ChatSession[] = [];

  sessions.forEach((s) => {
    if (s.is_pinned) { pinned.push(s); return; }
    const d = new Date(s.updated_at);
    const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays < 1) today.push(s);
    else if (diffDays < 7) week.push(s);
    else older.push(s);
  });

  return { pinned, today, week, older };
}

// ─── Session Item in Sidebar ──────────────────────────────────────────────────
const SessionItem: React.FC<{
  session: ChatSession;
  isActive: boolean;
  onSelect: () => void;
  onPin: () => void;
  onDelete: () => void;
}> = ({ session, isActive, onSelect, onPin, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
        isActive
          ? 'bg-[rgba(254,150,56,0.12)] border border-[#FE9638]/25'
          : 'hover:bg-[rgba(255,255,255,0.04)] border border-transparent'
      }`}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {session.is_pinned && (
        <svg className="w-3 h-3 text-[#FE9638] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
        </svg>
      )}
      <span className="flex-1 text-xs text-[#FAFAFA] truncate leading-relaxed">
        {session.title}
      </span>

      {/* Action buttons on hover */}
      {hovered && (
        <div className="flex items-center gap-0.5 ml-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onPin}
            title={session.is_pinned ? 'Unpin' : 'Pin'}
            className="p-1 rounded-lg hover:bg-[rgba(254,150,56,0.2)] text-[#666] hover:text-[#FE9638] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill={session.is_pinned ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            title="Delete"
            className="p-1 rounded-lg hover:bg-[rgba(248,113,113,0.15)] text-[#666] hover:text-[#F87171] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Session Group Label ──────────────────────────────────────────────────────
const GroupLabel: React.FC<{ label: string }> = ({ label }) => (
  <p className="text-[10px] font-bold uppercase tracking-widest text-[#555] px-3 mt-4 mb-1">{label}</p>
);


// ─── Main ChatWidget ──────────────────────────────────────────────────────────
export const ChatWidget: React.FC = () => {
  const {
    isOpen,
    toggleChat,
    messages,
    addMessage,
    isTyping,
    setTyping,
    currentStartupId,
    clearChat,
    sessions,
    sessionsLoading,
    activeSessionId,
    loadSessions,
    loadSessionMessages,
    pinSession,
    removeSession,
    addSessionToList,
    updateActiveSessionId,
  } = useChatStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load sessions whenever chat opens
  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleNewChat = useCallback(() => {
    clearChat();
  }, [clearChat]);

  const handleSelectSession = useCallback(
    async (sessionId: string) => {
      if (sessionId === activeSessionId) return;
      await loadSessionMessages(sessionId);
    },
    [activeSessionId, loadSessionMessages]
  );

  const handleSubmit = async (e?: React.FormEvent, presetMsg?: string) => {
    if (e) e.preventDefault();
    const userMsg = presetMsg || input.trim();
    if (!userMsg || isTyping) return;

    addMessage({ role: 'user', content: userMsg });
    setInput('');
    setTyping(true);

    try {
      if (!currentStartupId) {
        throw new Error('Please select a startup report to chat about it.');
      }

      const res = await startupAiChat(currentStartupId, userMsg, activeSessionId);
      addMessage({ role: 'ai', content: res.answer });

      // If a new session was created, update active session and reload sidebar
      if (!activeSessionId && res.session_id) {
        updateActiveSessionId(res.session_id);
        await loadSessions(); // refresh sidebar immediately
      } else if (activeSessionId) {
        // Touch updated_at so it shows at top of list
        await loadSessions();
      }
    } catch (err: any) {
      addMessage({
        role: 'ai',
        content:
          err.message ||
          "Sorry, I couldn't fetch an answer right now. Make sure you are viewing a startup report.",
      });
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const { pinned, today, week, older } = groupSessions(sessions);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-sm"
          onClick={toggleChat}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[1200px] h-[90vh] md:h-[85vh] flex flex-col md:flex-row bg-[#0F0F0F] rounded-2xl shadow-2xl border border-[rgba(255,255,255,0.1)] overflow-hidden"
          >
            {/* ─── Left Sidebar ─────────────────────────────────────────── */}
            <div className="hidden md:flex flex-col w-[280px] bg-[#0A0A0A] border-r border-[rgba(255,255,255,0.07)]">
              {/* Branding */}
              <div className="p-5 border-b border-[rgba(255,255,255,0.07)]">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[rgba(254,150,56,0.15)] flex items-center justify-center text-[#FE9638]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-[#FAFAFA]">VentureAI</h2>
                </div>
                <p className="text-[11px] text-[#666]">AI assistant for startup analysis</p>
              </div>

              {/* New Chat Button */}
              <div className="p-3">
                <button
                  onClick={handleNewChat}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] text-xs text-[#FAFAFA] font-medium hover:bg-[rgba(254,150,56,0.08)] hover:border-[#FE9638]/30 hover:text-[#FE9638] transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Chat
                </button>
              </div>

              {/* Session History */}
              <div className="flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar space-y-0.5">
                {sessionsLoading && (
                  <div className="flex justify-center py-6">
                    <div className="w-4 h-4 border-2 border-[#FE9638] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {!sessionsLoading && sessions.length === 0 && (
                  <p className="text-[11px] text-[#555] text-center py-8 px-3">No conversations yet. Start a new chat!</p>
                )}

                {pinned.length > 0 && (
                  <>
                    <GroupLabel label="📌 Pinned" />
                    {pinned.map((s) => (
                      <SessionItem
                        key={s.id}
                        session={s}
                        isActive={activeSessionId === s.id}
                        onSelect={() => handleSelectSession(s.id)}
                        onPin={() => pinSession(s.id, !s.is_pinned)}
                        onDelete={() => removeSession(s.id)}
                      />
                    ))}
                  </>
                )}
                {today.length > 0 && (
                  <>
                    <GroupLabel label="Today" />
                    {today.map((s) => (
                      <SessionItem
                        key={s.id}
                        session={s}
                        isActive={activeSessionId === s.id}
                        onSelect={() => handleSelectSession(s.id)}
                        onPin={() => pinSession(s.id, !s.is_pinned)}
                        onDelete={() => removeSession(s.id)}
                      />
                    ))}
                  </>
                )}
                {week.length > 0 && (
                  <>
                    <GroupLabel label="Previous 7 Days" />
                    {week.map((s) => (
                      <SessionItem
                        key={s.id}
                        session={s}
                        isActive={activeSessionId === s.id}
                        onSelect={() => handleSelectSession(s.id)}
                        onPin={() => pinSession(s.id, !s.is_pinned)}
                        onDelete={() => removeSession(s.id)}
                      />
                    ))}
                  </>
                )}
                {older.length > 0 && (
                  <>
                    <GroupLabel label="Older" />
                    {older.map((s) => (
                      <SessionItem
                        key={s.id}
                        session={s}
                        isActive={activeSessionId === s.id}
                        onSelect={() => handleSelectSession(s.id)}
                        onPin={() => pinSession(s.id, !s.is_pinned)}
                        onDelete={() => removeSession(s.id)}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* ─── Main Chat Area ────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col bg-[#0A0A0A] relative">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-[#0F0F0F] border-b border-[rgba(255,255,255,0.07)]">
                <div className="flex items-center gap-3">
                  <div className="md:hidden w-7 h-7 rounded-lg bg-[rgba(254,150,56,0.15)] flex items-center justify-center text-[#FE9638]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#FAFAFA] flex items-center gap-2">
                      VentureAI
                      <span className="flex items-center gap-1 text-[11px] font-normal text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        online
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#FE9638] uppercase tracking-wider font-bold">
                      {currentStartupId ? 'Analyzing Context' : 'Select a Startup to begin'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* New chat on mobile */}
                  <button
                    onClick={handleNewChat}
                    className="md:hidden p-2 rounded-lg text-[#9A9A9A] hover:text-[#FE9638] hover:bg-[#1C1C1C] transition-colors"
                    title="New Chat"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button
                    onClick={toggleChat}
                    className="p-2 rounded-lg text-[#9A9A9A] hover:text-[#FAFAFA] hover:bg-[#1C1C1C] transition-colors"
                    aria-label="Close Chat"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-6 animate-fadeIn max-w-lg mx-auto">
                    <div className="w-20 h-20 rounded-3xl bg-[rgba(254,150,56,0.1)] flex items-center justify-center text-[#FE9638] shadow-lg shadow-[#FE9638]/5">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div className="text-center space-y-3">
                      <h4 className="text-2xl font-bold text-[#FAFAFA]">How can I help you today?</h4>
                      <p className="text-sm text-[#9A9A9A]">
                        I can analyze market size, evaluate risks, review business models, and more.
                      </p>
                    </div>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                      {SUGGESTED_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => handleSubmit(undefined, prompt)}
                          className="w-full text-left px-5 py-4 rounded-xl bg-[#141414] border border-[rgba(255,255,255,0.06)] hover:border-[#FE9638]/40 hover:bg-[#1C1C1C] hover:-translate-y-0.5 text-sm text-[#FAFAFA] transition-all flex items-center justify-between group shadow-sm"
                        >
                          {prompt}
                          <svg className="w-4 h-4 text-[#666] group-hover:text-[#FE9638] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'ai' && (
                        <div className="w-8 h-8 rounded-lg bg-[rgba(254,150,56,0.15)] flex items-center justify-center text-[#FE9638] mr-3 mt-1 flex-shrink-0">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-[15px] leading-relaxed shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-[#FE9638] text-[#0A0A0A] font-medium rounded-tr-sm'
                            : 'bg-[#141414] text-[#FAFAFA] border border-[rgba(255,255,255,0.06)] rounded-tl-sm'
                        }`}
                      >
                        {msg.role === 'ai' ? (
                          <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-p:my-1.5 prose-pre:bg-[#0A0A0A] prose-pre:border prose-pre:border-[rgba(255,255,255,0.05)] prose-table:border-collapse prose-th:border prose-th:border-[rgba(255,255,255,0.1)] prose-td:border prose-td:border-[rgba(255,255,255,0.08)] prose-th:p-2 prose-td:p-2">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-lg bg-[#222] flex items-center justify-center text-white ml-3 mt-1 flex-shrink-0 border border-[rgba(255,255,255,0.08)]">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))
                )}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(254,150,56,0.15)] flex items-center justify-center text-[#FE9638] mr-3 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="bg-[#141414] rounded-2xl p-4 rounded-tl-sm border border-[rgba(255,255,255,0.06)]">
                      <div className="flex gap-1.5 items-center h-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FE9638] animate-bounce" style={{ animationDuration: '0.8s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FE9638] animate-bounce" style={{ animationDelay: '0.15s', animationDuration: '0.8s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FE9638] animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '0.8s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 md:px-8 md:pb-6">
                <form
                  onSubmit={handleSubmit}
                  className="relative flex items-end bg-[#141414] border border-[rgba(255,255,255,0.1)] rounded-xl focus-within:border-[#FE9638]/50 focus-within:ring-1 focus-within:ring-[#FE9638]/20 transition-all shadow-lg"
                >
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about this startup..."
                    className="w-full bg-transparent py-4 pl-5 pr-14 text-sm md:text-base text-[#FAFAFA] focus:outline-none resize-none max-h-40 min-h-[56px] custom-scrollbar placeholder-[#444]"
                    rows={1}
                    style={{ height: input ? 'auto' : '56px' }}
                  />
                  <button
                    type="submit"
                    disabled={isTyping || !input.trim()}
                    className="absolute right-2 bottom-2 p-2.5 rounded-lg text-[#FE9638] bg-[rgba(254,150,56,0.1)] hover:bg-[#FE9638] hover:text-black disabled:opacity-50 disabled:bg-transparent disabled:text-[#666] transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
                <p className="text-center mt-2 text-[11px] text-[#444]">
                  VentureAI can make mistakes. Consider verifying important information.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
