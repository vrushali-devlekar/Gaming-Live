import videoCyberpunk from '../assets/video_cyberpunk.png';
import videoPubg from '../assets/video_pubg.png';
import videoEgypt from '../assets/video_egypt.png';
import nfsPayback from '../assets/nfs_payback.png';
import hero from '../assets/hero.png';

export const THEMES = [
  {
    id: 'cyberpunk',
    name: 'CYBERPUNK NEON',
    category: 'SPECIAL OPERATIONS',
    image: videoCyberpunk,
    desc: 'Neon Tokyo cybernetic layout. Glowing cyan and magenta lasers with digital grid interfaces and synthwave vibe.',
    size: '12.4 MB',
    accentColor: '#00f0ff',
    accentHover: '#00b8c4',
    accentGlow: 'rgba(0, 240, 255, 0.45)',
    editorBg: '#0b0c10',
    containerBg: '#0c0d12',
    secondaryColor: '#ff007f',
    secondaryGlow: 'rgba(255, 0, 127, 0.45)',
    gridColor: 'rgba(6, 182, 212, 0.04)',
    panelBg: '#151722',
    panelBorder: '#2d3142',
    textColor: '#e2e8f0',
    musicTitle: 'SYNTHWAVE CYBERPUNK LOBBY',
    musicArtist: 'DJ KO-DER ft. ANTIGRAVITY'
  },
  {
    id: 'erangel',
    name: 'ERANGEL MILITARY',
    category: 'CLASSIC THEMES',
    image: videoPubg,
    desc: 'Tactical forest camouflage setup. Deep army olive greens, weathered brass accents, and rugged steel plating.',
    size: '18.2 MB',
    accentColor: '#fb923c', // Orange drop package highlight
    accentHover: '#ea580c',
    accentGlow: 'rgba(251, 146, 60, 0.45)',
    editorBg: '#11140e',
    containerBg: '#090b07',
    secondaryColor: '#84cc16', // Forest green
    secondaryGlow: 'rgba(132, 204, 22, 0.35)',
    gridColor: 'rgba(132, 204, 22, 0.04)',
    panelBg: '#1b2016',
    panelBorder: '#37412c',
    textColor: '#f1f5f9',
    musicTitle: 'ERANGEL ENCOUNTER OPERA',
    musicArtist: 'BATTLEGROUNDS ORCHESTRA'
  },
  {
    id: 'miramar',
    name: 'MIRAMAR OUTLAW',
    category: 'CLASSIC THEMES',
    image: videoEgypt,
    desc: 'Sunburnt canyon wasteland. Terracotta desert clay, dust-blown orange sand, and industrial rusted iron sheets.',
    size: '15.6 MB',
    accentColor: '#fbbf24', // Desert yellow
    accentHover: '#d97706',
    accentGlow: 'rgba(251, 191, 36, 0.45)',
    editorBg: '#181410',
    containerBg: '#0e0c09',
    secondaryColor: '#f97316', // Amber orange
    secondaryGlow: 'rgba(249, 115, 22, 0.35)',
    gridColor: 'rgba(249, 115, 22, 0.03)',
    panelBg: '#221c16',
    panelBorder: '#45382b',
    textColor: '#fafaf9',
    musicTitle: 'DESERT OUTLAW GUITARS',
    musicArtist: 'WASTELAND STRUMMERS'
  },
  {
    id: 'vikendi',
    name: 'VIKENDI BLIZZARD',
    category: 'CLASSIC THEMES',
    image: hero,
    desc: 'Frozen sub-zero tundra. Sleek glacial ice cyan, heavy slate gray plates, and glowing aurora blue highlights.',
    size: '22.1 MB',
    accentColor: '#38bdf8', // Frost blue
    accentHover: '#0284c7',
    accentGlow: 'rgba(56, 189, 248, 0.45)',
    editorBg: '#0e131c',
    containerBg: '#090c11',
    secondaryColor: '#22d3ee', // Frost cyan
    secondaryGlow: 'rgba(34, 211, 238, 0.35)',
    gridColor: 'rgba(56, 189, 248, 0.05)',
    panelBg: '#161f2c',
    panelBorder: '#2e3e55',
    textColor: '#f8fafc',
    musicTitle: 'VIKENDI ICE SLATE PIANO',
    musicArtist: 'AURORA MUSIC CHILL'
  },
  {
    id: 'sanhok',
    name: 'SANHOK JUNGLE',
    category: 'CLASSIC THEMES',
    image: nfsPayback,
    desc: 'Ancient temple overgrown ruins. Deep mossy emerald shade, damp stone gray walls, and bright gold relic highlights.',
    size: '14.9 MB',
    accentColor: '#10b981', // Moss green
    accentHover: '#059669',
    accentGlow: 'rgba(16, 185, 129, 0.45)',
    editorBg: '#0b1410',
    containerBg: '#060c09',
    secondaryColor: '#facc15', // Gold
    secondaryGlow: 'rgba(250, 204, 21, 0.35)',
    gridColor: 'rgba(16, 185, 129, 0.04)',
    panelBg: '#12251a',
    panelBorder: '#254a34',
    textColor: '#f4fbf7',
    musicTitle: 'SANHOK ECO TEMPLE CHANTS',
    musicArtist: 'RAINFOREST RHYTHMS'
  }
];

export const themeService = {
  getCurrentTheme() {
    const savedId = localStorage.getItem('gaming_live_code_theme') || 'cyberpunk';
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
      return list ? JSON.parse(list) : ['cyberpunk'];
    } catch (e) {
      return ['cyberpunk'];
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
