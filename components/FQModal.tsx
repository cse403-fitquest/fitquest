import { View, Text, Modal, TouchableOpacity } from 'react-native';
import React, { FC } from 'react';

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
      testID="FQButton"
    >
      <View className="relative h-full justify-center items-center w-full">
        <View
          className={
            'relative border border-gray shadow-lg rounded p-7 bg-white min-w-[200px] max-w-[90%]'
          }
          style={{ width: width }}
        >
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
                <TouchableOpacity onPress={handleCancel}>
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
