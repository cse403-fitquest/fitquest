import { FirebaseError } from 'firebase/app';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
} from 'firebase/firestore';
import {
  getAvailableQuests,
  startQuest,
  updateQuestProgress,
  abandonQuest,
} from '@/services/quest';

// Mock Firebase Firestore
jest.mock('@/firebaseConfig', () => ({
  FIREBASE_DB: {
    // Add any specific properties your code expects
  },
}));

jest.mock('firebase/firestore', () => {
  const mockWithConverter = jest.fn().mockReturnValue({
    id: 'mockedCollection',
    path: 'quests',
  });

  return {
    collection: jest.fn(() => ({
      withConverter: mockWithConverter,
    })),
    doc: jest.fn(),
    getDocs: jest.fn(),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    where: jest.fn(),
    query: jest.fn(),
  };
});

describe('Quest Service Functions', () => {
  const mockGetDocs = getDocs as jest.Mock;
  const mockSetDoc = setDoc as jest.Mock;
  const mockUpdateDoc = updateDoc as jest.Mock;
  const mockDoc = doc as jest.Mock;
  const mockCollection = collection as jest.Mock;
  const mockQuery = query as jest.Mock;

  const userId = 'testUser123';
  const questId = 'quest123';

  beforeEach(() => {
    jest.clearAllMocks();
    const mockedDoc = { id: 'mockedDoc', path: 'quests/mockedDoc' };
    mockDoc.mockReturnValue(mockedDoc);
    mockCollection.mockReturnValue({
      id: 'quests',
      path: 'quests',
      withConverter: jest.fn().mockReturnValue(mockedDoc),
    });
    mockQuery.mockReturnValue({ id: 'mockedQuery' });
  });

  describe('getAvailableQuests', () => {
    it('should get available quests successfully', async () => {
      const mockQuests = [
        { id: '1', title: 'Quest 1' },
        { id: '2', title: 'Quest 2' },
      ];

      mockGetDocs.mockResolvedValue({
        docs: mockQuests.map((quest) => ({
          data: () => quest,
          id: quest.id,
        })),
      });

      const response = await getAvailableQuests();

      expect(mockGetDocs).toHaveBeenCalled();
      expect(response).toEqual({
        success: true,
        data: { quests: mockQuests },
        error: null,
      });
    });

    it('should handle FirebaseError', async () => {
      mockGetDocs.mockRejectedValue(
        new FirebaseError('permission-denied', 'Permission denied'),
      );

      const response = await getAvailableQuests();

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error getting quests. Please try again.',
      });
    });

    it('should handle empty quest list', async () => {
      mockGetDocs.mockResolvedValue({
        docs: [],
      });

      const response = await getAvailableQuests();

      expect(response).toEqual({
        success: true,
        data: { quests: [] },
        error: null,
      });
    });

    it('should handle generic error', async () => {
      mockGetDocs.mockRejectedValue(new Error('Generic error'));

      const response = await getAvailableQuests();

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error getting quests. Please try again.',
      });
    });

    it('should handle specific Firebase errors', async () => {
      const errorCases = [
        { code: 'permission-denied', message: 'Permission denied' },
        { code: 'not-found', message: 'Document not found' },
        { code: 'unavailable', message: 'Service unavailable' },
      ];

      for (const errorCase of errorCases) {
        mockGetDocs.mockRejectedValue(
          new FirebaseError(errorCase.code, errorCase.message),
        );

        const response = await getAvailableQuests();

        expect(response).toEqual({
          success: false,
          data: null,
          error: 'Error getting quests. Please try again.',
        });
      }
    });
  });

  describe('startQuest', () => {
    it('should start quest successfully', async () => {
      const timestamp = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(timestamp);

      mockSetDoc.mockResolvedValue(undefined);

      const response = await startQuest(userId, questId);

      expect(mockSetDoc).toHaveBeenCalledWith(expect.anything(), {
        questId,
        progress: 0,
        bossDefeated: false,
        startedAt: timestamp,
      });

      expect(response).toEqual({
        success: true,
        data: {
          questId,
          progress: 0,
          bossDefeated: false,
          startedAt: timestamp,
        },
        error: undefined,
      });
    });

    it('should handle FirebaseError', async () => {
      mockSetDoc.mockRejectedValue(
        new FirebaseError('permission-denied', 'Permission denied'),
      );

      const response = await startQuest(userId, questId);

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error starting quest. Please try again.',
      });
    });
  });

  describe('updateQuestProgress', () => {
    it('should update quest progress successfully', async () => {
      const timestamp = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(timestamp);

      mockUpdateDoc.mockResolvedValue(undefined);
      const progress = 50;

      const response = await updateQuestProgress(userId, questId, progress);

      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), {
        progress,
        bossDefeated: false,
      });

      expect(response).toEqual({
        success: true,
        data: {
          questId,
          progress,
          bossDefeated: false,
          startedAt: timestamp,
        },
        error: undefined,
      });
    });

    it('should handle FirebaseError', async () => {
      mockUpdateDoc.mockRejectedValue(
        new FirebaseError('permission-denied', 'Permission denied'),
      );

      const response = await updateQuestProgress(userId, questId, 50);

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error updating quest progress. Please try again.',
      });
    });
  });

  describe('abandonQuest', () => {
    it('should abandon quest successfully', async () => {
      mockUpdateDoc.mockResolvedValue(undefined);

      const response = await abandonQuest(userId, questId);

      expect(mockUpdateDoc).toHaveBeenCalledWith(
        { id: 'mockedDoc', path: 'quests/mockedDoc' },
        {
          abandoned: true,
        },
      );

      expect(response).toEqual({
        success: true,
        data: null,
        error: null,
      });
    });

    it('should handle FirebaseError', async () => {
      mockUpdateDoc.mockRejectedValue(
        new FirebaseError('permission-denied', 'Permission denied'),
      );

      const response = await abandonQuest(userId, questId);

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error abandoning quest. Please try again.',
      });
    });
  });
});

afterAll(() => {
  jest.resetAllMocks();
});
