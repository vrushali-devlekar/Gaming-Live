import videoCyberpunk from '../assets/video_cyberpunk.png';
import videoPubg from '../assets/video_pubg.png';
import videoEgypt from '../assets/video_egypt.png';
import nfsPayback from '../assets/nfs_payback.png';
import hero from '../assets/hero.png';

export const THEMES = [
  {
    id: 'sanhok',
    code: 'SEC//01',
    name: 'KRONOS PERIMETER',
    category: 'ACTIVE DEPLOYMENT SECTORS',
    domain: 'Arrays, Hashing, Recursion',
    image: nfsPayback,
    desc: 'Deep forest server array facility. Ancient overgrown mossy nodes, damp obsidian stone walls, and high-frequency emerald data pings.',
    size: '14.9 MB',
    accentColor: '#00F5D4',
    accentHover: '#00D6B8',
    accentGlow: 'rgba(0, 245, 212, 0.45)',
    editorBg: '#080B11',
    containerBg: '#080B11',
    secondaryColor: '#F59E0B',
    secondaryGlow: 'rgba(245, 158, 11, 0.35)',
    gridColor: 'rgba(0, 245, 212, 0.04)',
    panelBg: 'rgba(13, 17, 26, 0.85)',
    panelBorder: 'rgba(255, 255, 255, 0.08)',
    textColor: '#F4FBF7',
    musicTitle: 'KRONOS RUNTIME CHANTS',
    musicArtist: 'RAINFOREST RHYTHMS'
  },
  {
    id: 'miramar',
    code: 'SEC//02',
    name: 'DUSTLINE RUNTIME',
    category: 'ACTIVE DEPLOYMENT SECTORS',
    domain: 'Greedy, Two-Pointers, Sorting',
    image: videoEgypt,
    desc: 'Rusted silicon wasteland outpost. Sunburnt terracotta clay, dust-blown orange sand, and industrial iron heat shields.',
    size: '15.6 MB',
    accentColor: '#F59E0B',
    accentHover: '#D97706',
    accentGlow: 'rgba(245, 158, 11, 0.45)',
    editorBg: '#120E0A',
    containerBg: '#0B0806',
    secondaryColor: '#F97316',
    secondaryGlow: 'rgba(249, 115, 22, 0.35)',
    gridColor: 'rgba(249, 115, 22, 0.03)',
    panelBg: 'rgba(18, 14, 10, 0.85)',
    panelBorder: 'rgba(245, 158, 11, 0.15)',
    textColor: '#FAFAF9',
    musicTitle: 'DUSTLINE RUNTIME ACOUSTICS',
    musicArtist: 'WASTELAND STRUMMERS'
  },
  {
    id: 'vikendi',
    code: 'SEC//03',
    name: 'CRYONIC TERMINUS',
    category: 'ACTIVE DEPLOYMENT SECTORS',
    domain: 'Trees, Heaps, Concurrency',
    image: hero,
    desc: 'Glacial sub-zero vault core. Sleek frost blue ice cyan plates, slate gray armor, and glowing aurora sub-zero conduits.',
    size: '22.1 MB',
    accentColor: '#38BDF8',
    accentHover: '#0284C7',
    accentGlow: 'rgba(56, 189, 248, 0.45)',
    editorBg: '#090E17',
    containerBg: '#060A10',
    secondaryColor: '#06B6D4',
    secondaryGlow: 'rgba(6, 182, 212, 0.35)',
    gridColor: 'rgba(56, 189, 248, 0.05)',
    panelBg: 'rgba(10, 16, 26, 0.85)',
    panelBorder: 'rgba(56, 189, 248, 0.15)',
    textColor: '#F8FAFC',
    musicTitle: 'CRYONIC SUB-ZERO SOUNDSCAPE',
    musicArtist: 'AURORA MUSIC CHILL'
  },
  {
    id: 'cyberpunk',
    code: 'SEC//04',
    name: 'NEO-SHIBUYA MATRIX',
    category: 'SPECIAL OPERATIONS',
    domain: 'Graphs, Dynamic Programming',
    image: videoCyberpunk,
    desc: 'High-density neon trench grid. Glowing cyan and magenta laser networks with digital matrix interface overlays.',
    size: '12.4 MB',
    accentColor: '#FF007F',
    accentHover: '#D6006B',
    accentGlow: 'rgba(255, 0, 127, 0.45)',
    editorBg: '#0B0C10',
    containerBg: '#06070B',
    secondaryColor: '#00F5D4',
    secondaryGlow: 'rgba(0, 245, 212, 0.45)',
    gridColor: 'rgba(0, 245, 212, 0.04)',
    panelBg: 'rgba(17, 12, 22, 0.85)',
    panelBorder: 'rgba(255, 0, 127, 0.2)',
    textColor: '#E2E8F0',
    musicTitle: 'NEO-SHIBUYA SYNTHWAVE',
    musicArtist: 'DJ KO-DER ft. ANTIGRAVITY'
  },
  {
    id: 'erangel',
    code: 'SEC//05',
    name: 'FORTRESS COMMAND',
    category: 'SPECIAL OPERATIONS',
    domain: 'Graph Theory, DP, Sliding Window',
    image: videoPubg,
    desc: 'Military command outpost. Deep army tactical green camouflage, brass accents, and reinforced titanium armor plates.',
    size: '18.2 MB',
    accentColor: '#FB923C',
    accentHover: '#EA580C',
    accentGlow: 'rgba(251, 146, 60, 0.45)',
    editorBg: '#0F120D',
    containerBg: '#080A06',
    secondaryColor: '#84CC16',
    secondaryGlow: 'rgba(132, 204, 22, 0.35)',
    gridColor: 'rgba(132, 204, 22, 0.04)',
    panelBg: 'rgba(15, 18, 13, 0.85)',
    panelBorder: 'rgba(251, 146, 60, 0.2)',
    textColor: '#F1F5F9',
    musicTitle: 'FORTRESS COMMAND ORCHESTRA',
    musicArtist: 'BATTLEGROUNDS ORCHESTRA'
  }
];

export const themeService = {
  getCurrentTheme() {
    const savedId = localStorage.getItem('gaming_live_code_theme') || 'sanhok';
    return THEMES.find(t => t.id === savedId) || THEMES[0];
  },

  setCurrentTheme(id) {
    const theme = THEMES.find(t => t.id === id);
    if (theme) {
      localStorage.setItem('gaming_live_code_theme', id);
      this.applyThemeProperties(theme);
    }
    return theme || THEMES[0];
  },

  getDownloadedThemes() {
    try {
      const list = localStorage.getItem('gaming_live_downloaded_themes');
      return list ? JSON.parse(list) : ['sanhok', 'cyberpunk', 'miramar', 'vikendi', 'erangel'];
    } catch (e) {
      return ['sanhok', 'cyberpunk', 'miramar', 'vikendi', 'erangel'];
    }
  },

  downloadTheme(id) {
    const list = this.getDownloadedThemes();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem('gaming_live_downloaded_themes', JSON.stringify(list));
    }
    return list;
  },

  applyThemeProperties(theme) {
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--theme-accent-color', theme.accentColor);
    root.style.setProperty('--theme-accent-hover', theme.accentHover);
    root.style.setProperty('--theme-accent-glow', theme.accentGlow);
    root.style.setProperty('--theme-editor-bg', theme.editorBg);
    root.style.setProperty('--theme-container-bg', theme.containerBg);
    root.style.setProperty('--theme-secondary-color', theme.secondaryColor);
    root.style.setProperty('--theme-secondary-glow', theme.secondaryGlow);
    root.style.setProperty('--theme-grid-color', theme.gridColor);
    root.style.setProperty('--theme-panel-bg', theme.panelBg);
    root.style.setProperty('--theme-panel-border', theme.panelBorder);
    root.style.setProperty('--theme-text-color', theme.textColor);
  }
};
