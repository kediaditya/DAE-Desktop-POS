
import React, { useState } from 'react';
import { THEME, UI_CLASSES } from '../theme';
import { Icon } from '../icons';
import { Button, Input } from '../components/UI';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-${THEME.colors.background}`}>
      {/* Decorative Background Elements - Clean/Neutral */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-${THEME.colors.primaryLight} rounded-full blur-3xl translate-x-1/2 -translate-y-1/2`}></div>
        <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2`}></div>
      </div>

      <div className={`relative flex flex-col md:flex-row w-full max-w-5xl h-[600px] bg-white ${THEME.radius.large} ${THEME.shadows.xl} overflow-hidden animate-in fade-in zoom-in duration-500 border border-${THEME.colors.border}`}>
        {/* Left Side: Illustration */}
        <div className={`hidden md:flex w-1/2 bg-slate-50 items-center justify-center p-12 border-r border-${THEME.colors.border}`}>
          <div className="text-center">
            <div className="mb-8 flex justify-center">
               <div className={`p-6 bg-white ${THEME.radius.base} shadow-lg border border-${THEME.colors.border}`}>
                  <img src="https://picsum.photos/seed/pos/400/300" alt="Illustration" className={`${THEME.radius.base} object-cover w-full h-full grayscale opacity-80`} />
               </div>
            </div>
            <h2 className={`text-3xl font-bold text-${THEME.colors.text.base} mb-2`}>Smart Energy POS</h2>
            <p className={`text-${THEME.colors.text.muted} max-w-xs mx-auto`}>Next generation digital assistant for modern energy stations.</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className={`flex items-center gap-2 text-${THEME.colors.text.muted} text-sm font-medium`}>
              <Icon.Globe className="w-4 h-4" />
              <span>EN / 中 / KH</span>
            </div>
            <button className={`flex items-center gap-2 text-${THEME.colors.text.muted} text-sm font-medium hover:text-${THEME.colors.primary} transition-colors`}>
              <Icon.Settings className="w-4 h-4" />
              <span>System Settings</span>
            </button>
          </div>

          <div className="max-w-sm mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <p className={`text-${THEME.colors.primary} font-semibold mb-1 uppercase tracking-wide text-xs`}>Welcome Back</p>
              <h1 className={`text-4xl font-bold text-${THEME.colors.text.base}`}>Sign In</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className={`text-sm font-semibold text-${THEME.colors.text.base}`}>Cashier / Manager ID</label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-${THEME.colors.text.muted} group-focus-within:text-${THEME.colors.primary} transition-colors`}>
                    <Icon.AuthUser className="w-5 h-5" />
                  </div>
                  <Input
                    type="text"
                    value={id}
                    onChange={(e: any) => setId(e.target.value)}
                    className="pl-12"
                    placeholder="Enter your ID"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-semibold text-${THEME.colors.text.base}`}>Password</label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-${THEME.colors.text.muted} group-focus-within:text-${THEME.colors.primary} transition-colors`}>
                    <Icon.AuthLock className="w-5 h-5" />
                  </div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                    className="pl-12"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-4" icon={Icon.ChevronRight}>
                Sign In
              </Button>
            </form>
          </div>

          <div className={`text-center text-${THEME.colors.text.light} text-xs`}>
            SN: T202192G40579 • NovaPOS v3.2.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
