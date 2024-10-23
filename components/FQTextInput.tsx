import React, { FC } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface IFQTextInput extends TextInputProps {
  label: string;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
}

const FQTextInput: FC<IFQTextInput> = ({
  label,
  error,
  containerClassName,
  inputClassName,
  ...textInputProps
}) => {
  return (
    <View
      className={`bg-white border border-1 border-gray rounded py-2 px-3 ${containerClassName}`}
      testID='FQTextInput'
    >
      <View className="flex flex-row">
        <Text className="text-gray text-xs mb-1" testID='FQTextInput-label'>{label}</Text>
        {error ? (
          <Text className="ml-2 text-red-500 text-xs font-semibold">
            {error}
          </Text>
        ) : null}
      </View>
      <TextInput
        className={`bg-white text-base ${inputClassName}`}
        {...textInputProps}
        placeholderTextColor="lightgray"
        testID='FQTextInput-input'
      ></TextInput>
    </View>
  );
};

export default FQTextInput;
