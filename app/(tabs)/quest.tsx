import { Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';
import { useUserStore } from '@/store/user';
import { updateUserProfile } from '@/services/user';
import { getAvailableQuests } from '@/services/quest';

interface Quest {
  questName: string;
  questId: string;
  questDescription?: '';
  spriteId: AnimatedSpriteID;
  milestones: number[];
  bossThreshold: number;
  duration: number;
  createdAt?: '';
  expiredAt?: '';
}

interface ActiveQuest {
  questID: string;
  questName: string;
  progress: number;
  milestones: number[];
  timer: number;
  bossThreshold: number;
  spriteId: AnimatedSpriteID;
  bossDefeated: boolean;
}

const Quest = () => {
  // const userID = 'user123';
  const [activeQuest, setActiveQuest] = useState<ActiveQuest | null>(null);
  const [, setShowAbandonModal] = useState<boolean>(false);
  const router = useRouter();
  const [, setVisualProgress] = useState<number>(0);
  const [, setCurrentNodeIndex] = useState(0);
  const { user, setUser } = useUserStore();
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);

  const startQuest = async (
    userID: string,
    questID: string,
    setActiveQuest: (quest: ActiveQuest | null) => void,
  ) => {
    const selectedQuest = availableQuests.find(
      (quest) => quest.questId === questID,
    );
    if (selectedQuest) {
      const existingProgress = user?.currentQuest?.progress?.[questID] || 0;

      await AsyncStorage.setItem(
        'activeQuest',
        JSON.stringify({
          questID: selectedQuest.questId,
          questName: selectedQuest.questName,
          progress: existingProgress,
          milestones: selectedQuest.milestones,
          timer: Date.now(),
          bossThreshold: selectedQuest.bossThreshold,
          spriteId: selectedQuest.spriteId,
          bossDefeated: false,
        }),
      );
      setActiveQuest({
        questID: selectedQuest.questId,
        questName: selectedQuest.questName,
        progress: existingProgress,
        milestones: selectedQuest.milestones,
        timer: Date.now(),
        bossThreshold: selectedQuest.bossThreshold,
        spriteId: selectedQuest.spriteId,
        bossDefeated: false,
      });
      console.log(
        `Quest ${selectedQuest.questName} started for user ${userID}`,
      );
    }
  };

  useEffect(() => {
    const loadQuests = async () => {
      const result = await getAvailableQuests();
      console.log('loadQuests');
      console.log(result);
      if (result.success && result.data) {
        setAvailableQuests(
          (result.data as { quests: Quest[] }).quests?.slice(0, 2) || [],
        );
      }
    };

    const loadActiveQuest = async () => {
      const storedQuest = await AsyncStorage.getItem('activeQuest');
      if (storedQuest) {
        setActiveQuest(JSON.parse(storedQuest));
      }
    };

    loadQuests();
    loadActiveQuest();
  }, []);

  const getNextMilestones = (quest: Quest, currentProgress: number) => {
    const allMilestones = quest.milestones;
    const remainingMilestones = allMilestones.filter(
      (milestone) => milestone > currentProgress,
    );
    if (remainingMilestones.length < 5) {
      const completedMilestones = allMilestones
        .filter((milestone) => milestone <= currentProgress)
        .slice(-5 + remainingMilestones.length);
      return [...completedMilestones, ...remainingMilestones];
    }

    return remainingMilestones.slice(0, 5);
  };

  const handleAbandon = async () => {
    if (activeQuest) {
      Alert.alert(
        `Abandon Quest: ${activeQuest.questName}`,
        'Abandoning the quest will reset its progress if you decide to embark on it again.',
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
        await AsyncStorage.removeItem('activeQuest');
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
      const nextMilestone = activeQuest.milestones.find(
        (milestone) => milestone > activeQuest.progress,
      );

      if (nextMilestone) {
        const updatedQuest = { ...activeQuest, progress: nextMilestone };

        // Update the user's quest progress
        const updatedProgress = {
          ...user.currentQuest.progress,
          [activeQuest.questID]: nextMilestone,
        };

        try {
          const result = await updateUserProfile(user.id, {
            currentQuest: {
              id: activeQuest.questID,
              progress: updatedProgress,
            },
          });

          if (result.success) {
            setUser({
              ...user,
              currentQuest: {
                id: activeQuest.questID,
                progress: updatedProgress,
              },
            });

            const isBoss = nextMilestone === activeQuest.bossThreshold;
            const uniqueKey = Date.now();

            router.replace({
              pathname: '/fight',
              params: {
                isBoss: isBoss ? 'true' : 'false',
                questId: activeQuest.questID,
                uniqueKey,
              },
            });

            setActiveQuest(updatedQuest);
            await AsyncStorage.setItem(
              'activeQuest',
              JSON.stringify(updatedQuest),
            );
          } else {
            throw new Error(result.error || 'Failed to update progress');
          }
        } catch (error) {
          console.error('Failed to update quest progress:', error);
          Alert.alert(
            'Error',
            'Failed to update quest progress. Please try again.',
          );
        }
      } else {
        Alert.alert(
          'Quest Complete!',
          'Congratulations! You have completed the quest!',
          [{ text: 'OK' }],
        );
        AsyncStorage.removeItem('activeQuest');
        setActiveQuest(null);
        setCurrentNodeIndex(0);
        setVisualProgress(0);
        setShowAbandonModal(false);
      }
    }
  };

  const calculateQuestPercentage = (quest: ActiveQuest, progress: number) => {
    const totalMilestones = quest.milestones.length;
    const completedMilestones = quest.milestones.filter(
      (m) => m <= progress,
    ).length;
    return Math.round((completedMilestones / totalMilestones) * 100);
  };

  const renderMilestoneNodes = (quest: ActiveQuest, progress: number) => {
    const startingPoint = 'start';
    const nextMilestones = getNextMilestones(
      {
        questId: quest.questID,
        questName: quest.questName,
        milestones: quest.milestones,
        bossThreshold: quest.bossThreshold,
        duration: 0,
        questDescription: '',
        spriteId: quest.spriteId,
        createdAt: '',
        expiredAt: '',
      },
      progress,
    );

    const visualMilestones = [startingPoint, ...nextMilestones];

    const percentage = calculateQuestPercentage(quest, progress);

    return (
      <View className="mt-6 mb-4">
        <Text className="text-base text-gray-600 mb-3">
          Progress: {percentage}%
        </Text>

        <View
          className="flex-row justify-between items-center"
          style={{ height: 120 }}
        >
          {visualMilestones.map((milestone) => (
            <View
              key={milestone === 'start' ? 'start-node' : milestone}
              className="items-center"
            >
              {milestone === 'start' ? (
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: '#D3D3D3',
                    borderWidth: 2,
                    borderColor: '#404040',
                  }}
                />
              ) : milestone === quest.bossThreshold && !quest.bossDefeated ? (
                <View style={{ width: 48, height: 48 }}>
                  <AnimatedSprite
                    id={
                      quest.questID === '1'
                        ? AnimatedSpriteID.MINOTAUR_RED
                        : AnimatedSpriteID.CHOMPBUG_GREEN
                    }
                    width={64}
                    height={64}
                    state={SpriteState.IDLE}
                  />
                </View>
              ) : (
                <View style={{ width: 32, height: 32 }}>
                  <AnimatedSprite
                    id={
                      quest.questID === '1'
                        ? AnimatedSpriteID.SLIME_GREEN
                        : AnimatedSpriteID.FIRE_SKULL_RED
                    }
                    width={32}
                    height={32}
                    state={SpriteState.IDLE}
                  />
                </View>
              )}
              {milestone === 'start' ? (
                <Text className="text-sm text-gray-500 mt-2 font-bold"></Text>
              ) : milestone === quest.bossThreshold ? (
                <Text className="text-sm text-red-500 mt-2 font-bold"></Text>
              ) : null}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: Quest; index: number }) => {
    // Helper function to determine the correct sprite ID based on quest name
    const getQuestSprite = (questName: string): AnimatedSpriteID => {
      switch (questName) {
        case 'Hunt Red Minotaur':
          return AnimatedSpriteID.MINOTAUR_RED;
        case 'Hunt Green Chompbug':
          return AnimatedSpriteID.CHOMPBUG_GREEN;
        default:
          return AnimatedSpriteID.SLIME_GREEN;
      }
    };

    return (
      <TouchableOpacity
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
          <View style={{ width: 85, height: 85 }}>
            <AnimatedSprite
              id={getQuestSprite(item.questName)}
              width={85}
              height={85}
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

              {activeQuest ? (
                <View className="bg-white p-6 rounded-xl border border-gray relative shadow-black shadow-lg min-h-[150px] max-h-[225px]">
                  <Text className="text-lg font-semibold mb-2">
                    {activeQuest.questName}
                  </Text>
                  {renderMilestoneNodes(activeQuest, activeQuest.progress)}
                  <TouchableOpacity
                    className="absolute right-[40px] p-2"
                    onPress={handleAdvance}
                  >
                    <Ionicons
                      name="arrow-forward-circle-outline"
                      size={30}
                      color="lightblue"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="absolute right-0 p-2"
                    onPress={handleAbandon}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={30}
                      color="lightgray"
                    />
                  </TouchableOpacity>
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
            <FlatList
              data={availableQuests}
              renderItem={renderItem}
              keyExtractor={(item) => item.questId}
              ListHeaderComponent={null}
              ListFooterComponent={null}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Quest;
