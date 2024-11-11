import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Pressable, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';
import { AnimatedSprite } from '@/components/AnimatedSprite';

const initialPlayer = {
  id: '',
  name: 'Player',
  health: 100,
  power: 10000,
};

const questThemes = {
  '1': {
    backgroundColor: '#FFE4E1',
    bossBackground: '#FF6B6B',
    normalMonsters: [
      {
        name: 'Baby Chungus',
        maxHealth: 80,
        health: 80,
        power: 8,
        spriteId: AnimatedSpriteID.SLIME_GREEN,
      },
      {
        name: 'Chungus Jr.',
        maxHealth: 85,
        health: 85,
        power: 9,
        spriteId: AnimatedSpriteID.SLIME_BLUE,
      },
      {
        name: 'Chungling',
        maxHealth: 75,
        health: 75,
        power: 7,
        spriteId: AnimatedSpriteID.SLIME_RED,
      },
    ],
    boss: {
      name: 'Big Chungus',
      maxHealth: 200,
      health: 200,
      power: 15,
      spriteId: AnimatedSpriteID.MINOTAUR_RED,
    },
  },
  '2': {
    backgroundColor: '#E6E6FA',
    bossBackground: '#9370DB',
    normalMonsters: [
      {
        name: 'Flaming Skull',
        maxHealth: 70,
        health: 70,
        power: 9,
        spriteId: AnimatedSpriteID.FIRE_SKULL_RED,
      },
      {
        name: 'Firey Skull',
        maxHealth: 85,
        health: 85,
        power: 7,
        spriteId: AnimatedSpriteID.FIRE_SKULL_BLUE,
      },
    ],
    boss: {
      name: 'Jimmy Two-Toes',
      maxHealth: 180,
      health: 180,
      power: 14,
      spriteId: AnimatedSpriteID.CHOMPBUG_GREEN,
    },
  },
};

const Combat = () => {
  const { isBoss, questId, questName, uniqueKey } = useLocalSearchParams();
  const currentQuest = questThemes[questId as keyof typeof questThemes];

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
      return { ...currentQuest.boss };
    } else {
      const randomMonster =
        currentQuest.normalMonsters[
          Math.floor(Math.random() * currentQuest.normalMonsters.length)
        ];
      return { ...randomMonster };
    }
  });
  const [combatLog, setCombatLog] = useState<string[]>([]);

  const [isPlayerTurn] = useState(true);
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

  const handleAttack = async (isStrong = false) => {
    if (!isPlayerTurn || isAnimating) return;

    const damage = isStrong ? Math.floor(player.power * 1.5) : player.power;

    if (isStrong && strongAttackCooldown > 0) {
      setCombatLog((prev) => [...prev, 'Strong attack is on cooldown!']);
      return;
    }

    setIsAnimating(true);

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

    if (player.health - monsterDamage <= 0) {
      setIsAnimating(false);
      handleDefeat();
      return;
    }

    if (strongAttackCooldown > 0) {
      setStrongAttackCooldown((prev) => prev - 1);
    }

    setIsAnimating(false);
  };

  const handlePotion = async (type: 'small' | 'large') => {
    if (!isPlayerTurn || isAnimating || potions[type] <= 0) return;
    setIsAnimating(true);

    const healAmount = type === 'small' ? SMALL_POTION_HEAL : LARGE_POTION_HEAL;
    const newHealth = Math.min(
      initialPlayer.health,
      player.health + healAmount,
    );

    setPlayer((prev) => ({ ...prev, health: newHealth }));
    setPotions((prev) => ({ ...prev, [type]: prev[type] - 1 }));
    setCombatLog((prev) => [...prev, `You healed for ${healAmount} HP!`]);

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

    if (strongAttackCooldown > 0) {
      setStrongAttackCooldown((prev) => prev - 1);
    }

    setIsAnimating(false);
  };

  const handleVictory = () => {
    const exp = Math.floor(Math.random() * 20) + 30;
    setExpGained(exp);
    setModalType('victory');
    setShowVictoryModal(true);
  };

  const handleDefeat = () => {
    setModalType('defeat');
    setShowVictoryModal(true);
  };

  return (
    <SafeAreaView className="flex-1 p-4 pb-20">
      <View className="h-2 bg-gray-200 rounded-full mb-8">
        <View className="h-full bg-blue-500 rounded-full w-1/2" />
      </View>

      <Text className="text-2xl font-bold text-center mb-6">{questName}</Text>
      <View className="flex-1">
        <View className="flex-row justify-between items-start mb-8">
          <View className="w-1/2 pr-4 border border-gray p-5 rounded">
            <Text className="text-lg font-bold mb-1">{monster.name}</Text>
            <View className="w-full h-4 bg-gray rounded-full overflow-hidden b-black border border-black border-2">
              <View
                className="h-full bg-green"
                style={{
                  width: `${(monster.health / monster.maxHealth!) * 100}%`,
                }}
              />
            </View>
            <Text className="text-sm mt-1">
              HP: {monster.health}/
              {isBossFight ? currentQuest.boss.health : monster.maxHealth}
            </Text>
          </View>

          <View className="w-1/2 items-end">
            <AnimatedSprite
              id={monster.spriteId}
              width={120}
              height={120}
              state={SpriteState.IDLE}
            />
          </View>
        </View>

        <View className="flex-row justify-between items-end mt-auto mb-8">
          <View className="w-1/2">
            <AnimatedSprite
              id={AnimatedSpriteID.HERO_20}
              width={120}
              height={120}
              state={SpriteState.IDLE}
            />
          </View>

          <View className="w-1/2 pl-4 border border-gray p-5 rounded">
            <Text className="text-lg font-bold mb-1">{player.name}</Text>
            <View className="w-full h-4 bg-gray rounded-full overflow-hidden border border-black border-2">
              <View
                className="h-full bg-green"
                style={{
                  width: `${(player.health / initialPlayer.health) * 100}%`,
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
                <Text className="text-2xl font-bold mb-6">
                  You have defeated {isBossFight ? 'Boss' : 'the monster'}!
                </Text>

                <View className="h-32 w-full items-center justify-center mb-6 border-2 border-dashed border-gray-200 rounded-lg">
                  <Text className="text-gray-400 italic">
                    Victory Animation Here
                  </Text>
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
                <Text className="text-2xl font-bold mb-6 text-red-500">
                  Defeated by {monster.name}!
                </Text>

                <View className="h-32 w-full items-center justify-center mb-6 border-2 border-dashed border-gray-200 rounded-lg">
                  <Text className="text-gray-400 italic">
                    Defeat Animation Here
                  </Text>
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
    </SafeAreaView>
  );
};

export default Combat;
