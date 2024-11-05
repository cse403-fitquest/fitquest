import { MOCK_USER_FRIENDS } from '@/constants/social';
import { Friend, UserFriend } from '@/types/social';
import { create } from 'zustand';

interface ISocialStore {
  userFriend: UserFriend | null;

  setUserFriend: (userFriends: UserFriend) => void;

  setFriends: (friends: Friend[]) => void;

  setSentRequests: (sentRequests: string[]) => void;

  setPendingRequests: (pendingRequests: Friend[]) => void;
}

export const useSocialStore = create<ISocialStore>((set) => ({
  userFriend: {
    id: '',
    friends: MOCK_USER_FRIENDS.friends,
    sentRequests: MOCK_USER_FRIENDS.sentRequests,
    pendingRequests: MOCK_USER_FRIENDS.pendingRequests,
  },

  setUserFriend: (userFriend) => set({ userFriend }),

  setFriends: (friends) =>
    set((state) => ({
      userFriend: {
        ...state.userFriend!,
        friends,
      },
    })),

  setSentRequests: (sentRequests) =>
    set((state) => ({
      userFriend: {
        ...state.userFriend!,
        sentRequests,
      },
    })),

  setPendingRequests: (pendingRequests) =>
    set((state) => ({
      userFriend: {
        ...state.userFriend!,
        pendingRequests,
      },
    })),
}));
