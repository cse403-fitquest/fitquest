import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Pressable, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from '@/store/user';

const questThemes = {
  '1': {
    normalMonsters: [
      {
        name: 'Green Slime',
        maxHealth: 100,
        health: 100,
        power: 15,
        speed: 20,
        spriteId: AnimatedSpriteID.SLIME_GREEN,
      },
      {
        name: 'Blue Slime',
        maxHealth: 100,
        health: 100,
        power: 15,
        speed: 20,
        spriteId: AnimatedSpriteID.SLIME_BLUE,
      },
      {
        name: 'Red Slime',
        maxHealth: 100,
        health: 100,
        power: 15,
        speed: 20,
        spriteId: AnimatedSpriteID.SLIME_RED,
      },
    ],
    boss: {
      name: 'Red Minotaur',
      maxHealth: 200,
      health: 200,
      power: 15,
      speed: 20,
      spriteId: AnimatedSpriteID.MINOTAUR_RED,
    },
  },
  '2': {
    normalMonsters: [
      {
        name: 'Flaming Skull',
        maxHealth: 70,
        health: 70,
        power: 9,
        speed: 4,
        spriteId: AnimatedSpriteID.FIRE_SKULL_RED,
      },
      {
        name: 'Blue Flaming Skull',
        maxHealth: 85,
        health: 85,
        power: 7,
        speed: 4,
        spriteId: AnimatedSpriteID.FIRE_SKULL_BLUE,
      },
    ],
    boss: {
      name: 'Green Chompbug',
      maxHealth: 180,
      health: 180,
      power: 14,
      speed: 14,
      spriteId: AnimatedSpriteID.CHOMPBUG_GREEN,
    },
  },
};

type TurnInfo = {
  id: string;
  name: string;
  speed: number;
  isPlayer: boolean;
};

const Combat = () => {
  const { isBoss, questId, questName, uniqueKey } = useLocalSearchParams();
  const currentQuest = questThemes[questId as keyof typeof questThemes];

  const { user } = useUserStore();

  // Initialize player stats from user data
  const initialPlayer = {
    id: user?.id || '',
    name: user?.profileInfo.username || 'Player',
    health: (user?.attributes.health || 6) * 20, // Scale health to 20 HP per point (default to 6 for testing)
    power: (user?.attributes.power || 15) * 2, // Use user data for power
    speed: user?.attributes.speed || 15, // Use user data for speed
  };

  const getNewMonster = () => {
    if (isBoss === 'true') {
      return { ...currentQuest.boss };
    }
    const randomIndex = Math.floor(
      Math.random() * currentQuest.normalMonsters.length,
    );
    return { ...currentQuest.normalMonsters[randomIndex] };
  };

  const [player, setPlayer] = useState(initialPlayer);

  const [monster, setMonster] = useState(() => {
    if (isBoss === 'true') {
      const scaledMonster = {
        ...currentQuest.boss,
        health: currentQuest.boss.health * 20, // Scale monster health to 20 HP per point
      };
      return { ...scaledMonster }; // Use scaled monster
    } else {
      const randomMonster =
        currentQuest.normalMonsters[
          Math.floor(Math.random() * currentQuest.normalMonsters.length)
        ];
      return { ...randomMonster, health: randomMonster.health * 20 }; // Scale normal monster health
    }
  });
  const [combatLog, setCombatLog] = useState<string[]>([]);

  // const [isPlayerTurn] = useState(true);
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
  const [expGained, setExpGained] = useState(0);

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

    const totalTurnsToCalculate = 20; // Arbitrary number to ensure enough turns are generated

    // Determine who should act first based on speed
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

    return turns;
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
      setPlayer((prev) => ({
        ...prev,
        exp: 0 + expGained,
      }));

      router.replace(`/(tabs)/quest`);
    } else {
      router.replace('/(tabs)/quest');
      resetCombatState();
    }
  };

  useEffect(() => {
    const resetCombat = () => {
      setPlayer({ ...initialPlayer });
      setMonster(getNewMonster());
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

    // Wait for animation to complete
    await delay(500);

    // Advance turn after player action
    setCurrentTurnIndex((prev) => (prev + 1) % turnQueue.length);
    setIsAnimating(false);
    setPlayerSpriteState(SpriteState.IDLE);

    // Decrement cooldowns only on player's turn
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

    // Advance turn after player action
    setCurrentTurnIndex((prev) => (prev + 1) % turnQueue.length);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Monster's turn
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

    // Advance turn after monster action
    setCurrentTurnIndex((prev) => (prev + 1) % turnQueue.length);
    setIsAnimating(false);
  };

  const handleVictory = async () => {
    const exp = Math.floor(Math.random() * 20) + 30;
    setExpGained(exp);
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
        health: (user.attributes.health || 6) * 20, // Ensure health is scaled when user data changes
        power: (user.attributes.power || 15) * 2,
        speed: user.attributes.speed || 15,
      }));
    }
  }, [user]); // Update player stats when user data changes

  const renderTurnOrder = () => (
    <View className="flex-row justify-center items-center space-x-2 mb-4 p-2 bg-gray-800 rounded-lg shadow-md">
      {[...Array(5)].map((_, index) => {
        const turn = turnQueue[currentTurnIndex + index];
        if (!turn) return null;

        return (
          <View
            key={index}
            className={`w-14 h-14 rounded-lg ${
              index === 0
                ? 'border-4 border-yellow-400 bg-yellow-100'
                : 'border border-gray-500 bg-gray-700'
            } justify-center items-center overflow-hidden shadow-sm`}
          >
            <View className="scale-[0.6]">
              <AnimatedSprite
                id={turn.isPlayer ? user?.spriteID : monster.spriteId}
                width={48}
                height={48}
                state={SpriteState.IDLE}
              />
            </View>
          </View>
        );
      })}
    </View>
  );

  // Add this new function for monster attacks
  const handleMonsterTurn = async () => {
    if (isAnimating || turnQueue[currentTurnIndex].isPlayer) return;

    setIsAnimating(true);
    const baseMonsterDamage = monster.power;
    const monsterDamage = getRandomDamage(baseMonsterDamage);

    // Add initial delay before monster attacks
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

    // Add additional delay after damage is dealt
    await delay(500);

    setMonsterSpriteState(SpriteState.IDLE);

    if (player.health - monsterDamage <= 0) {
      setIsAnimating(false);
      handleDefeat();
      return;
    }

    // Final delay before ending turn
    await delay(500);

    setCurrentTurnIndex((prev) => (prev + 1) % turnQueue.length);
    setIsAnimating(false);
  };

  // Add this useEffect to watch for turns
  useEffect(() => {
    if (turnQueue.length && !isAnimating) {
      if (turnQueue[currentTurnIndex].isPlayer) {
        // Player's turn logic can be handled by UI interactions
      } else {
        handleMonsterTurn();
      }
    }
  }, [currentTurnIndex, turnQueue, isAnimating]);

  // Update the getChargePercentage function
  const getChargePercentage = (entityId: string) => {
    // If it's currently this entity's turn, return 100%
    if (turnQueue[currentTurnIndex]?.id === entityId) {
      return 100;
    }

    // Find the next turn index for this entity
    const nextTurnIndex = turnQueue.findIndex(
      (turn, index) => index > currentTurnIndex && turn.id === entityId,
    );

    if (nextTurnIndex === -1) return 0;

    // Calculate percentage based on turns until next action
    const turnsUntilNext = nextTurnIndex - currentTurnIndex;
    return Math.max(0, ((5 - turnsUntilNext) / 5) * 100);
  };

  return (
    <SafeAreaView className="flex-1 p-4 pb-20 px-6 mt-[-50px]">
      <View className="h-2 bg-gray-200 rounded-full mb-12">
        <View className="h-full bg-blue-500 rounded-full w-1/2" />
      </View>

      <Text className="text-2xl font-bold text-center mb-4">{questName}</Text>

      {renderTurnOrder()}

      <View className="flex-1">
        <View className="flex-row justify-between items-start mb-[-30px] -mt-12">
          <View className="w-1/2 pl-4 mt-20 ml-[-12]">
            <Text className="text-lg font-bold mb-1">{monster.name}</Text>
            <View className="w-full h-4 bg-gray rounded-full overflow-hidden border border-black border-2">
              <View
                className="h-full bg-green"
                style={{
                  width: `${(monster.health / monster.maxHealth!) * 100}%`,
                }}
              />
            </View>
            <View className="w-full h-2 bg-gray rounded-full mt-1 overflow-hidden">
              <View
                className="h-full bg-blue"
                style={{
                  width: `${getChargePercentage('monster')}%`,
                }}
              />
            </View>
            <Text className="text-sm mt-1">
              HP: {monster.health}/
              {isBossFight ? currentQuest.boss.health : monster.maxHealth}
            </Text>
          </View>

          <View className="w-1/2 items-center ">
            <AnimatedSprite
              id={monster.spriteId}
              width={256}
              height={256}
              state={monsterSpriteState}
            />
          </View>
        </View>
        <View className="flex-row justify-between items-center mb-15 ">
          <View className="w-10 items-start ml-[-30px] ">
            <AnimatedSprite
              id={user?.spriteID}
              width={256}
              height={256}
              state={playerSpriteState}
            />
          </View>

          <View className="w-1/2 pl-4">
            <Text className="text-lg font-bold mb-1 ">{player.name}</Text>
            <View className="w-full h-4 bg-gray rounded-full overflow-hidden border border-black border-2">
              <View
                className="h-full bg-green"
                style={{
                  width: `${(player.health / initialPlayer.health) * 100}%`,
                }}
              />
            </View>
            <View className="w-full h-2 bg-gray rounded-full mt-1 overflow-hidden">
              <View
                className="h-full bg-blue"
                style={{
                  width: `${getChargePercentage(player.id)}%`,
                }}
              />
            </View>
            <Text className="text-sm mt-1">
              HP: {player.health}/{initialPlayer.health}
            </Text>
          </View>
        </View>
      </View>

      <View className="mb-4 p-2 bg-white/80 rounded">
        {combatLog.slice(-3).map((log, index) => (
          <Text key={index} className="text-sm mb-1">
            {log}
          </Text>
        ))}
      </View>

      <View className="flex-row">
        <View className="flex-1 mr-2">
          <Text className="text-lg font-bold mb-2">MOVES</Text>
          <View className="space-y-2">
            <Pressable
              className={`bg-white p-3 rounded shadow ${isAnimating ? 'opacity-50' : ''}`}
              onPress={() => handleAttack(false)}
              disabled={isAnimating}
            >
              <Text className="text-center">Attack</Text>
            </Pressable>
            <Pressable
              className={`bg-white p-3 rounded shadow ${
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
          <Text className="text-lg font-bold mb-2">POTIONS</Text>
          <View className="space-y-2">
            <Pressable
              className={`bg-white p-3 rounded shadow ${
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
              className={`bg-white p-3 rounded shadow ${
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
                        id={AnimatedSpriteID.SLIME_GREEN}
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

                <View className="mb-8">
                  <Text className="text-lg text-center">
                    EXP GAIN:{' '}
                    <Text className="text-yellow-500 font-bold">
                      {expGained} XP
                    </Text>
                  </Text>
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
                        id={AnimatedSpriteID.SLIME_RED}
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
  );
};

export default Combat;
