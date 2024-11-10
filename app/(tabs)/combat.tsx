import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Pressable, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const initialPlayer = {
  name: 'Player',
  health: 1000,
  attack: 2500,
  defense: 5,
};

const questThemes = {
  '1': {
    // Big Chungus Quest
    backgroundColor: '#FFE4E1', // Misty Rose
    bossBackground: '#FF6B6B',
    normalMonsters: [
      { name: 'Baby Chungus', health: 80, attack: 8, defense: 3 },
      { name: 'Chungus Jr.', health: 85, attack: 9, defense: 4 },
      { name: 'Chungling', health: 75, attack: 7, defense: 2 },
    ],
    boss: { name: 'Big Chungus', health: 200, attack: 15, defense: 8 },
  },
  '2': {
    // Jimmy Two-Toes Quest
    backgroundColor: '#E6E6FA', // Lavender
    bossBackground: '#9370DB',
    normalMonsters: [
      { name: 'One-Toe Bandit', health: 70, attack: 9, defense: 2 },
      { name: 'Three-Toe Thug', health: 85, attack: 7, defense: 4 },
      { name: 'Four-Toe Fighter', health: 80, attack: 8, defense: 3 },
    ],
    boss: { name: 'Jimmy Two-Toes', health: 180, attack: 14, defense: 7 },
  },
  '3': {
    // Swamp Hydra Quest
    backgroundColor: '#98FF98', // Mint Green
    bossBackground: '#2E8B57',
    normalMonsters: [
      { name: 'Swamp Crawler', health: 75, attack: 8, defense: 3 },
      { name: 'Marsh Beast', health: 85, attack: 7, defense: 4 },
      { name: 'Bog Creature', health: 80, attack: 9, defense: 2 },
    ],
    boss: { name: 'The Swamp Hydra', health: 220, attack: 16, defense: 9 },
  },
  '4': {
    // Lightning Ogre Quest
    backgroundColor: '#FFFACD', // Lemon Chiffon
    bossBackground: '#FFD700',
    normalMonsters: [
      { name: 'Static Imp', health: 70, attack: 9, defense: 2 },
      { name: 'Thunder Goblin', health: 85, attack: 7, defense: 4 },
      { name: 'Storm Troll', health: 80, attack: 8, defense: 3 },
    ],
    boss: { name: 'The Lightning Ogre', health: 190, attack: 17, defense: 6 },
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
      return {
        name: currentQuest.boss.name,
        health: currentQuest.boss.health,
        attack: currentQuest.boss.attack,
      };
    } else {
      return {
        name: 'Monster',
        health: 100,
        attack: 15,
      };
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

  const NORMAL_ATTACK = 20;
  const STRONG_ATTACK = 35;
  const SMALL_POTION_HEAL = 30;
  const LARGE_POTION_HEAL = 70;

  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [modalType, setModalType] = useState<'victory' | 'defeat'>('victory');
  const [expGained, setExpGained] = useState(0);

  // Add state to track if this is the final boss fight
  const [isBossFight] = useState(() => {
    // Check if this is the final fight of the quest
    return isBoss === 'true';
  });

  // Reset function
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

  // Add this useEffect to reset state when component mounts (new fight starts)
  useEffect(() => {
    resetCombatState();
  }, []);

  // Also add reset to the continue button press handler
  const handleContinue = () => {
    if (modalType === 'victory') {
      setPlayer((prev) => ({
        ...prev,
        exp: 0 + expGained,
      }));
    }
    resetCombatState();
    router.back();
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

    const damage = isStrong ? STRONG_ATTACK : NORMAL_ATTACK;

    if (isStrong && strongAttackCooldown > 0) {
      setCombatLog((prev) => [...prev, 'Strong attack is on cooldown!']);
      return;
    }

    setIsAnimating(true);

    // Player attack
    const newMonsterHealth = Math.max(0, monster.health - damage);
    setMonster((prev) => ({ ...prev, health: newMonsterHealth }));
    setCombatLog((prev) => [...prev, `You dealt ${damage} damage!`]);

    if (isStrong) {
      setStrongAttackCooldown(2); // Set cooldown
    }

    // Check if monster defeated
    if (newMonsterHealth <= 0) {
      setIsAnimating(false);
      handleVictory();
      return;
    }

    // Wait before monster's turn
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Monster attack
    const monsterDamage = currentQuest.boss.attack;
    setPlayer((prev) => ({
      ...prev,
      health: Math.max(0, prev.health - monsterDamage),
    }));
    setCombatLog((prev) => [
      ...prev,
      `${monster.name} dealt ${monsterDamage} damage!`,
    ]);

    // Check if player defeated
    if (player.health - monsterDamage <= 0) {
      setIsAnimating(false);
      handleDefeat();
      return;
    }

    // Reduce cooldown
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

    // Wait before monster's turn
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Monster's turn after using potion
    const monsterDamage = currentQuest.boss.attack;
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

  // const handleMonsterTurn = async () => {
  //   setIsAnimating(true);
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  //   const monsterDamage = currentQuest.boss.attack;
  //   setPlayer((prev) => ({
  //     ...prev,
  //     health: Math.max(0, prev.health - monsterDamage),
  //   }));
  //   setCombatLog((prev) => [
  //     ...prev,
  //     `${monster.name} dealt ${monsterDamage} damage!`,
  //   ]);

  //   if (strongAttackCooldown > 0) {
  //     setStrongAttackCooldown((prev) => prev - 1);
  //   }

  //   setIsAnimating(false);
  // };

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
    <SafeAreaView className="flex-1 p-4">
      <View className="h-2 bg-gray-200 rounded-full mb-8">
        <View className="h-full bg-blue-500 rounded-full w-1/2" />
      </View>

      <Text className="text-2xl font-bold text-center mb-6">{questName}</Text>

      {/* Combat Area */}
      <View className="flex-1">
        {/* Monster Stats */}
        <View className="items-center mb-8">
          <View
            className={`w-20 h-20 rounded-full ${isBoss === 'true' ? 'bg-red-500' : 'bg-green-500'} mb-2`}
          />
          <Text className="text-lg font-bold mb-1">{monster.name}</Text>
          <View className="w-32 h-2 bg-gray-200 rounded-full">
            <View
              className="h-full bg-green-500 rounded-full"
              style={{
                width: `${(monster.health / currentQuest.boss.health) * 100}%`,
              }}
            />
          </View>
          <Text className="text-sm">
            HP: {monster.health}/{currentQuest.boss.health}
          </Text>
        </View>

        {/* Player Stats */}
        <View className="items-center">
          <View className="w-20 h-20 rounded-full bg-blue-500 mb-2" />
          <Text className="text-lg font-bold mb-1">{player.name}</Text>
          <View className="w-32 h-2 bg-gray-200 rounded-full">
            <View
              className="h-full bg-green-500 rounded-full"
              style={{
                width: `${(player.health / initialPlayer.health) * 100}%`,
              }}
            />
          </View>
          <Text className="text-sm">
            HP: {player.health}/{initialPlayer.health}
          </Text>
        </View>
      </View>

      {/* Combat Log */}
      <View className="mb-4 p-2 bg-white/80 rounded">
        {combatLog.slice(-3).map((log, index) => (
          <Text key={index} className="text-sm mb-1">
            {log}
          </Text>
        ))}
      </View>

      {/* Action Buttons */}
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
