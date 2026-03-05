
/**
 * Centralized Theme Configuration
 * Update these values to change the visual identity of the entire application.
 */

export const THEME = {
  colors: {
    // Brand Blue - The Single Source of Truth for Blue
    primary: '[#4375A3]', 
    primaryHover: '[#365E85]', 
    primaryLight: '[#F0F6FA]', // Consistent light blue background
    primaryLightHover: '[#E1EAF2]', // Hover state for light backgrounds
    primaryContrast: 'white',
    
    // Secondary Actions - Derived from Brand Blue for consistency (Dark Navy)
    secondary: '[#2C4E6E]', 
    secondaryHover: '[#1F3A52]',
    
    // Tertiary/Muted Actions - Derived from Brand Blue (Grey-Blue)
    muted: '[#94A3B8]', 
    mutedHover: '[#64748B]',

    // Brand Yellow/Orange (Accent)
    accent: '[#F4A228]',
    accentHover: '[#D68B1E]',
    accentLight: 'amber-50',
    
    // Backgrounds
    background: 'slate-50',
    surface: 'white',
    surfaceAlt: 'slate-50',
    
    // Borders
    border: 'slate-200',
    borderLight: 'slate-100',
    
    text: {
      base: 'slate-900',
      muted: 'slate-500',
      light: 'slate-400',
      contrast: 'white',
      accent: '[#4375A3]'
    },
    
    // Statuses
    status: {
      success: '[#4375A3]',
      successBg: '[#F0F6FA]',
      successText: '[#4375A3]',
      
      warning: '[#F4A228]',    
      warningBg: 'amber-50',
      warningText: 'amber-700',
      
      danger: 'red-600',       
      dangerBg: 'red-50',
      dangerText: 'red-700',
      
      info: 'slate-500',
      infoBg: 'slate-100',
      infoText: 'slate-700'
    },
    
    categories: {
      fuel: 'slate',
      goods: 'slate',
      keypad: 'slate',
      payment: 'slate',
      data: 'slate',
      system: 'slate'
    }
  },
  
  typography: {
    heading: 'font-bold tracking-tight',
    subheading: 'font-semibold uppercase tracking-wider text-[10px]',
    body: 'font-normal text-sm',
    mono: 'font-mono'
  },
  
  radius: {
    base: 'rounded-md',
    large: 'rounded-lg',
    xl: 'rounded-xl',
    button: 'rounded-md'
  },
  
  spacing: {
    container: 'p-4 gap-4',
    card: 'p-6',
    modal: 'p-8'
  },
  
  shadows: {
    sm: 'shadow-sm',
    base: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-2xl',
    primary: 'shadow-slate-200',
    danger: 'shadow-red-200'
  }
};

// Common class combinations for quick reuse
export const UI_CLASSES = {
  card: `bg-${THEME.colors.surface} ${THEME.radius.large} ${THEME.shadows.sm} border border-${THEME.colors.border}`,
  modalOverlay: `fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4`,
  modalContent: `bg-${THEME.colors.surface} ${THEME.radius.xl} ${THEME.shadows.xl} max-w-lg w-full overflow-hidden animate-in zoom-in duration-300 border border-${THEME.colors.border}`,
  input: `w-full p-4 bg-${THEME.colors.surfaceAlt} ${THEME.radius.base} border border-${THEME.colors.border} focus:border-${THEME.colors.primary} focus:ring-1 focus:ring-${THEME.colors.primary} outline-none transition-all text-${THEME.colors.text.base} font-medium`,
  
  // Updated buttons
  buttonPrimary: `bg-${THEME.colors.primary} hover:bg-${THEME.colors.primaryHover} text-white ${THEME.radius.button} font-semibold transition-all active:scale-[0.98] shadow-sm`,
  buttonSecondary: `bg-${THEME.colors.secondary} hover:bg-${THEME.colors.secondaryHover} text-white ${THEME.radius.button} font-semibold transition-all shadow-sm`,
  buttonGhost: `bg-transparent hover:bg-${THEME.colors.surfaceAlt} text-${THEME.colors.text.muted} ${THEME.radius.button} font-medium transition-all`
};
