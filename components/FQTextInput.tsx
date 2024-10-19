import React, { FC } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface IFQTextInput extends TextInputProps {
  label: string;
  containerClassName?: string;
  inputClassName?: string;
}

const FQTextInput: FC<IFQTextInput> = ({
  label,
  containerClassName,
  inputClassName,
  ...textInputProps
}) => {
  return (
    <View
      className={`bg-white border border-1 border-gray rounded py-2 px-3 ${containerClassName}`}
    >
      <Text className="text-gray text-xs mb-1">{label}</Text>
      <TextInput
        className={`bg-white text-base ${inputClassName}`}
        {...textInputProps}
        placeholderTextColor="lightgray"
      ></TextInput>
    </View>
  );
};

export default FQTextInput;
