import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';
import { useUserStore } from '@/store/user';
import { updateUserProfile } from '@/services/user';
import { getAvailableQuests } from '@/services/quest';
import { QuestNodeModal } from '@/components/QuestNodeModal';
import { getMonsterById } from '@/services/monster';
import { useGeneralStore } from '@/store/general';

interface Quest {
  monsters: AnimatedSpriteID[];
  questName: string;
  questId: string;
  questDescription?: '';
  spriteId: AnimatedSpriteID;
  milestones: number[];
  bossThreshold: number;
  duration: number;
  createdAt?: '';
  expiredAt?: '';
  boss: {
    spriteId: AnimatedSpriteID;
    health: number;
    power: number;
    speed: number;
  };
}

interface ActiveQuest {
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
  spriteId: AnimatedSpriteID;
  bossDefeated: boolean;
  monsters: string[];
}

interface QuestNode {
  milestone: number;
  isBoss: boolean;
  possibleMonsters: {
    monsterId: string;
    spriteId: AnimatedSpriteID;
  }[];
  description: string;
}

const Quest = () => {
  const [activeQuest, setActiveQuest] = useState<ActiveQuest | null>(null);
  const [, setShowAbandonModal] = useState<boolean>(false);
  const router = useRouter();
  const [, setVisualProgress] = useState<number>(0);
  const [, setCurrentNodeIndex] = useState(0);
  const { user, setUser } = useUserStore();
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState<QuestNode | null>(null);
  const { setLoading } = useGeneralStore();

  const startQuest = async (
    userID: string,
    questID: string,
    setActiveQuest: (quest: ActiveQuest | null) => void,
  ) => {
    const selectedQuest = availableQuests.find(
      (quest) => quest.questId === questID,
    );
    if (selectedQuest && user?.id) {
      const existingProgress = user?.currentQuest?.progress || {};
      const questProgress = existingProgress[questID] || 0;

      const newActiveQuest: ActiveQuest = {
        questID: selectedQuest.questId,
        questName: selectedQuest.questName,
        progress: questProgress,
        milestones: selectedQuest.milestones,
        timer: Date.now(),
        bossThreshold: selectedQuest.bossThreshold,
        spriteId: selectedQuest.spriteId,
        bossDefeated: false,
        boss: selectedQuest.boss,
        monsters: selectedQuest.monsters,
      };

      setActiveQuest(newActiveQuest);
      await updateUserCurrentQuest(questID, existingProgress);
    }
  };

  useEffect(() => {
    const loadQuests = async () => {
      setIsLoading(true);
      try {
        const result = await getAvailableQuests();
        if (result.success && result.data) {
          setAvailableQuests(
            (result.data as { quests: Quest[] }).quests?.slice(0, 3) || [],
          );
        }
      } catch (error) {
        console.error('Error loading quests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuests();
  }, []);

  useEffect(() => {
    if (user?.currentQuest?.id && availableQuests.length > 0) {
      const currentQuest = availableQuests.find(
        (quest) => quest.questId === user.currentQuest.id,
      );

      if (currentQuest) {
        const progress = user.currentQuest.progress[currentQuest.questId] || 0;

        setActiveQuest({
          questID: currentQuest.questId,
          questName: currentQuest.questName,
          progress: progress,
          milestones: currentQuest.milestones,
          timer: Date.now(),
          bossThreshold: currentQuest.bossThreshold,
          spriteId: currentQuest.spriteId,
          bossDefeated: false,
          boss: currentQuest.boss,
          monsters: currentQuest.monsters,
        });
      }
    } else if (!user?.currentQuest?.id) {
      setActiveQuest(null);
    }
  }, [user?.currentQuest, availableQuests]);

  const getNextMilestones = (quest: Quest, currentProgress: number) => {
    const allMilestones = quest.milestones;

    // Find the current milestone index
    const currentIndex = allMilestones.findIndex(
      (milestone) => milestone > currentProgress,
    );

    if (currentIndex === -1) {
      // If we're at the end, show the last 4 milestones
      return allMilestones.slice(-4);
    }

    // Show current position +3 more milestones ahead
    const startIndex = Math.max(0, currentIndex - 1);
    return allMilestones.slice(startIndex + 1, startIndex + 4);
  };

  const handleAbandon = async () => {
    if (activeQuest) {
      Alert.alert(
        `Abandon Quest: ${activeQuest.questName}`,
        'Are you sure you wish to abandon the quest? Progress is saved.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Abandon Quest',
            style: 'destructive',
            onPress: confirmAbandon,
          },
        ],
      );
    }
  };

  const confirmAbandon = async () => {
    if (!user?.id) return;
    try {
      const result = await updateUserProfile(user.id, {
        currentQuest: {
          id: '',
          progress: user.currentQuest.progress,
        },
      });
      if (result.success) {
        setUser({
          ...user,
          currentQuest: {
            id: '',
            progress: user.currentQuest.progress,
          },
        });
        setActiveQuest(null);
        setCurrentNodeIndex(0);
        setVisualProgress(0);
        setShowAbandonModal(false);
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to abandon quest:', error);
      Alert.alert('Error', 'Failed to abandon quest. Please try again.');
    }
  };

  function confirmAction(
    action: string,
    quest: Quest,
    setActiveQuest: (quest: ActiveQuest | null) => void,
  ) {
    if (activeQuest?.questID === quest.questId) return;

    Alert.alert(
      `${action} Quest: ${quest.questName}?`,
      `Are you sure you want to ${action.toLowerCase()} this quest?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await updateUserCurrentQuest(
                quest.questId,
                user?.currentQuest?.progress,
              );
              await startQuest(user?.id || '', quest.questId, setActiveQuest);
            } catch (error) {
              console.error('Error starting quest:', error);
              Alert.alert('Error', 'Failed to start quest. Please try again.');
            }
          },
        },
      ],
    );
  }

  const updateUserCurrentQuest = async (
    questId: string,
    existingProgress = {},
  ) => {
    if (!user?.id) return;
    try {
      const result = await updateUserProfile(user.id, {
        currentQuest: {
          id: questId,
          progress: existingProgress,
        },
      });
      if (result.success) {
        setUser({
          ...user,
          currentQuest: {
            id: questId,
            progress: existingProgress,
          },
        });
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update user current quest:', error);
      Alert.alert('Error', 'Failed to update current quest. Please try again.');
    }
  };

  const handleAdvance = async () => {
    if (activeQuest && user?.id) {
      if (user.activeWorkoutMinutes < 30) {
        Alert.alert(
          'Not Strong Enough...',
          "You'll need to train more before challenging this foe. Return after training!",
          [
            {
              text: 'Grow Stronger',
              onPress: () => router.push('/(tabs)/workout'),
            },
          ],
          { cancelable: false },
        );
        return;
      }

      setLoading(true);

      const newProgress = activeQuest.progress + 50;
      const nextMilestone = activeQuest.milestones.find(
        (milestone) => milestone >= newProgress,
      );

      if (nextMilestone) {
        const isBoss = newProgress % activeQuest.bossThreshold === 0;
        console.log('isBoss', isBoss);
        const uniqueKey = Date.now();

        const result = await updateUserProfile(user.id, {
          activeWorkoutMinutes: user.activeWorkoutMinutes - 30,
        });

        if (result.success) {
          setUser({
            ...user,
            activeWorkoutMinutes: user.activeWorkoutMinutes - 30,
          });

          setLoading(false);

          router.replace({
            pathname: '/fight',
            params: {
              isBoss: isBoss ? 'true' : 'false',
              questName: activeQuest.questName,
              questId: activeQuest.questID,
              uniqueKey,
              questMonsters: activeQuest.monsters,
              nextProgress: newProgress.toString(),
              bossThreshold: activeQuest.bossThreshold,
            },
          });
        } else {
          console.error('Failed to update workout minutes:', result.error);
          Alert.alert('Error', 'Failed to start battle. Please try again.');
        }
      } else {
        const updatedProgress = {
          ...user.currentQuest.progress,
          [activeQuest.questID]: 0,
        };

        const result = await updateUserProfile(user.id, {
          currentQuest: {
            id: '',
            progress: updatedProgress,
          },
        });

        if (result.success) {
          setUser({
            ...user,
            currentQuest: {
              id: '',
              progress: updatedProgress,
            },
          });

          setLoading(false);

          Alert.alert(
            'Quest Complete!',
            'Congratulations! You have completed the quest!',
            [{ text: 'OK' }],
          );
          setActiveQuest(null);
          setCurrentNodeIndex(0);
          setVisualProgress(0);
          setShowAbandonModal(false);
        } else {
          console.error('Failed to reset quest progress:', result.error);
          Alert.alert(
            'Error',
            'Failed to reset quest progress. Please try again.',
          );
        }
      }
    }
  };

  const getNodeInfo = async (
    milestone: number | string,
    quest: ActiveQuest,
  ): Promise<QuestNode | null> => {
    const milestoneNum = Number(milestone);

    // Use the same boss check logic
    const isBossNode =
      milestoneNum > 0 && milestoneNum % quest.bossThreshold === 0;

    // Map the monster IDs to their corresponding sprite IDs
    const monsters = await Promise.all(
      quest.monsters.map(async (monsterId) => {
        const monster = await getMonsterById(monsterId);
        return {
          monsterId,
          spriteId: monster?.spriteId as AnimatedSpriteID,
        };
      }),
    );

    return {
      milestone: milestoneNum,
      isBoss: isBossNode,
      possibleMonsters: isBossNode
        ? [{ monsterId: quest.boss.spriteId, spriteId: quest.boss.spriteId }]
        : monsters,
      description: isBossNode
        ? 'Boss Battle!'
        : `Quest checkpoint: ${milestoneNum}`,
    };
  };

  const renderMilestoneNodes = (quest: ActiveQuest, progress: number) => {
    const startingPoint = 'start';
    const selectedQuest = availableQuests.find(
      (q) => q.questId === quest.questID,
    );

    if (!selectedQuest) return null;

    // Check if quest is completed
    const isQuestCompleted = progress >= Math.max(...quest.milestones);
    if (isQuestCompleted) {
      return (
        <View className="mt-4 mb-2">
          <Text className="text-md mb-5 font-bold text-green-600">
            Quest Completed!
          </Text>
        </View>
      );
    }

    const nextMilestones = getNextMilestones(selectedQuest, progress);
    const visualMilestones = [startingPoint, ...nextMilestones];

    // Adjust progress bar width to be slightly shorter
    const progressBarWidth =
      visualMilestones.length <= 2 ? '50%' : `${(3 - 2.075) * 100}%`;

    const getProgressText = () => {
      if (!user?.activeWorkoutMinutes) return '0% ready to advance!';

      if (user.activeWorkoutMinutes >= 30) {
        return 'Ready to advance!';
      }

      const readyPercentage = Math.round(
        (user.activeWorkoutMinutes / 30) * 100,
      );
      return `${readyPercentage}% ready to advance!`;
    };

    const isBossNode = (milestoneValue: number) => {
      return milestoneValue > 0 && milestoneValue % quest.bossThreshold === 0;
    };

    return (
      <View className="mt-4 mb-2">
        <Text className="text-md mb-5 font-bold">{getProgressText()}</Text>

        <View className="flex-row relative" style={{ height: 20 }}>
          <View
            className="absolute bg-gray"
            style={{
              height: 3,
              width: progressBarWidth,
              left: 10,
              top: '50%',
              transform: [{ translateY: -1.5 }],
            }}
          />

          {visualMilestones.map((milestone, index) => {
            const milestoneValue =
              milestone === 'start' ? 0 : Number(milestone);
            // Update boss node check to use the new function
            const isBoss = isBossNode(milestoneValue);
            const isCompleted = progress >= milestoneValue;
            const nodeInfo = getNodeInfo(milestone, quest);

            // Adjust position calculation to account for shorter width
            const position = index * 45;

            return (
              <TouchableOpacity
                testID={`milestone-node-${index}`}
                key={milestone === 'start' ? 'start-node' : milestone}
                className="items-center absolute"
                style={{
                  left: `${position + 5}%`,
                  transform: [{ translateX: -10 }],
                }}
                onPress={async () => {
                  if (nodeInfo && milestoneValue > progress) {
                    setSelectedNode(await nodeInfo);
                    setModalVisible(true);
                  }
                }}
                disabled={milestoneValue <= progress}
              >
                {isBoss ? (
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      marginTop: -50,
                      marginLeft: -25,
                    }}
                  >
                    <AnimatedSprite
                      id={activeQuest?.boss.spriteId}
                      width={80}
                      height={80}
                      state={SpriteState.IDLE}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20,
                      backgroundColor: isCompleted ? '#4CAF50' : '#D3D3D3',
                      borderWidth: 2,
                      borderColor: isCompleted ? '#45a049' : '#c0c0c0',
                    }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: Quest; index: number }) => {
    return (
      <TouchableOpacity
        testID={`quest-item-${index}`}
        key={index}
        className={`bg-white p-4 px-5 mb-4 rounded text-xl shadow-sm shadow-black border border-gray h-[100px] justify-center items-between ${
          activeQuest?.questID === item.questId ? 'opacity-50' : ''
        }`}
        onPress={() => confirmAction('Start', item as Quest, setActiveQuest)}
        disabled={activeQuest?.questID === item.questId}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text
              className={`text-lg font-semibold ${
                activeQuest?.questID === item.questId ? 'text-gray-500' : ''
              }`}
            >
              {item.questName}
            </Text>
            {item.questDescription && (
              <Text className="text-sm text-gray-600 mt-1">
                {item.questDescription}
              </Text>
            )}
          </View>
          <View style={{ width: 80, height: 125 }}>
            <AnimatedSprite
              id={item.boss.spriteId}
              width={100}
              height={100}
              state={SpriteState.IDLE}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className={`flex-1 bg-offWhite `}>
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <View className="flex-1 px-6 pt-8">
            <View className="mb-8">
              <Text className="text-2xl text-gray-black mb-5">Quest</Text>

              <Text className="text-xl mb-4 font-bold text-grayDark">
                ACTIVE QUEST
              </Text>

              {isLoading ? (
                <View className="bg-white p-6 rounded-xl border border-gray min-h-[180px] items-center justify-center">
                  <ActivityIndicator size="large" color="#0000ff" />
                  <Text className="mt-4 text-gray-600">
                    Loading quest data...
                  </Text>
                </View>
              ) : activeQuest ? (
                <View className="bg-white p-6 rounded-xl border border-gray relative shadow-black shadow-lg min-h-[150px] max-h-[225px]">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-base font-semibold" numberOfLines={1}>
                      {activeQuest.questName}
                    </Text>
                    <View className="flex-row justify-center items-center">
                      {/* Start Button */}
                      <TouchableOpacity
                        testID="advance-quest"
                        className="mr-4"
                        onPress={handleAdvance}
                      >
                        <Ionicons name="play" size={24} color="green" />
                      </TouchableOpacity>

                      {/* Abandon Button */}
                      <TouchableOpacity
                        testID="abandon-quest"
                        className=""
                        onPress={handleAbandon}
                      >
                        <Ionicons name="flag-outline" size={24} color="red" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {renderMilestoneNodes(activeQuest, activeQuest.progress)}
                </View>
              ) : (
                <View className="bg-gray-200 p-6 rounded-xl flex items-center justify-center min-h-[180px]">
                  <Text className="text-lg mb-2">No Active Quest</Text>
                  <Text className="text-gray-600">
                    Start a quest from the quest board below
                  </Text>
                </View>
              )}
            </View>

            <Text className="text-xl mb-4 font-bold text-grayDark">
              QUEST BOARD
            </Text>
            {isLoading ? (
              <View className="items-center justify-center py-8">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text className="mt-4 text-gray-600">
                  Loading available quests...
                </Text>
              </View>
            ) : (
              <FlatList
                data={availableQuests}
                renderItem={renderItem}
                keyExtractor={(item) => item.questId}
                ListHeaderComponent={null}
                ListFooterComponent={null}
              />
            )}
          </View>
        }
      />
      <QuestNodeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        nodeInfo={{
          isBoss: selectedNode?.isBoss || false,
          milestone: selectedNode?.milestone || 0,
          possibleMonsters:
            selectedNode?.possibleMonsters?.map(
              (monster: { monsterId: string; spriteId: AnimatedSpriteID }) => ({
                monsterId: monster.monsterId,
                spriteId: monster.spriteId,
              }),
            ) || [],
        }}
      />
    </SafeAreaView>
  );
};

export default Quest;
