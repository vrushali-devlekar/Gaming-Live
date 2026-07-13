import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Terminal, Code2, Play, Pause, SkipForward, SkipBack, Disc, Volume2, ShieldAlert, Award, ArrowLeft, RefreshCw, Send, Check } from 'lucide-react';
import './Arena.css';

export default function Arena() {
  const navigate = useNavigate();

  // Simulated squad state
  const [squad, setSquad] = useState([
    { id: 'ghost', name: 'GHOST_CODER', cursor: { line: 12, col: 4 }, hp: 80, testsPassed: 8, totalTests: 10, mic: true },
    { id: 'viper', name: 'NEON_VIPER', cursor: { line: 8, col: 14 }, hp: 60, testsPassed: 6, totalTests: 10, mic: false },
    { id: 'ace', name: 'CYBER_ACE', cursor: { line: 17, col: 9 }, hp: 90, testsPassed: 9, totalTests: 10, mic: true },
  ]);

  // Code editor lines state
  const [editorContent, setEditorContent] = useState([
    "// Mission: Secure the Perimeter Firewall Grid",
    "// Implement a bypass route that avoids intrusion detection scanners.",
    "function bypassFirewall(grid, startX, startY) {",
    "  const queue = [[startX, startY, []]];",
    "  const visited = new Set();",
    "  ",
    "  while (queue.length > 0) {",
    "    const [x, y, path] = queue.shift();",
    "    const key = `${x},${y}`;",
    "    ",
    "    if (grid[y] && grid[y][x] === 'DETECTOR') {",
    "      continue; // Triggered alert! Evade coordinate.",
    "    }",
    "    ",
    "    if (x === grid[0].length - 1 && y === grid.length - 1) {",
    "      return [...path, [x, y]]; // Secure path compiled!",
    "    }",
    "    ",
    "    if (!visited.has(key)) {",
    "      visited.add(key);",
    "      // Explore valid adjacent coordinates",
    "      queue.push([x + 1, y, [...path, [x, y]]]);",
    "      queue.push([x, y + 1, [...path, [x, y]]]);",
    "    }",
    "  }",
    "  return null; // Perimeter breach failed.",
    "}"
  ]);

  // Spotify/Music state
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);
  const [musicProgress, setMusicProgress] = useState(35);
  const [spotifyVolume, setSpotifyVolume] = useState(60);

  // Time remaining countdown: 14:59 (899 seconds)
  const [timeLeft, setTimeLeft] = useState(899);

  // Terminal output logs state
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'info', text: 'SYSTEM: COLLABORATIVE COMPILER ONLINE (v2.4.12)' },
    { type: 'info', text: 'SQUAD: Connected to [PORT_5005]. Syncing local repository buffers...' },
    { type: 'success', text: 'SYNC: Player GHOST_CODER, NEON_VIPER, CYBER_ACE online.' },
    { type: 'warning', text: 'ALERT: Intruders detected at PORT_22. Perimeter lockdown in 15:00 minutes!' },
    { type: 'info', text: 'Ready for compiler execution.' }
  ]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Submit modal/state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionCompleted, setSubmissionCompleted] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time (e.g. 899 -> 14:59)
  const formatTimeRemaining = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `TIME REMAINING: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulate active collaborator typing cursor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSquad((prevSquad) =>
        prevSquad.map((player) => {
          if (player.id === 'ghost') return player; // User cursor stays static or updates via editor
          
          // Randomly change cursor line/col
          const randomLine = Math.floor(Math.random() * editorContent.length) + 1;
          const randomCol = Math.floor(Math.random() * 30) + 1;
          
          // Small chance to update test case score / HP
          let newHp = player.hp;
          let newTests = player.testsPassed;
          if (Math.random() > 0.85 && player.testsPassed < 10) {
            newTests = player.testsPassed + 1;
            newHp = newTests * 10;
          }

          return {
            ...player,
            cursor: { line: randomLine, col: randomCol },
            hp: newHp,
            testsPassed: newTests
          };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [editorContent.length]);

  // Simulate Spotify progress tracking
  useEffect(() => {
    let musicInterval;
    if (isPlayingMusic) {
      musicInterval = setInterval(() => {
        setMusicProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(musicInterval);
  }, [isPlayingMusic]);

  // Mic toggles handler
  const handleToggleMic = (id) => {
    setSquad((prev) =>
      prev.map((player) =>
        player.id === id ? { ...player, mic: !player.mic } : player
      )
    );
  };

  // Run Test cases logic
  const handleRunTests = () => {
    if (isRunningTests) return;
    setIsRunningTests(true);
    
    // Step 1: Compiling
    setTerminalLogs((prev) => [
      ...prev,
      { type: 'info', text: 'Executing test suite: bypassFirewall_test.spec.js' },
      { type: 'info', text: 'Compiling syntax buffers...' }
    ]);

    setTimeout(() => {
      // Step 2: Running cases
      setTerminalLogs((prev) => [
        ...prev,
        { type: 'info', text: 'Testing Coordinate Grid: 10x10 Matrix...' },
        { type: 'success', text: '✔ TEST 1: Pathfinding security - PASSED' },
        { type: 'success', text: '✔ TEST 2: Detector avoidance - PASSED' },
      ]);
      
      setTimeout(() => {
        // Step 3: Finished
        setTerminalLogs((prev) => [
          ...prev,
          { type: 'success', text: '✔ TEST 3: Performance test (under 50ms) - PASSED' },
          { type: 'success', text: 'COMPILATION SUCCESSFUL. HP Bar replenished.' }
        ]);
        
        // Replenish GHOST_CODER's tests passed
        setSquad((prev) =>
          prev.map((player) =>
            player.id === 'ghost' ? { ...player, hp: 100, testsPassed: 10 } : player
          )
        );
        setIsRunningTests(false);
      }, 1500);
    }, 1500);
  };

  // Submit code logic
  const handleSubmitCode = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionCompleted(true);
    }, 3000);
  };

  return (
    <div className="arena-container font-sans select-none relative">
      {/* Background Matrix Overlay */}
      <div className="arena-grid-matrix"></div>
      <div className="scanlines-overlay"></div>

      {/* Arena Header */}
      <header className="relative z-10 bg-iron-gray border-b border-[#2d3142] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-1.5 text-xs font-military text-gray-400 hover:text-white transition-colors border border-gray-800 hover:border-gray-600 px-3 py-1 bg-black/30 rounded"
          >
            <ArrowLeft size={14} />
            <span>ABANDON MATCH</span>
          </button>
          
          <div className="h-4 w-[2px] bg-gray-800"></div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></span>
            <span className="font-military text-sm text-red-500 tracking-wider">COLLABORATIVE DUEL #A501</span>
          </div>
        </div>

        <div className="bg-black/45 border border-red-950/60 px-4 py-1 flex items-center gap-4 text-xs font-mono text-gray-400">
          <div>
            <span className="text-gray-600 mr-1.5">SERVER:</span>
            <span className="text-white font-semibold">TOKYO_BATTLE_2</span>
          </div>
          <div className="w-[1px] h-3 bg-gray-800"></div>
          <div>
            <span className="text-gray-600 mr-1.5">TEAM SIZE:</span>
            <span className="text-[#FACC15] font-semibold">3 / 3</span>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 min-h-0 overflow-hidden">
        
        {/* ================= LEFT COLUMN: SQUAD STATUS ================= */}
        <section className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1">
          <div className="bg-iron-gray border border-[#2d3142] p-4 flex flex-col justify-between h-full clip-steel-widget relative">
            <div className="absolute top-0 right-4 w-8 h-[2px] bg-cyan-400"></div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-[#2d3142]/60 pb-2">
                <Code2 className="text-cyan-400 w-5 h-5" />
                <h3 className="font-military text-sm text-white tracking-widest">SQUAD DIRECTORY</h3>
              </div>

              {squad.map((player) => (
                <div 
                  key={player.id} 
                  className={`p-3 bg-black/40 border border-[#1f2230] relative clip-steel-sm transition-all duration-300 ${
                    player.id === 'ghost' ? 'border-l-4 border-l-[#FACC15]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {/* Mini Avatar dot */}
                      <span className={`w-2 h-2 rounded-full ${
                        player.id === 'ghost' ? 'bg-[#FACC15]' : player.id === 'viper' ? 'bg-green-500' : 'bg-purple-500'
                      }`}></span>
                      <span className="font-military text-sm text-white font-semibold tracking-wide">
                        {player.name} {player.id === 'ghost' && "(YOU)"}
                      </span>
                    </div>

                    {/* Microphone Toggle Button */}
                    <button 
                      onClick={() => handleToggleMic(player.id)} 
                      className={`w-7 h-7 rounded border flex items-center justify-center transition-all ${
                        player.mic 
                          ? 'bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20' 
                          : 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
                      }`}
                    >
                      {player.mic ? <Mic size={13} /> : <MicOff size={13} />}
                    </button>
                  </div>

                  {/* Active Neon Cursor Position Indicator */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[9px] font-mono text-gray-500">CURSOR BUFFER:</span>
                    <span className="text-[10px] font-mono font-bold text-green-400 tracking-wider">
                      LN {player.cursor.line}, COL {player.cursor.col}
                    </span>
                  </div>

                  {/* HP Bar (Progress Indicator) */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-1">
                      <span>COMPILER HEALTH (HP)</span>
                      <span className="text-[#FACC15] font-semibold">
                        {player.testsPassed} / {player.totalTests} TESTS
                      </span>
                    </div>
                    <div className="w-full h-2 bg-black border border-gray-800 rounded-sm overflow-hidden flex">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          player.hp >= 80 ? 'bg-green-500' : player.hp >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${player.hp}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated Voice Wave activity info */}
            <div className="mt-4 bg-[#0f1016] border border-gray-900 p-2 text-[10px] font-mono text-gray-500 flex items-center justify-between">
              <span>SQUAD RADIO (VOIP)</span>
              <span className="text-green-500 animate-pulse">CH_A ACTIVE</span>
            </div>
          </div>
        </section>

        {/* ================= MIDDLE COLUMN: WORKSPACE CODE EDITOR ================= */}
        <section className="lg:col-span-2 flex flex-col min-h-0">
          <div className="steel-panel border-2 border-[#2d3142] flex-1 flex flex-col clip-steel-widget min-h-0">
            {/* Visual Header Skew Tabs */}
            <div className="flex items-center justify-between bg-black/60 border-b border-[#2d3142] px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/60"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/60"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/60"></span>
                </div>
                <div className="h-4 w-[1px] bg-gray-800 mx-2"></div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#151722] border-t-2 border-t-[#FACC15] text-xs font-mono text-white">
                  <Code2 size={12} className="text-[#FACC15]" />
                  <span>grid_perimeter_secure.js</span>
                </div>
              </div>

              <div className="text-[10px] font-mono text-gray-500 flex items-center gap-3">
                <span className="flex items-center gap-1 text-green-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  LIVE SHARE (3 CODES)
                </span>
              </div>
            </div>

            {/* Code Canvas Mocking VS Code */}
            <div className="flex-1 vscode-editor-mock custom-scrollbar p-4 flex flex-col font-mono text-xs leading-relaxed select-text">
              
              <div className="flex flex-col relative w-full h-full">
                {editorContent.map((line, index) => {
                  const lineNum = index + 1;
                  return (
                    <div key={index} className="flex hover:bg-[#1e2030]/20 py-0.5 relative group">
                      
                      {/* Line Number */}
                      <span className="w-8 select-none text-gray-600 text-right pr-3 font-mono text-[10px]">
                        {lineNum}
                      </span>
                      
                      {/* Code line content */}
                      <pre className="text-gray-300 font-mono whitespace-pre flex-1 relative">
                        
                        {/* Custom syntax coloring mock (simplified) */}
                        {line.startsWith("//") ? (
                          <span className="text-green-600 font-mono italic">{line}</span>
                        ) : line.includes("function") ? (
                          <>
                            <span className="text-blue-400">function</span> <span className="text-yellow-400">bypassFirewall</span>
                            {line.slice(line.indexOf("bypassFirewall") + 14)}
                          </>
                        ) : line.includes("const ") || line.includes("let ") ? (
                          <>
                            <span className="text-blue-400">{line.slice(0, line.indexOf("const ") + 6)}</span>
                            {line.slice(line.indexOf("const ") + 6)}
                          </>
                        ) : line.includes("return") ? (
                          <>
                            <span className="text-purple-400">return</span>
                            {line.slice(line.indexOf("return") + 6)}
                          </>
                        ) : line.includes("if ") || line.includes("while ") ? (
                          <>
                            <span className="text-purple-400">{line.slice(0, line.indexOf("if ") !== -1 ? line.indexOf("if ") + 3 : line.indexOf("while ") + 6)}</span>
                            {line.slice(line.indexOf("if ") !== -1 ? line.indexOf("if ") + 3 : line.indexOf("while ") + 6)}
                          </>
                        ) : (
                          <span>{line}</span>
                        )}

                        {/* Rendering simulated collaborative cursors */}
                        {lineNum === squad[1].cursor.line && (
                          <span 
                            className="collab-cursor cursor-viper"
                            style={{ left: `${squad[1].cursor.col * 7}px` }}
                          >
                            <span className="cursor-tag tag-viper">VIPER</span>
                          </span>
                        )}

                        {lineNum === squad[2].cursor.line && (
                          <span 
                            className="collab-cursor cursor-ace"
                            style={{ left: `${squad[2].cursor.col * 7}px` }}
                          >
                            <span className="cursor-tag tag-ace">ACE</span>
                          </span>
                        )}
                        
                      </pre>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Code status bar details */}
            <div className="bg-black/60 border-t border-[#2d3142] px-4 py-1.5 text-[10px] font-mono text-gray-500 flex justify-between">
              <div className="flex gap-4">
                <span>Ln 14, Col 22</span>
                <span>Spaces: 2</span>
                <span>UTF-8</span>
              </div>
              <div className="text-green-500 font-bold">READY TO DEPLOY</div>
            </div>
          </div>
        </section>

        {/* ================= RIGHT COLUMN: OBJECTIVE INTEL ================= */}
        <section className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          
          {/* TOP BOX: BATTLE MISSION */}
          <div className="bg-iron-gray border border-[#2d3142] p-4 flex-1 min-h-[220px] flex flex-col clip-steel-widget">
            <div className="flex items-center gap-2 border-b border-[#2d3142]/60 pb-2 mb-3">
              <ShieldAlert className="text-[#FACC15] w-4.5 h-4.5 animate-pulse" />
              <h3 className="font-military text-sm text-white tracking-widest">BATTLE MISSION</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 text-xs font-mono leading-relaxed text-gray-300">
              <p className="text-cyan-400 font-bold mb-2">OBJECTIVE: ESCAPE SCANNERS</p>
              <p className="mb-3">
                Intrusion alerts have shut down normal output lines. Write an algorithm that takes a <span className="text-[#FACC15]">grid</span> coordinate grid, finding the shortest secure path from the top-left to bottom-right corner.
              </p>
              <p className="mb-3">
                Your path MUST NOT intersect with coordinates marked as <span className="text-red-500">"DETECTOR"</span>. Return an array of coordinates representing the secure path, or <span className="text-red-500">null</span> if no path exists.
              </p>
              <p className="border-l-2 border-cyan-500 pl-2 text-gray-400 py-1 italic bg-cyan-950/20">
                Tip: Implement Breadth-First Search (BFS) to efficiently compile the shortest coordinates block.
              </p>
            </div>
          </div>

          {/* BOTTOM BOX: COMPILATION TERMINAL */}
          <div className="bg-iron-gray border border-[#2d3142] p-4 h-64 flex flex-col clip-steel-widget">
            <div className="flex items-center justify-between border-b border-[#2d3142]/60 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="text-green-500 w-4.5 h-4.5" />
                <h3 className="font-military text-sm text-white tracking-widest">COMPILER TERMINAL</h3>
              </div>
              
              <button 
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="px-2.5 py-1 bg-green-500 hover:bg-green-400 text-black font-military text-[10px] font-bold tracking-widest clip-steel-sm transition-colors flex items-center gap-1.5"
              >
                {isRunningTests ? (
                  <RefreshCw size={10} className="animate-spin" />
                ) : (
                  <Play size={10} fill="black" />
                )}
                <span>RUN TESTS</span>
              </button>
            </div>

            <div className="flex-1 bg-black/50 border border-gray-900 p-3 overflow-y-auto custom-scrollbar font-mono text-[10px] leading-relaxed text-gray-400">
              {terminalLogs.map((log, index) => (
                <div 
                  key={index} 
                  className={`mb-1.5 ${
                    log.type === 'success' ? 'text-green-400' :
                    log.type === 'warning' ? 'text-[#FACC15]' :
                    'text-gray-400'
                  }`}
                >
                  {log.text}
                </div>
              ))}
              {isRunningTests && (
                <div className="text-cyan-400 animate-pulse font-mono">Running compiler test pipelines...</div>
              )}
            </div>
          </div>

        </section>

      </main>

      {/* ================= BOTTOM HUD: TIMER, SPOTIFY, SUBMIT ================= */}
      <footer className="relative z-10 bg-iron-gray border-t border-[#2d3142] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Count Down Timer */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-red-950/40 border border-red-500/30 clip-steel-sm">
            <span className="font-military text-lg font-black tracking-widest timer-urgency">
              {formatTimeRemaining(timeLeft)}
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-500 hidden md:block">
            MISSION TIMELINE DECREMENT
          </span>
        </div>

        {/* Spotify Playback Widget Overlay */}
        <div className="flex items-center gap-3 bg-[#0c0d12] border border-gray-800 py-1.5 px-4 rounded clip-steel-sm max-w-sm w-full">
          <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center bg-black rounded-full overflow-hidden">
            <Disc className={`w-5 h-5 text-green-500 ${isPlayingMusic ? 'animate-spin-slow' : ''}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center text-[9px] text-gray-500 font-mono">
              <span className="text-green-500 tracking-wider">SPOTIFY LINK</span>
              <span>1:34 / 2:45</span>
            </div>
            <p className="font-military text-xs text-white truncate tracking-wide">
              SYNTHWAVE CYBERPUNK LOBBY
            </p>
            {/* Playback progress bar */}
            <div className="w-full h-[2px] bg-gray-800 mt-1 rounded">
              <div className="h-full bg-green-500" style={{ width: `${musicProgress}%` }}></div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setIsPlayingMusic(!isPlayingMusic)} 
              className="text-gray-400 hover:text-white p-1"
            >
              {isPlayingMusic ? <Pause size={12} /> : <Play size={12} />}
            </button>
            <div className="flex items-center gap-1 text-gray-500">
              <Volume2 size={12} />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={spotifyVolume}
                onChange={(e) => setSpotifyVolume(e.target.value)}
                className="w-12 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500" 
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={handleSubmitCode}
            disabled={isSubmitting}
            className="w-full sm:w-auto py-3 px-8 bg-[#FACC15] hover:bg-[#ebd510] text-black font-military font-black text-xl tracking-wider clip-angular-btn start-match-glow flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="animate-spin w-5 h-5" />
                <span>COMPILING CODE...</span>
              </>
            ) : (
              <>
                <Send size={16} fill="black" />
                <span>SUBMIT CODE</span>
              </>
            )}
          </button>
        </div>

      </footer>

      {/* Simulated Victory Overlay Modal */}
      {submissionCompleted && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="max-w-md w-full bg-iron-gray border-2 border-[#FACC15] p-8 text-center clip-steel-widget shadow-[0_0_50px_rgba(250,204,21,0.3)]">
            <div className="w-16 h-16 bg-[#FACC15] text-black rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Award size={36} />
            </div>

            <h2 className="font-military text-4xl text-[#FACC15] font-black tracking-widest mb-2">
              VICTORY ROYALE!
            </h2>
            <h3 className="font-military text-xl text-white tracking-widest mb-6">
              SQUAD FIREWALL BYPASS COMPLETE
            </h3>

            <div className="bg-black/60 p-4 border border-gray-900 font-mono text-xs text-left text-gray-400 mb-8 rounded">
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span>TIME TO DEPLOY:</span>
                <span className="text-white font-bold">14:59 REMAINING</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span>TEST CASES PASSED:</span>
                <span className="text-green-400 font-bold">10 / 10 (100% SECURED)</span>
              </div>
              <div className="flex justify-between py-1">
                <span>TOTAL RATINGS GAIN:</span>
                <span className="text-[#FACC15] font-bold">+45 BP CODES</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSubmissionCompleted(false);
                navigate('/');
              }}
              className="py-3 px-8 bg-cyan-500 hover:bg-cyan-400 text-black font-military font-bold text-lg tracking-wider clip-steel-sm w-full transition-colors flex items-center justify-center gap-2"
            >
              <Check size={18} />
              <span>RETURN TO LOBBY</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
