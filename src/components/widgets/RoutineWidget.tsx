import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ROUTINES } from '../../data/routines';

export default function RoutineWidget({ type }: { type: 'MORNING' | 'EVENING' }) {
  const location = useAppStore(state => state.location);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const items = ROUTINES[type](location) || [];
  
  const toggleItem = (id: string) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const allDone = items.length > 0 && items.every(item => completed[item.id]);

  return (
    <div className="routine-widget">
      <AnimatePresence mode="wait">
        {allDone ? (
          <motion.div 
            key="done-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card" 
            style={{ 
              padding: '32px 24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.05)'
            }}
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              style={{
                width: 56, height: 56, borderRadius: 28, 
                background: '#fff', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16
              }}
            >
              <Check color="#000" size={28} strokeWidth={3} />
            </motion.div>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#fff' }}>Helt færdig</h3>
            <p style={{ margin: '6px 0 0 0', fontSize: '15px', color: 'rgba(255,255,255,0.6)' }}>Du har gennemført rutinen.</p>
          </motion.div>
        ) : (
          <motion.div
            key="list-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            {items.map(item => {
              const isDone = completed[item.id];
              return (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleItem(item.id)}
                  className="glass-card"
                  style={{
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderColor: isDone ? 'rgba(255,255,255,0.05)' : 'var(--glass-border)',
                    background: isDone ? 'transparent' : 'var(--glass-bg)',
                    opacity: isDone ? 0.4 : 1
                  }}
                >
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '13px',
                    border: `1.5px solid ${isDone ? '#fff' : 'rgba(255,255,255,0.3)'}`,
                    marginRight: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isDone ? '#fff' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}>
                    {isDone && <Check size={16} color="#000" strokeWidth={3} />}
                  </div>
                  <span style={{
                    fontSize: '17px',
                    fontWeight: 500,
                    textDecoration: isDone ? 'line-through' : 'none',
                    transition: 'all 0.2s ease'
                  }}>
                    {item.text}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
