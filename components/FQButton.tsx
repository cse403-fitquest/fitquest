import { Text, TouchableOpacityProps } from 'react-native';
import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import clsx from 'clsx';

interface IFQButtonProps extends TouchableOpacityProps {
  secondary?: boolean;
}

const FQButton: FC<IFQButtonProps> = (props) => {
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
        'bg-blue': !props.secondary,
        'bg-gray': props.secondary,
        'opacity-40': props.disabled,
      })}
      testID="FQButton"
    >
      {renderChildren()}
    </TouchableOpacity>
  );
};

export default FQButton;
