import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import CyberGridCanvas from './CyberGridCanvas';
import HoloSphereCanvas from './HoloSphereCanvas';
import IsometricCubeCanvas from './IsometricCubeCanvas';

import { 
  Code2, 
  Search,
  ArrowUpRight,
  Shield, 
  Trophy, 
  Users, 
  Radio, 
  Menu, 
  X, 
  Zap, 
  Check, 
  Crosshair,
  Award,
  ChevronRight,
  ChevronDown,
  Layers,
  Terminal,
  Activity,
  Package,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { themeService } from '../../services/themeService';
import './Landing.css';

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const activeTheme = themeService.getCurrentTheme();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeChallengeFilter, setActiveChallengeFilter] = useState('all');
  const [activeLeaderTab, setActiveLeaderTab] = useState('global');
  const [liveProblems, setLiveProblems] = useState([]);

  // Curated Challenges matching exact screenshot
  const challengesList = [
    {
      id: 'two-sum',
      num: '01',
      title: 'Two Sum Problem',
      category: 'Array • Hashing',
      difficulty: 'Easy',
      diffColor: 'easy',
      xp: '+50 XP',
      languages: ['JS', 'PY', 'C++']
    },
    {
      id: 'valid-parens',
      num: '02',
      title: 'Valid Socket Sequence',
      category: 'Stack • Queue',
      difficulty: 'Medium',
      diffColor: 'medium',
      xp: '+75 XP',
      languages: ['JS', 'PY', 'C++']
    },
    {
      id: 'lru-cache',
      num: '03',
      title: 'LRU Firewall Cache Buffer',
      category: 'String • Buffer',
      difficulty: 'Medium',
      diffColor: 'medium',
      xp: '+75 XP',
      languages: ['JS', 'PY', 'C++']
    },
    {
      id: 'network-delay',
      num: '04',
      title: 'Subnet Delay Time',
      category: 'Graph • Shortest Path',
      difficulty: 'Hard',
      diffColor: 'hard',
      xp: '+120 XP',
      languages: ['JS', 'PY', 'C++']
    },
    {
      id: 'trap-rain',
      num: '05',
      title: 'Trapping Water Grid',
      category: 'Array • Dynamic Programming',
      difficulty: 'Hard',
      diffColor: 'hard',
      xp: '+120 XP',
      languages: ['JS', 'PY', 'C++']
    }
  ];

  // Leaderboard entries matching exact screenshot
  const globalLeaderboard = [
    { rank: '01', name: 'Aryan_Dev', tier: 'Diamond III', winRate: '78%', points: '12,450', avatar: 'Aryan' },
    { rank: '02', name: 'CodeNinja', tier: 'Diamond II', winRate: '72%', points: '11,980', avatar: 'Ninja' },
    { rank: '03', name: 'PixelRogue', tier: 'Diamond II', winRate: '69%', points: '10,870', avatar: 'Pixel' },
    { rank: '04', name: 'DevKunal', tier: 'Platinum I', winRate: '64%', points: '9,430', avatar: 'Kunal' },
    { rank: '05', name: 'ByteQueen', tier: 'Platinum I', winRate: '60%', points: '8,920', avatar: 'Queen' }
  ];

  const clanLeaderboard = [
    { rank: '01', name: 'TASK FORCE 141', tier: 'Elite Clan', winRate: '88%', points: '48,250', avatar: 'TF' },
    { rank: '02', name: 'APEX CODERS', tier: 'Grandmaster', winRate: '84%', points: '42,100', avatar: 'AP' },
    { rank: '03', name: 'STACK BREACHERS', tier: 'Dominator', winRate: '81%', points: '39,800', avatar: 'SB' },
    { rank: '04', name: 'NEO MATRIX', tier: 'Master Clan', winRate: '77%', points: '36,450', avatar: 'NM' },
    { rank: '05', name: 'RECOIL SQUAD', tier: 'Challenger', winRate: '73%', points: '32,190', avatar: 'RS' }
  ];

  const friendsLeaderboard = [
    { rank: '01', name: 'Aryan_Dev', tier: 'Diamond III', winRate: '78%', points: '12,450', avatar: 'Aryan' },
    { rank: '02', name: 'GHOST_OPERATOR', tier: 'Diamond I', winRate: '75%', points: '11,200', avatar: 'Ghost' },
    { rank: '03', name: 'NEON_VIPER', tier: 'Platinum II', winRate: '68%', points: '9,850', avatar: 'Viper' },
    { rank: '04', name: 'CYBER_ACE', tier: 'Platinum III', winRate: '62%', points: '8,400', avatar: 'Ace' }
  ];

  const currentLeaderboard = activeLeaderTab === 'clans' 
    ? clanLeaderboard 
    : activeLeaderTab === 'friends' 
      ? friendsLeaderboard 
      : globalLeaderboard;

  // Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: true,
    });

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  const handleEnterArena = () => {
    if (isLoggedIn) {
      navigate('/arena');
    } else {
      navigate('/login');
    }
  };

  const filteredChallenges = activeChallengeFilter === 'all'
    ? challengesList
    : challengesList.filter(c => c.difficulty.toLowerCase() === activeChallengeFilter);

  return (
    <div className="landing-editorial-root">
      {/* Background Subtle Canvas */}
      <CyberGridCanvas />

      {/* ================= SECTION A — NAVBAR ================= */}
      <header className="cb-navbar">
        <div className="cb-nav-container">
          {/* Brand Logo */}
          <Link to="/" className="cb-brand">
            <div className="cb-brand-icon">
              <Code2 size={20} className="text-[#bef264]" />
            </div>
            <span className="cb-brand-text">CodeBattle</span>
          </Link>

          {/* Nav Links */}
          <nav className="cb-nav-links desktop-only">
            <a href="#experience" className="cb-nav-item">Discover</a>
            <Link to="/arena" className="cb-nav-item">Arena</Link>
            <a href="#challenges" className="cb-nav-item">Challenges</a>
            <a href="#leaderboard" className="cb-nav-item">Leaderboard</a>
            <Link to="/stream" className="cb-nav-item">Live Streams</Link>
          </nav>

          {/* Right Actions */}
          <div className="cb-nav-actions">
            <button className="cb-icon-btn desktop-only" aria-label="Search">
              <Search size={16} />
            </button>
            <Link to="/login" className="cb-sign-in-link desktop-only">
              Sign In
            </Link>
            <button onClick={handleEnterArena} className="cb-btn-enter">
              <span>Enter Arena</span>
              <ArrowUpRight size={14} />
            </button>

            {/* Mobile Nav Toggle */}
            <button 
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="cb-mobile-toggle mobile-only"
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileNavOpen && (
          <div className="cb-mobile-drawer mobile-only">
            <a href="#experience" onClick={() => setMobileNavOpen(false)} className="cb-mobile-link">Discover</a>
            <Link to="/arena" onClick={() => setMobileNavOpen(false)} className="cb-mobile-link">Arena</Link>
            <a href="#challenges" onClick={() => setMobileNavOpen(false)} className="cb-mobile-link">Challenges</a>
            <a href="#leaderboard" onClick={() => setMobileNavOpen(false)} className="cb-mobile-link">Leaderboard</a>
            <Link to="/stream" onClick={() => setMobileNavOpen(false)} className="cb-mobile-link">Live Streams</Link>
            <div className="cb-mobile-actions">
              <Link to="/login" onClick={() => setMobileNavOpen(false)} className="cb-mobile-signin">
                Sign In
              </Link>
              <button onClick={() => { setMobileNavOpen(false); handleEnterArena(); }} className="cb-btn-enter w-full">
                <span>Enter Arena</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ================= SECTION B — EDITORIAL HERO ================= */}
      <section className="cb-hero-section">
        <div className="cb-hero-container">
          
          {/* Hero Left: Editorial Copy */}
          <div className="cb-hero-content">
            <div className="cb-hero-eyebrow">
              <span className="cb-beacon-dot"></span>
              <span>COMPETITIVE PROGRAMMING / REAL-TIME MULTIPLAYER</span>
            </div>

            <h1 className="cb-hero-headline">
              YOUR CODE.<br />
              YOUR COMPETITION.<br />
              <span className="cb-headline-lime">YOUR LEGACY.</span>
            </h1>

            <p className="cb-hero-subtext">
              Not another coding platform. A live arena where developers solve problems, challenge rivals, and earn their place on the leaderboard.
            </p>

            <div className="cb-hero-actions">
              <button onClick={handleEnterArena} className="cb-btn-primary">
                <span>Enter the Arena</span>
                <ArrowUpRight size={15} />
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('challenges');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="cb-btn-secondary"
              >
                <span>Explore Challenges</span>
              </button>
            </div>
          </div>

          {/* Hero Right: Live Battle Preview & HoloSphere */}
          <div className="cb-hero-graphic-wrap">
            <div className="cb-hero-card-window">
              
              {/* Top Match HUD Bar */}
              <div className="cb-hero-match-hud">
                <div className="cb-hud-player left">
                  <div className="cb-avatar-dot green"></div>
                  <div className="cb-health-bar green"><div className="cb-health-fill" style={{ width: '85%' }}></div></div>
                </div>

                <div className="cb-hud-timer">04:12</div>

                <div className="cb-hud-player right">
                  <div className="cb-health-bar red"><div className="cb-health-fill" style={{ width: '45%' }}></div></div>
                  <div className="cb-avatar-dot red"></div>
                </div>
              </div>

              {/* Middle Window Area: Code Tab + Radar Sphere */}
              <div className="cb-hero-window-split">
                
                {/* Left Code Editor Pane */}
                <div className="cb-hero-code-pane">
                  <div className="cb-tab-label">
                    <span className="cb-tab-dot"></span>
                    <span>main.js</span>
                  </div>
                  <pre className="cb-hero-code">
                    <code>
                      <span className="cb-c-kw">function</span> <span className="cb-c-fn">twoSum</span>(nums, target) {'{\n'}
                      {'  '}<span className="cb-c-kw">const</span> map = <span className="cb-c-kw">new</span> Map();{'\n'}
                      {'  '}<span className="cb-c-kw">for</span> (<span className="cb-c-kw">let</span> i = 0; i &lt; nums.length; i++) {'{\n'}
                      {'    '}<span className="cb-c-kw">const</span> complement = target - nums[i];{'\n'}
                      {'    '}<span className="cb-c-kw">if</span> (map.has(complement)) {'{\n'}
                      {'      '}<span className="cb-c-kw">return</span> [map.get(complement), i];{'\n'}
                      {'    }\n'}
                      {'    '}map.set(nums[i], i);{'\n'}
                      {'  }\n'}
                      {'}'}
                    </code>
                  </pre>
                  <div className="cb-cursor-indicator green">
                    <span>Aryan_Dev</span>
                  </div>
                </div>

                {/* Right Radar / 3D Sphere */}
                <div className="cb-hero-sphere-box">
                  <HoloSphereCanvas />
                </div>

              </div>

              {/* Bottom Live Battle Connected Badge */}
              <div className="cb-hero-bottom-status">
                <div className="flex items-center gap-2">
                  <span className="cb-live-indicator-square"></span>
                  <span className="cb-status-title">Live Battle</span>
                </div>
                <span className="cb-status-sub">212 players connected</span>
              </div>

            </div>
          </div>

        </div>

        {/* 3 Bottom Feature Points */}
        <div className="cb-hero-feature-strip">
          <div className="cb-feature-point">
            <span className="cb-feat-dot"></span>
            <div>
              <strong className="cb-feat-title">Real-time Battles</strong>
              <span className="cb-feat-sub">Code together, compete live</span>
            </div>
          </div>

          <div className="cb-feature-point">
            <span className="cb-feat-dot"></span>
            <div>
              <strong className="cb-feat-title">Global Leaderboard</strong>
              <span className="cb-feat-sub">Climb, earn, be seen</span>
            </div>
          </div>

          <div className="cb-feature-point">
            <span className="cb-feat-dot"></span>
            <div>
              <strong className="cb-feat-title">Build Your Identity</strong>
              <span className="cb-feat-sub">Costumes, Equip, Stand out</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION C — THE CODEBATTLE EXPERIENCE ================= */}
      <section className="cb-section" id="experience">
        <div className="cb-container">
          
          {/* Section Heading Row */}
          <div className="cb-section-header-split">
            <div>
              <span className="cb-section-eyebrow">THE CODEBATTLE EXPERIENCE</span>
              <h2 className="cb-section-heading">ENGINEERED FOR<br />SERIOUS CODERS.</h2>
            </div>
            <p className="cb-section-lead-text">
              More than just code. It's a community, a platform, and a competitive arena built for developers who want more.
            </p>
          </div>

          {/* Asymmetric Product Grid */}
          <div className="cb-experience-grid">
            
            {/* Left 65%: Live Battle Arena Large Card */}
            <div className="cb-card-arena-large">
              <div className="cb-arena-mockup-frame">
                
                {/* Battle Top HUD */}
                <div className="cb-arena-mock-hud">
                  <div className="cb-mock-player left">
                    <div className="cb-mock-avatar">
                      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=You" alt="You" />
                    </div>
                    <div className="cb-mock-health-track">
                      <div className="cb-mock-health-fill green" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div className="cb-mock-timer">04:12</div>

                  <div className="cb-mock-player right">
                    <div className="cb-mock-health-track">
                      <div className="cb-mock-health-fill red" style={{ width: '45%' }}></div>
                    </div>
                    <div className="cb-mock-avatar">
                      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Pixel" alt="Rival" />
                    </div>
                  </div>
                </div>

                {/* Workspace Split (Problem & Monaco Code) */}
                <div className="cb-arena-mock-workspace">
                  
                  {/* Left: Problem Panel */}
                  <div className="cb-arena-mock-problem">
                    <div className="cb-mock-panel-tag">Problem</div>
                    <h4 className="cb-mock-problem-title">Two Sum</h4>
                    <p className="cb-mock-problem-desc">
                      Given an array of integers, return indices of the two numbers such that they add up to a target.
                    </p>
                    <div className="cb-mock-constraints">
                      <span className="cb-const-label">Constraints:</span>
                      <ul>
                        <li>2 &le; nums.length &le; 10⁴</li>
                        <li>-10⁹ &le; nums[i] &le; 10⁹</li>
                        <li>2 &le; target &le; 10⁹</li>
                      </ul>
                    </div>
                  </div>

                  {/* Right: Code Monaco Window */}
                  <div className="cb-arena-mock-code">
                    <div className="cb-mock-code-tab">
                      <span className="cb-tab-dot"></span>
                      <span>main.js</span>
                    </div>

                    <pre className="cb-mock-syntax">
                      <code>
                        <span className="cb-c-kw">const</span> <span className="cb-c-fn">twoSum</span> = (nums, target) =&gt; {'{\n'}
                        {'  '}<span className="cb-c-kw">const</span> map = <span className="cb-c-kw">new</span> Map();{'\n'}
                        {'  '}<span className="cb-c-kw">for</span> (<span className="cb-c-kw">let</span> i = 0; i &lt; nums.length; i++) {'{\n'}
                        {'    '}<span className="cb-c-kw">const</span> complement = target - nums[i];{'\n'}
                        {'    '}<span className="cb-c-kw">if</span> (map.has(complement)) {'{\n'}
                        {'      '}<span className="cb-c-kw">return</span> [map.get(complement), i];{'\n'}
                        {'    }\n'}
                        {'    '}map.set(nums[i], i);{'\n'}
                        {'  }\n'}
                        {'}'}
                      </code>
                    </pre>

                    {/* Active Keystroke Cursors */}
                    <div className="cb-arena-cursor green" style={{ top: '48px', left: '160px' }}>
                      <span className="cb-cursor-badge">Aryan_Dev</span>
                    </div>
                    <div className="cb-arena-cursor red" style={{ top: '110px', left: '220px' }}>
                      <span className="cb-cursor-badge">PixelRogue</span>
                    </div>
                  </div>

                </div>

                {/* Bottom Console & Submit Strip */}
                <div className="cb-arena-mock-bottom">
                  <div className="cb-console-tabs">
                    <span className="cb-console-tab active">Console</span>
                    <span className="cb-console-tab">Test Results</span>
                    <span className="cb-test-pass-badge">
                      <Check size={12} />
                      <span>4 tests passed</span>
                      <Zap size={11} className="text-[#bef264]" />
                    </span>
                  </div>

                  <div className="cb-console-actions">
                    <div className="cb-lang-dropdown">
                      <span>Javascript</span>
                      <ChevronDown size={13} />
                    </div>
                    <button className="cb-btn-submit-mock">Submit</button>
                  </div>
                </div>

              </div>

              {/* Arena Card Caption */}
              <div className="cb-card-caption">
                <h3 className="cb-caption-title">Live Battle Arena</h3>
                <p className="cb-caption-desc">
                  Code in real-time with your squad and push your limits together.
                </p>
              </div>
            </div>

            {/* Right 35%: Stacked Cards (Leaderboard, Identity, Locker) */}
            <div className="cb-experience-sidebar">
              
              {/* 1. Leaderboard Mini Card */}
              <div className="cb-side-card">
                <div className="cb-side-card-header">
                  <span className="cb-side-card-title">Global Leaderboard</span>
                  <Link to="/clan" className="cb-side-card-link">View all &gt;</Link>
                </div>
                <div className="cb-side-leader-list">
                  {globalLeaderboard.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="cb-side-leader-row">
                      <div className="flex items-center gap-2.5">
                        <span className="cb-side-rank-num">{item.rank}</span>
                        <div className="cb-side-avatar-circle">
                          <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${item.avatar}`} alt={item.name} />
                        </div>
                        <span className="cb-side-player-name">{item.name}</span>
                      </div>
                      <span className="cb-side-player-points">{item.points}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Your Identity Mini Card */}
              <div className="cb-side-card">
                <div className="cb-side-card-header">
                  <span className="cb-side-card-title">Your Identity</span>
                  <Link to="/analytics" className="cb-side-card-link">Rank &gt;</Link>
                </div>
                <div className="cb-side-identity-body">
                  <div className="flex items-center gap-3">
                    <div className="cb-identity-avatar-frame">
                      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Commander" alt="Operator" />
                    </div>
                    <div className="flex-1">
                      <span className="cb-identity-rank-label">Rank</span>
                      <div className="flex items-center gap-1.5">
                        <Shield size={13} className="text-[#bef264]" />
                        <span className="cb-identity-rank-val">Diamond III</span>
                      </div>
                    </div>
                  </div>
                  <div className="cb-identity-win-bar">
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-muted">Win Rate</span>
                      <span className="text-white font-bold">68%</span>
                    </div>
                    <div className="cb-win-bar-track">
                      <div className="cb-win-bar-fill" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Locker Room Mini Card */}
              <div className="cb-side-card">
                <div className="cb-side-card-header">
                  <span className="cb-side-card-title">Locker Room</span>
                  <Link to="/inventory" className="cb-side-card-link">View &gt;</Link>
                </div>
                <div className="cb-side-locker-items">
                  <div className="cb-locker-preview-box">
                    <Package size={18} className="text-[#bef264]" />
                  </div>
                  <div className="cb-locker-preview-box">
                    <Shield size={18} className="text-[#38bdf8]" />
                  </div>
                  <div className="cb-locker-preview-box">
                    <Zap size={18} className="text-[#f59e0b]" />
                  </div>
                  <div className="cb-locker-preview-box">
                    <Layers size={18} className="text-muted" />
                  </div>
                </div>
              </div>

              {/* Locker Room Caption */}
              <div className="cb-card-caption">
                <h3 className="cb-caption-title">Locker Room</h3>
                <p className="cb-caption-desc">
                  Customise your avatar, themes and show your style.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= SECTION D — HOW IT WORKS ================= */}
      <section className="cb-section cb-bg-subtle" id="how-it-works">
        <div className="cb-container">
          
          <div className="cb-how-header-row">
            <div>
              <span className="cb-section-eyebrow">HOW IT WORKS</span>
              <h2 className="cb-section-heading">
                THINK FAST. CODE CLEAN.<br />
                WIN TOGETHER.
              </h2>
            </div>
            <div className="cb-how-steps-indicator desktop-only">
              <span className="cb-step-dot active">01</span>
              <span className="cb-step-line"></span>
              <span className="cb-step-dot">02</span>
              <span className="cb-step-line"></span>
              <span className="cb-step-dot">03</span>
            </div>
          </div>

          <div className="cb-how-steps-grid">
            
            {/* Step 1 */}
            <div className="cb-how-step-card">
              <div className="cb-how-icon-circle">
                <Crosshair size={22} className="text-[#bef264]" />
              </div>
              <h3 className="cb-how-step-title">Find Your Rival</h3>
              <p className="cb-how-step-desc">
                Join a battle, create a room, or challenge another developer.
              </p>
            </div>

            {/* Connector Arrow */}
            <div className="cb-how-arrow desktop-only">
              <ArrowUpRight size={18} className="rotate-45 text-[#bef264]/40" />
            </div>

            {/* Step 2 */}
            <div className="cb-how-step-card">
              <div className="cb-how-icon-circle">
                <Code2 size={22} className="text-[#bef264]" />
              </div>
              <h3 className="cb-how-step-title">Build Under Pressure</h3>
              <p className="cb-how-step-desc">
                Write and test your solution in a synchronized multiplayer coding arena.
              </p>
            </div>

            {/* Connector Arrow */}
            <div className="cb-how-arrow desktop-only">
              <ArrowUpRight size={18} className="rotate-45 text-[#bef264]/40" />
            </div>

            {/* Step 3 */}
            <div className="cb-how-step-card">
              <div className="cb-how-icon-circle">
                <Trophy size={22} className="text-[#bef264]" />
              </div>
              <h3 className="cb-how-step-title">Earn Your Rank</h3>
              <p className="cb-how-step-desc">
                Track your progress, unlock achievements, and climb the leaderboard.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ================= SECTION E — FEATURED CHALLENGES ================= */}
      <section className="cb-section" id="challenges">
        <div className="cb-container">
          
          <div className="cb-challenges-header">
            <div>
              <span className="cb-section-eyebrow">FEATURED CHALLENGES</span>
              <h2 className="cb-section-heading">THE NEXT MOVE IS YOURS.</h2>
              <p className="cb-section-lead-text">
                Every challenge is an opportunity to prove what you're made of.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="cb-filter-pills">
              {['all', 'easy', 'medium', 'hard'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveChallengeFilter(filter)}
                  className={`cb-filter-pill-btn ${activeChallengeFilter === filter ? 'active' : ''}`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Challenge Rows Table */}
          <div className="cb-challenges-table">
            {filteredChallenges.map((item) => (
              <div key={item.id} className="cb-challenge-row">
                <span className="cb-ch-num">{item.num}</span>

                <div className="cb-ch-info">
                  <h4 className="cb-ch-title">{item.title}</h4>
                  <span className="cb-ch-category">{item.category}</span>
                </div>

                <div className="cb-ch-diff">
                  <span className={`cb-diff-badge ${item.diffColor}`}>
                    {item.difficulty}
                  </span>
                </div>

                <div className="cb-ch-langs">
                  {item.languages.map((lang, idx) => (
                    <span key={idx} className="cb-lang-chip">{lang}</span>
                  ))}
                </div>

                <div className="cb-ch-xp">
                  <span className="cb-xp-val">{item.xp}</span>
                </div>

                <div className="cb-ch-action">
                  <button 
                    onClick={() => navigate(`/arena?problemId=${item.id}`)}
                    className="cb-btn-solve-row"
                  >
                    <span>Solve Challenge</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= SECTION F — LEADERBOARD ================= */}
      <section className="cb-section cb-bg-subtle" id="leaderboard">
        <div className="cb-container">
          
          <div className="cb-leaderboard-intro">
            <span className="cb-section-eyebrow">LEADERBOARD</span>
            <h2 className="cb-section-heading">REPUTATION IS EARNED.</h2>
            <p className="cb-section-lead-text">
              Every solution counts. Every victory moves you forward.
            </p>
          </div>

          <div className="cb-leaderboard-split-layout">
            
            {/* Left 65%: Table Card */}
            <div className="cb-leader-table-card">
              {/* Tabs */}
              <div className="cb-leader-tabs">
                <button 
                  onClick={() => setActiveLeaderTab('global')}
                  className={`cb-leader-tab ${activeLeaderTab === 'global' ? 'active' : ''}`}
                >
                  Global
                </button>
                <button 
                  onClick={() => setActiveLeaderTab('clans')}
                  className={`cb-leader-tab ${activeLeaderTab === 'clans' ? 'active' : ''}`}
                >
                  Clans
                </button>
                <button 
                  onClick={() => setActiveLeaderTab('friends')}
                  className={`cb-leader-tab ${activeLeaderTab === 'friends' ? 'active' : ''}`}
                >
                  Friends
                </button>
              </div>

              {/* Table Header */}
              <div className="cb-leader-th-row">
                <span className="cb-th-rank">#</span>
                <span className="cb-th-player">PLAYER</span>
                <span className="cb-th-tier">RANK</span>
                <span className="cb-th-win">WIN RATE</span>
                <span className="cb-th-points">POINTS</span>
              </div>

              {/* Table Rows */}
              <div className="cb-leader-rows-wrap">
                {currentLeaderboard.map((row, idx) => (
                  <div key={idx} className="cb-leader-data-row">
                    <span className="cb-td-rank">{row.rank}</span>

                    <div className="cb-td-player">
                      <div className="cb-player-avatar-small">
                        <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${row.avatar}`} alt={row.name} />
                      </div>
                      <span className="cb-player-name-text">{row.name}</span>
                    </div>

                    <div className="cb-td-tier">
                      <Shield size={12} className="text-[#38bdf8]" />
                      <span>{row.tier}</span>
                    </div>

                    <span className="cb-td-win">{row.winRate}</span>
                    <span className="cb-td-points">{row.points}</span>
                  </div>
                ))}
              </div>

              {/* View All Rankings Link */}
              <div className="cb-leader-card-footer">
                <Link to="/clan" className="cb-view-rankings-btn">
                  <span>View All Rankings</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>

            {/* Right 35%: Radar Graphic & Quote Card */}
            <div className="cb-leader-quote-card">
              <div className="cb-quote-radar-visual">
                <div className="cb-radar-circle outer"></div>
                <div className="cb-radar-circle middle"></div>
                <div className="cb-radar-circle inner"></div>
                <div className="cb-radar-sweep"></div>
                <div className="cb-radar-blip"></div>
              </div>

              <div className="cb-quote-text-wrap">
                <h3 className="cb-quote-title">
                  Higher rank.<br />
                  Bigger challenges.<br />
                  Greater rewards.
                </h3>
                <div className="cb-quote-dash"></div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= SECTION G — JOIN THE ARENA / FINAL CTA ================= */}
      <section className="cb-section">
        <div className="cb-container">
          <div className="cb-final-cta-card">
            
            <div className="cb-cta-left">
              <span className="cb-section-eyebrow text-[#bef264]">JOIN THE ARENA</span>
              <h2 className="cb-cta-heading">
                READY TO MAKE<br />YOUR NEXT MOVE?
              </h2>
              <p className="cb-cta-sub">
                Step into the arena. Challenge your limits. Let your code speak.
              </p>

              <div className="cb-cta-btns">
                <button onClick={handleEnterArena} className="cb-btn-primary">
                  <span>Enter the Arena</span>
                  <ArrowUpRight size={15} />
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('challenges');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="cb-btn-secondary"
                >
                  <span>Explore Challenges</span>
                </button>
              </div>
            </div>

            {/* Right: 3D Wireframe Glowing Isometric Cube */}
            <div className="cb-cta-cube-visual">
              <IsometricCubeCanvas />
            </div>

          </div>
        </div>
      </section>

      {/* ================= SECTION H — FOOTER ================= */}
      <footer className="cb-footer">
        <div className="cb-container">
          
          <div className="cb-footer-top-grid">
            
            {/* Brand column */}
            <div className="cb-footer-brand-col">
              <div className="cb-brand mb-2">
                <div className="cb-brand-icon">
                  <Code2 size={18} className="text-[#bef264]" />
                </div>
                <span className="cb-brand-text">CodeBattle</span>
              </div>
              <p className="cb-footer-tagline">
                Where code meets competition.
              </p>

              {/* Social icons */}
              <div className="cb-social-icons-row">
                <a href="https://discord.com" target="_blank" rel="noreferrer" className="cb-social-icon" aria-label="Discord">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z"/></svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="cb-social-icon" aria-label="GitHub">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="cb-social-icon" aria-label="YouTube">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="cb-social-icon" aria-label="X">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>

            {/* Col 1: Platform */}
            <div className="cb-footer-col">
              <span className="cb-footer-col-title">Platform</span>
              <a href="#experience" className="cb-footer-link">Discover</a>
              <Link to="/arena" className="cb-footer-link">Arena</Link>
              <a href="#challenges" className="cb-footer-link">Challenges</a>
              <a href="#leaderboard" className="cb-footer-link">Leaderboard</a>
            </div>

            {/* Col 2: Community */}
            <div className="cb-footer-col">
              <span className="cb-footer-col-title">Community</span>
              <Link to="/stream" className="cb-footer-link">Live Streams</Link>
              <Link to="/clan" className="cb-footer-link">Clans</Link>
              <Link to="/analytics" className="cb-footer-link">Players</Link>
              <Link to="/theme" className="cb-footer-link">Events</Link>
            </div>

            {/* Col 3: Account */}
            <div className="cb-footer-col">
              <span className="cb-footer-col-title">Account</span>
              <Link to="/login" className="cb-footer-link">Sign In</Link>
              <Link to="/login" className="cb-footer-link">Sign Up</Link>
              <a href="#" className="cb-footer-link">Privacy Policy</a>
              <a href="#" className="cb-footer-link">Terms of Service</a>
            </div>

          </div>

          {/* Bottom copyright & ping */}
          <div className="cb-footer-bottom-row">
            <span className="cb-footer-copy">
              © {new Date().getFullYear()} CodeBattle. Built by developers, for developers.
            </span>
            <span className="cb-footer-ping">
              Ping: 12ms (Optimal)
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
