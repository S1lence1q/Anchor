import { useAppStore } from '../../store/useAppStore';
import { TRANSIT_SCHEDULE } from '../../data/schedule';
import { motion } from 'framer-motion';
import { BusFront, Footprints } from 'lucide-react';

export default function TransportWidget() {
  const { location, timeSegment, currentTime } = useAppStore();

  let targetBus: string | null = null;
  let leaveHouseTime = '';
  let walkingTime = 0;

  if (timeSegment === 'MORNING') {
    const morningBus = TRANSIT_SCHEDULE[location].morningBus;
    targetBus = morningBus.departure; // e.g. "08:15"
    leaveHouseTime = morningBus.leaveHouse;
    walkingTime = 'walkingTimeMins' in morningBus ? (morningBus as any).walkingTimeMins : 8; 
  } else if (timeSegment === 'AFTERNOON_TRAINING' && location === 'Far') {
    // Basic fallback logic for Far afternoon. 
    targetBus = TRANSIT_SCHEDULE.Far.afternoonBus.postTrainingDeparture;
    leaveHouseTime = TRANSIT_SCHEDULE.Far.afternoonBus.leaveSchool;
    walkingTime = 15;
  }

  if (!targetBus) return null;

  // Calculate minutes remaining
  const [targetH, targetM] = targetBus.split(':').map(Number);
  const targetDate = new Date(currentTime);
  targetDate.setHours(targetH, targetM, 0, 0);

  const diffMs = targetDate.getTime() - currentTime.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  // If the bus left more than 5 mins ago, hide widget
  if (diffMinutes < -15) return null;

  const isUrgent = diffMinutes <= walkingTime + 2 && diffMinutes >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card" 
      style={{ 
        padding: '24px', 
        marginBottom: '16px',
        borderColor: isUrgent ? 'rgba(255, 80, 80, 0.4)' : 'var(--glass-border)',
        background: isUrgent ? 'rgba(255, 80, 80, 0.1)' : 'var(--glass-bg)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: isUrgent ? '#FF5050' : 'rgba(255,255,255,0.5)', fontWeight: '600', textTransform: 'uppercase' }}>
          Transit Status
        </div>
        <BusFront size={20} color={isUrgent ? "#FF5050" : "rgba(255,255,255,0.7)"} />
      </div>

      {diffMinutes > 0 ? (
        <h3 style={{ margin: 0, fontSize: '32px', color: isUrgent ? '#FF5050' : '#fff' }}>
          Afgang om {diffMinutes} min
        </h3>
      ) : diffMinutes === 0 ? (
        <h3 style={{ margin: 0, fontSize: '32px', color: '#FF5050' }}>Kører NU!</h3>
      ) : (
        <h3 style={{ margin: 0, fontSize: '32px', color: 'rgba(255,255,255,0.5)' }}>Bussen er kørt</h3>
      )}
      
      <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Footprints size={14} /> Forlad basen senest {leaveHouseTime}
      </p>
    </motion.div>
  );
}
