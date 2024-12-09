import { render, fireEvent } from '@testing-library/react-native';
import { QuestNodeModal } from '@/components/QuestNodeModal';
import { AnimatedSpriteID } from '@/constants/sprite';

// Mock AnimatedSprite component
jest.mock('@/components/AnimatedSprite', () => ({
  AnimatedSprite: () => null,
}));

describe('QuestNodeModal', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    nodeInfo: {
      isBoss: false,
      milestone: 100,
      possibleMonsters: [
        {
          monsterId: 'monster1',
          spriteId: AnimatedSpriteID.HERO_01,
        },
        {
          monsterId: 'monster2',
          spriteId: AnimatedSpriteID.HERO_02,
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(<QuestNodeModal {...defaultProps} />);

    expect(getByText('Quest Node')).toBeTruthy();
    expect(getByText('Stage 2')).toBeTruthy();
    expect(getByText('Possible encounters:')).toBeTruthy();
  });

  it('renders boss node correctly', () => {
    const bossProps = {
      ...defaultProps,
      nodeInfo: {
        ...defaultProps.nodeInfo,
        isBoss: true,
      },
    };

    const { getByText } = render(<QuestNodeModal {...bossProps} />);
    expect(getByText('Boss Node')).toBeTruthy();
  });

  it('calls onClose when OK button is pressed', () => {
    const { getByText } = render(<QuestNodeModal {...defaultProps} />);
    fireEvent.press(getByText('OK'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('returns null when nodeInfo is null', () => {
    const { queryByTestId } = render(
      <QuestNodeModal visible={true} onClose={jest.fn()} nodeInfo={null} />,
    );
    expect(queryByTestId('quest-node-modal')).toBeNull();
  });

  it('handles modal close request', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <QuestNodeModal
        visible={true}
        onClose={onClose}
        nodeInfo={defaultProps.nodeInfo}
      />,
    );

    // Trigger the modal's onRequestClose
    const modal = getByTestId('quest-node-modal');
    fireEvent(modal, 'onRequestClose');

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
