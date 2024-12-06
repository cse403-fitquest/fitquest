import { View, Text, Modal, TouchableOpacity } from 'react-native';
import React, { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IFQModal {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  visible: boolean;
  width?: number;

  setVisible: (visible: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;

  cancelText?: string;
  confirmText?: string;
  closeButton?: boolean;
}

const FQModal: FC<IFQModal> = ({
  title,
  subtitle,
  children,
  visible,
  width,
  setVisible,
  onConfirm,
  onCancel,
  cancelText,
  confirmText,
  closeButton = false,
}) => {
  if (!visible) {
    return null;
  }

  const handleCancel = () => {
    setVisible(false);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
      testID="FQModal"
    >
      <View className="relative h-full justify-center items-center w-full">
        <View
          className={
            'relative border border-gray shadow-lg rounded p-7 bg-white min-w-[200px] max-w-[90%]'
          }
          style={{ width: width }}
        >
          <View>
            <View className="flex-row justify-between items-center">
              <Text
                className="text-xl text-black font-bold"
                testID="FQModal-title"
              >
                {title}
              </Text>
              {closeButton && (
                <TouchableOpacity onPress={handleCancel}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              )}
            </View>
            {subtitle && (
              <Text
                className="text-black font-medium"
                testID="FQModal-subtitle"
              >
                {subtitle}
              </Text>
            )}
          </View>
          {children}
          <View className="flex-row justify-between mt-5">
            <View>
              {cancelText && (
                <TouchableOpacity
                  onPress={handleCancel}
                  testID="FQModal-cancel-button"
                >
                  <Text className="text-red-500 font-semibold">
                    {cancelText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View>
              <TouchableOpacity
                onPress={onConfirm}
                testID="FQModal-confirm-button"
              >
                <Text className="text-blue font-semibold">
                  {confirmText ? confirmText : 'CONFIRM'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FQModal;
