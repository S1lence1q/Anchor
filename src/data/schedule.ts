export const TRANSIT_SCHEDULE = {
  Far: {
    morningBus: {
      leaveHouse: '07:24',
      departure: '07:32',
      arrival: '08:00', // Ankommer Viborg RTB
      graceTime: 2 // bus kan være et par min forsinket
    },
    afternoonBus: {
      postTrainingDeparture: '13:45', // Stram afgang fra RTB!
      leaveSchool: '13:30', // Seneste afgang fra skolen til fods
    }
  },
  Mor: {
    morningBus: {
      leaveHouse: '08:13',
      departure: '08:15',
      walkingTimeMins: 1.5,
    },
    afternoonBus: {
      departures: ['13:17', '13:47'], // Mere fleksibelt
      walkingTimeMins: 35 // Gå-mulighed hjem
    }
  }
};

export const TRAINING_SCHEDULE = {
  1: 'Skulder & Ryg', // Mandag ? Ikke nævnt direkte, men antager hvile eller andet hvis det mangler
  2: 'Skulder & Ryg', // Tirsdag
  3: 'Bryst & Mave', // Onsdag
  4: 'Arme', // Torsdag
  5: 'Ben', // Fredag (Tidspunkt varierer. Hos far = aften, Hos mor = eftermiddag)
};
