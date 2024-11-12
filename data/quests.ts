export const quests = [
  {
    id: 1,
    name: "Forest Quest",
    totalProgress: 5, // Total fights needed
    progress: 0,      // Current progress
    boss: {
      name: "Forest Boss",
      health: 200,
      attack: 25,
    },
    monster: {        // Add regular monster stats
      name: "Forest Monster",
      health: 100,
      attack: 15,
    }
  },
  // ... other quests
]; 