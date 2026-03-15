import React from 'react';
import CrossroadsBackground from './components/CrossroadsBackground';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
      {/* Background 3D Simulation */}
      <div className="fixed inset-0 z-0">
        <CrossroadsBackground />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-slate-950/20 backdrop-brightness-75 transition-all">
        <div className="w-full h-full pointer-events-auto">
          <LandingPage />
        </div>
      </div>
    </div>
  );
}

export default App;
