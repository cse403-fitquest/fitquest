import { useRootNavigationState } from 'expo-router';

const Index = () => {
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key) return null;

  return null;
};

export default Index;
