import { Text, TouchableOpacityProps } from 'react-native';
import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import clsx from 'clsx';

const FQButton: FC<TouchableOpacityProps> = (props) => {
  return (
    <TouchableOpacity
      {...props}
      className={clsx('p-4 rounded min-h-[60px]', {
        'bg-blue': !props.disabled,
        'bg-gray': props.disabled,
      })}
    >
      <Text className={`w-full text-white text-center font-bold text-lg`}>
        {props.children}
      </Text>
    </TouchableOpacity>
  );
};

export default FQButton;
