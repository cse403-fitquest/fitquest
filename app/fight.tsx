import { useEffect, useMemo, useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Modal,
  Dimensions,
  Animated,
  ImageBackground,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from '@/store/user';
import { getRandomMonster } from '@/services/monster';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebaseConfig';

type TurnInfo = {
  id: string;
  name: string;
  speed: number;
  isPlayer: boolean;
};

const calculatePlayerLevel = (attributes: {
  power: number;
  speed: number;
  health: number;
}) => {
  return attributes.power + attributes.speed + attributes.health;
};

const calculateDifficultyMultiplier = (playerLevel: number) => {
  const levelFactor = Math.floor(playerLevel / 10);
  return 1 + levelFactor * 0.2;
};

const Combat = () => {
  const { isBoss, questId, uniqueKey, questMonsters } = useLocalSearchParams();
  const { user } = useUserStore();

  const initialPlayer = {
    id: user?.id || '',
    name: user?.profileInfo.username || 'Player',
    health: (user?.attributes.health || 6) * 20,
    power: (user?.attributes.power || 15) * 2,
    speed: user?.attributes.speed || 15,
  };

  const [isLoading, setIsLoading] = useState(true);

  const [monster, setMonster] = useState({
    name: 'Unknown Monster',
    maxHealth: 100,
    health: 100,
    power: 10,
    speed: 5,
    spriteId: AnimatedSpriteID.SLIME_GREEN,
  });

  const [isMonsterInitialized, setIsMonsterInitialized] = useState(false);

  useEffect(() => {
    const initializeMonster = async () => {
      setIsLoading(true);
      try {
        const playerLevel = calculatePlayerLevel(
          user?.attributes || { power: 15, speed: 15, health: 6 },
        );
        const difficultyMultiplier = calculateDifficultyMultiplier(playerLevel);

        if (isBoss === 'true') {
          const formattedQuestId = `quest_${questId}`;

          const questDocRef = doc(FIREBASE_DB, 'quests', formattedQuestId);

          const questDoc = await getDoc(questDocRef);

          if (questDoc.exists()) {
            const questData = questDoc.data();
            const bossData = questData.boss;

            setMonster({
              name: questData.questName,
              maxHealth: Math.floor(
                bossData.health * 20 * difficultyMultiplier,
              ),
              health: Math.floor(bossData.health * 20 * difficultyMultiplier),
              power: Math.floor(bossData.power * difficultyMultiplier),
              speed: Math.floor(bossData.speed),
              spriteId: bossData.spriteId,
            });
          } else {
            setDefaultMonster(difficultyMultiplier);
          }
        } else {
          const monsterIds = (questMonsters as string).split(',');
          const selectedMonster = await getRandomMonster(monsterIds);

          if (selectedMonster) {
            setMonster({
              name: selectedMonster.name,
              maxHealth: Math.floor(
                selectedMonster.attributes.health * 20 * difficultyMultiplier,
              ),
              health: Math.floor(
                selectedMonster.attributes.health * 20 * difficultyMultiplier,
              ),
              power: Math.floor(
                selectedMonster.attributes.power * difficultyMultiplier,
              ),
              speed: Math.floor(selectedMonster.attributes.speed),
              spriteId: selectedMonster.spriteId as AnimatedSpriteID,
            });
          } else {
            setDefaultMonster(difficultyMultiplier);
          }
        }
        setIsMonsterInitialized(true);
      } catch (error) {
        console.error('Error initializing monster:', error);
        setDefaultMonster();
      }
      setIsLoading(false);
    };

    const setDefaultMonster = (multiplier = 1) => {
      setMonster({
        name: 'Unknown Monster',
        maxHealth: Math.floor(100 * multiplier),
        health: Math.floor(100 * multiplier),
        power: Math.floor(10 * multiplier),
        speed: Math.floor(5 * multiplier),
        spriteId: AnimatedSpriteID.SLIME_GREEN,
      });
    };

    if (questId) {
      initializeMonster();
    } else {
      console.warn('No questId provided');
    }
  }, [questId, isBoss, questMonsters, user?.attributes]);

  const [player, setPlayer] = useState(initialPlayer);

  const [combatLog, setCombatLog] = useState<string[]>([]);

  const [strongAttackCooldown, setStrongAttackCooldown] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [potions, setPotions] = useState({
    small: 3,
    large: 1,
  });

  // const NORMAL_ATTACK = 20;
  // const STRONG_ATTACK = 35;
  const SMALL_POTION_HEAL = 30;
  const LARGE_POTION_HEAL = 70;

  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [modalType, setModalType] = useState<'victory' | 'defeat'>('victory');

  const [isBossFight] = useState(() => {
    return isBoss === 'true';
  });

  const [turnQueue, setTurnQueue] = useState<TurnInfo[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);

  // const gcd = (a: number, b: number): number => {
  //   return b === 0 ? a : gcd(b, a % b);
  // };

  const calculateTurnOrder = (playerSpeed: number, monsterSpeed: number) => {
    const turns: TurnInfo[] = [];
    let playerNextTurn = 0;
    let monsterNextTurn = 0;

    const totalTurnsToCalculate = 20;

    if (playerSpeed >= monsterSpeed) {
      playerNextTurn = 0;
      monsterNextTurn = 1 / monsterSpeed;
    } else {
      playerNextTurn = 1 / playerSpeed;
      monsterNextTurn = 0;
    }

    for (let i = 0; i < totalTurnsToCalculate; i++) {
      if (playerNextTurn <= monsterNextTurn) {
        turns.push({
          id: player.id,
          name: player.name,
          speed: playerSpeed,
          isPlayer: true,
        });
        playerNextTurn += 1 / playerSpeed;
      } else {
        turns.push({
          id: 'monster',
          name: monster.name,
          speed: monsterSpeed,
          isPlayer: false,
        });
        monsterNextTurn += 1 / monsterSpeed;
      }
    }

    return turns.map((turn) => ({
      ...turn,
      name: turn.isPlayer ? player.name : monster.name,
    }));
  };

  const generateMoreTurns = () => {
    const newTurns = calculateTurnOrder(player.speed, monster.speed);
    setTurnQueue((prev) => [...prev, ...newTurns]);
  };

  useEffect(() => {
    if (turnQueue.length - currentTurnIndex < 10) {
      generateMoreTurns();
    }
  }, [currentTurnIndex]);

  const resetCombatState = () => {
    setStrongAttackCooldown(0);
    setPotions({
      small: 3,
      large: 1,
    });
    setIsAnimating(false);
    setShowVictoryModal(false);
    setCombatLog([]);
  };

  useEffect(() => {
    resetCombatState();
  }, []);

  const handleContinue = () => {
    if (modalType === 'victory') {
      router.replace(`/(tabs)/quest`);
    } else {
      router.replace('/(tabs)/quest');
      resetCombatState();
    }
  };

  useEffect(() => {
    const resetCombat = () => {
      setPlayer({ ...initialPlayer });
      setCombatLog([]);
    };

    resetCombat();
  }, [isBoss, questId, uniqueKey]);

  const [playerSpriteState, setPlayerSpriteState] = useState(SpriteState.IDLE);
  const [monsterSpriteState, setMonsterSpriteState] = useState(
    SpriteState.IDLE,
  );

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const getRandomDamage = (baseDamage: number) => {
    const variation = 0.5; // 50% variation
    const randomFactor = 1 + Math.random() * 2 * variation;
    return Math.floor(baseDamage * randomFactor);
  };

  const handleAttack = async (isStrong = false) => {
    if (isAnimating || !turnQueue[currentTurnIndex].isPlayer) return;

    const baseDamage = isStrong ? Math.floor(player.power * 1.5) : player.power;
    const damage = getRandomDamage(baseDamage);

    if (isStrong && strongAttackCooldown > 0) {
      setCombatLog((prev) => [...prev, 'Strong attack is on cooldown!']);
      return;
    }

    setIsAnimating(true);
    setPlayerSpriteState(
      isStrong ? SpriteState.ATTACK_1 : SpriteState.ATTACK_2,
    );

    const newMonsterHealth = Math.max(0, monster.health - damage);
    setMonster((prev) => ({ ...prev, health: newMonsterHealth }));
    setCombatLog((prev) => [...prev, `You dealt ${damage} damage!`]);

    if (isStrong) {
      setStrongAttackCooldown(2);
    }

    if (newMonsterHealth <= 0) {
      setIsAnimating(false);
      handleVictory();
      return;
    }

    await delay(500);

    setCurrentTurnIndex((prev) => (prev + 1) % turnQueue.length);
    setIsAnimating(false);
    setPlayerSpriteState(SpriteState.IDLE);

    if (strongAttackCooldown > 0) {
      setStrongAttackCooldown((prev) => prev - 1);
    }
  };

  const handlePotion = async (type: 'small' | 'large') => {
    if (
      isAnimating ||
      !turnQueue[currentTurnIndex].isPlayer ||
      potions[type] <= 0
    )
      return;
    setIsAnimating(true);

    const healAmount = type === 'small' ? SMALL_POTION_HEAL : LARGE_POTION_HEAL;
    const newHealth = Math.min(
      initialPlayer.health,
      player.health + healAmount,
    );

    setPlayer((prev) => ({ ...prev, health: newHealth }));
    setPotions((prev) => ({ ...prev, [type]: prev[type] - 1 }));
    setCombatLog((prev) => [...prev, `You healed for ${healAmount} HP!`]);

    setCurrentTurnIndex((prev) => (prev + 1) % turnQueue.length);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const monsterDamage = monster.power;
    setPlayer((prev) => ({
      ...prev,
      health: Math.max(0, prev.health - monsterDamage),
    }));
    setCombatLog((prev) => [
      ...prev,
      `${monster.name} dealt ${monsterDamage} damage!`,
    ]);

    setMonsterSpriteState(SpriteState.DAMAGED);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setMonsterSpriteState(SpriteState.IDLE);

    if (strongAttackCooldown > 0) {
      setStrongAttackCooldown((prev) => prev - 1);
    }

    setCurrentTurnIndex((prev) => (prev + 1) % turnQueue.length);
    setIsAnimating(false);
  };

  const handleVictory = async () => {
    setModalType('victory');
    setShowVictoryModal(true);
  };

  const handleDefeat = () => {
    setModalType('defeat');
    setShowVictoryModal(true);
  };

  useEffect(() => {
    if (user) {
      setPlayer((prev) => ({
        ...prev,
        health: (user.attributes.health || 6) * 20,
        power: (user.attributes.power || 15) * 2,
        speed: user.attributes.speed || 15,
      }));
    }
  }, [user]);

  const getChargePercentage = (entityId: string) => {
    if (turnQueue[currentTurnIndex]?.id === entityId) {
      return 100;
    }

    if (
      currentTurnIndex > 0 &&
      turnQueue[currentTurnIndex - 1]?.id === entityId
    ) {
      return 0;
    }

    const nextTurnIndex = turnQueue.findIndex(
      (turn, index) => index > currentTurnIndex && turn.id === entityId,
    );

    if (nextTurnIndex === -1) return 0;

    const turnsUntilNext = nextTurnIndex - currentTurnIndex;
    return Math.max(0, ((5 - turnsUntilNext) / 5) * 100);
  };

  const playerPosition = useRef(new Animated.Value(0)).current;
  const monsterPosition = useRef(new Animated.Value(0)).current;

  const animateSpriteToPosition = (
    animatedValue: Animated.Value,
    toValue: number,
  ) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    const playerCharge = getChargePercentage(player.id);
    animateSpriteToPosition(playerPosition, playerCharge);

    const monsterCharge = getChargePercentage('monster');
    animateSpriteToPosition(monsterPosition, monsterCharge);
  }, [currentTurnIndex, turnQueue]);

  const renderTurnOrder = () => {
    return (
      <View className="mb-4">
        <View className="h-24 rounded-xl p-4">
          <View className="h-full relative flex-row items-center">
            <View className="absolute left-4 right-4 top-2/3 h-[5px] bg-yellow">
              <View className="absolute top-[-3px] left-0 w-[6px] h-[12px] bg-yellow rounded-full" />
              <View className="absolute top-[-3px] right-0 w-[6px] h-[12px] bg-yellow rounded-full" />
            </View>

            <Animated.View
              style={{
                position: 'absolute',
                left: playerPosition.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['4%', '82%'],
                }),
                top: '50%',
                transform: [
                  { translateY: -24 },
                  { translateX: 0 },
                  {
                    scale:
                      turnQueue[currentTurnIndex]?.id === player.id ? 1.25 : 1,
                  },
                ],
                zIndex: turnQueue[currentTurnIndex]?.id === player.id ? 2 : 1,
              }}
            >
              <AnimatedSprite
                id={user?.spriteID}
                width={48}
                height={48}
                state={
                  turnQueue[currentTurnIndex]?.id === player.id
                    ? SpriteState.ATTACK_2
                    : SpriteState.IDLE
                }
              />
            </Animated.View>

            <Animated.View
              style={{
                position: 'absolute',
                left: monsterPosition.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['4%', '82%'],
                }),
                top: '50%',
                transform: [
                  { translateY: -24 },
                  { translateX: 0 },
                  {
                    scale:
                      turnQueue[currentTurnIndex]?.id === 'monster' ? 1.25 : 1,
                  },
                ],
                zIndex: turnQueue[currentTurnIndex]?.id === 'monster' ? 2 : 1,
              }}
            >
              <AnimatedSprite
                id={monster.spriteId}
                width={48}
                height={48}
                state={
                  turnQueue[currentTurnIndex]?.id === 'monster'
                    ? SpriteState.ATTACK_2
                    : SpriteState.IDLE
                }
              />
            </Animated.View>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (isMonsterInitialized && player && monster) {
      const initialTurns = calculateTurnOrder(player.speed, monster.speed);
      setTurnQueue(initialTurns);
    }
  }, [isMonsterInitialized, player, monster]);

  const handleMonsterTurn = async () => {
    if (
      isAnimating ||
      turnQueue[currentTurnIndex].isPlayer ||
      !isMonsterInitialized
    )
      return;

    setIsAnimating(true);
    const baseMonsterDamage = monster.power;
    const monsterDamage = getRandomDamage(baseMonsterDamage);

    await delay(1000);

    setMonsterSpriteState(SpriteState.ATTACK_1);
    await delay(500);

    setPlayer((prev) => ({
      ...prev,
      health: Math.max(0, prev.health - monsterDamage),
    }));

    setCombatLog((prev) => [
      ...prev,
      `${monster.name} dealt ${monsterDamage} damage!`,
    ]);

    await delay(500);
    setMonsterSpriteState(SpriteState.IDLE);

    if (player.health - monsterDamage <= 0) {
      setIsAnimating(false);
      handleDefeat();
      return;
    }

    await delay(500);
    setCurrentTurnIndex((prev) => (prev + 1) % turnQueue.length);
    setIsAnimating(false);
  };

  useEffect(() => {
    if (turnQueue.length && !isAnimating) {
      if (turnQueue[currentTurnIndex]?.isPlayer) {
        // Player turn
      } else {
        handleMonsterTurn();
      }
    }
  }, [currentTurnIndex, turnQueue, isAnimating]);

  const spriteSize = useMemo(() => {
    const { width } = Dimensions.get('window');
    const spriteSize = width / 3;
    return spriteSize;
  }, []);

  const battleBackgrounds = [
    require('@/assets/backgrounds/battle_background_1.png'),
    // Add more backgrounds as needed
  ];

  const [battleBackground] = useState(() => 
    battleBackgrounds[Math.floor(Math.random() * battleBackgrounds.length)]
  );

  if (isLoading) {
    return (
      <ImageBackground 
        source={battleBackground}
        className="flex-1"
      >
        <SafeAreaView className="flex-1 p-4 pb-20 px-6 mt-[-50px]">
          <View className="h-2 bg-gray-200/50 rounded-full mb-12">
            <View className="h-full bg-blue-500/70 rounded-full w-1/2" />
          </View>

          <View className="flex-1 px-6 justify-center items-center h-full">
            <View className="h-[300px] w-full mb-40 rounded-xl p-4">
              <View className="flex-row justify-between items-start mb-[10px]">
                <View className="w-1/2 pr-4 bg-black/30 p-2 rounded">
                  <View className="h-4 bg-gray-400/50 rounded-full w-32 mb-2" />
                  <View className="w-full h-4 bg-gray/80 rounded-full overflow-hidden border border-black border-2">
                    <View className="h-full bg-gray-400/50 animate-pulse w-1/2" />
                  </View>
                </View>
              </View>

              <View className="flex-row justify-between items-center mt-20">
                <View className="w-1/2 pl-4 bg-black/30 p-2 rounded">
                  <View className="h-4 bg-gray-400/50 rounded-full w-32 mb-2" />
                  <View className="w-full h-4 bg-gray/80 rounded-full overflow-hidden border border-black border-2">
                    <View className="h-full bg-gray-400/50 animate-pulse w-1/2" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className="absolute left-6 bottom-0 pb-8 flex-row w-full h-[160px]">
            <View className="flex-1 mr-2">
              <Text className="text-lg font-bold mb-2 text-white drop-shadow">MOVES</Text>
              <View className="space-y-2">
                <View className="bg-gray-400/50 p-3 rounded shadow animate-pulse" />
                <View className="bg-gray-400/50 p-3 rounded shadow animate-pulse" />
              </View>
            </View>

            <View className="flex-1 ml-2">
              <Text className="text-lg font-bold mb-2 text-white drop-shadow">POTIONS</Text>
              <View className="space-y-2">
                <View className="bg-gray-400/50 p-3 rounded shadow animate-pulse" />
                <View className="bg-gray-400/50 p-3 rounded shadow animate-pulse" />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground 
      source={battleBackground}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 p-4 pb-20 px-6 mt-[-50px]">
        <View className="h-2 bg-gray-200/50 rounded-full mb-12">
          <View className="h-full bg-blue-500/70 rounded-full w-1/2" />
        </View>

        {renderTurnOrder()}

        <View className="flex-1 px-6 justify-center items-center h-full">
          <View className="h-[300px] w-full mb-40 rounded-xl p-4">
            <View className="flex-row justify-between items-start mb-[10px]">
              <View className="w-1/2 pr-4 bg-black/30 p-2 rounded">
                <Text className="text-lg font-bold mb-1 text-white">{monster.name}</Text>
                <View className="w-full h-4 bg-gray/80 rounded-full overflow-hidden border border-black border-2">
                  <View
                    className="h-full bg-green"
                    style={{
                      width: `${(monster.health / monster.maxHealth!) * 100}%`,
                    }}
                  />
                </View>
                <Text className="text-sm mt-1 text-white">
                  HP: {monster.health}/{monster.maxHealth}
                </Text>
              </View>

              <View className="w-1/2 items-end left-5">
                <AnimatedSprite
                  id={monster.spriteId}
                  width={spriteSize}
                  height={spriteSize}
                  state={monsterSpriteState}
                  direction="left"
                />
              </View>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="w-1/2 items-start right-5">
                <AnimatedSprite
                  id={user?.spriteID}
                  width={spriteSize}
                  height={spriteSize}
                  state={playerSpriteState}
                />
              </View>

              <View className="w-1/2 pl-4 bg-black/30 p-2 rounded">
                <Text className="text-lg font-bold mb-1 text-white">{player.name}</Text>
                <View className="w-full h-4 bg-gray/80 rounded-full overflow-hidden border border-black border-2">
                  <View
                    className="h-full bg-green"
                    style={{
                      width: `${(player.health / initialPlayer.health) * 100}%`,
                    }}
                  />
                </View>
                <Text className="text-sm mt-1 text-white">
                  HP: {player.health}/{initialPlayer.health}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="absolute left-6 w-full bottom-[170px] mb-4 p-2 bg-black/50 rounded">
          {combatLog.slice(-3).map((log, index) => (
            <Text key={index} className="text-sm mb-1 text-white">
              {log}
            </Text>
          ))}
        </View>

        <View className="absolute left-6 bottom-0 pb-8 flex-row w-full h-[160px]">
          <View className="flex-1 mr-2">
            <Text className="text-lg font-bold mb-2 text-white drop-shadow">MOVES</Text>
            <View className="space-y-2">
              <Pressable
                className={`bg-white/90 p-3 rounded shadow ${isAnimating ? 'opacity-50' : ''}`}
                onPress={() => handleAttack(false)}
                disabled={isAnimating}
              >
                <Text className="text-center">Attack</Text>
              </Pressable>
              <Pressable
                className={`bg-white/90 p-3 rounded shadow ${
                  strongAttackCooldown > 0 || isAnimating ? 'opacity-50' : ''
                }`}
                onPress={() => handleAttack(true)}
                disabled={strongAttackCooldown > 0 || isAnimating}
              >
                <Text className="text-center flex-row items-center justify-center">
                  Strong Attack
                  {strongAttackCooldown > 0 && (
                    <Text className="ml-1 text-red-500">
                      {' '}
                      [CD: {strongAttackCooldown}]
                    </Text>
                  )}
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="flex-1 ml-2">
            <Text className="text-lg font-bold mb-2 text-white drop-shadow">POTIONS</Text>
            <View className="space-y-2">
              <Pressable
                className={`bg-white/90 p-3 rounded shadow ${
                  potions.small <= 0 || isAnimating ? 'opacity-50' : ''
                }`}
                onPress={() => handlePotion('small')}
                disabled={potions.small <= 0 || isAnimating}
              >
                <Text className="text-center">
                  Small Potion
                  <Text className="text-gray-600"> ({potions.small})</Text>
                </Text>
              </Pressable>
              <Pressable
                className={`bg-white/90 p-3 rounded shadow ${
                  potions.large <= 0 || isAnimating ? 'opacity-50' : ''
                }`}
                onPress={() => handlePotion('large')}
                disabled={potions.large <= 0 || isAnimating}
              >
                <Text className="text-center">
                  Large Potion
                  <Text className="text-gray-600"> ({potions.large})</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={showVictoryModal}
          onRequestClose={() => setShowVictoryModal(false)}
        >
          <View className="flex-1 bg-black/50 items-center justify-center">
            <View className="bg-white m-5 p-6 rounded-2xl w-[85%] items-center">
              {modalType === 'victory' ? (
                <>
                  <Text className="text-2xl font-bold">
                    You have defeated {isBossFight ? 'Boss' : 'the monster'}!
                  </Text>

                  <View className="w-full relative items-center justify-center h-[160px] overflow-hidden mb-10">
                    <View className="absolute bottom-0 flex-row justify-center items-end">
                      <View className="relative left-[25px]">
                        <AnimatedSprite
                          id={user?.spriteID}
                          state={SpriteState.ATTACK_1}
                          width={120}
                          height={120}
                          duration={600}
                        />
                      </View>
                      <View className="relative right-[25px]">
                        <AnimatedSprite
                          id={monster.spriteId}
                          state={SpriteState.DAMAGED}
                          direction="left"
                          width={150}
                          height={150}
                          duration={600}
                          delay={200}
                        />
                      </View>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <Text className="text-2xl mb-6 font-bold text-red-500">
                    Defeated by {monster.name}!
                  </Text>

                  <View className="w-full relative items-center justify-center h-[160px] overflow-hidden mb-10">
                    <View className="absolute bottom-0 flex-row justify-center items-end">
                      <View className="relative left-[15px]">
                        <AnimatedSprite
                          id={user?.spriteID}
                          state={SpriteState.DEATH}
                          width={120}
                          height={120}
                          duration={600}
                        />
                      </View>
                      <View className="relative right-[15px] z-10">
                        <AnimatedSprite
                          id={monster.spriteId}
                          state={SpriteState.ATTACK_1}
                          direction="left"
                          width={150}
                          height={150}
                          duration={600}
                          delay={200}
                        />
                      </View>
                    </View>
                  </View>

                  <View className="mb-8">
                    <Text className="text-lg text-center text-gray-600">
                      Better luck next time!
                    </Text>
                  </View>
                </>
              )}

              <Pressable
                className="w-full bg-blue py-4 rounded-xl shadow-lg active:bg-blue"
                onPress={handleContinue}
              >
                <Text className="text-white text-xl font-bold tracking-wider text-center">
                  CONTINUE
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <StatusBar backgroundColor="#161622" style="light" />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Combat;
