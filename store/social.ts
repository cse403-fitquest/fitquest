import { Friend, UserFriend } from '@/types/social';
import { create } from 'zustand';

interface ISocialStore {
  userFriend: UserFriend;

  setUserFriend: (userFriends: UserFriend) => void;

  setFriends: (friends: Friend[]) => void;

  setSentRequests: (sentRequests: string[]) => void;

  setPendingRequests: (pendingRequests: Friend[]) => void;

  resetSocialStore: () => void;
}

export const useSocialStore = create<ISocialStore>((set) => ({
  userFriend: {
    id: '',
    friends: [],
    sentRequests: [],
    pendingRequests: [],
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

  resetSocialStore: () =>
    set({
      userFriend: {
        id: '',
        friends: [],
        sentRequests: [],
        pendingRequests: [],
      },
    }),
}));
