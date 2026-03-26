export type Location = 'Mor' | 'Far';

export interface RoutineItem {
  id: string;
  text: string;
}

export const ROUTINES = {
  MORNING: (location: Location): RoutineItem[] => {
    // Fokus er KUN på de ting, der skaber panik eller glemmes "last-second",
    // i stedet for en træls liste med ting, brugeren automatisk husker alligevel.
    if (location === 'Far') {
      return [
        { id: 'mf_1', text: 'Detaljerne? (Øjenbryn, Deo)' },
        { id: 'mf_2', text: 'Fyld vanddunken' },
        { id: 'mf_3', text: 'Grib den pakkede taske' },
      ];
    } else {
      return [
        { id: 'mm_1', text: 'Detaljerne? (Øjenbryn, Deo)' },
        { id: 'mm_2', text: 'Lommerne: 2x Tlf, AirPods, Rejsekort' },
        { id: 'mm_3', text: 'Tasken er klar (Mac & Oplader)' },
        { id: 'mm_4', text: 'Evt. Træningssko' },
        { id: 'mm_5', text: 'Fyld vanddunken' },
      ];
    }
  },

  EVENING: (location: Location): RoutineItem[] => {
    return [
      { id: 'e_1', text: 'Pak tasken til i morgen' },
      { id: 'e_2', text: 'Børst tænder' },
      { id: 'e_3', text: 'Tag medicin' },
    ];
  }
};
