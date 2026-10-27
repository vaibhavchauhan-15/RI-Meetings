import React, { useState, useCallback } from 'react';
import { Agentation } from "agentation";
import Navbar from "./components/layout/Navbar";
import MeetingSummariesPage from "./features/meeting-reports/components/MeetingSummariesPage";
import { 
    ToastProvider, 
    OfflineBanner, 
    SlowNetworkBanner, 
    SessionExpiredModal,
    ErrorBoundary 
} from "./components/feedback";
import { StatesPreviewModal } from "./components/dev/StatesPreviewModal";

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
    <ToastProvider>
      <div className="flex flex-col h-full w-full bg-white overflow-hidden relative">
        {/* State 4: Global Offline Banner (persistent top alert when disconnected) */}
        <OfflineBanner />

        <Navbar 
          onLogoClick={handleLogoClick} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
          <ErrorBoundary title="Operational Dashboard Encountered an Error">
            <MeetingSummariesPage 
              resetTrigger={resetTrigger} 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </ErrorBoundary>
        </main>

        {/* State 5: Slow Network Floating Banner */}
        <SlowNetworkBanner />

        {/* State 8: Session Expired Modal (HTTP 401) */}
        <SessionExpiredModal />

        {/* Interactive 10 States Developer Preview Sandbox */}
        <StatesPreviewModal />

        {process.env.NODE_ENV === "development" && <Agentation />}
      </div>
    </ToastProvider>
  );
}

export default App;

