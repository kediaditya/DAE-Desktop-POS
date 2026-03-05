
import React, { useState, useCallback } from 'react';
import { ViewState } from './types';
import LoginView from './views/LoginView';
import POSHomeView from './views/POSHomeView';
import HistoryView from './views/HistoryView';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);

  const handleLogin = useCallback(() => {
    setView(ViewState.POS_HOME);
  }, []);

  const handleLogout = useCallback(() => {
    setView(ViewState.LOGIN);
  }, []);

  const navigateTo = useCallback((newView: ViewState) => {
    setView(newView);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 select-none">
      {view === ViewState.LOGIN && (
        <LoginView onLogin={handleLogin} />
      )}
      
      {view === ViewState.POS_HOME && (
        <POSHomeView 
          onLogout={handleLogout} 
          onNavigate={navigateTo} 
        />
      )}

      {view === ViewState.HISTORY && (
        <HistoryView 
          onBack={() => navigateTo(ViewState.POS_HOME)} 
        />
      )}
    </div>
  );
};

export default App;
