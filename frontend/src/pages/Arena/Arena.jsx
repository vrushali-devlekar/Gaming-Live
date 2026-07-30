import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { 
  Terminal, Code2, Play, Pause, Disc, Volume2, ShieldAlert, Award, 
  ArrowLeft, RefreshCw, Send, Shield, Zap, Flame, Cpu, Eye, Radio, Check,
  Search, Link, Copy, UserCheck, ExternalLink, HelpCircle, Users
} from 'lucide-react';
import { io } from 'socket.io-client';
import { themeService } from '../../services/themeService';
import { audioService } from '../../services/audioService';
import { useAuth } from '../../context/AuthContext';
import BattleChat from '../../components/BattleChat/BattleChat';
import './Arena.css';

export default function Arena() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const activeTheme = themeService.getCurrentTheme();

  // Socket.io connection instance
  const [socket, setSocket] = useState(null);
  const [matchId, setMatchId] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [matchStarted, setMatchStarted] = useState(false);

  // 1. Question-First Selection State
  const [availableProblems, setAvailableProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  
  // 2. GitHub Lookup & Target Preview State
  const [showInviteDrawer, setShowInviteDrawer] = useState(false);
  const [githubInput, setGithubInput] = useState('');
  const [isSearchingGithub, setIsSearchingGithub] = useState(false);
  const [githubTarget, setGithubTarget] = useState(null);
  const [githubError, setGithubError] = useState('');

  // Language selector & templates
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  
  const languageTemplates = {
    javascript: `// Mission: Secure Perimeter Firewall Grid (1v1 Duel)\nfunction bypassFirewall(grid, startX, startY) {\n  // Write your algorithm logic here\n}`,
    python: `# Mission: Secure Perimeter Firewall Grid (1v1 Duel)\ndef bypass_firewall(grid, start_x, start_y):\n    pass`,
    cpp: `// Mission: Secure Perimeter Firewall Grid (1v1 Duel)\n#include <iostream>\nusing namespace std;\n\nint solution() {\n  return 0;\n}`
  };

  const [code, setCode] = useState(languageTemplates.javascript);

  // Combat Health Mechanics
  const [userHp, setUserHp] = useState(100);
  const [opponentHp, setOpponentHp] = useState(100);
  const [opponentProfile, setOpponentProfile] = useState({
    username: 'AWAITING TARGET...',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Target'
  });
  const [userTestsPassed, setUserTestsPassed] = useState(0);
  const [opponentTestsPassed, setOpponentTestsPassed] = useState(0);
  const [hasHelmet, setHasHelmet] = useState(false);
  const [isDamageFlashing, setIsDamageFlashing] = useState(false);

  // Terminal & Match Control
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'info', text: '[SYSTEM] COMBAT COMPILER ARENA ONLINE (v4.2.0)' },
    { type: 'warning', text: '[STEP 1] Select or customize a coding problem to unlock tactical invitations.' }
  ]);

  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchTimeLeft, setMatchTimeLeft] = useState(899);

  // Fetch Problems list from backend on mount
  useEffect(() => {
    fetch('http://localhost:3001/api/problems/all')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.problems && data.problems.length > 0) {
          setAvailableProblems(data.problems);
          const defaultProb = data.problems[0];
          setSelectedProblem(defaultProb);
        }
      })
      .catch(() => {});
  }, []);

  // Initialize Socket.io Connection & Match URL handler
  useEffect(() => {
    const newSocket = io('http://localhost:3001/battle', {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });
    setSocket(newSocket);

    const queryParams = new URLSearchParams(location.search);
    const urlMatchId = queryParams.get('matchId');

    const currentUserPayload = {
      username: user?.username || 'GHOST_CODER',
      avatar: user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'Ghost'}`
    };

    if (urlMatchId) {
      setMatchId(urlMatchId);
      newSocket.emit('arena:join_room', {
        matchId: urlMatchId,
        guestUser: currentUserPayload
      });
    } else {
      const generatedId = `MATCH_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      setMatchId(generatedId);
      newSocket.emit('arena:create_challenge', {
        matchId: generatedId,
        hostUser: currentUserPayload
      });
    }

    // Socket Event: Opponent joined/connected handler
    const handleOpponentJoined = (data) => {
      let guestName = 'TARGET_ACQUIRED';
      let guestAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=Target`;

      if (data.guestUser) {
        guestName = data.guestUser.username || guestName;
        guestAvatar = data.guestUser.avatar || guestAvatar;
      } else if (data.players && data.players.length > 1) {
        guestName = data.players[1].username || guestName;
        guestAvatar = data.players[1].avatar || guestAvatar;
      }

      setOpponentProfile({
        username: guestName,
        avatar: guestAvatar
      });

      setMatchStarted(true);

      setTerminalLogs((prev) => [
        ...prev,
        { type: 'success', text: data.message || `[SYSTEM] @${guestName} connected to the tactical perimeter.` },
        { type: 'info', text: '[MATCH STATUS] 1v1 Duel active! Timer countdown engaged.' }
      ]);

      try {
        audioService.playSniper();
      } catch (e) {}
    };

    newSocket.on('arena:opponent_joined', handleOpponentJoined);
    newSocket.on('arena:opponent_connected', handleOpponentJoined);

    return () => {
      newSocket.off('arena:opponent_joined', handleOpponentJoined);
      newSocket.off('arena:opponent_connected', handleOpponentJoined);
      newSocket.disconnect();
    };
  }, [location.search, user]);

  // Countdown Match Timer
  useEffect(() => {
    if (matchTimeLeft <= 0) return;
    const timer = setInterval(() => setMatchTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [matchTimeLeft]);

  // Handle GitHub Profile Search
  const handleGithubSearch = async (e) => {
    e.preventDefault();
    if (!githubInput.trim()) return;

    setIsSearchingGithub(true);
    setGithubError('');
    setGithubTarget(null);

    try {
      const response = await fetch(
        `http://localhost:3001/api/users/github-preview?identifier=${encodeURIComponent(githubInput.trim())}`
      );
      const data = await response.json();
      setIsSearchingGithub(false);

      if (data.success && data.profile) {
        setGithubTarget(data.profile);
      } else {
        setGithubError(data.message || 'GitHub profile not found');
      }
    } catch (err) {
      setIsSearchingGithub(false);
      setGithubError('Failed to fetch GitHub profile');
    }
  };

  // Generate & Copy Match Challenge Link
  const handleCopyMatchLink = () => {
    const inviteUrl = `${window.location.origin}/arena?matchId=${matchId}&host=${encodeURIComponent(user?.username || 'HOST')}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);

    if (socket && matchId) {
      socket.emit('arena:create_challenge', {
        matchId,
        problem: selectedProblem,
        hostUser: { username: user?.username || 'HOST_OPERATOR', avatar: user?.avatar }
      });
    }

    setTerminalLogs((prev) => [
      ...prev,
      { type: 'info', text: `[INVITE LINK] Challenge URL copied: ${inviteUrl}` }
    ]);

    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Confirm Question Selection
  const handleConfirmQuestion = (problemObj) => {
    setSelectedProblem(problemObj);
    if (problemObj.driverCode && problemObj.driverCode[selectedLanguage]) {
      setCode(problemObj.driverCode[selectedLanguage]);
    }
    setShowQuestionModal(false);
    setTerminalLogs((prev) => [
      ...prev,
      { type: 'success', text: `[QUESTION LOCKED] Active problem set to "${problemObj.title}". Invite action unlocked!` }
    ]);
  };

  // Run Test Cases Action
  const handleRunTests = () => {
    if (isRunningTests) return;
    audioService.playReload();
    setIsRunningTests(true);

    setTerminalLogs((prev) => [
      ...prev,
      { type: 'info', text: `[${user?.username || 'CODER'}] Compiling syntax buffers against test cases...` }
    ]);

    setTimeout(() => {
      const isFailedAttempt = Math.random() > 0.65;

      if (isFailedAttempt) {
        if (hasHelmet) {
          setHasHelmet(false);
          setTerminalLogs((prev) => [
            ...prev,
            { type: 'warning', text: '[ARMOR] Level 3 Helmet shielded operator from HP recoil penalty!' }
          ]);
        } else {
          setIsDamageFlashing(true);
          setTimeout(() => setIsDamageFlashing(false), 800);
          setUserHp((prev) => Math.max(0, prev - 20));
          setTerminalLogs((prev) => [
            ...prev,
            { type: 'danger', text: '[OPPONENT] Counter-attacked! Recoil penalty (-20 HP)!' }
          ]);
        }
      } else {
        audioService.playSniper();
        setUserTestsPassed((prev) => Math.min(10, prev + 1));
        setTerminalLogs((prev) => [
          ...prev,
          { type: 'success', text: `[${user?.username || 'CODER'}] Headshot on Test Case ${userTestsPassed + 1}! (+10 PTS)` }
        ]);
      }

      setIsRunningTests(false);
    }, 1400);
  };

  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`arena-container font-sans select-none relative ${isDamageFlashing ? 'animate-damage-flash' : ''}`}>
      <div className="arena-grid-matrix" />
      <div className="scanlines-overlay" />

      {/* Red Damage Flash Screen Overlay */}
      {isDamageFlashing && (
        <div className="absolute inset-0 bg-red-600/25 z-50 pointer-events-none animate-pulse border-4 border-red-500" />
      )}

      {/* Top Tactical Header */}
      <header className="relative z-10 bg-iron-gray border-b border-[#2d3142] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/lobby')} 
            className="flex items-center gap-1.5 text-xs font-military text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 px-3 py-1 bg-black/30 rounded transition-colors"
          >
            <ArrowLeft size={14} />
            <span>ABANDON MATCH</span>
          </button>
          
          <div className="h-4 w-[2px] bg-gray-800" />

          {/* Question Selector Trigger */}
          <button
            onClick={() => setShowQuestionModal(true)}
            className="flex items-center gap-2 px-3 py-1 bg-[#facc15]/10 border border-[#facc15]/40 text-[#facc15] font-military text-xs font-bold rounded clip-steel-sm hover:bg-[#facc15]/20 cursor-pointer"
          >
            <HelpCircle size={14} />
            <span>{selectedProblem ? `QUESTION: ${selectedProblem.title}` : 'SELECT MATCH QUESTION'}</span>
          </button>
        </div>

        {/* Action Buttons: Invite Opponent & Link Copy */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInviteDrawer(true)}
            disabled={!selectedProblem}
            className={`flex items-center gap-2 px-4 py-1.5 font-military text-xs font-bold tracking-wider rounded clip-angular-btn transition-all cursor-pointer ${
              selectedProblem
                ? 'bg-[#00ffcc] hover:bg-[#00cca3] text-black shadow-[0_0_15px_rgba(0,255,204,0.3)]'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Users size={14} />
            <span>INVITE OPPONENT</span>
          </button>

          <button
            onClick={handleCopyMatchLink}
            className="flex items-center gap-2 px-3 py-1.5 bg-black/50 border border-white/20 hover:border-white text-white font-military text-xs rounded transition-all cursor-pointer"
          >
            {copiedLink ? <Check size={14} className="text-[#00ffcc]" /> : <Copy size={14} />}
            <span>{copiedLink ? 'LINK COPIED!' : 'COPY MATCH LINK'}</span>
          </button>
        </div>

        {/* Match Timer */}
        <div className="flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-500/30 clip-steel-sm">
          <ShieldAlert size={14} className="text-red-500 animate-pulse" />
          <span className="font-military text-sm text-red-500 font-bold tracking-widest">
            {formatTime(matchTimeLeft)}
          </span>
        </div>
      </header>

      {/* Main Split-Screen Workspace Grid */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 min-h-0 overflow-hidden">
        
        {/* ================= LEFT SIDE: MONACO CODE EDITOR (7 COLS) ================= */}
        <section className="lg:col-span-7 flex flex-col min-h-0 relative">
          <div className="steel-panel border-2 border-steel-border flex-1 flex flex-col clip-steel-widget min-h-0 overflow-hidden">
            
            <div className="flex items-center justify-between bg-black/60 border-b border-steel-border px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/60" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <span className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="h-4 w-[1px] bg-gray-800 mx-2" />
                <div className="flex items-center gap-1.5 px-3 py-1 bg-panel-bg border-t-2 border-t-gold text-xs font-mono text-white">
                  <Code2 size={12} className="text-gold" />
                  <span>solution.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'cpp' ? 'cpp' : 'js'}</span>
                </div>
              </div>

              <div className="text-[10px] font-mono text-gray-500 flex items-center gap-3">
                <span className="text-[#00ffcc] font-bold">
                  {selectedProblem ? selectedProblem.title : 'NO QUESTION SELECTED'}
                </span>
              </div>
            </div>

            <div className="flex-1 relative w-full h-full min-h-[380px]">
              <Editor
                height="100%"
                language={selectedLanguage}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  fontSize: 13,
                  fontFamily: 'Fira Code, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  lineNumbers: 'on',
                  padding: { top: 12, bottom: 12 }
                }}
              />
            </div>
          </div>
        </section>

        {/* ================= RIGHT SIDE: OPPONENT HUD & TERMINAL KILL FEED (5 COLS) ================= */}
        <section className="lg:col-span-5 flex flex-col gap-4 min-h-0 overflow-y-auto custom-scrollbar">
          
          <div className="bg-iron-gray border border-steel-border p-4 clip-steel-widget flex flex-col gap-4 relative">
            <div className="flex items-center justify-between border-b border-steel-border/60 pb-2">
              <div className="flex items-center gap-2">
                <Shield className="text-red-500 w-4.5 h-4.5" />
                <h3 className="font-military text-sm text-white tracking-widest">COMBAT HEALTH &amp; OPPONENT HUD</h3>
              </div>
              <span className="text-[9px] font-mono text-green-400 animate-pulse">
                {matchStarted ? '1V1 LIVE DUEL' : 'AWAITING MATCH ROOM'}
              </span>
            </div>

            {/* PLAYER 1 (YOU) */}
            <div className="p-3 bg-black/40 border border-slate-800 clip-steel-sm">
              <div className="flex justify-between items-center text-xs font-military mb-1.5">
                <span className="text-white font-bold flex items-center gap-1.5">
                  {user?.username || 'GHOST_CODER'} (YOU)
                </span>
                <span className="text-gold font-mono text-[11px] font-bold">
                  {userHp} HP | {userTestsPassed}/10 TESTS
                </span>
              </div>
              <div className="w-full h-3 bg-black border border-slate-800 rounded-sm overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-500 ${
                    userHp >= 70 ? 'bg-green-500' : userHp >= 40 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
                  }`}
                  style={{ width: `${userHp}%` }}
                />
              </div>
            </div>

            {/* PLAYER 2 (OPPONENT / TARGET) */}
            <div className="p-3 bg-black/40 border border-slate-800 clip-steel-sm">
              <div className="flex justify-between items-center text-xs font-military mb-1.5">
                <div className="flex items-center gap-2">
                  <img src={opponentProfile.avatar} alt="Opponent Avatar" className="w-5 h-5 rounded-full border border-[#00ffcc]" />
                  <span className={`font-bold ${opponentProfile.username === 'AWAITING TARGET...' ? 'text-gray-500 animate-pulse' : 'text-gray-300'}`}>
                    {opponentProfile.username}
                  </span>
                </div>
                <span className="text-red-400 font-mono text-[11px] font-bold">
                  {opponentHp} HP | {opponentTestsPassed}/10 TESTS
                </span>
              </div>

              <div className="w-full h-3 bg-black border border-slate-800 rounded-sm overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-500 ${
                    opponentHp >= 70 ? 'bg-green-500' : opponentHp >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${opponentHp}%` }}
                />
              </div>
            </div>
          </div>

          {/* KILL FEED */}
          <div className="bg-iron-gray border border-steel-border p-4 flex-1 min-h-[220px] flex flex-col clip-steel-widget">
            <div className="flex items-center justify-between border-b border-steel-border/60 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="text-[#00ffcc] w-4.5 h-4.5" />
                <h3 className="font-military text-sm text-white tracking-widest">TACTICAL COMBAT KILL FEED</h3>
              </div>
              
              <button 
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="px-3 py-1 bg-[#00ffcc] hover:bg-[#00cca3] text-black font-military text-xs font-bold tracking-widest clip-steel-sm transition-colors flex items-center gap-1.5 border-none cursor-pointer"
              >
                {isRunningTests ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} fill="black" />}
                <span>RUN TESTS</span>
              </button>
            </div>

            <div className="flex-1 bg-black/50 border border-slate-900 p-3 overflow-y-auto custom-scrollbar font-mono text-[10px] leading-relaxed text-gray-300">
              {terminalLogs.map((log, index) => (
                <div key={index} className={`mb-1.5 ${log.type === 'success' ? 'text-[#00ffcc] font-bold' : log.type === 'danger' ? 'text-red-400 font-bold' : log.type === 'warning' ? 'text-gold' : 'text-gray-400'}`}>
                  {log.text}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ================= MODALS & DRAWERS ================= */}

      {/* 1. QUESTION SELECTION MODAL */}
      {showQuestionModal && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={() => setShowQuestionModal(false)}>
          <div className="max-w-xl w-full bg-[#121520] border-2 border-[#facc15] p-6 clip-steel-card shadow-[0_0_40px_rgba(250,204,21,0.25)] relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="font-military text-2xl text-white font-bold tracking-wider">
                STEP 1: SELECT MATCH QUESTION
              </h3>
              <button onClick={() => setShowQuestionModal(false)} className="text-gray-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar mb-4">
              {availableProblems.map((prob) => (
                <div
                  key={prob._id || prob.title}
                  onClick={() => handleConfirmQuestion(prob)}
                  className={`p-3.5 bg-black/50 border clip-steel-sm cursor-pointer transition-all flex items-center justify-between ${
                    selectedProblem?.title === prob.title ? 'border-[#00ffcc] bg-[#00ffcc]/10' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div>
                    <h4 className="font-military text-base text-white font-bold">{prob.title}</h4>
                    <span className="font-mono text-[10px] text-gray-400">{prob.difficulty} | {prob.tags ? prob.tags.join(', ') : 'DSA'}</span>
                  </div>
                  <button className="btn-tactical-cyan px-4 py-1.5 text-xs clip-angular-btn">
                    SELECT
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button onClick={() => setShowQuestionModal(false)} className="btn-tactical-yellow px-6 py-2 text-xs clip-angular-btn">
                DONE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. GITHUB TARGET LOOKUP DRAWER */}
      {showInviteDrawer && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={() => setShowInviteDrawer(false)}>
          <div className="max-w-md w-full bg-[#121520] border-2 border-[#00ffcc] p-6 clip-steel-card shadow-[0_0_40px_rgba(0,255,204,0.3)] relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <UserCheck size={20} className="text-[#00ffcc]" />
                <h3 className="font-military text-xl text-white font-bold tracking-wider">
                  INVITE GITHUB OPPONENT
                </h3>
              </div>
              <button onClick={() => setShowInviteDrawer(false)} className="text-gray-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleGithubSearch} className="flex flex-col gap-3 mb-6">
              <label className="font-mono text-xs text-gray-400 uppercase block">ENTER GITHUB USERNAME OR PROFILE URL:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={githubInput}
                  onChange={(e) => setGithubInput(e.target.value)}
                  placeholder="e.g. octocat or https://github.com/octocat"
                  className="flex-1 bg-black/60 border border-white/15 focus:border-[#00ffcc] text-xs font-mono text-white p-3 rounded outline-none"
                />
                <button type="submit" disabled={isSearchingGithub} className="btn-tactical-cyan px-4 py-2 text-xs clip-angular-btn">
                  {isSearchingGithub ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                </button>
              </div>
              {githubError && <span className="font-mono text-xs text-red-400">{githubError}</span>}
            </form>

            {githubTarget && (
              <div className="bg-black/60 border border-[#00ffcc]/40 p-4 clip-steel-sm flex flex-col gap-4 text-left">
                <div className="flex items-center gap-2 border-b border-[#00ffcc]/30 pb-2">
                  <span className="w-2 h-2 bg-[#00ffcc] rounded-full animate-ping" />
                  <span className="font-military text-xs text-[#00ffcc] font-bold tracking-widest uppercase">
                    TARGET ACQUIRED // PROFILE VERIFIED
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <img src={githubTarget.avatarUrl} alt="Target Avatar" className="w-16 h-16 rounded-full border-2 border-[#00ffcc] object-cover" />
                  <div>
                    <h4 className="font-military text-xl text-white font-bold">{githubTarget.name}</h4>
                    <a href={githubTarget.githubUrl} target="_blank" rel="noreferrer" className="font-mono text-xs text-[#00ffcc] hover:underline flex items-center gap-1">
                      @{githubTarget.username} <ExternalLink size={12} />
                    </a>
                    <p className="font-mono text-[10px] text-gray-400 mt-1 line-clamp-2">{githubTarget.bio}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-300 bg-white/5 p-2 rounded">
                  <div>PUBLIC REPOS: <strong className="text-white">{githubTarget.publicRepos}</strong></div>
                  <div>FOLLOWERS: <strong className="text-white">{githubTarget.followers}</strong></div>
                </div>

                <button
                  onClick={() => {
                    setOpponentProfile({
                      username: githubTarget.username,
                      avatar: githubTarget.avatarUrl
                    });
                    setShowInviteDrawer(false);
                    handleCopyMatchLink();
                  }}
                  className="w-full btn-tactical-yellow py-3 text-xs clip-angular-btn text-black font-bold"
                >
                  SEND TACTICAL INVITE &amp; LOCK MATCH
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. REAL-TIME BATTLE CHAT & QUICK RADIO DRAWER */}
      <BattleChat
        socket={socket}
        matchId={matchId}
        currentUser={user}
        onNewKillfeedLog={(logText) => {
          setTerminalLogs((prev) => [
            ...prev,
            { type: 'info', text: logText }
          ]);
        }}
      />
    </div>
  );
}
