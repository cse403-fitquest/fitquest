import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AnimatedSprite } from './AnimatedSprite';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';

interface QuestNodeModalProps {
  visible: boolean;
  onClose: () => void;
  nodeInfo: {
    isBoss: boolean;
    milestone: number;
    possibleMonsters: {
      monsterId: string;
      spriteId: AnimatedSpriteID;
    }[];
  } | null;
}

export const QuestNodeModal = ({
  visible,
  onClose,
  nodeInfo,
}: QuestNodeModalProps) => {
  if (!nodeInfo) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID="quest-node-modal"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {nodeInfo.isBoss ? 'Boss Node' : 'Quest Node'}
          </Text>
          <Text style={styles.milestone}>
            Stage {Math.floor(nodeInfo.milestone / 50)}
          </Text>

          <Text style={styles.subtitle}>Possible encounters:</Text>
          <View style={styles.monstersGrid}>
            {nodeInfo.possibleMonsters.map(({ monsterId, spriteId }) => (
              <View key={monsterId} style={styles.monsterContainer}>
                <AnimatedSprite
                  id={spriteId}
                  width={120}
                  height={120}
                  state={SpriteState.IDLE}
                />
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  milestone: {
    fontSize: 16,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  monstersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  monsterContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
