import { render, fireEvent } from '@testing-library/react-native';

import FQButton from '@/components/FQButton';

describe('FQButton', () => {
  it('renders correctly with default props', () => {
    const { getByTestId, getByText } = render(
      <FQButton onPress={() => {}}>Click Me</FQButton>
    );

    const button = getByTestId('FQButton');
    const buttonText = getByText('Click Me');

    expect(button).toBeTruthy();
    expect(buttonText).toBeTruthy();
  });


  it('applies secondary styles when secondary prop is true', () => {
    const { getByTestId } = render(
      <FQButton secondary onPress={() => {}}>
        Secondary Button
      </FQButton>
    );

    const button = getByTestId('FQButton');

    // Assuming you are using Tailwind CSS classes,
    // you might need to check for the presence of 'bg-gray' class.
    // However, in React Native, styles are applied as objects.
    // Therefore, it's better to check the style prop directly.

    // Example: If 'bg-gray' corresponds to a specific background color,
    // you can assert the style like this:
    expect(button.props.style).toEqual(
      expect.objectContaining({
        backgroundColor: '#7E7E7E', // Replace with actual color if different
      })
    );
  });

  it('applies disabled styles when disabled prop is true', () => {
    const { getByTestId } = render(
      <FQButton disabled onPress={() => {}}>
        Disabled Button
      </FQButton>
    );

    const button = getByTestId('FQButton');

    // Check for opacity style
    expect(button.props.style).toEqual(
      expect.objectContaining({
        opacity: 0.4, // Replace with actual opacity if different
      })
    );
  });

  it('calls onPress handler when pressed', () => {
    const onPressMock = jest.fn();

    const { getByTestId } = render(
      <FQButton onPress={onPressMock}>Press Me</FQButton>
    );

    const button = getByTestId('FQButton');

    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress handler when disabled and pressed', () => {
    const onPressMock = jest.fn();

    const { getByTestId } = render(
      <FQButton disabled onPress={onPressMock}>
        Disabled Press
      </FQButton>
    );

    const button = getByTestId('FQButton');

    fireEvent.press(button);

    expect(onPressMock).not.toHaveBeenCalled();
  });
});
