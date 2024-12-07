import { FirebaseError } from 'firebase/app';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import { getMonsterByIdWithResponse, getMonsters } from '@/services/monster';

jest.mock('@/firebaseConfig', () => ({
  FIREBASE_DB: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
}));

describe('Monster Service', () => {
  const mockGetDoc = getDoc as jest.Mock;
  const mockDoc = doc as jest.Mock;
  const mockCollection = collection as jest.Mock;
  const mockQuery = query as jest.Mock;
  const mockGetDocs = getDocs as jest.Mock;

  const monsterId = 'monster123';

  beforeEach(() => {
    jest.clearAllMocks();

    mockDoc.mockImplementation((db, collectionPath, docId) => ({
      id: docId,
      path: `${collectionPath}/${docId}`,
    }));

    mockCollection.mockImplementation(() => ({
      id: 'monsters',
      path: 'monsters',
      withConverter: jest.fn().mockReturnThis(),
    }));

    mockQuery.mockImplementation(() => ({
      id: 'mockedQuery',
    }));
  });

  describe('getMonsterById', () => {
    it('should get monster by id successfully', async () => {
      const mockMonster = {
        id: 'monster123',
        name: 'Test Monster',
        spriteId: 'HERO_01',
        attributes: {
          power: 10,
          speed: 10,
          health: 100,
        },
        associatedQuest: 'quest123',
      };

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockMonster,
        id: monsterId,
      });

      const response = await getMonsterByIdWithResponse(monsterId);

      expect(mockDoc).toHaveBeenCalledWith({}, 'monsters', monsterId);
      expect(response).toEqual({
        success: true,
        data: { monsters: [mockMonster] },
        error: undefined,
      });
    });

    it('should handle non-existent monster', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
        data: () => null,
        id: monsterId,
      });

      const response = await getMonsterByIdWithResponse(monsterId);

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Monster not found',
      });
    });

    it('should handle FirebaseError', async () => {
      mockGetDoc.mockRejectedValue(
        new FirebaseError('permission-denied', 'Permission denied'),
      );

      const response = await getMonsterByIdWithResponse(monsterId);

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error getting monster. Please try again.',
      });
    });
  });

  describe('getMonsters', () => {
    it('should get all monsters successfully', async () => {
      const mockMonsters = [
        {
          monsterId: 'monster1',
          name: 'Monster 1',
          spriteId: 'HERO_01',
          attributes: {
            power: 10,
            speed: 10,
            health: 100,
          },
          associatedQuest: 'quest1',
        },
        {
          monsterId: 'monster2',
          name: 'Monster 2',
          spriteId: 'HERO_02',
          attributes: {
            power: 15,
            speed: 12,
            health: 120,
          },
          associatedQuest: 'quest2',
        },
      ];

      mockGetDocs.mockResolvedValue({
        docs: mockMonsters.map((monster) => ({
          exists: () => true,
          data: () => monster,
          id: monster.monsterId,
        })),
      });

      const response = await getMonsters();

      expect(response).toEqual({
        success: true,
        data: { monsters: mockMonsters },
        error: undefined,
      });
    });

    it('should handle FirebaseError', async () => {
      mockGetDocs.mockRejectedValue(
        new FirebaseError('permission-denied', 'Permission denied'),
      );

      const response = await getMonsters();

      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Error getting monsters. Please try again.',
      });
    });
  });
});
