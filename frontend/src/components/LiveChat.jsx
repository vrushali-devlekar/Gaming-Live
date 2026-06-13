import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Send } from 'lucide-react';
import { io } from 'socket.io-client';

const randomMessages = [
  { sender: 'X_Gamer_X', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60', text: 'Insane drive skills! 🔥' },
  { sender: 'LizzieFan', avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&auto=format&fit=crop&q=60', text: 'Love the neon graphics on the bridge' },
  { sender: 'ShadowPro', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=60', text: 'Squad up after this?' },
  { sender: 'Cyber_Knight', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60', text: 'Poggers! 😮' },
  { sender: 'VibeCheck99', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60', text: 'Which cyberware build is this?' },
  { sender: 'Anderson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60', text: 'Let\'s goooo!!' },
  { sender: 'RacerX', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=60', text: 'That car is so fast!' },
  { sender: 'GamerGirl_V', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60', text: 'Cyberpunk is looking so good in HDR' },
  { sender: 'PixelArtisan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60', text: 'Wait, what mods are installed?' }
];

const LiveChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Anderson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
      texts: [
        'Amazing Headshot!',
        'My uid: 1548264. Please add me to your squad!'
      ]
    },
    {
      id: 2,
      sender: 'Jason Leo',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=60',
      texts: [
        'Amazing Headshot!'
      ]
    },
    {
      id: 3,
      sender: 'Karl Fen',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
      texts: [
        'Amazing Headshot!'
      ]
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle socket server connection
  useEffect(() => {
    // Connect to backend Socket server
    const socket = io('http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true,
      reconnectionAttempts: 5,
      timeout: 3000
    });
    
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to real-time chat server');
      setIsSocketConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from real-time chat server');
      setIsSocketConnected(false);
    });

    socket.on('connect_error', () => {
      setIsSocketConnected(false);
    });

    // Listen for incoming messages from socket server
    socket.on('new_message', (data) => {
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        // If the last message sender matches, append text list
        if (lastMsg && lastMsg.sender === data.sender) {
          return [
            ...prev.slice(0, -1),
            {
              ...lastMsg,
              texts: [...lastMsg.texts, data.text]
            }
          ];
        }
        // Otherwise create new message block
        return [
          ...prev,
          {
            id: data.id,
            sender: data.sender,
            avatar: data.avatar,
            texts: [data.text]
          }
        ];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Offline local simulation (only runs if Socket is NOT connected)
  useEffect(() => {
    if (isSocketConnected) return; // server will broadcast mock comments if connected

    const triggerNextMessage = () => {
      const delay = Math.random() * 2000 + 2000;
      return setTimeout(() => {
        const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.sender === randomMsg.sender) {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMsg,
                texts: [...lastMsg.texts, randomMsg.text]
              }
            ];
          }
          return [
            ...prev,
            {
              id: Date.now() + Math.random(),
              sender: randomMsg.sender,
              avatar: randomMsg.avatar,
              texts: [randomMsg.text]
            }
          ];
        });

        timeoutId = triggerNextMessage();
      }, delay);
    };

    let timeoutId = triggerNextMessage();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isSocketConnected]);

  // Form submission: emit via Socket or fallback locally
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const messageData = {
      sender: 'You (Galibe)',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=60',
      text: inputVal
    };

    if (isSocketConnected && socketRef.current) {
      // Emit to server (server will broadcast to all, including us)
      socketRef.current.emit('send_message', messageData);
    } else {
      // Fallback: Append locally if server is offline
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.sender === messageData.sender) {
          return [
            ...prev.slice(0, -1),
            {
              ...lastMsg,
              texts: [...lastMsg.texts, messageData.text]
            }
          ];
        }
        return [
          ...prev,
          {
            id: Date.now(),
            sender: messageData.sender,
            avatar: messageData.avatar,
            texts: [messageData.text]
          }
        ];
      });
    }

    setInputVal('');
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] bg-card-bg/60 border border-slate-800/80 rounded-3xl p-5 flex flex-col justify-between shadow-xl neon-border-glow sticky top-24">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/50 pb-3 mb-4">
        <div className="flex flex-col text-left">
          <h2 className="text-lg font-bold text-white tracking-wide font-sans flex items-center gap-2">
            Live Chats
          </h2>
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider flex items-center gap-1 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isSocketConnected ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-amber-500 animate-pulse'}`}></span>
            {isSocketConnected ? 'REAL-TIME NETWORK SYNCED' : 'LOCAL SIMULATOR RUNNING'}
          </span>
        </div>
        <button className="text-slate-400 hover:text-white transition-colors cursor-pointer">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1 mb-4 select-none max-h-[420px] min-h-[300px]">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3 text-left">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-purple-500/20">
              <img
                src={msg.avatar}
                alt={msg.sender}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bubble contents */}
            <div className="flex flex-col gap-1.5 flex-1 max-w-[85%]">
              <span className="text-xs font-bold text-slate-300">
                {msg.sender}
              </span>
              <div className="flex flex-col gap-1.5">
                {msg.texts.map((txt, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed font-sans shadow-sm border ${
                      msg.sender.startsWith('You')
                        ? 'bg-purple-950/60 text-purple-200 border-purple-800/40 rounded-tr-sm self-end text-right'
                        : 'bg-[#0d0c1d]/90 text-slate-300 border-slate-900/60 rounded-tl-sm'
                    }`}
                  >
                    {txt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input container */}
      <form onSubmit={handleSend} className="relative mt-2">
        <div className="relative flex items-center bg-[#0d0c1d] rounded-full border border-slate-800/80 focus-within:border-purple-500/60 focus-within:shadow-[0_0_12px_rgba(139,92,246,0.15)] transition-all duration-300">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Write something"
            className="w-full bg-transparent py-3 pl-5 pr-12 text-xs text-slate-200 outline-none placeholder:text-slate-500 font-sans"
          />
          <button
            type="submit"
            className="absolute right-3 w-8 h-8 rounded-full gradient-pink-purple hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all shadow-md shadow-pink-500/10 cursor-pointer"
          >
            <Send size={12} className="rotate-45" />
          </button>
        </div>
      </form>

    </div>
  );
};

export default LiveChat;
