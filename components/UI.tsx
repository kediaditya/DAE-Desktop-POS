
import React from 'react';
import { THEME, UI_CLASSES } from '../theme';
import { Icon } from '../icons';

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon: IconComp, 
  ...props 
}: any) => {
  const variants: any = {
    primary: UI_CLASSES.buttonPrimary,
    secondary: UI_CLASSES.buttonSecondary,
    ghost: UI_CLASSES.buttonGhost,
    danger: `bg-${THEME.colors.status.dangerBg} text-${THEME.colors.status.danger} hover:bg-red-100 ${THEME.radius.button} font-bold transition-all`,
    outline: `bg-white border border-${THEME.colors.border} text-${THEME.colors.text.base} hover:bg-slate-50 ${THEME.radius.button} font-bold transition-all`
  };

  return (
    <button 
      className={`flex items-center justify-center gap-2 py-3 px-6 ${variants[variant]} ${className}`} 
      {...props}
    >
      {IconComp && <IconComp className="w-4 h-4" />}
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', ...props }: any) => (
  <div className={`${UI_CLASSES.card} ${className}`} {...props}>
    {children}
  </div>
);

export const Input = ({ className = '', ...props }: any) => (
  <input className={`${UI_CLASSES.input} ${className}`} {...props} />
);

export const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className={UI_CLASSES.modalOverlay}>
      <div className={UI_CLASSES.modalContent}>
        <div className={`bg-${THEME.colors.surface} border-b border-${THEME.colors.border} p-6 flex justify-between items-center`}>
          <h3 className={`text-xl ${THEME.typography.heading} text-${THEME.colors.text.base}`}>{title}</h3>
          <button onClick={onClose} className={`p-2 hover:bg-${THEME.colors.surfaceAlt} rounded-full transition-colors`}>
            <Icon.Close className={`w-6 h-6 text-${THEME.colors.text.muted}`} />
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Badge = ({ children, color = 'primary' }: any) => {
  const colors: any = {
    primary: `bg-${THEME.colors.primaryLight} text-${THEME.colors.primary}`,
    success: `bg-${THEME.colors.primaryLight} text-${THEME.colors.primary}`, // Success is now Brand Blue
    warning: `bg-${THEME.colors.accentLight} text-${THEME.colors.status.warningText}`, // Warning is Brand Yellow
    danger: `bg-${THEME.colors.status.dangerBg} text-${THEME.colors.status.danger}`
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${colors[color]}`}>
      {children}
    </span>
  );
};
