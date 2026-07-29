import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { 
  Terminal, Code2, Play, Pause, Disc, Volume2, ShieldAlert, Award, 
  ArrowLeft, RefreshCw, Send, Shield, Zap, Flame, Cpu, Eye, Radio, Check
} from 'lucide-react';
import { themeService } from '../../services/themeService';
import { audioService } from '../../services/audioService';
import './Arena.css';

export default function Arena() {
  const navigate = useNavigate();
  const activeTheme = themeService.getCurrentTheme();

  // 1. Language selector & templates
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  
  const languageTemplates = {
    javascript: `// Mission: Secure Perimeter Firewall Grid (1v1 Duel)
// Write an algorithm that finds the shortest secure path avoiding DETECTOR nodes.
function bypassFirewall(grid, startX, startY) {
  const queue = [[startX, startY, []]];
  const visited = new Set();
  
  while (queue.length > 0) {
    const [x, y, path] = queue.shift();
    const key = \`\${x},\${y}\`;
    
    if (grid[y] && grid[y][x] === 'DETECTOR') continue;
    
    if (x === grid[0].length - 1 && y === grid.length - 1) {
      return [...path, [x, y]]; // Secure path compiled!
    }
    
    if (!visited.has(key)) {
      visited.add(key);
      queue.push([x + 1, y, [...path, [x, y]]]);
      queue.push([x, y + 1, [...path, [x, y]]]);
    }
  }
  return null;
}`,
    python: `# Mission: Secure Perimeter Firewall Grid (1v1 Duel)
# Write an algorithm that finds the shortest secure path avoiding DETECTOR nodes.
def bypass_firewall(grid, start_x, start_y):
    queue = [(start_x, start_y, [])]
    visited = set()
    
    while queue:
        x, y, path = queue.pop(0)
        key = f"{x},{y}"
        
        if 0 <= y < len(grid) and 0 <= x < len(grid[0]) and grid[y][x] == 'DETECTOR':
            continue
            
        if x == len(grid[0]) - 1 and y == len(grid) - 1:
            return path + [(x, y)]
            
        if key not in visited:
            visited.add(key)
            queue.append((x + 1, y, path + [(x, y)]))
            queue.append((x, y + 1, path + [(x, y)]))
    return None`,
    cpp: `// Mission: Secure Perimeter Firewall Grid (1v1 Duel)
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

vector<pair<int, int>> bypassFirewall(vector<vector<string>>& grid) {
    // Implement BFS pathfinding algorithm
    return {};
}`,
    java: `// Mission: Secure Perimeter Firewall Grid (1v1 Duel)
import java.util.*;

public class Solution {
    public static List<int[]> bypassFirewall(String[][] grid) {
        // Implement BFS pathfinding algorithm
        return new ArrayList<>();
    }
}`
  };

  const [code, setCode] = useState(languageTemplates.javascript);

  // Switch template when language changes
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setCode(languageTemplates[lang] || languageTemplates.javascript);
  };

  // 2. Combat Health Mechanics (100 HP initial)
  const [userHp, setUserHp] = useState(100);
  const [opponentHp, setOpponentHp] = useState(100);
  const [userTestsPassed, setUserTestsPassed] = useState(7);
  const [opponentTestsPassed, setOpponentTestsPassed] = useState(6);
  const [hasHelmet, setHasHelmet] = useState(false); // Level 3 Helmet Shield
  const [isDamageFlashing, setIsDamageFlashing] = useState(false); // Red damage overlay

  // 3. Air Drop Event Modal State (every 3 mins)
  const [airDropActive, setAirDropActive] = useState(false);
  const [airDropTimeLeft, setAirDropTimeLeft] = useState(30);
  const [selectedAirdropOption, setSelectedAirdropOption] = useState(null);
  const [isSmoked, setIsSmoked] = useState(false); // Smoke Grenade powerup
  const [currentAirdropQ, setCurrentAirdropQ] = useState(0);

  const airdropQuestions = [
    {
      q: "What is the worst-case time complexity of QuickSort?",
      options: ["O(N log N)", "O(N)", "O(N²)", "O(1)"],
      correct: 2
    },
    {
      q: "Which data structure operates on a LIFO (Last-In-First-Out) model?",
      options: ["Queue", "Stack", "Binary Tree", "Linked List"],
      correct: 1
    },
    {
      q: "Which CSS property disables element pointer clicks?",
      options: ["cursor: none", "user-select: none", "pointer-events: none", "display: block"],
      correct: 2
    }
  ];

  // 4. Opponent Real-Time Typing & HUD State
  const [opponentCursor, setOpponentCursor] = useState({ line: 14, col: 8 });
  const [isOpponentTyping, setIsOpponentTyping] = useState(true);

  // 5. Terminal / Kill Feed Logs
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'info', text: '[SYSTEM] COMBAT COMPILER ARENA ONLINE (v2.4.12)' },
    { type: 'info', text: '[MATCH] DUEL INITIALIZED: GHOST_CODER VS NEON_VIPER' },
    { type: 'success', text: '[GHOST_CODER] Headshot on Test Case 1!' },
    { type: 'success', text: '[GHOST_CODER] Headshot on Test Case 2!' },
    { type: 'warning', text: '[SYSTEM] Air Drop deployment countdown active...' }
  ]);

  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchTimeLeft, setMatchTimeLeft] = useState(899);

  // Countdown Match Timer
  useEffect(() => {
    if (matchTimeLeft <= 0) return;
    const timer = setInterval(() => setMatchTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [matchTimeLeft]);

  // Air Drop 3-Minute Interval Loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (!airDropActive) {
        setSelectedAirdropOption(null);
        setCurrentAirdropQ(Math.floor(Math.random() * airdropQuestions.length));
        setAirDropTimeLeft(30);
        setAirDropActive(true);
      }
    }, 180000); // 3 minutes
    return () => clearInterval(interval);
  }, [airDropActive]);

  // Air Drop Countdown Timer
  useEffect(() => {
    if (!airDropActive) return;
    if (airDropTimeLeft <= 0) {
      setAirDropActive(false);
      return;
    }
    const timer = setInterval(() => setAirDropTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [airDropActive, airDropTimeLeft]);

  // Low HP Heartbeat Audio loop
  useEffect(() => {
    if (userHp > 0 && userHp <= 25) {
      audioService.startHeartbeat();
    } else {
      audioService.stopHeartbeat();
    }
    return () => audioService.stopHeartbeat();
  }, [userHp]);

  // Opponent Live Typing Simulator
  useEffect(() => {
    const interval = setInterval(() => {
      const line = Math.floor(Math.random() * 20) + 1;
      const col = Math.floor(Math.random() * 30) + 1;
      setOpponentCursor({ line, col });
      setIsOpponentTyping(Math.random() > 0.3);

      // Opponent score updates
      if (Math.random() > 0.85 && opponentTestsPassed < 10) {
        setOpponentTestsPassed((prev) => prev + 1);
        setTerminalLogs((prevLogs) => [
          ...prevLogs,
          { type: 'warning', text: `[NEON_VIPER] Headshot on Test Case ${opponentTestsPassed + 1}!` }
        ]);
      }
    }, 2800);
    return () => clearInterval(interval);
  }, [opponentTestsPassed]);

  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Run Test Cases Action
  const handleRunTests = () => {
    if (isRunningTests) return;
    audioService.playReload();
    setIsRunningTests(true);

    setTerminalLogs((prev) => [
      ...prev,
      { type: 'info', text: '[GHOST_CODER] Reloading syntax buffers...' }
    ]);

    setTimeout(() => {
      // Randomly simulate pass or fail to demonstrate HP damage mechanics
      const isFailedAttempt = Math.random() > 0.65;

      if (isFailedAttempt) {
        if (hasHelmet) {
          setHasHelmet(false); // Helmet shields penalty!
          setTerminalLogs((prev) => [
            ...prev,
            { type: 'warning', text: '[ARMOR] Level 3 Helmet shielded GHOST_CODER from HP recoil penalty!' }
          ]);
        } else {
          // Trigger Red Damage Flash Overlay & -20 HP loss
          setIsDamageFlashing(true);
          setTimeout(() => setIsDamageFlashing(false), 800);
          setUserHp((prev) => Math.max(0, prev - 20));
          
          setTerminalLogs((prev) => [
            ...prev,
            { type: 'danger', text: '[NEON_VIPER] Counter-attacked! [GHOST_CODER] suffered Recoil damage (-20 HP)!' }
          ]);
        }
      } else {
        audioService.playSniper();
        setUserTestsPassed((prev) => Math.min(10, prev + 1));
        setTerminalLogs((prev) => [
          ...prev,
          { type: 'success', text: `[GHOST_CODER] Headshot on Test Case ${userTestsPassed + 1}! (+10 PTS)` }
        ]);
      }

      setIsRunningTests(false);
    }, 1400);
  };

  // Submit Match Action
  const handleSubmitMatch = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/result');
    }, 2000);
  };

  return (
    <div className={`arena-container font-sans select-none relative ${isDamageFlashing ? 'animate-damage-flash' : ''}`}>
      
      {/* Background Grid & Scanlines */}
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

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
            <span className="font-military text-sm text-red-500 tracking-wider">BGMI DUEL ARENA #A501</span>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-3 bg-black/40 border border-[#2d3142] px-3 py-1 clip-steel-sm">
          <Code2 size={14} className="text-[#00ffcc]" />
          <span className="text-[10px] font-mono text-gray-400 uppercase">LANGUAGE:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-transparent text-xs font-mono text-white font-bold border-none focus:outline-none cursor-pointer"
          >
            <option value="javascript" className="bg-[#121620]">JavaScript (Node.js)</option>
            <option value="python" className="bg-[#121620]">Python (v3.11)</option>
            <option value="cpp" className="bg-[#121620]">C++ (GCC 12)</option>
            <option value="java" className="bg-[#121620]">Java (OpenJDK 17)</option>
          </select>
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
            
            {/* Editor Header Bar */}
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
                  <span>solution.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'java' ? 'java' : 'js'}</span>
                </div>
              </div>

              <div className="text-[10px] font-mono text-gray-500 flex items-center gap-3">
                <span className="flex items-center gap-1 text-[#00ffcc]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] animate-pulse" />
                  MONACO ENGINE (VS-DARK)
                </span>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="flex-1 relative w-full h-full min-h-[380px]">
              
              {/* Smoke Grenade Blind Overlay */}
              {isSmoked && (
                <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-md z-40 flex flex-col items-center justify-center pointer-events-none transition-all duration-300">
                  <span className="font-military text-xl text-[#00ffcc] tracking-widest block mb-2 animate-pulse">SMOKE GRENADE ACTIVE</span>
                  <span className="text-[9px] font-mono text-gray-400 uppercase">Opponent blinded your editor logs for 12s</span>
                </div>
              )}

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
                  padding: { top: 12, bottom: 12 },
                  cursorBlinking: 'smooth',
                  renderLineHighlight: 'all'
                }}
              />
            </div>

            {/* Editor Footer Bar */}
            <div className="bg-black/60 border-t border-steel-border px-4 py-1.5 text-[10px] font-mono text-gray-500 flex justify-between">
              <div className="flex gap-4">
                <span>Ln 14, Col 22</span>
                <span>UTF-8</span>
                <span className="text-gray-400">STATUS: {selectedLanguage.toUpperCase()} READY</span>
              </div>
              <div className="text-[#00ffcc] font-bold flex items-center gap-1">
                <Zap size={10} />
                COMPILER DEPLOYMENT ONLINE
              </div>
            </div>

          </div>
        </section>

        {/* ================= RIGHT SIDE: OPPONENT HUD & TERMINAL KILL FEED (5 COLS) ================= */}
        <section className="lg:col-span-5 flex flex-col gap-4 min-h-0 overflow-y-auto custom-scrollbar">
          
          {/* OPPONENT STATS & COMBAT HEALTH WIDGET */}
          <div className="bg-iron-gray border border-steel-border p-4 clip-steel-widget flex flex-col gap-4 relative">
            <div className="absolute top-0 right-6 w-10 h-[2px] bg-red-500" />
            
            <div className="flex items-center justify-between border-b border-steel-border/60 pb-2">
              <div className="flex items-center gap-2">
                <Shield className="text-red-500 w-4.5 h-4.5" />
                <h3 className="font-military text-sm text-white tracking-widest">COMBAT HEALTH & OPPONENT HUD</h3>
              </div>
              <span className="text-[9px] font-mono text-green-400 animate-pulse">1V1 LIVE DUEL</span>
            </div>

            {/* PLAYER 1 (YOU) HP BAR */}
            <div className="p-3 bg-black/40 border border-slate-800 clip-steel-sm">
              <div className="flex justify-between items-center text-xs font-military mb-1.5">
                <span className="text-white font-bold flex items-center gap-1.5">
                  GHOST_CODER (YOU)
                  {hasHelmet && <Shield size={12} className="text-[#00ffcc] fill-[#00ffcc]/20 animate-pulse" />}
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

            {/* PLAYER 2 (OPPONENT) HP BAR & LIVE TYPING INDICATOR */}
            <div className="p-3 bg-black/40 border border-slate-800 clip-steel-sm">
              <div className="flex justify-between items-center text-xs font-military mb-1.5">
                <span className="text-gray-300 font-bold flex items-center gap-1.5">
                  NEON_VIPER (OPPONENT)
                  {isOpponentTyping && (
                    <span className="text-[9px] font-mono text-[#00ffcc] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] animate-ping" />
                      TYPING...
                    </span>
                  )}
                </span>
                <span className="text-red-400 font-mono text-[11px] font-bold">
                  {opponentHp} HP | {opponentTestsPassed}/10 TESTS
                </span>
              </div>

              {/* Opponent HP bar */}
              <div className="w-full h-3 bg-black border border-slate-800 rounded-sm overflow-hidden flex mb-2">
                <div 
                  className={`h-full transition-all duration-500 ${
                    opponentHp >= 70 ? 'bg-green-500' : opponentHp >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${opponentHp}%` }}
                />
              </div>

              {/* Opponent Live Cursor Buffer */}
              <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 border-t border-slate-900 pt-1.5">
                <span>CURSOR POSITION: LN {opponentCursor.line}, COL {opponentCursor.col}</span>
                <span className="text-gray-400">LATENCY: 24ms</span>
              </div>
            </div>

          </div>

          {/* COMPILER TERMINAL / TACTICAL KILL FEED */}
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
                {isRunningTests ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <Play size={12} fill="black" />
                )}
                <span>RUN TESTS</span>
              </button>
            </div>

            {/* Kill feed log list */}
            <div className="flex-1 bg-black/50 border border-slate-900 p-3 overflow-y-auto custom-scrollbar font-mono text-[10px] leading-relaxed text-gray-300">
              {terminalLogs.map((log, index) => (
                <div 
                  key={index} 
                  className={`mb-1.5 ${
                    log.type === 'success' ? 'text-[#00ffcc] font-bold' :
                    log.type === 'danger' ? 'text-red-400 font-bold' :
                    log.type === 'warning' ? 'text-gold' :
                    'text-gray-400'
                  }`}
                >
                  {log.text}
                </div>
              ))}
              {isRunningTests && (
                <div className="text-[#00ffcc] animate-pulse font-mono">Compiling syntax buffers & running test cases...</div>
              )}
            </div>
          </div>

        </section>

      </main>

      {/* ================= BOTTOM HUD: SUBMIT MATCH BUTTON ================= */}
      <footer className="relative z-10 bg-iron-gray border-t border-steel-border px-6 py-3 flex items-center justify-between">
        <div className="text-[10px] font-mono text-gray-500">
          MATCHMAKING ID: #A501-DUEL | SAFE ZONE STABLE
        </div>

        <button
          onClick={handleSubmitMatch}
          disabled={isSubmitting}
          className="py-3 px-8 bg-gold hover:bg-gold-hover text-black font-military font-black text-lg tracking-wider clip-angular-btn start-match-glow flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border-none"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="animate-spin w-5 h-5" />
              <span>SUBMITTING MATCH...</span>
            </>
          ) : (
            <>
              <Send size={16} fill="black" />
              <span>SUBMIT MATCH</span>
            </>
          )}
        </button>
      </footer>

      {/* Air Drop Mini-Event Modal */}
      {airDropActive && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#0b0e14] border-2 border-[#00ffcc] p-6 text-center clip-steel-widget shadow-[0_0_30px_rgba(0,255,204,0.25)] relative">
            <div className="absolute top-0 right-10 w-8 h-[2px] bg-[#00ffcc]" />
            
            <div className="flex items-center gap-2 justify-center border-b border-[#252e3d] pb-3 mb-4">
              <span className="w-2.5 h-2.5 bg-[#00ffcc] rounded-full animate-ping" />
              <h2 className="font-military text-xl text-[#00ffcc] tracking-widest font-black">AIR DROP HAS LANDED</h2>
            </div>

            <div className="text-[10px] font-mono text-gray-500 mb-4 flex justify-between">
              <span>QUICK 30-SECOND LOGIC PROMPT</span>
              <span className="text-red-500 font-bold">TIME REMAINING: {airDropTimeLeft}s</span>
            </div>

            {selectedAirdropOption === null ? (
              <div className="text-left flex flex-col gap-4">
                <p className="text-white font-mono text-xs leading-relaxed bg-black/40 border border-slate-900 p-3 rounded">
                  {airdropQuestions[currentAirdropQ].q}
                </p>
                
                <div className="flex flex-col gap-2">
                  {airdropQuestions[currentAirdropQ].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (i === airdropQuestions[currentAirdropQ].correct) {
                          setSelectedAirdropOption('correct');
                        } else {
                          setSelectedAirdropOption('incorrect');
                        }
                      }}
                      className="p-3 bg-[#121620] hover:bg-[#1b202e] border border-[#252e3d] text-left text-xs font-mono text-gray-300 hover:text-white rounded transition-colors cursor-pointer"
                    >
                      {i + 1}. {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : selectedAirdropOption === 'correct' ? (
              <div className="flex flex-col gap-4 text-center">
                <div className="w-12 h-12 bg-[#00ffcc]/10 border border-[#00ffcc] text-[#00ffcc] rounded-full flex items-center justify-center mx-auto mb-1">
                  <Shield size={24} />
                </div>
                <h3 className="font-military text-lg text-white tracking-wider">AIR DROP PAYLOAD UNLOCKED!</h3>
                <p className="text-[11px] font-mono text-gray-500 px-2 uppercase">Select your tactical power-up below:</p>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setIsSmoked(true);
                      setTimeout(() => setIsSmoked(false), 12000);
                      setAirDropActive(false);
                      setTerminalLogs((prev) => [
                        ...prev,
                        { type: 'success', text: '[SYSTEM] Smoke Grenade deployed! Opponent terminal blinded for 12s.' }
                      ]);
                    }}
                    className="py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-military text-xs tracking-wider rounded cursor-pointer border-none font-bold"
                  >
                    SMOKE GRENADE (BLIND OPPONENT TERMINAL FOR 12s)
                  </button>
                  <button
                    onClick={() => {
                      setHasHelmet(true);
                      setAirDropActive(false);
                      setTerminalLogs((prev) => [
                        ...prev,
                        { type: 'success', text: '[SYSTEM] Level 3 Helmet equipped! Next HP recoil penalty shielded.' }
                      ]);
                    }}
                    className="py-2.5 bg-[#00ffcc] hover:bg-[#00cca3] text-black font-military text-xs tracking-wider rounded cursor-pointer border-none font-bold"
                  >
                    LEVEL 3 HELMET (SHIELD NEXT HP PENALTY)
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 text-center py-4">
                <p className="text-red-500 font-military text-lg font-black tracking-widest">ACCESS DENIED!</p>
                <p className="text-xs font-mono text-gray-400">Incorrect key verification sequence. Drop self-destructed.</p>
                <button
                  onClick={() => setAirDropActive(false)}
                  className="mt-2 py-2 px-6 bg-slate-800 hover:bg-slate-700 text-white font-military text-xs tracking-wider rounded cursor-pointer border-none"
                >
                  DISMISS
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
