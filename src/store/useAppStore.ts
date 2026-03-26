import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimeSegment = 'MORNING' | 'SCHOOL' | 'AFTERNOON_TRAINING' | 'EVENING';
export type Location = 'Mor' | 'Far';

export interface Device {
  id: string;
  name: string;
  lastCharged: number; // timestamp
  lifetimeDays: number;
}

interface AppState {
  location: Location;
  setLocation: (loc: Location) => void;
  
  // Dynamic time
  currentTime: Date;
  timeSegment: TimeSegment;
  isFriday: boolean;
  updateTime: () => void;
  
  // Daily Routines state
  waterFilled: boolean;
  setWaterFilled: (val: boolean) => void;
  medsTaken: boolean;
  setMedsTaken: (val: boolean) => void;

  // Husk I Dag (Ad-hoc Tasks)
  adHocTasks: Array<{ id: string; text: string; done: boolean }>;
  toggleAdHocTask: (id: string) => void;

  // Smart Devices
  devices: Device[];
  chargeDevice: (id: string) => void;

  // Dev Tools / Time Travel
  devModeSegment: TimeSegment | null;
  setDevModeSegment: (seg: TimeSegment | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      location: 'Mor',
      setLocation: (loc) => set({ location: loc }),
      
      currentTime: new Date(),
      timeSegment: 'MORNING', 
      isFriday: new Date().getDay() === 5,
      updateTime: () => set((state) => {
        const now = new Date();
        const day = now.getDay();
        const isFriday = day === 5;
        
        const hour = now.getHours();
        const min = now.getMinutes();
        const timeVal = hour + min / 60;

        let segment: TimeSegment = 'MORNING';
        
        if (timeVal >= 8.0 && timeVal < 14.5) {
          segment = 'SCHOOL'; 
        } else if (timeVal >= 14.5 && timeVal < 18.0) {
          segment = 'AFTERNOON_TRAINING'; 
        } else if (timeVal >= 18.0) {
          segment = 'EVENING'; 
        }

        return { 
          currentTime: now, 
          timeSegment: state.devModeSegment || segment, 
          isFriday 
        };
      }),

      waterFilled: false,
      setWaterFilled: (val) => set({ waterFilled: val }),
      medsTaken: false,
      setMedsTaken: (val) => set({ medsTaken: val }),

      adHocTasks: [],
      toggleAdHocTask: (id) => set((state) => ({
        adHocTasks: state.adHocTasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
      })),

      devices: [
        { id: 'ur', name: 'Smartwatch', lastCharged: Date.now(), lifetimeDays: 2 },
        { id: 'headset', name: 'Headset', lastCharged: Date.now(), lifetimeDays: 7 },
        { id: 'mus', name: 'Computer Mus', lastCharged: Date.now(), lifetimeDays: 14 }
      ],
      chargeDevice: (id) => set((state) => ({
        devices: state.devices.map(d => d.id === id ? { ...d, lastCharged: Date.now() } : d)
      })),

      devModeSegment: null,
      setDevModeSegment: (seg) => set((state) => ({ 
        devModeSegment: seg, 
        timeSegment: seg || 'MORNING' // Update instantly, men setInterval retter det faste hvis det er null
      }))
    }),
    {
      name: 'anchor-storage',
      partialize: (state) => ({
        location: state.location,
        adHocTasks: state.adHocTasks,
        devices: state.devices
      }), // Gem kun user-data, ikke tiden som jo ændrer sig konstant
    }
  )
);
