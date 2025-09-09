// Centralized Color System for Easy Management
// All colors, gradients, and themes are defined here for easy customization

export interface ColorTheme {
  // Core Colors
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  inputBackground: string;
  ring: string;
  
  // Dazai-specific colors
  dazaiBrown: string;
  dazaiBeige: string;
  dazaiCream: string;
  dazaiGold: string;
  dazaiDark: string;
  dazaiMuted: string;
  animeShadow: string;
  
  // Chart colors
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  
  // Sidebar colors
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

export interface GradientTheme {
  // Primary gradients
  heroGradient: string;
  cardGradient: string;
  buttonGradient: string;
  accentGradient: string;
  
  // Background gradients
  backgroundGradient: string;
  sectionGradient: string;
  footerGradient: string;
  
  // Special effects
  glowGradient: string;
  shadowGradient: string;
  animeBorderGradient: string;
  
  // Character-specific gradients
  dazaiGradient: string;
  akutagawaGradient: string;
  atsushiGradient: string;
  chuuyaGradient: string;
  ranpoGradient: string;
  kunikidaGradient: string;
}

// Light Mode Colors
export const lightColors: ColorTheme = {
  // Core Colors
  background: '#f8f6f2',
  foreground: '#2c1810',
  card: '#fafaf8',
  cardForeground: '#2c1810',
  popover: '#ffffff',
  popoverForeground: '#2c1810',
  primary: '#3d2a1a',
  primaryForeground: '#f8f6f2',
  secondary: '#8b7355',
  secondaryForeground: '#f8f6f2',
  muted: '#e8e2d6',
  mutedForeground: '#4a3728',
  accent: '#b8941f',
  accentForeground: '#f8f6f2',
  destructive: '#8b4513',
  destructiveForeground: '#ffffff',
  border: 'rgba(60, 42, 26, 0.2)',
  input: 'transparent',
  inputBackground: '#f0ebe0',
  ring: '#b8941f',
  
  // Dazai-specific colors
  dazaiBrown: '#3d2a1a',
  dazaiBeige: '#8b7355',
  dazaiCream: '#f8f6f2',
  dazaiGold: '#b8941f',
  dazaiDark: '#2c1810',
  dazaiMuted: '#4a3728',
  animeShadow: 'rgba(60, 42, 26, 0.3)',
  
  // Chart colors
  chart1: '#b8941f',
  chart2: '#8b7355',
  chart3: '#6b5b47',
  chart4: '#4a3728',
  chart5: '#3d2a1a',
  
  // Sidebar colors
  sidebar: '#f8f6f2',
  sidebarForeground: '#2c1810',
  sidebarPrimary: '#3d2a1a',
  sidebarPrimaryForeground: '#f8f6f2',
  sidebarAccent: '#e8e2d6',
  sidebarAccentForeground: '#2c1810',
  sidebarBorder: 'rgba(60, 42, 26, 0.2)',
  sidebarRing: '#b8941f'
};

// Dark Mode Colors
export const darkColors: ColorTheme = {
  // Core Colors
  background: '#0a0704',
  foreground: '#f5f1eb',
  card: '#161008',
  cardForeground: '#f5f1eb',
  popover: '#161008',
  popoverForeground: '#f5f1eb',
  primary: '#f0d898',
  primaryForeground: '#0a0704',
  secondary: '#c9a96e',
  secondaryForeground: '#0a0704',
  muted: '#2a1e16',
  mutedForeground: '#d4c7b0',
  accent: '#e6c547',
  accentForeground: '#0a0704',
  destructive: '#ff6b47',
  destructiveForeground: '#f5f1eb',
  border: 'rgba(240, 216, 152, 0.2)',
  input: '#2a1e16',
  inputBackground: '#2a1e16',
  ring: '#e6c547',
  
  // Dazai-specific colors
  dazaiBrown: '#f0d898',
  dazaiBeige: '#e6c547',
  dazaiCream: '#f5f1eb',
  dazaiGold: '#ffd700',
  dazaiDark: '#f5f1eb',
  dazaiMuted: '#d4c7b0',
  animeShadow: 'rgba(240, 216, 152, 0.25)',
  
  // Chart colors
  chart1: '#f0d898',
  chart2: '#e6c547',
  chart3: '#d4c7b0',
  chart4: '#c9a96e',
  chart5: '#8b7355',
  
  // Sidebar colors
  sidebar: '#0a0704',
  sidebarForeground: '#f5f1eb',
  sidebarPrimary: '#f0d898',
  sidebarPrimaryForeground: '#0a0704',
  sidebarAccent: '#2a1e16',
  sidebarAccentForeground: '#f5f1eb',
  sidebarBorder: 'rgba(240, 216, 152, 0.2)',
  sidebarRing: '#e6c547'
};

// Light Mode Gradients
export const lightGradients: GradientTheme = {
  // Primary gradients
  heroGradient: 'linear-gradient(135deg, #f8f6f2 0%, #e8e2d6 50%, #b8941f 100%)',
  cardGradient: 'linear-gradient(145deg, #fafaf8 0%, #f0ebe0 100%)',
  buttonGradient: 'linear-gradient(135deg, #b8941f 0%, #3d2a1a 100%)',
  accentGradient: 'linear-gradient(135deg, #b8941f 0%, #8b7355 100%)',
  
  // Background gradients
  backgroundGradient: 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe0 100%)',
  sectionGradient: 'linear-gradient(135deg, #fafaf8 0%, #e8e2d6 100%)',
  footerGradient: 'linear-gradient(135deg, #e8e2d6 0%, #d4c7b0 100%)',
  
  // Special effects
  glowGradient: 'radial-gradient(circle, rgba(184, 148, 31, 0.3) 0%, transparent 70%)',
  shadowGradient: 'linear-gradient(135deg, rgba(60, 42, 26, 0.1) 0%, transparent 100%)',
  animeBorderGradient: 'conic-gradient(from 0deg, #b8941f, #3d2a1a, #8b7355, #b8941f)',
  
  // Character-specific gradients
  dazaiGradient: 'linear-gradient(135deg, #3d2a1a 0%, #b8941f 50%, #f8f6f2 100%)',
  akutagawaGradient: 'linear-gradient(135deg, #2c1810 0%, #4a3728 50%, #8b7355 100%)',
  atsushiGradient: 'linear-gradient(135deg, #f8f6f2 0%, #e8e2d6 50%, #b8941f 100%)',
  chuuyaGradient: 'linear-gradient(135deg, #8b4513 0%, #b8941f 50%, #3d2a1a 100%)',
  ranpoGradient: 'linear-gradient(135deg, #8b7355 0%, #b8941f 50%, #6b5b47 100%)',
  kunikidaGradient: 'linear-gradient(135deg, #4a3728 0%, #8b7355 50%, #b8941f 100%)'
};

// Dark Mode Gradients
export const darkGradients: GradientTheme = {
  // Primary gradients
  heroGradient: 'linear-gradient(135deg, #0a0704 0%, #2a1e16 50%, #e6c547 100%)',
  cardGradient: 'linear-gradient(145deg, #161008 0%, #2a1e16 100%)',
  buttonGradient: 'linear-gradient(135deg, #e6c547 0%, #f0d898 100%)',
  accentGradient: 'linear-gradient(135deg, #e6c547 0%, #c9a96e 100%)',
  
  // Background gradients
  backgroundGradient: 'linear-gradient(180deg, #0a0704 0%, #161008 100%)',
  sectionGradient: 'linear-gradient(135deg, #161008 0%, #2a1e16 100%)',
  footerGradient: 'linear-gradient(135deg, #2a1e16 0%, #1a140e 100%)',
  
  // Special effects
  glowGradient: 'radial-gradient(circle, rgba(230, 197, 71, 0.3) 0%, transparent 70%)',
  shadowGradient: 'linear-gradient(135deg, rgba(240, 216, 152, 0.1) 0%, transparent 100%)',
  animeBorderGradient: 'conic-gradient(from 0deg, #e6c547, #f0d898, #c9a96e, #e6c547)',
  
  // Character-specific gradients
  dazaiGradient: 'linear-gradient(135deg, #f0d898 0%, #e6c547 50%, #0a0704 100%)',
  akutagawaGradient: 'linear-gradient(135deg, #f5f1eb 0%, #d4c7b0 50%, #c9a96e 100%)',
  atsushiGradient: 'linear-gradient(135deg, #0a0704 0%, #2a1e16 50%, #e6c547 100%)',
  chuuyaGradient: 'linear-gradient(135deg, #ff6b47 0%, #e6c547 50%, #f0d898 100%)',
  ranpoGradient: 'linear-gradient(135deg, #c9a96e 0%, #e6c547 50%, #8b7355 100%)',
  kunikidaGradient: 'linear-gradient(135deg, #d4c7b0 0%, #c9a96e 50%, #e6c547 100%)'
};

// Function to generate CSS variables
export const generateCSSVariables = (colors: ColorTheme, gradients: GradientTheme, isDark = false) => {
  const prefix = isDark ? '.dark' : ':root';
  
  return `
${prefix} {
  /* Core Colors */
  --background: ${colors.background};
  --foreground: ${colors.foreground};
  --card: ${colors.card};
  --card-foreground: ${colors.cardForeground};
  --popover: ${colors.popover};
  --popover-foreground: ${colors.popoverForeground};
  --primary: ${colors.primary};
  --primary-foreground: ${colors.primaryForeground};
  --secondary: ${colors.secondary};
  --secondary-foreground: ${colors.secondaryForeground};
  --muted: ${colors.muted};
  --muted-foreground: ${colors.mutedForeground};
  --accent: ${colors.accent};
  --accent-foreground: ${colors.accentForeground};
  --destructive: ${colors.destructive};
  --destructive-foreground: ${colors.destructiveForeground};
  --border: ${colors.border};
  --input: ${colors.input};
  --input-background: ${colors.inputBackground};
  --ring: ${colors.ring};
  
  /* Dazai Colors */
  --dazai-brown: ${colors.dazaiBrown};
  --dazai-beige: ${colors.dazaiBeige};
  --dazai-cream: ${colors.dazaiCream};
  --dazai-gold: ${colors.dazaiGold};
  --dazai-dark: ${colors.dazaiDark};
  --dazai-muted: ${colors.dazaiMuted};
  --anime-shadow: ${colors.animeShadow};
  
  /* Chart Colors */
  --chart-1: ${colors.chart1};
  --chart-2: ${colors.chart2};
  --chart-3: ${colors.chart3};
  --chart-4: ${colors.chart4};
  --chart-5: ${colors.chart5};
  
  /* Sidebar Colors */
  --sidebar: ${colors.sidebar};
  --sidebar-foreground: ${colors.sidebarForeground};
  --sidebar-primary: ${colors.sidebarPrimary};
  --sidebar-primary-foreground: ${colors.sidebarPrimaryForeground};
  --sidebar-accent: ${colors.sidebarAccent};
  --sidebar-accent-foreground: ${colors.sidebarAccentForeground};
  --sidebar-border: ${colors.sidebarBorder};
  --sidebar-ring: ${colors.sidebarRing};
  
  /* Gradients */
  --hero-gradient: ${gradients.heroGradient};
  --card-gradient: ${gradients.cardGradient};
  --button-gradient: ${gradients.buttonGradient};
  --accent-gradient: ${gradients.accentGradient};
  --background-gradient: ${gradients.backgroundGradient};
  --section-gradient: ${gradients.sectionGradient};
  --footer-gradient: ${gradients.footerGradient};
  --glow-gradient: ${gradients.glowGradient};
  --shadow-gradient: ${gradients.shadowGradient};
  --anime-border-gradient: ${gradients.animeBorderGradient};
  --dazai-gradient: ${gradients.dazaiGradient};
  --akutagawa-gradient: ${gradients.akutagawaGradient};
  --atsushi-gradient: ${gradients.atsushiGradient};
  --chuuya-gradient: ${gradients.chuuyaGradient};
  --ranpo-gradient: ${gradients.ranpoGradient};
  --kunikida-gradient: ${gradients.kunikidaGradient};
}`;
};

// Export current theme (can be modified by admin)
export let currentLightTheme = { ...lightColors };
export let currentDarkTheme = { ...darkColors };
export let currentLightGradients = { ...lightGradients };
export let currentDarkGradients = { ...darkGradients };

// Function to update themes (for admin use)
export const updateTheme = (
  lightColors?: Partial<ColorTheme>,
  darkColors?: Partial<ColorTheme>,
  lightGradients?: Partial<GradientTheme>,
  darkGradients?: Partial<GradientTheme>
) => {
  if (lightColors) {
    currentLightTheme = { ...currentLightTheme, ...lightColors };
  }
  if (darkColors) {
    currentDarkTheme = { ...currentDarkTheme, ...darkColors };
  }
  if (lightGradients) {
    currentLightGradients = { ...currentLightGradients, ...lightGradients };
  }
  if (darkGradients) {
    currentDarkGradients = { ...currentDarkGradients, ...darkGradients };
  }
  
  // Apply updated themes to CSS
  applyThemeToCSS();
};

// Function to apply theme to CSS
export const applyThemeToCSS = () => {
  const lightCSS = generateCSSVariables(currentLightTheme, currentLightGradients, false);
  const darkCSS = generateCSSVariables(currentDarkTheme, currentDarkGradients, true);
  
  // Update or create style element
  let styleElement = document.getElementById('dynamic-theme-styles') as HTMLStyleElement;
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'dynamic-theme-styles';
    document.head.appendChild(styleElement);
  }
  
  styleElement.textContent = lightCSS + '\n' + darkCSS;
};

// Function to initialize theme system
export const initializeThemeSystem = () => {
  if (typeof document !== 'undefined') {
    // Apply initial themes
    applyThemeToCSS();
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement;
          if (target.classList.contains('dark')) {
            // Dark mode activated
            applyThemeToCSS();
          } else {
            // Light mode activated
            applyThemeToCSS();
          }
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
};

// Gradient utility classes for Tailwind
export const gradientClasses = {
  'bg-hero-gradient': 'var(--hero-gradient)',
  'bg-card-gradient': 'var(--card-gradient)',
  'bg-button-gradient': 'var(--button-gradient)',
  'bg-accent-gradient': 'var(--accent-gradient)',
  'bg-background-gradient': 'var(--background-gradient)',
  'bg-section-gradient': 'var(--section-gradient)',
  'bg-footer-gradient': 'var(--footer-gradient)',
  'bg-glow-gradient': 'var(--glow-gradient)',
  'bg-shadow-gradient': 'var(--shadow-gradient)',
  'bg-anime-border-gradient': 'var(--anime-border-gradient)',
  'bg-dazai-gradient': 'var(--dazai-gradient)',
  'bg-akutagawa-gradient': 'var(--akutagawa-gradient)',
  'bg-atsushi-gradient': 'var(--atsushi-gradient)',
  'bg-chuuya-gradient': 'var(--chuuya-gradient)',
  'bg-ranpo-gradient': 'var(--ranpo-gradient)',
  'bg-kunikida-gradient': 'var(--kunikida-gradient)'
};

// Character color schemes
export const characterColors = {
  dazai: {
    primary: '#3d2a1a',
    accent: '#b8941f',
    background: '#f8f6f2'
  },
  akutagawa: {
    primary: '#2c1810',
    accent: '#4a3728',
    background: '#8b7355'
  },
  atsushi: {
    primary: '#f8f6f2',
    accent: '#e8e2d6',
    background: '#b8941f'
  },
  chuuya: {
    primary: '#8b4513',
    accent: '#b8941f',
    background: '#3d2a1a'
  },
  ranpo: {
    primary: '#8b7355',
    accent: '#b8941f',
    background: '#6b5b47'
  },
  kunikida: {
    primary: '#4a3728',
    accent: '#8b7355',
    background: '#b8941f'
  }
};

// Initialize theme on load
if (typeof document !== 'undefined') {
  initializeThemeSystem();
}