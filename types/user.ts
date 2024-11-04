export type User = {
  id: string;
  profileInfo: {
    email: string;
    username: string;
    age: number;
    height: number;
    weight: number;
  };
  spriteID: string;
  attributes: { power: number; speed: number; health: number };
  exp: number;
  gold: number;
  currentQuest: string;
  privacySettings: {
    isLastWorkoutPublic: boolean;
    isCurrentQuestPublic: boolean;
  };
  createdAt: number;
};
