import { render, fireEvent } from '@testing-library/react-native';
import FQModal from '@/components/FQModal';
import { Text } from 'react-native';

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: '',
}));

describe('FQModal', () => {
  const mockSetVisible = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    children: <Text>Child Content</Text>,
    visible: true,
    setVisible: mockSetVisible,
    onConfirm: mockOnConfirm,
    cancelText: 'Cancel',
    confirmText: 'Confirm',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and subtitle correctly', () => {
    const { getByTestId } = render(<FQModal {...defaultProps} />);
    expect(getByTestId('FQButton-title').props.children).toBe('Test Title');
    expect(getByTestId('FQButton-subtitle').props.children).toBe(
      'Test Subtitle',
    );
  });

  it('renders child content correctly', () => {
    const { getByText } = render(<FQModal {...defaultProps} />);
    expect(getByText('Child Content')).toBeTruthy();
  });

  it('calls setVisible(false) when cancel button is pressed', () => {
    const { getByTestId } = render(<FQModal {...defaultProps} />);
    fireEvent.press(getByTestId('FQButton-cancel'));
    expect(mockSetVisible).toHaveBeenCalledWith(false);
  });

  it('calls onConfirm when confirm button is pressed', () => {
    const { getByTestId } = render(<FQModal {...defaultProps} />);
    fireEvent.press(getByTestId('FQButton-confirm'));
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('does not render modal content when visible is false', () => {
    const { queryByTestId } = render(
      <FQModal {...defaultProps} visible={false} />,
    );
    expect(queryByTestId('FQButton-title')).toBeNull();
  });
});
