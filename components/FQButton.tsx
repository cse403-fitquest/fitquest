import { Text, TouchableOpacityProps } from 'react-native';
import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import clsx from 'clsx';

const FQButton: FC<TouchableOpacityProps> = (props) => {
  const renderChildren = () => {
    if (typeof props.children === 'string') {
      return (
        <Text className={`w-full text-white text-center font-bold text-lg`}>
          {props.children}
        </Text>
      );
    }

    return props.children;
  };

  return (
    <TouchableOpacity
      {...props}
      className={clsx('relative p-4 rounded h-[60px] ', {
        'bg-blue': !props.disabled,
        'bg-gray': props.disabled,
      })}
    >
      {renderChildren()}
    </TouchableOpacity>
  );
};

export default FQButton;
