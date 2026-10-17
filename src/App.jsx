import React, { useState, useCallback } from 'react';
import { Agentation } from "agentation";
import Navbar from "./components/layout/Navbar";
import MeetingSummariesPage from "./features/meeting-reports/components/MeetingSummariesPage";

function App() {
  const [resetTrigger, setResetTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogoClick = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.location.search) {
        window.history.pushState({}, '', window.location.pathname);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
    setSearchQuery('');
    setResetTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      <Navbar 
        onLogoClick={handleLogoClick} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
        <MeetingSummariesPage 
          resetTrigger={resetTrigger} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </main>
      {process.env.NODE_ENV === "development" && <Agentation />}
    </div>
  );
}

export default App;

