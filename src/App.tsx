import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import Dashboard from './components/Dashboard';
import './App.css';

export default function App() {
  const updateTime = useAppStore(state => state.updateTime);
  const timeSegment = useAppStore(state => state.timeSegment);

  // Global time loop
  useEffect(() => {
    updateTime(); // Initial precise time sync
    const interval = setInterval(() => {
      updateTime();
    }, 60000); // Recalculate context every minute
    return () => clearInterval(interval);
  }, [updateTime]);

  const getGlowColors = () => {
    switch (timeSegment) {
      case 'MORNING': 
        return { t: 'rgba(255, 140, 60, 0.15)', b: 'rgba(255, 80, 80, 0.1)' }; // Sunrise Warmth
      case 'SCHOOL': 
        return { t: 'rgba(60, 120, 255, 0.15)', b: 'rgba(100, 200, 255, 0.1)' }; // Focused Blue
      case 'AFTERNOON_TRAINING': 
        return { t: 'rgba(255, 80, 80, 0.15)', b: 'rgba(255, 140, 60, 0.1)' }; // Energetic Red/Orange
      case 'EVENING': 
        return { t: 'rgba(80, 60, 160, 0.15)', b: 'rgba(40, 40, 90, 0.1)' }; // Deep Indigo Obsidian
      default: 
        return { t: 'rgba(60, 90, 160, 0.15)', b: 'rgba(120, 70, 150, 0.1)' };
    }
  };

  const glows = getGlowColors();

  return (
    <>
      <div className="ambient-bg">
        <div 
          className="glow-top" 
          style={{ 
            background: `radial-gradient(circle, ${glows.t} 0%, transparent 70%)`,
            transition: 'background 3s ease-in-out' // Smooth transition between times of day
          }}
        />
        <div 
          className="glow-bottom" 
          style={{ 
            background: `radial-gradient(circle, ${glows.b} 0%, transparent 70%)`,
            transition: 'background 3s ease-in-out'
          }}
        />
      </div>

      <div className="app-container">
        <main className="content-area">
          <Dashboard />
        </main>
      </div>
    </>
  );
}
