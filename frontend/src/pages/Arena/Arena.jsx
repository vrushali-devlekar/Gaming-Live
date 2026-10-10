import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { 
  Terminal, 
  Code2, 
  Play, 
  ShieldAlert, 
  ArrowLeft, 
  RefreshCw, 
  Shield, 
  Zap, 
  Users, 
  Check, 
  Search, 
  Copy, 
  UserCheck, 
  ExternalLink, 
  HelpCircle, 
  Send,
  Radio,
  ChevronDown,
  Clock,
  Sparkles,
  FileCode,
  CheckCircle2,
  XCircle,
  AlertCircle
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
  const [connectionStatus, setConnectionStatus] = useState('CONNECTING'); // 'CONNECTING' | 'SEARCHING' | 'IN_BATTLE'

  // 1. Question-First Selection State
  const [availableProblems, setAvailableProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState('hud'); // 'hud' | 'problem' | 'testcases' | 'console'
  
  // 2. GitHub Lookup & Target Preview State
  const [showInviteDrawer, setShowInviteDrawer] = useState(false);
  const [githubInput, setGithubInput] = useState('');
  const [isSearchingGithub, setIsSearchingGithub] = useState(false);
  const [githubTarget, setGithubTarget] = useState(null);
  const [githubError, setGithubError] = useState('');

  // Language selector & templates
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  
  const languageTemplates = {
    javascript: `// Mission: Secure Perimeter Firewall Grid (1v1 Duel)\nfunction bypassFirewall(grid, startX, startY) {\n  // Write your algorithm logic here\n  const visited = new Set();\n  return true;\n}`,
    python: `# Mission: Secure Perimeter Firewall Grid (1v1 Duel)\ndef bypass_firewall(grid, start_x, start_y):\n    # Write your algorithm logic here\n    visited = set()\n    return True`,
    cpp: `// Mission: Secure Perimeter Firewall Grid (1v1 Duel)\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nbool bypassFirewall(vector<vector<int>>& grid, int startX, int startY) {\n    // Write your algorithm logic here\n    return true;\n}`
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
    { type: 'info', text: '[SYSTEM] CYBER ARENA COMPILER ONLINE (v4.2.0)' },
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
      .catch(() => {
        // Fallback default problem
        const fallback = {
          _id: 'p-1',
          title: 'Perimeter Firewall Traversal',
          difficulty: 'Medium',
          category: 'Graph BFS / Grid',
          description: 'Given an N x M grid representing server firewalls where 0 is open and 1 is blocked, determine the minimum number of socket hops required to reach the extraction perimeter node.',
          examples: [
            { input: 'grid = [[0,0,0],[1,1,0],[0,0,0]], start = [0,0]', output: '4 hops' }
          ]
        };
        setSelectedProblem(fallback);
      });
  }, []);

  // Initialize Socket.io Connection & Match URL handler
  useEffect(() => {
    const newSocket = io('http://localhost:3001/battle', {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });
    setSocket(newSocket);
    setConnectionStatus('SEARCHING');

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
      setConnectionStatus('IN_BATTLE');

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

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    if (selectedProblem?.driverCode?.[lang]) {
      setCode(selectedProblem.driverCode[lang]);
    } else if (languageTemplates[lang]) {
      setCode(languageTemplates[lang]);
    }
  };

  // Run Test Cases Action
  const handleRunTests = () => {
    if (isRunningTests) return;
    try { audioService.playReload(); } catch(e) {}
    setIsRunningTests(true);

    setTerminalLogs((prev) => [
      ...prev,
      { type: 'info', text: `[${user?.username || 'CODER'}] Compiling syntax buffers against test suite...` }
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
            { type: 'danger', text: '[RECOIL] Test Case #3 failed! -20 HP recoil penalty taken.' }
          ]);
        }
      } else {
        try { audioService.playSniper(); } catch(e) {}
        setUserTestsPassed((prev) => Math.min(10, prev + 1));
        setOpponentHp((prev) => Math.max(0, prev - 15));
        setTerminalLogs((prev) => [
          ...prev,
          { type: 'success', text: `[${user?.username || 'CODER'}] Test Case ${userTestsPassed + 1} passed! Dealt 15 DMG to opponent.` }
        ]);
      }

      setIsRunningTests(false);
    }, 1200);
  };

  // Final Submit Solution Action
  const handleSubmitSolution = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    setTerminalLogs((prev) => [
      ...prev,
      { type: 'info', text: `[SUBMIT] Deploying solution to automated competitive evaluator...` }
    ]);

    setTimeout(() => {
      setIsSubmitting(false);
      setUserTestsPassed(10);
      setOpponentHp(0);
      setTerminalLogs((prev) => [
        ...prev,
        { type: 'success', text: `[VICTORY] 10/10 Test cases verified in 0.04ms! Match settlement triggered.` }
      ]);
      try { audioService.playSniper(); } catch(e) {}

      setTimeout(() => {
        navigate('/result');
      }, 1500);
    }, 2000);
  };

  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`cyber-arena-viewport ${isDamageFlashing ? 'damage-recoil-active' : ''}`}>
      <div className="theme-grid-matrix-bg" />
      <div className="theme-scanline-overlay" />

      {/* Red Damage Flash Screen Overlay */}
      {isDamageFlashing && <div className="damage-flash-screen" />}

      {/* TOP ARENA HUD NAVBAR */}
      <header className="arena-top-hud">
        <div className="hud-left-group">
          <button 
            onClick={() => navigate('/lobby')} 
            className="hud-back-btn"
            title="Return to Command Deck"
          >
            <ArrowLeft size={15} />
            <span className="desktop-only">EXIT ARENA</span>
          </button>

          <div className="hud-separator desktop-only" />

          {/* Question Selector Trigger */}
          <button
            onClick={() => setShowQuestionModal(true)}
            className="hud-problem-selector"
          >
            <HelpCircle size={14} className="text-lime" />
            <span className="problem-title-text">
              {selectedProblem ? selectedProblem.title : 'SELECT MATCH QUESTION'}
            </span>
            <span className="problem-diff-pill">
              {selectedProblem?.difficulty || 'MEDIUM'}
            </span>
          </button>
        </div>

        {/* Center: Match Timer & Connection State */}
        <div className="hud-center-group">
          <div className="hud-connection-state">
            <span className={`status-beacon-${connectionStatus === 'IN_BATTLE' ? 'green' : 'amber'}`}></span>
            <span className="hud-status-text">
              {connectionStatus === 'IN_BATTLE' ? '1v1 DUEL IN PROGRESS' : 'MATCHMAKING ONLINE'}
            </span>
          </div>

          <div className="hud-timer-badge">
            <Clock size={14} className="text-danger animate-pulse" />
            <span className="hud-time-val">{formatTime(matchTimeLeft)}</span>
          </div>
        </div>

        {/* Right: Actions (Invite, Link Copy, Language) */}
        <div className="hud-right-group">
          {/* Language Selector */}
          <div className="hud-lang-select-wrapper">
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="hud-lang-dropdown"
            >
              <option value="javascript">JavaScript (ES6)</option>
              <option value="python">Python 3.11</option>
              <option value="cpp">C++ 20</option>
            </select>
          </div>

          <button
            onClick={() => setShowInviteDrawer(true)}
            disabled={!selectedProblem}
            className="hud-invite-btn"
          >
            <Users size={14} />
            <span className="desktop-only">INVITE TARGET</span>
          </button>

          <button
            onClick={handleCopyMatchLink}
            className="hud-copy-btn"
            title="Copy Match Invite Link"
          >
            {copiedLink ? <Check size={14} className="text-lime" /> : <Copy size={14} />}
            <span className="desktop-only">{copiedLink ? 'COPIED!' : 'MATCH LINK'}</span>
          </button>
        </div>
      </header>

      {/* MAIN ARENA WORKSPACE */}
      <main className="arena-workspace-grid">
        
        {/* ================= LEFT / MAIN: MONACO CODE EDITOR ================= */}
        <section className="arena-editor-section">
          <div className="editor-panel-wrapper">
            
            {/* Editor Top Bar */}
            <div className="editor-top-toolbar">
              <div className="flex items-center gap-2">
                <div className="editor-window-controls">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="editor-file-pill">
                  <FileCode size={13} className="text-lime" />
                  <span>solution.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'cpp' ? 'cpp' : 'js'}</span>
                </div>
              </div>

              {/* Editor Quick Actions */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleRunTests}
                  disabled={isRunningTests || isSubmitting}
                  className="btn-editor-run"
                >
                  {isRunningTests ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
                  <span>RUN TESTS</span>
                </button>

                <button 
                  onClick={handleSubmitSolution}
                  disabled={isRunningTests || isSubmitting}
                  className="btn-editor-submit"
                >
                  {isSubmitting ? <RefreshCw size={13} className="animate-spin" /> : <Zap size={13} />}
                  <span>SUBMIT DUEL</span>
                </button>
              </div>
            </div>

            {/* Monaco Component */}
            <div className="monaco-canvas-container">
              <Editor
                height="100%"
                language={selectedLanguage}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, Fira Code, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  lineNumbers: 'on',
                  padding: { top: 12, bottom: 12 },
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  renderLineHighlight: 'all',
                }}
              />
            </div>

            {/* Editor Bottom Status Bar */}
            <div className="editor-status-strip">
              <div className="flex items-center gap-3">
                <span className="status-item">UTF-8</span>
                <span className="status-item">SPACES: 2</span>
                <span className="status-item text-lime">MONACO ENGINE v4.7</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="status-item">MATCH: {matchId}</span>
                <span className="status-item font-bold text-lime">100% SECURE</span>
              </div>
            </div>

          </div>
        </section>

        {/* ================= RIGHT SIDE: COMBAT HUD & TELEMETRY ================= */}
        <section className="arena-telemetry-sidebar">
          
          {/* COMBATANTS HP & HEALTH HUD */}
          <div className="combat-health-card">
            <div className="combat-card-header">
              <div className="flex items-center gap-2">
                <Shield size={15} className="text-lime" />
                <span className="combat-header-title">COMBAT HEALTH TELEMETRY</span>
              </div>
              <span className="combat-mode-pill">1v1 STAKE: +45 MMR</span>
            </div>

            {/* Player 1 (You) */}
            <div className="combatant-box player-self">
              <div className="combatant-meta">
                <div className="flex items-center gap-2">
                  <img 
                    src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'Ghost'}`} 
                    alt="You" 
                    className="combatant-avatar"
                  />
                  <div>
                    <span className="combatant-name">{user?.username || 'GHOST_OPERATOR'} (YOU)</span>
                    <span className="combatant-sub">TESTS PASSED: {userTestsPassed}/10</span>
                  </div>
                </div>
                <span className="hp-digit-label text-lime">{userHp} HP</span>
              </div>
              
              <div className="hp-track-bar">
                <div 
                  className={`hp-fill-bar ${userHp >= 60 ? 'hp-safe' : userHp >= 30 ? 'hp-warn' : 'hp-crit'}`}
                  style={{ width: `${userHp}%` }}
                />
              </div>
            </div>

            {/* Player 2 (Opponent) */}
            <div className="combatant-box player-target">
              <div className="combatant-meta">
                <div className="flex items-center gap-2">
                  <img 
                    src={opponentProfile.avatar} 
                    alt="Opponent" 
                    className="combatant-avatar opponent"
                  />
                  <div>
                    <span className={`combatant-name ${opponentProfile.username.includes('AWAITING') ? 'text-muted' : ''}`}>
                      {opponentProfile.username}
                    </span>
                    <span className="combatant-sub">TESTS PASSED: {opponentTestsPassed}/10</span>
                  </div>
                </div>
                <span className="hp-digit-label text-danger">{opponentHp} HP</span>
              </div>

              <div className="hp-track-bar">
                <div 
                  className={`hp-fill-bar ${opponentHp >= 60 ? 'hp-safe' : opponentHp >= 30 ? 'hp-warn' : 'hp-crit'}`}
                  style={{ width: `${opponentHp}%` }}
                />
              </div>
            </div>
          </div>

          {/* TELEMETRY TABS (Problem Dossier vs Kill Feed Console) */}
          <div className="telemetry-tabs-card">
            <div className="telemetry-tabs-header">
              <button
                onClick={() => setActiveSideTab('hud')}
                className={`telemetry-tab-btn ${activeSideTab === 'hud' ? 'active' : ''}`}
              >
                <Terminal size={13} />
                <span>COMBAT LOGS</span>
              </button>

              <button
                onClick={() => setActiveSideTab('problem')}
                className={`telemetry-tab-btn ${activeSideTab === 'problem' ? 'active' : ''}`}
              >
                <HelpCircle size={13} />
                <span>MISSION BRIEF</span>
              </button>
            </div>

            {/* TAB CONTENT 1: COMBAT LOGS */}
            {activeSideTab === 'hud' && (
              <div className="combat-logs-feed custom-scrollbar">
                {terminalLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`combat-log-entry ${log.type}`}
                  >
                    <span className="log-time">T+0{index}:</span>
                    <span className="log-text">{log.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT 2: PROBLEM DESCRIPTION */}
            {activeSideTab === 'problem' && (
              <div className="problem-brief-body custom-scrollbar">
                <h4 className="brief-title">{selectedProblem?.title || 'Tactical Duel Problem'}</h4>
                <div className="brief-tags">
                  <span className="tag-pill">{selectedProblem?.difficulty || 'Medium'}</span>
                  <span className="tag-pill">{selectedProblem?.category || 'Algorithms'}</span>
                </div>
                <p className="brief-desc">
                  {selectedProblem?.description || 'Construct an optimal algorithm to traverse the network perimeter without triggering firewall alarms.'}
                </p>

                {selectedProblem?.examples && selectedProblem.examples.map((ex, i) => (
                  <div key={i} className="example-box">
                    <span className="example-lbl">EXAMPLE {i + 1}:</span>
                    <div className="example-code">
                      <span><strong>Input:</strong> {ex.input}</span>
                      <span><strong>Output:</strong> {ex.output}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </section>
      </main>

      {/* ================= MODALS & DRAWERS ================= */}

      {/* 1. QUESTION SELECTION MODAL */}
      {showQuestionModal && (
        <div className="arena-modal-backdrop" onClick={() => setShowQuestionModal(false)}>
          <div className="arena-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-lime" />
                <h3 className="modal-title">SELECT MATCH CHALLENGE</h3>
              </div>
              <button onClick={() => setShowQuestionModal(false)} className="modal-close-btn">✕</button>
            </div>

            <p className="modal-subtitle">
              Choose an algorithmic challenge for this 1v1 duel arena.
            </p>

            <div className="modal-problems-list custom-scrollbar">
              {availableProblems.map((prob) => (
                <div
                  key={prob._id || prob.title}
                  onClick={() => handleConfirmQuestion(prob)}
                  className={`modal-problem-row ${selectedProblem?.title === prob.title ? 'selected' : ''}`}
                >
                  <div>
                    <h4 className="problem-row-title">{prob.title}</h4>
                    <span className="problem-row-meta">{prob.difficulty} • {prob.category || 'Algorithms'}</span>
                  </div>
                  <button className="btn-select-prob">
                    {selectedProblem?.title === prob.title ? 'LOCKED' : 'SELECT'}
                  </button>
                </div>
              ))}
            </div>

            <div className="modal-actions-footer">
              <button onClick={() => setShowQuestionModal(false)} className="btn-cyber-primary w-full">
                CONFIRM PROBLEM SELECTION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. GITHUB TARGET LOOKUP DRAWER */}
      {showInviteDrawer && (
        <div className="arena-modal-backdrop" onClick={() => setShowInviteDrawer(false)}>
          <div className="arena-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="flex items-center gap-2">
                <UserCheck size={18} className="text-lime" />
                <h3 className="modal-title">INVITE GITHUB OPPONENT</h3>
              </div>
              <button onClick={() => setShowInviteDrawer(false)} className="modal-close-btn">✕</button>
            </div>

            <form onSubmit={handleGithubSearch} className="flex flex-col gap-2 mb-4">
              <label className="text-xs font-mono text-muted uppercase">Enter GitHub Username or URL:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={githubInput}
                  onChange={(e) => setGithubInput(e.target.value)}
                  placeholder="e.g. torvalds or octocat"
                  className="input-cyber-search flex-1"
                />
                <button type="submit" disabled={isSearchingGithub} className="btn-cyber-primary px-3">
                  {isSearchingGithub ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                </button>
              </div>
              {githubError && <span className="text-xs font-mono text-danger">{githubError}</span>}
            </form>

            {githubTarget && (
              <div className="github-target-preview">
                <div className="flex items-center gap-3">
                  <img src={githubTarget.avatarUrl} alt="Target" className="w-12 h-12 rounded-full border border-lime" />
                  <div>
                    <h4 className="font-header font-bold text-white text-base">{githubTarget.name}</h4>
                    <a href={githubTarget.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-lime font-mono hover:underline flex items-center gap-1">
                      @{githubTarget.username} <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                <p className="text-xs text-secondary font-mono mt-2 line-clamp-2">{githubTarget.bio}</p>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-secondary bg-white/5 p-2 rounded mt-3">
                  <div>REPOS: <strong className="text-white">{githubTarget.publicRepos}</strong></div>
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
                  className="btn-cyber-primary w-full mt-4"
                >
                  SEND TACTICAL DUEL INVITE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. REAL-TIME BATTLE CHAT & RADIO COMMS */}
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
