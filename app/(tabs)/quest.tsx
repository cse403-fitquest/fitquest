import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';

interface Quest {
  questId: string;
  name: string;
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
}

export const quests = [
  {
    questId: '1',
    name: 'Hunt Big Chungus',
    questDescription: '',
    spriteId: AnimatedSpriteID.MINOTAUR_RED,
    milestones: Array.from({ length: 20 }, (_, i) => (i + 1) * 50),
    bossThreshold: 500,
    duration: 7 * 24 * 60 * 60 * 1000,
    createdAt: '',
    expiredAt: '',
  },
  {
    questId: '2',
    name: 'Hunt Jimmy Two-Toes',
    questDescription: '',
    spriteId: AnimatedSpriteID.CHOMPBUG_GREEN,
    milestones: Array.from({ length: 20 }, (_, i) => (i + 1) * 50),
    bossThreshold: 500,
    duration: 7 * 24 * 60 * 60 * 1000,
    createdAt: '',
    expiredAt: '',
  },
];

const questData: {
  activeQuests: Record<string, ActiveQuest>;
  questProgress: Record<string, number>;
} = {
  activeQuests: {},
  questProgress: {},
};

const startQuest = async (
  userID: string,
  questID: string,
  setActiveQuest: (quest: ActiveQuest | null) => void,
) => {
  const selectedQuest = quests.find((quest) => quest.questId === questID);
  if (selectedQuest) {
    questData.activeQuests[userID] = {
      questID: selectedQuest.questId,
      questName: selectedQuest.name,
      progress: 0,
      milestones: selectedQuest.milestones,
      timer: Date.now(),
      bossThreshold: selectedQuest.bossThreshold,
      spriteId: selectedQuest.spriteId,
    };
    await AsyncStorage.setItem(
      'activeQuest',
      JSON.stringify(questData.activeQuests[userID]),
    );
    setActiveQuest(questData.activeQuests[userID]);
    console.log(`Quest ${selectedQuest.name} started for user ${userID}`);
  }
};

const Quest = () => {
  const userID = 'user123';
  const [activeQuest, setActiveQuest] = useState<ActiveQuest | null>(null);
  const [, setShowAbandonModal] = useState<boolean>(false);
  const router = useRouter();
  const [, setVisualProgress] = useState<number>(0);
  const [, setCurrentNodeIndex] = useState(0);

  useEffect(() => {
    const loadActiveQuest = async () => {
      const storedQuest = await AsyncStorage.getItem('activeQuest');
      if (storedQuest) {
        setActiveQuest(JSON.parse(storedQuest));
      }
    };
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
    await AsyncStorage.removeItem('activeQuest');
    setActiveQuest(null);
    setCurrentNodeIndex(0);
    setVisualProgress(0);
    setShowAbandonModal(false);
  };

  function confirmAction(
    action: string,
    quest: Quest,
    userID: string,
    setActiveQuest: (quest: ActiveQuest | null) => void,
  ) {
    Alert.alert(
      `${action} Quest: ${quest.name}?`,
      `Are you sure you want to ${action.toLowerCase()} this quest?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => startQuest(userID, quest.questId, setActiveQuest),
        },
      ],
    );
  }

  const handleAdvance = () => {
    if (activeQuest) {
      const nextMilestone = activeQuest.milestones.find(
        (milestone) => milestone > activeQuest.progress,
      );

      if (nextMilestone) {
        const updatedQuest = { ...activeQuest, progress: nextMilestone };
        const isBoss = nextMilestone >= activeQuest.bossThreshold;
        const uniqueKey = Date.now();

        router.replace({
          pathname: '/Fight',
          params: {
            isBoss: isBoss ? 'true' : 'false',
            questId: activeQuest.questID,
            uniqueKey,
          },
        });

        setActiveQuest(updatedQuest);
        AsyncStorage.setItem('activeQuest', JSON.stringify(updatedQuest));
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
    // Add a starting point (initial node)
    const startingPoint = 'start';
    const nextMilestones = getNextMilestones(
      {
        questId: quest.questID,
        name: quest.questName,
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

    // Add the "start" node as the first milestone visually
    const visualMilestones = [startingPoint, ...nextMilestones];

    // const isBossNearby = visualMilestones.some(
    //   (milestone) =>
    //     milestone !== 'start' &&
    //     typeof milestone === 'number' &&
    //     milestone >= quest.bossThreshold &&
    //     milestone <= quest.bossThreshold + 300,
    // );

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
              ) : milestone === quest.bossThreshold ? (
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
                <Text className="text-sm text-gray-500 mt-2 font-bold">
                  Start
                </Text>
              ) : milestone === quest.bossThreshold ? (
                <Text className="text-sm text-red-500 mt-2 font-bold"></Text>
              ) : null}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className={`flex-1 bg-offWhite px-6 pt-8`}>
      <View className="flex-1">
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
                <Ionicons name="trash-outline" size={30} color="lightgray" />
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
        <ScrollView className="flex-1">
          {quests.map((quest, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white p-4 px-5 mb-4 rounded text-xl shadow-sm shadow-black border border-gray h-[100px] justify-center items-between"
              onPress={() =>
                confirmAction('Start', quest as Quest, userID, setActiveQuest)
              }
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold">{quest.name}</Text>
                <View style={{ width: 85, height: 165 }}>
                  <AnimatedSprite
                    id={quest.spriteId}
                    width={120}
                    height={120}
                    state={SpriteState.IDLE}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Quest;
