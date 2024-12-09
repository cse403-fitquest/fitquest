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
  Alert,
  ActivityIndicator,
  Image,
  Easing,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from '@/store/user';
// import { getRandomMonster } from '@/services/monster';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebaseConfig';
import { updateUserProfile } from '@/services/user';
import { getMonsterById } from '@/services/monster';
import clsx from 'clsx';
import { getUserTotalAttributes } from '@/utils/user';
import { useItemStore } from '@/store/item';
import FQButton from '@/components/FQButton';

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
  const params = useLocalSearchParams();
  const nextProgress = Number(params.nextProgress);
  const questId = params.questId as string;

  const { isBoss, uniqueKey, questMonsters } = params;
  const { user, setUser } = useUserStore();
  const { items } = useItemStore();

  const [playerCharge, setPlayerCharge] = useState(0);
  const [monsterCharge, setMonsterCharge] = useState(0);

  const [currentTurnEntity, setCurrentTurnEntity] = useState<
    'player' | 'monster' | null
  >(null);

  const [isInitializing, setIsInitializing] = useState(true);

  const [monster, setMonster] = useState({
    id: '',
    name: 'Unknown Monster',
    maxHealth: 100,
    health: 100,
    power: 10,
    speed: 5,
    spriteId: AnimatedSpriteID.SLIME_GREEN,
  });

  const [isPlayerInitialized, setIsPlayerInitialized] = useState(false);
  const [isMonsterInitialized, setIsMonsterInitialized] = useState(false);

  useEffect(() => {
    const initializeMonster = async () => {
      if (user && monster.id === '') {
        setIsInitializing(true);
        try {
          const playerLevel = calculatePlayerLevel(user.attributes);
          const difficultyMultiplier =
            calculateDifficultyMultiplier(playerLevel);

          if (isBoss === 'true') {
            const formattedQuestId = `quest_${questId}`;
            const questDocRef = doc(FIREBASE_DB, 'quests', formattedQuestId);
            const questDoc = await getDoc(questDocRef);

            if (questDoc.exists()) {
              const questData = questDoc.data();
              const bossData = questData.boss;

              setMonster({
                id: questData.id,
                name: questData.questName.replace(/^hunt\s+/i, ''),
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
            const monsterIds =
              typeof questMonsters === 'string'
                ? questMonsters.split(',').filter((id) => id.trim() !== '')
                : [];

            if (monsterIds.length > 0) {
              const randomIndex = Math.floor(Math.random() * monsterIds.length);
              const selectedMonsterId = monsterIds[randomIndex];

              const selectedMonster = await getMonsterById(selectedMonsterId);

              if (selectedMonster) {
                setMonster({
                  id: selectedMonster.monsterId,
                  name: selectedMonster.name,
                  maxHealth: Math.floor(
                    selectedMonster.attributes.health *
                      20 *
                      difficultyMultiplier,
                  ),
                  health: Math.floor(
                    selectedMonster.attributes.health *
                      20 *
                      difficultyMultiplier,
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
            } else {
              setDefaultMonster(difficultyMultiplier);
            }
          }
        } catch (error) {
          console.error('Error initializing monster:', error);
          setDefaultMonster();
        } finally {
          setIsInitializing(false);
          setIsMonsterInitialized(true);
        }
      }
    };

    const setDefaultMonster = (multiplier = 1) => {
      setMonster({
        id: '',
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
      setIsInitializing(false);
    }
  }, [questId, isBoss, questMonsters, user?.attributes]);

  const [player, setPlayer] = useState({
    id: '',
    name: '',
    health: 0,
    maxHealth: 0,
    power: 0,
    speed: 0,
  });

  useEffect(() => {
    if (user && player.id === '') {
      const { health, power, speed } = getUserTotalAttributes(user, items);
      setPlayer({
        id: user.id,
        name: user.profileInfo.username,
        health: health * 20,
        maxHealth: health * 20,
        power: power * 2,
        speed: speed || 15,
      });

      setIsPlayerInitialized(true);
    }
  }, [user]);

  const [combatLog, setCombatLog] = useState<string[]>([]);

  const [strongAttackCooldown, setStrongAttackCooldown] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [potions, setPotions] = useState({
    small:
      user?.consumables.filter((id) => id === 'health_potion_small').length ||
      0,
    large:
      user?.consumables.filter((id) => id === 'health_potion_large').length ||
      0,
  });

  // const NORMAL_ATTACK = 20;
  // const STRONG_ATTACK = 35;

  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [modalType, setModalType] = useState<'victory' | 'defeat'>('victory');

  const [isBossFight] = useState(() => {
    return isBoss === 'true';
  });

  useEffect(() => {
    if (
      isMonsterInitialized &&
      isPlayerInitialized &&
      player &&
      monster &&
      !isInitializing
    ) {
      const maxSpeed = Math.max(player.speed, monster.speed);
      const incrementValue = 25;
      const speedBarInterval = setInterval(() => {
        if (currentTurnEntity === null) {
          setPlayerCharge((prev) => {
            // Normalize gain rate based on max speed
            const newCharge = prev + (player.speed / maxSpeed) * incrementValue;
            console.log('Player charge:', newCharge);
            return newCharge >= 100 ? 100 : newCharge;
          });

          setMonsterCharge((prev) => {
            const newCharge =
              prev + (monster.speed / maxSpeed) * incrementValue;
            console.log('Monster charge:', newCharge);
            return newCharge >= 100 ? 100 : newCharge;
          });
        }
      }, 500);

      return () => {
        console.log('Clearing intervals');
        clearInterval(speedBarInterval);
      };
    }
  }, [
    player.speed,
    monster.speed,
    isMonsterInitialized,
    isInitializing,
    currentTurnEntity,
  ]);

  useEffect(() => {
    if (currentTurnEntity === 'monster') {
      handleMonsterTurn();
    }
  }, [currentTurnEntity]);

  useEffect(() => {
    console.log(
      'Player charge:',
      playerCharge,
      'Monster charge:',
      monsterCharge,
    );
    if (
      isMonsterInitialized &&
      isPlayerInitialized &&
      (playerCharge >= 100 || monsterCharge >= 100)
    ) {
      // Reduce charge overflow for both entities if applicable
      let overchargeAmount = 0;

      let newPlayerCharge = playerCharge;
      let newMonsterCharge = monsterCharge;

      // If both entities are overcharged, reduce both by the same amount
      if (newPlayerCharge >= 100 && newMonsterCharge >= 100) {
        overchargeAmount = Math.max(newPlayerCharge, newMonsterCharge) - 100;
        newPlayerCharge -= overchargeAmount;
        newMonsterCharge -= overchargeAmount;
      } else if (newPlayerCharge >= 100) {
        overchargeAmount = newPlayerCharge - 100;
        newPlayerCharge -= overchargeAmount;
      } else if (newMonsterCharge >= 100) {
        overchargeAmount = newMonsterCharge - 100;
        newMonsterCharge -= overchargeAmount;
      } else {
        overchargeAmount = 0;
      }

      // Prioritize turn change based on charge
      if (newPlayerCharge >= 100 && newMonsterCharge >= 100) {
        console.log('Both entities are charged');
        setCurrentTurnEntity('player');
      } else if (newPlayerCharge >= 100) {
        setCurrentTurnEntity('player');
      } else if (newMonsterCharge >= 100) {
        setCurrentTurnEntity('monster');
      }

      // if (playerCharge >= 100) {
      //   // Player turn
      //   setCurrentTurnEntity('player');
      // }

      // if (monsterCharge >= 100) {
      //   setCurrentTurnEntity('monster');
      // }
    }
  }, [playerCharge, monsterCharge, isMonsterInitialized, isPlayerInitialized]);

  const resetCombatState = () => {
    setStrongAttackCooldown(0);
    setPotions({
      small:
        user?.consumables.filter((id) => id === 'health_potion_small').length ||
        0,
      large:
        user?.consumables.filter((id) => id === 'health_potion_large').length ||
        0,
    });
    setIsAnimating(false);
    setShowVictoryModal(false);
    setCombatLog([]);
    setSmallPotionsAwarded(0);
    setLargePotionAwarded(false);
    setGoldAwarded(0);
  };

  useEffect(() => {
    resetCombatState();
  }, []);

  const handleContinue = async () => {
    if (modalType === 'victory' && user?.id) {
      try {
        const updatedProgress = {
          ...user.currentQuest.progress,
          [questId]: nextProgress,
        };

        const result = await updateUserProfile(user.id, {
          currentQuest: {
            id: questId,
            progress: updatedProgress,
          },
        });

        if (result.success) {
          setUser({
            ...user,
            currentQuest: {
              id: questId,
              progress: updatedProgress,
            },
          });
        }
      } catch (error) {
        console.error('Failed to update quest progress:', error);
        Alert.alert(
          'Error',
          'Failed to update quest progress. Please try again.',
        );
      }
    }

    router.replace('/(tabs)/quest');
    resetCombatState();
  };

  useEffect(() => {
    const resetCombat = () => {
      if (user) {
        const { health, power, speed } = getUserTotalAttributes(user, items);
        setPlayer({
          id: user.id,
          name: user.profileInfo.username,
          health: health * 20,
          maxHealth: health * 20,
          power: power * 2,
          speed: speed || 15,
        });
      } else {
        setPlayer({
          id: '',
          name: '',
          health: 0,
          maxHealth: 0,
          power: 0,
          speed: 0,
        });
      }
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
    const variation = 0.2; // 20% variation
    const randomFactor = 1 + (Math.random() * 2 - 1) * variation;
    return Math.floor(baseDamage * randomFactor);
  };

  const endPlayerTurn = () => {
    setPlayerCharge(0);
    setCurrentTurnEntity(null);
  };

  const handleAttack = async (isStrong = false) => {
    if (isAnimating) return;

    const baseDamage = isStrong
      ? Math.floor(player.power * 1.75)
      : player.power;
    const damage = getRandomDamage(baseDamage);

    if (isStrong && strongAttackCooldown > 0) {
      setCombatLog((prev) => [...prev, 'Strong attack is on cooldown!']);
      return;
    }

    setIsAnimating(true);
    setPlayerSpriteState(
      isStrong ? SpriteState.ATTACK_1 : SpriteState.ATTACK_2,
    );
    setMonsterSpriteState(SpriteState.DAMAGED);

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

    setIsAnimating(false);
    setPlayerSpriteState(SpriteState.IDLE);
    setMonsterSpriteState(SpriteState.IDLE);

    if (strongAttackCooldown > 0) {
      setStrongAttackCooldown((prev) => prev - 1);
    }

    endPlayerTurn();
  };

  const handlePotion = async (type: 'small' | 'large') => {
    console.log(user, isAnimating, currentTurnEntity, potions[type]);
    if (
      !user?.id ||
      isAnimating ||
      currentTurnEntity !== 'player' ||
      potions[type] <= 0
    )
      return;

    setIsAnimating(true);

    const potionId =
      type === 'small' ? 'health_potion_small' : 'health_potion_large';
    const healPercentage = type === 'small' ? 0.2 : 0.5; // 20% for small, 50% for large
    const maxHealth = player.maxHealth;
    const healAmount = Math.floor(maxHealth * healPercentage);
    const newHealth = Math.min(maxHealth, player.health + healAmount);

    const updatedConsumables = [...user.consumables];
    const potionIndex = updatedConsumables.indexOf(potionId);
    if (potionIndex > -1) {
      updatedConsumables.splice(potionIndex, 1);
    }

    try {
      const result = await updateUserProfile(user.id, {
        consumables: updatedConsumables,
      });

      if (result.success) {
        setUser({
          ...user,
          consumables: updatedConsumables,
        });

        // Update player's health correctly
        setPlayer((prev) => ({ ...prev, health: newHealth }));
        setPotions((prev) => ({ ...prev, [type]: prev[type] - 1 }));
        setCombatLog((prev) => [...prev, `You healed for ${healAmount} HP!`]);

        if (strongAttackCooldown > 0) {
          setStrongAttackCooldown((prev) => prev - 1);
        }
      }
    } catch (error) {
      console.error('Failed to use potion:', error);
      Alert.alert('Error', 'Failed to use potion. Please try again.');
    } finally {
      setIsAnimating(false);
      endPlayerTurn();
    }
  };

  const [smallPotionsAwarded, setSmallPotionsAwarded] = useState(0);
  const [largePotionAwarded, setLargePotionAwarded] = useState(false);
  const [goldAwarded, setGoldAwarded] = useState(0);

  const handleVictory = async () => {
    if (!user?.id) return;

    // Generate random potion rewards
    const smallPotions = Math.floor(Math.random() * 4); // 0-3 small potions
    const largePotion = Math.random() < 0.25; // 25% chance for large potion

    // Generate random gold reward
    // Regular monsters: 10-30 gold
    // Bosses: 50-100 gold
    const baseGold = isBossFight ? 50 : 10;
    const maxGoldBonus = isBossFight ? 50 : 20;
    const goldReward = baseGold + Math.floor(Math.random() * maxGoldBonus);

    setSmallPotionsAwarded(smallPotions);
    setLargePotionAwarded(largePotion);
    setGoldAwarded(goldReward);

    // Create array of new potions
    const newPotions = [
      ...Array(smallPotions).fill('health_potion_small'),
      ...(largePotion ? ['health_potion_large'] : []),
    ];

    // Add new potions to existing consumables and update gold
    const updatedConsumables = [...user.consumables, ...newPotions];
    const updatedGold = user.gold + goldReward;

    try {
      const result = await updateUserProfile(user.id, {
        consumables: updatedConsumables,
        gold: updatedGold,
      });

      if (result.success) {
        setUser({
          ...user,
          consumables: updatedConsumables,
          gold: updatedGold,
        });
      }
    } catch (error) {
      console.error('Failed to update rewards:', error);
    }

    setModalType('victory');
    setShowVictoryModal(true);
  };

  const handleDefeat = () => {
    setModalType('defeat');
    setShowVictoryModal(true);
  };

  const playerPosition = useRef(new Animated.Value(0)).current;
  const monsterPosition = useRef(new Animated.Value(0)).current;

  // const animateSpriteToPosition = (
  //   animatedValue: Animated.Value,
  //   toValue: number,
  // ) => {
  //   Animated.timing(animatedValue, {
  //     toValue,
  //     duration: 500,
  //     useNativeDriver: false,
  //   }).start();
  // };

  const animateSpriteToPosition: (
    animatedValue: Animated.Value,
    toValue: number,
  ) => void = (animatedValue, toValue) => {
    const duration = 300;
    Animated.timing(animatedValue, {
      toValue,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    animateSpriteToPosition(playerPosition, playerCharge);
    animateSpriteToPosition(monsterPosition, monsterCharge);
  }, [playerCharge, monsterCharge]);

  // useEffect(() => {
  //   const playerCharge = getChargePercentage(player.id);
  //   console.log(playerCharge);
  //   animateSpriteToPosition(playerPosition, playerCharge);

  //   const monsterCharge = getChargePercentage('monster');
  //   console.log(monsterCharge);
  //   animateSpriteToPosition(monsterPosition, monsterCharge);
  // }, [currentTurnIndex, turnQueue]);

  const renderTurnOrder = () => {
    return (
      <View className="my-4">
        <View className="h-24 rounded-xl p-4">
          <View className="h-full relative flex-row items-center">
            <View className="absolute left-4 right-4 top-2/3 h-[5px] bg-yellow border border-black">
              <View className="absolute top-[-4px] -left-1 w-[6px] h-[12px] bg-yellow rounded-full border border-black" />
              <View className="absolute top-[-4px] -right-1 w-[6px] h-[12px] bg-yellow rounded-full border border-black" />
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
                    scale: currentTurnEntity === 'player' ? 1.25 : 1,
                  },
                ],
                zIndex: currentTurnEntity === 'player' ? 2 : 1,
              }}
            >
              <AnimatedSprite
                id={user?.spriteID}
                width={48}
                height={48}
                state={
                  currentTurnEntity === 'player' ||
                  currentTurnEntity === 'monster'
                    ? SpriteState.IDLE
                    : SpriteState.MOVE
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
                    scale: currentTurnEntity === 'monster' ? 1.25 : 1,
                  },
                ],
                zIndex: currentTurnEntity === 'monster' ? 2 : 1,
              }}
            >
              <AnimatedSprite
                id={monster.spriteId}
                width={48}
                height={48}
                state={
                  currentTurnEntity === 'monster' ||
                  currentTurnEntity === 'player'
                    ? SpriteState.IDLE
                    : SpriteState.MOVE
                }
              />
            </Animated.View>
          </View>
        </View>
      </View>
    );
  };

  const handleMonsterTurn = async () => {
    if (
      isAnimating ||
      currentTurnEntity !== 'monster' ||
      (!isMonsterInitialized && !isBossFight)
    )
      return;

    setIsAnimating(true);
    const baseMonsterDamage = monster.power;
    const monsterDamage = getRandomDamage(baseMonsterDamage);

    await delay(1000);

    setMonsterSpriteState(SpriteState.ATTACK_1);
    setPlayerSpriteState(SpriteState.DAMAGED);
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
    setPlayerSpriteState(SpriteState.IDLE);

    if (player.health - monsterDamage <= 0) {
      setIsAnimating(false);
      handleDefeat();
      return;
    }

    await delay(500);
    // setCurrentTurnIndex((prev) => (prev + 1) % turnQueue.length);
    setMonsterCharge(0);
    setCurrentTurnEntity(null);
    setIsAnimating(false);
  };

  // useEffect(() => {
  //   if (turnQueue.length && !isAnimating) {
  //     if (turnQueue[currentTurnIndex]?.isPlayer) {
  //       // Player turn
  //     } else {
  //       handleMonsterTurn();
  //     }
  //   }
  // }, [currentTurnIndex, turnQueue, isAnimating]);

  const spriteSize = useMemo(() => {
    const { width } = Dimensions.get('window');
    const spriteSize = width / 3;
    return spriteSize;
  }, []);

  const battleBackgrounds = [
    require('@/assets/backgrounds/bg_fight_screen_1.png'),
    require('@/assets/backgrounds/bg_fight_screen_2.png'),
    // Add more backgrounds as needed
  ];

  const [battleBackground] = useState(
    () =>
      battleBackgrounds[Math.floor(Math.random() * battleBackgrounds.length)],
  );

  if (!isMonsterInitialized || !isPlayerInitialized || isInitializing) {
    return (
      <SafeAreaView className="flex-1">
        <ImageBackground
          source={battleBackground}
          className="flex-1 items-center justify-center"
        >
          <View className="bg-black/50 p-6 rounded-xl items-center">
            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="text-xl text-white mt-4">
              Preparing for battle...
            </Text>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ImageBackground
        source={battleBackground}
        className="flex-1 px-6 flex-col justify-between bg-yellow h-full mt-5"
      >
        {renderTurnOrder()}

        <View className="flex-1 justify-end items-center h-full">
          <View className="w-full rounded-xl">
            <View className="flex-row justify-between items-start mb-[10px]">
              <View className="w-1/2 pr-4 bg-black/40 p-2 rounded">
                <Text className="text-md font-bold mb-1 text-white">
                  {monster.name}
                </Text>
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

              <View
                className="relative w-1/2 items-center"
                style={{
                  height: spriteSize,
                }}
              >
                {isBoss === 'true' ? (
                  <View className="absolute bottom-0">
                    <AnimatedSprite
                      id={monster.spriteId}
                      width={spriteSize * 2}
                      height={spriteSize * 2}
                      state={monsterSpriteState}
                      direction="left"
                    />
                  </View>
                ) : (
                  <AnimatedSprite
                    id={monster.spriteId}
                    width={spriteSize}
                    height={spriteSize}
                    state={monsterSpriteState}
                  />
                )}
              </View>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="w-1/2 items-center right-5">
                <AnimatedSprite
                  id={user?.spriteID}
                  width={spriteSize}
                  height={spriteSize}
                  state={playerSpriteState}
                />
              </View>

              <View className="w-1/2 pl-4 bg-black/40 p-2 rounded">
                <Text className="text-md font-bold mb-1 text-white">
                  {player.name}
                </Text>
                <View className="w-full h-4 bg-gray/80 rounded-full overflow-hidden border border-black border-2">
                  <View
                    className="h-full bg-green"
                    style={{
                      width: `${(player.health / player.maxHealth) * 100}%`,
                    }}
                  />
                </View>
                <Text className="text-sm mt-1 text-white">
                  HP: {player.health}/{player.maxHealth}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="h-[90px] mt-8 mb-1 justify-end">
          <View
            className={clsx('w-full p-2 bg-black/50 rounded max-h-[90px]', {
              hidden: combatLog.length === 0,
            })}
            testID="combat-log"
          >
            {combatLog.slice(-3).map((log, index) => (
              <Text key={index} className="text-sm mb-1 text-white w-full">
                {log}
              </Text>
            ))}
          </View>
        </View>

        <View className="flex-row w-full mb-8">
          <View className="flex-1 mr-2">
            <Text
              className="text-lg font-bold mb-2 text-white"
              style={{
                textShadowColor: '#000',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 15,
              }}
            >
              MOVES
            </Text>
            <View className="space-y-2">
              <Pressable
                className={`bg-white/90 p-3 rounded shadow ${isAnimating || currentTurnEntity !== 'player' ? 'opacity-50' : ''}`}
                onPress={() => handleAttack(false)}
                disabled={isAnimating || currentTurnEntity !== 'player'}
                testID="normal-attack-button"
              >
                <Text className="text-center">Attack</Text>
              </Pressable>
              <Pressable
                className={`bg-white/90 py-3 rounded shadow ${
                  strongAttackCooldown > 0 ||
                  isAnimating ||
                  currentTurnEntity !== 'player'
                    ? 'opacity-50'
                    : ''
                }`}
                onPress={() => handleAttack(true)}
                disabled={
                  strongAttackCooldown > 0 ||
                  isAnimating ||
                  currentTurnEntity !== 'player'
                }
                testID="strong-attack-button"
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
            <Text
              className="text-lg font-bold mb-2 text-white drop-shadow"
              style={{
                textShadowColor: '#000',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 15,
              }}
            >
              POTIONS
            </Text>
            <View className="space-y-2">
              <Pressable
                className={`bg-white/90 p-3 rounded shadow ${
                  potions.small <= 0 ||
                  isAnimating ||
                  currentTurnEntity !== 'player'
                    ? 'opacity-50'
                    : ''
                }`}
                testID="small-potion-button"
                onPress={() => handlePotion('small')}
                disabled={
                  potions.small <= 0 ||
                  isAnimating ||
                  currentTurnEntity !== 'player'
                }
              >
                <Text className="text-center">
                  Small Potion
                  <Text className="text-gray-600"> ({potions.small})</Text>
                </Text>
              </Pressable>
              <Pressable
                className={`bg-white/90 p-3 rounded shadow ${
                  potions.large <= 0 ||
                  isAnimating ||
                  currentTurnEntity !== 'player'
                    ? 'opacity-50'
                    : ''
                }`}
                testID="large-potion-button"
                onPress={() => handlePotion('large')}
                disabled={
                  potions.large <= 0 ||
                  isAnimating ||
                  currentTurnEntity !== 'player'
                }
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
                  <Text className="text-2xl font-bold mb-4">
                    You have defeated {monster.name}!
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

                  {(smallPotionsAwarded > 0 ||
                    largePotionAwarded ||
                    goldAwarded > 0) && (
                    <>
                      <Text className="text-lg font-bold mb-2">
                        Victory Rewards:
                      </Text>

                      {goldAwarded > 0 && (
                        <Text className="text-lg mb-2 text-gold font-semibold">
                          {goldAwarded} Gold
                        </Text>
                      )}

                      <View className="flex-row items-center justify-center mb-4">
                        {smallPotionsAwarded > 0 && (
                          <View className="flex-row items-center">
                            <Image
                              source={require('../assets/sprites/health_potion_small.png')}
                              style={{ width: 48, height: 48 }}
                            />
                            <Text className="text-lg ml-1 mr-4">
                              ×{smallPotionsAwarded}
                            </Text>
                          </View>
                        )}
                        {largePotionAwarded && (
                          <View className="flex-row items-center">
                            <Image
                              source={require('../assets/sprites/health_potion_large.png')}
                              style={{ width: 48, height: 48 }}
                            />
                            <Text className="text-lg ml-1">×1</Text>
                          </View>
                        )}
                      </View>
                    </>
                  )}
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

              <FQButton onPress={handleContinue} className="w-full">
                <Text className="text-white text-xl font-bold tracking-wider text-center">
                  CONTINUE
                </Text>
              </FQButton>
            </View>
          </View>
        </Modal>

        <StatusBar backgroundColor="#161622" style="light" />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Combat;
