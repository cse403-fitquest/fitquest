import { Text, TouchableOpacityProps } from 'react-native';
import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';

const FQButton: FC<TouchableOpacityProps> = (props) => {
  return (
    <TouchableOpacity {...props} className="p-4 bg-blue rounded">
      <Text className={`text-white text-center font-bold text-lg`}>
        {props.children}
      </Text>
    </TouchableOpacity>
  );
};

export default FQButton;
