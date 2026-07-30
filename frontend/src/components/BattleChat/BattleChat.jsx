import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Radio, Zap, Target, Bomb, Skull, Volume2 } from 'lucide-react';
import { audioService } from '../../services/audioService';
import './BattleChat.css';

export default function BattleChat({ socket, matchId, currentUser, onNewKillfeedLog }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'system_welcome',
      senderId: 'system',
      senderName: 'SYSTEM',
      senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=System',
      message: 'Tactical radio comms online. Select a quick radio command or type a message below.',
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef(null);

  // Helper to format timestamp into readable 12-hour time (e.g. 06:50 PM)
  const formatMessageTime = (ts) => {
    if (!ts) return '';
    const dateObj = new Date(ts);
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Quick BGMI Radio Commands List
  const radioCommands = [
    { label: 'Target acquired!', icon: '🎯' },
    { label: 'Optimizing my Big-O!', icon: '⚡' },
    { label: 'Air drop requested!', icon: '💣' },
    { label: 'Good game, well played!', icon: '☠️' }
  ];

  // Auto-scroll to bottom of message list
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Socket.io Real-Time Event Listener
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });

      // Play tactical chime SFX
      try {
        audioService.playBeep(900, 0.08, 'triangle');
      } catch (e) {}

      // If drawer is closed and message is from opponent, increment unread counter
      const currentName = currentUser?.username || 'GHOST_CODER';
      if (!isOpen && data.senderName !== currentName) {
        setUnreadCount((prev) => prev + 1);
      }

      // Log to Kill Feed
      if (onNewKillfeedLog) {
        onNewKillfeedLog(`[RADIO] @${data.senderName}: ${data.message}`);
      }
    };

    socket.on('arena:receive_message', handleReceiveMessage);

    return () => {
      socket.off('arena:receive_message', handleReceiveMessage);
    };
  }, [socket, isOpen, currentUser, onNewKillfeedLog]);

  // Open Chat Drawer action
  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Reset unread counter on open
    }
  };

  // Dispatch Message via Socket & Local State
  const sendMessage = (textToSend) => {
    const msgText = (textToSend || inputMessage).trim();
    if (!msgText) return;

    const senderName = currentUser?.username || 'GHOST_CODER';
    const msgPayload = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      matchId: matchId || 'GLOBAL_MATCH',
      senderId: currentUser?.userId || 'local_user',
      senderName: senderName,
      senderAvatar: currentUser?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${senderName}`,
      message: msgText,
      timestamp: new Date()
    };

    // Add locally immediately so sender sees message right away
    setMessages((prev) => [...prev, msgPayload]);

    if (onNewKillfeedLog) {
      onNewKillfeedLog(`[RADIO] @${senderName}: ${msgText}`);
    }

    // Emit over socket
    if (socket) {
      socket.emit('arena:send_message', msgPayload);
    }

    setInputMessage('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={handleToggleChat}
        className="battle-chat-trigger-btn"
        title="Tactical Radio Comms"
      >
        <MessageSquare size={24} />
        {unreadCount > 0 && (
          <span className="chat-unread-badge">{unreadCount}</span>
        )}
      </button>

      {/* Slide-out Tactical Chat Drawer */}
      {isOpen && (
        <div className="battle-chat-drawer">
          {/* Header Bar */}
          <div className="chat-header-bar">
            <div className="flex items-center gap-2">
              <Radio size={16} className="text-[#00ffcc] animate-pulse" />
              <div>
                <span className="font-military text-sm text-white font-bold tracking-wider block leading-none">
                  TACTICAL RADIO COMMS
                </span>
                <span className="font-mono text-[9px] text-[#00ffcc] tracking-widest block mt-0.5">
                  SECURE CHANNEL PORT_5005
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleChat}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick BGMI Radio Commands Grid */}
          <div className="radio-commands-section">
            <span className="font-military text-[10px] text-gray-400 tracking-wider uppercase block">
              QUICK RADIO COMMANDS
            </span>
            <div className="radio-commands-grid">
              {radioCommands.map((cmd, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => sendMessage(`${cmd.icon} ${cmd.label}`)}
                  className="radio-command-btn"
                >
                  <span>{cmd.icon}</span>
                  <span className="truncate">{cmd.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message History Stream */}
          <div className="chat-messages-container">
            {messages.map((msg, index) => {
              const myName = currentUser?.username || 'GHOST_CODER';
              const isOwn = msg.senderName === myName || msg.senderId === currentUser?.userId;
              const isSystem = msg.senderId === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id || index} className="text-center font-mono text-[10px] text-[#00ffcc] my-1 bg-black/60 p-2 border border-[#00ffcc]/30 rounded">
                    {msg.message}
                    <span className="block text-[8px] text-[#00ffcc]/60 mt-0.5">{formatMessageTime(msg.timestamp)}</span>
                  </div>
                );
              }

              return (
                <div key={msg.id || index} className={`chat-bubble ${isOwn ? 'own' : 'opponent'}`}>
                  <div className="chat-sender-name">
                    <img src={msg.senderAvatar} alt="Avatar" className="w-4 h-4 rounded-full border border-current" />
                    <span className={isOwn ? 'text-[#00ffcc]' : 'text-[#facc15]'}>
                      {msg.senderName}
                    </span>
                  </div>
                  <div className="chat-message-text">{msg.message}</div>
                  <div className="chat-message-timestamp">{formatMessageTime(msg.timestamp)}</div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleFormSubmit} className="chat-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type tactical message..."
              className="chat-input-field"
            />
            <button type="submit" className="chat-send-btn">
              <Send size={13} />
              <span>SEND</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
