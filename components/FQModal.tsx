import { View, Text, Modal, TouchableOpacity } from 'react-native';
import React, { FC } from 'react';

interface IFQModal {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onConfirm: () => void;

  cancelText?: string;
  confirmText?: string;
}

const FQModal: FC<IFQModal> = ({
  title,
  subtitle,
  children,
  visible,
  setVisible,
  onConfirm,
  cancelText,
  confirmText,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
      testID="FQButton"
    >
      <View className="relative w-full h-full justify-center items-center">
        <View className="relative border border-gray shadow-lg rounded p-7 bg-white min-w-[200px] max-w-[75%]">
          <View>
            <Text
              className="text-xl text-black font-bold"
              testID="FQButton-title"
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                className="text-black font-medium"
                testID="FQButton-subtitle"
              >
                {subtitle}
              </Text>
            )}
          </View>
          {children}
          <View className="flex-row justify-between mt-5">
            <View>
              {cancelText && (
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Text
                    className="text-red-500 font-semibold"
                    testID="FQButton-cancel"
                  >
                    {cancelText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View>
              <TouchableOpacity onPress={onConfirm}>
                <Text
                  className="text-blue font-semibold"
                  testID="FQButton-confirm"
                >
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
