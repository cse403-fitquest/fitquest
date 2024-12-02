import { AnimatedSpriteID } from '@/constants/sprite';

export interface Quest {
  boss: {
    health: number;
    power: number;
    speed: number;
    spriteId: AnimatedSpriteID;
  };
  monsters: string[];
  questId: string;
  questName: string;
  questDescription?: string;
  milestones: number[];
  bossThreshold: number;
  duration: number;
  createdAt?: string;
  expiredAt?: string;
}

export interface QuestProgress {
  questId: string;
  progress: number;
  bossDefeated: boolean;
  startedAt: number;
}

export interface QuestResponse {
  success: boolean;
  data?: QuestProgress | null;
  error?: string;
}

export interface ActiveQuest {
  boss: {
    spriteId: AnimatedSpriteID;
    health: number;
    power: number;
    speed: number;
  };
  questID: string;
  questName: string;
  progress: number;
  milestones: number[];
  timer: number;
  bossThreshold: number;
  bossDefeated: boolean;
}
