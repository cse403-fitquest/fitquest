import { Friend, UserFriend } from '@/types/social';

export const BASE_FRIEND: Friend = {
  id: '',
  profileInfo: {
    email: '',
    username: '',
  },
  currentQuest: '',
  privacySettings: {
    isLastWorkoutPublic: true,
    isCurrentQuestPublic: true,
  },
};

export const MOCK_USER_FRIENDS: UserFriend = {
  id: '1',
  friends: [
    {
      ...BASE_FRIEND,
      id: 'faagsg',
      profileInfo: { ...BASE_FRIEND.profileInfo, username: 'NiceDude5' },
      currentQuest: 'Hunt Big Chungus',
    },
    {
      ...BASE_FRIEND,
      id: 'fggosi',
      profileInfo: { ...BASE_FRIEND.profileInfo, username: 'NiceDude1' },
      currentQuest: 'Hunt Big Chungus',
    },
    {
      ...BASE_FRIEND,
      id: 'fgsg',
      profileInfo: { ...BASE_FRIEND.profileInfo, username: 'KindaNiceDude2' },
      currentQuest: 'Hunt The Swamp Hydra',
    },
    {
      ...BASE_FRIEND,
      id: 'fssg',
      profileInfo: { ...BASE_FRIEND.profileInfo, username: 'NiceeeeeDude3' },
      currentQuest: 'Hunt Big Chungus',
      privacySettings: {
        isCurrentQuestPublic: true,
        isLastWorkoutPublic: false,
      },
    },
    {
      ...BASE_FRIEND,
      id: 'fsfsgg',
      profileInfo: { ...BASE_FRIEND.profileInfo, username: 'CoolDude3' },
      currentQuest: 'Hunt Big Chungus',
      privacySettings: {
        isCurrentQuestPublic: false,
        isLastWorkoutPublic: true,
      },
    },
    {
      ...BASE_FRIEND,
      id: 'fsfsfdfdgg',
      profileInfo: { ...BASE_FRIEND.profileInfo, username: 'VeryCoolDude3' },
      currentQuest: 'Hunt Big Chungus',
      privacySettings: {
        isCurrentQuestPublic: false,
        isLastWorkoutPublic: false,
      },
    },
  ],
  sentRequests: ['jdoe@mail.com', 'bdover@mail.com', 'apee@mail.com'],
  pendingRequests: [
    {
      ...BASE_FRIEND,
      id: 'sgag',
      profileInfo: {
        ...BASE_FRIEND.profileInfo,
        username: 'KindaCoolDude',
      },
    },
    {
      ...BASE_FRIEND,
      id: 'fwfafof',
      profileInfo: { ...BASE_FRIEND.profileInfo, username: 'VeryCoolDude2' },
    },
    {
      ...BASE_FRIEND,
      id: 'dfff',
      profileInfo: { ...BASE_FRIEND.profileInfo, username: 'VeryCoolDude3' },
    },
  ],
};
