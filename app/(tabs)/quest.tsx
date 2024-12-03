import { Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';
import { useUserStore } from '@/store/user';
import { updateUserProfile } from '@/services/user';
import { getAvailableQuests } from '@/services/quest';

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
      const result = await getAvailableQuests();
      if (result.success && result.data) {
        setAvailableQuests(
          (result.data as { quests: Quest[] }).quests?.slice(0, 2) || [],
        );
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
    const remainingMilestones = allMilestones.filter(
      (milestone) => milestone > currentProgress,
    );
    if (remainingMilestones.length < 5) {
      const completedMilestones = allMilestones
        .filter((milestone) => milestone <= currentProgress)
        .slice(-4 + remainingMilestones.length);
      return [...completedMilestones, ...remainingMilestones];
    }
    return remainingMilestones.slice(0, 4);
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
      const newProgress = activeQuest.progress + 50;
      const nextMilestone = activeQuest.milestones.find(
        (milestone) => milestone >= newProgress,
      );

      if (nextMilestone) {
        const updatedQuest = { ...activeQuest, progress: newProgress };

        const updatedProgress = {
          ...user.currentQuest.progress,
          [activeQuest.questID]: newProgress,
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

            const isBoss = newProgress === activeQuest.bossThreshold;
            const uniqueKey = Date.now();

            router.replace({
              pathname: '/fight',
              params: {
                isBoss: isBoss ? 'true' : 'false',
                questName: activeQuest.questName,
                questId: activeQuest.questID,
                uniqueKey,
                questMonsters: activeQuest.monsters,
              },
            });

            setActiveQuest(updatedQuest);
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
        setActiveQuest(null);
        setCurrentNodeIndex(0);
        setVisualProgress(0);
        setShowAbandonModal(false);
      }
    }
  };

  const calculateQuestPercentage = (quest: ActiveQuest, progress: number) => {
    const finalMilestone = quest.milestones[quest.milestones.length - 1];
    return Math.round((progress / finalMilestone) * 100);
  };

  const renderMilestoneNodes = (quest: ActiveQuest, progress: number) => {
    const startingPoint = 'start';
    const selectedQuest = availableQuests.find(
      (q) => q.questId === quest.questID,
    );

    if (!selectedQuest) return null;

    const nextMilestones = getNextMilestones(selectedQuest, progress);
    const visualMilestones = [startingPoint, ...nextMilestones];

    const percentage = calculateQuestPercentage(quest, progress);

    return (
      <View className="mt-6 mb-4">
        <Text className="text-base text-gray-600 mb-3">
          Progress: {percentage}%
        </Text>

        <View
          className="flex-row justify-between items-center"
          style={{ height: 60 }}
        >
          {visualMilestones.map((milestone) => {
            const milestoneValue =
              milestone === 'start' ? 0 : Number(milestone);
            const isBossNode = milestoneValue === Number(quest.bossThreshold);

            return (
              <View
                key={milestone === 'start' ? 'start-node' : milestone}
                className="items-center"
              >
                {isBossNode ? (
                  <View style={{ width: 70, height: 120 }}>
                    <AnimatedSprite
                      id={activeQuest?.boss.spriteId}
                      width={85}
                      height={85}
                      state={SpriteState.IDLE}
                    />
                  </View>
                ) : (
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
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: Quest; index: number }) => {
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
              id={item.boss.spriteId}
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
                    className="absolute top-[15px] right-[60px] p-2"
                    onPress={handleAdvance}
                  >
                    <Text className="text-white text-lg bg-green px-3 py-1 rounded-lg">
                      Start
                    </Text>
                    {/* 
                    <Ionicons
                      name="arrow-forward-circle-outline"
                      size={30}
                      color="green"
                    />
                    */}
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="absolute top-[15px] right-[10px] p-2"
                    onPress={handleAbandon}
                  >
                    <View className="bg-red-500 rounded-full p-1">
                      <Ionicons name="trash-outline" size={30} color="white" />
                    </View>
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
