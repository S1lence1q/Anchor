import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bell } from 'lucide-react';
import RoutineWidget from './widgets/RoutineWidget';
import TransportWidget from './widgets/TransportWidget';
import DeviceWidget from './widgets/DeviceWidget';
import { TimeSegment } from '../store/useAppStore';

export default function Dashboard() {
  const { timeSegment, location, setLocation, isFriday, adHocTasks, devModeSegment, setDevModeSegment } = useAppStore();

  const dateStr = new Date().toLocaleDateString('da-DK', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  }).toUpperCase();

  const getGreeting = () => {
    switch (timeSegment) {
      case 'MORNING': return "Godmorgen.";
      case 'SCHOOL': return "God arbejdslyst.";
      case 'AFTERNOON_TRAINING': return "God træning.";
      case 'EVENING': return "God aften.";
      default: return "Hej.";
    }
  };

  const getSubtitle = () => {
    switch (timeSegment) {
      case 'MORNING': return "Lad os få klaret rutinerne før bussen.";
      case 'SCHOOL': return "Skole-tilstand aktiv. Hold fokus.";
      case 'AFTERNOON_TRAINING': return isFriday ? "Det er fredag! Snart weekend." : "Tid til at give den gas.";
      case 'EVENING': return "Klar til at lande.";
      default: return "Alt kører efter planen.";
    }
  };

  return (
    <div className="dashboard-feed">
      {/* Top Bar for Location and Global Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div 
          className="glass-pill" 
          onClick={() => setLocation(location === 'Mor' ? 'Far' : 'Mor')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          <MapPin size={14} color="rgba(255,255,255,0.7)" />
          <span style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px' }}>Hos {location}</span>
        </div>
        <div className="glass-pill" style={{ padding: '8px' }}>
          <Bell size={16} color="rgba(255,255,255,0.7)" />
        </div>
      </div>

      <header className="header" style={{ marginBottom: '40px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="date-text"
        >
          {dateStr}
        </motion.div>
        
        <motion.h1 
          key={getGreeting()} // Re-animates when greeting changes
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          {getGreeting()}
        </motion.h1>
        
        <motion.p 
          className="subtitle"
          key={getSubtitle()}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {getSubtitle()}
        </motion.p>
      </header>

      {/* Feed Area - Dynamically mounts widgets based on timeSegment */}
      <div className="feed-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <AnimatePresence mode="popLayout">
          {timeSegment === 'MORNING' && (
            <motion.div 
              key="morning-feed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <TransportWidget />

              {/* MOCKING MORNING */}
              <div className="date-text" style={{ fontSize: '12px', marginTop: '32px', marginBottom: '16px' }}>INDEN DU SMUTTER ({location})</div>
              <RoutineWidget type="MORNING" />
            </motion.div>
          )}

          {timeSegment === 'SCHOOL' && (
            <motion.div 
              key="school-feed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '24px' }}>Fokus-tilstand</h3>
                <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>Ingen forstyrrelser. Tjek ind senere når skoledagen er færdig.</p>
              </div>
            </motion.div>
          )}

          {timeSegment === 'AFTERNOON_TRAINING' && (
            <motion.div 
              key="afternoon-feed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <TransportWidget />

              <div className="glass-card" style={{ padding: '24px', borderColor: 'rgba(255, 90, 90, 0.3)', background: 'rgba(255, 90, 90, 0.05)' }}>
                <div style={{ fontSize: '13px', color: 'rgba(255,90,90,0.8)', marginBottom: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Fysisk Træning</div>
                <h3 style={{ margin: 0, fontSize: '24px' }}>Tid til at rykke</h3>
                <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>Dine sæt og programmer kommer her.</p>
              </div>
            </motion.div>
          )}

          {timeSegment === 'EVENING' && (
            <motion.div 
              key="evening-feed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {adHocTasks.length > 0 && (
                <>
                  <div className="date-text" style={{ fontSize: '12px', marginBottom: '16px' }}>HUSK I DAG</div>
                  <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
                    {/* Placeholder for task list mapping */}
                  </div>
                </>
              )}

              <div className="date-text" style={{ fontSize: '12px', marginBottom: '16px' }}>AFTEN RUTINER</div>
              <RoutineWidget type="EVENING" />

              <div className="date-text" style={{ fontSize: '12px', marginTop: '32px', marginBottom: '16px' }}>UDSTYR & BATTERI</div>
              <DeviceWidget />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DEV TOOLS / TIME TRAVEL */}
      <div style={{ marginTop: '64px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
          Tidsrejse (Kun til Test)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {(['MORNING', 'SCHOOL', 'AFTERNOON_TRAINING', 'EVENING'] as TimeSegment[]).map(seg => (
            <button
              key={seg}
              onClick={() => setDevModeSegment(seg)}
              style={{
                background: devModeSegment === seg ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: devModeSegment === seg ? '#fff' : 'rgba(255,255,255,0.5)',
                padding: '6px 12px',
                borderRadius: '100px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              {seg}
            </button>
          ))}
          {devModeSegment && (
            <button
              onClick={() => setDevModeSegment(null)}
              style={{
                background: 'rgba(255, 80, 80, 0.1)',
                border: '1px solid rgba(255, 80, 80, 0.2)',
                color: '#FF5050',
                padding: '6px 12px',
                borderRadius: '100px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Brug Rigtig Tid
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
