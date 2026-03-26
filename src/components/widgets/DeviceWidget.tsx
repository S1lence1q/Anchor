import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, BatteryWarning, ChevronDown } from 'lucide-react';

const DEVICE_CONFIG = [
  { id: 'ur', name: 'Smartwatch', lifetimeDays: 12 },
  { id: 'headset', name: 'Headset', lifetimeDays: 14 },
  { id: 'mus', name: 'Computer Mus', lifetimeDays: 30 }
];

export default function DeviceWidget() {
  const { devices, chargeDevice } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const now = Date.now();
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const deviceData = DEVICE_CONFIG.map(cfg => {
    // Slå op i vores persisterede status, eller antag at den er fuld opladt nu (fallback)
    const state = devices.find(d => d.id === cfg.id);
    const lastCharged = state ? state.lastCharged : now;
    
    const daysSinceCharge = (now - lastCharged) / MS_PER_DAY;
    const daysLeft = cfg.lifetimeDays - daysSinceCharge;
    
    // Batteri-procent
    const batteryPct = Math.max(0, Math.min(100, (daysLeft / cfg.lifetimeDays) * 100));
    const isCritical = batteryPct < 15;
    const isWarning = batteryPct < 30 && !isCritical;
    
    let color = '#64FF64'; // Grøn
    if (isWarning) color = '#FFD24D'; // Gul
    if (isCritical) color = '#FF4D4D'; // Rød

    return { ...cfg, batteryPct, isCritical, isWarning, color, daysLeft, lastCharged };
  });

  const criticalCount = deviceData.filter(d => d.isCritical).length;
  const warningCount = deviceData.filter(d => d.isWarning || d.isCritical).length;

  // Samlet overblik-status
  let overviewText = 'Alt udstyr har strøm';
  let overviewColor = '#64FF64';
  if (criticalCount > 0) {
    overviewText = `${criticalCount} enhed${criticalCount > 1 ? 'er' : ''} skriger efter strøm!`;
    overviewColor = '#FF4D4D';
  } else if (warningCount > 0) {
    overviewText = 'Noget udstyr skal snart lades';
    overviewColor = '#FFD24D';
  }

  return (
    <div className="device-widget">
      {/* Sammenklappet overskrift / Status */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="glass-card"
        style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          borderColor: criticalCount > 0 ? 'rgba(255, 77, 77, 0.4)' : 'var(--glass-border)',
          background: criticalCount > 0 ? 'rgba(255, 77, 77, 0.1)' : 'var(--glass-bg)',
          zIndex: 2,
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            {criticalCount > 0 ? <BatteryWarning size={20} color={overviewColor} /> : <Battery size={20} color={overviewColor} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '16px', fontWeight: 500, color: '#fff' }}>Udstyr Status</span>
            <span style={{ fontSize: '12px', color: criticalCount > 0 ? '#FF4D4D' : 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{overviewText}</span>
          </div>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
          <ChevronDown size={20} color="rgba(255,255,255,0.5)" />
        </motion.div>
      </motion.div>

      {/* Udfoldet liste med de specifikke enheder */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: '12px' }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {deviceData.map((d) => (
              <motion.div
                key={d.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => chargeDevice(d.id)}
                className="glass-card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  borderColor: d.isCritical ? 'rgba(255, 77, 77, 0.3)' : 'var(--glass-border)',
                  background: d.isCritical ? 'transparent' : 'rgba(255,255,255,0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>
                      {d.name}
                    </span>
                    <span style={{ fontSize: '12px', color: d.isCritical ? '#FF4D4D' : 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                      {d.isCritical ? 'OPLAD I NAT!' : `Est. ${Math.ceil(d.daysLeft)} dage tilbage`}
                    </span>
                  </div>
                </div>

                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '6px 10px',
                  borderRadius: '8px'
                }}>
                  Har Opladt
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
