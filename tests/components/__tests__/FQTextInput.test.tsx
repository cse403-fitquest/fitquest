import { render } from '@testing-library/react-native';

import FQTextInput from '@/components/FQTextInput';

describe('FQTextInput', () => {
  it('renders the container correctly', () => {
    const { getByTestId } = render(<FQTextInput label="FQTextInput" />);

    // Verify that the FQTextInput is rendered
    const fqButton = getByTestId('FQTextInput');
    expect(fqButton).toBeTruthy();
  });

  it('renders the label correctly', () => {
    const { getByTestId } = render(<FQTextInput label="FQTextInput" />);

    // Verify that the FQTextInput label is rendered
    const fqButton = getByTestId('FQTextInput-label');
    expect(fqButton).toBeTruthy();
  });

  it('renders the input correctly', () => {
    const { getByTestId } = render(<FQTextInput label="FQTextInput" />);

    // Verify that the FQTextInput input is rendered
    const fqButton = getByTestId('FQTextInput-input');
    expect(fqButton).toBeTruthy();
  });

});