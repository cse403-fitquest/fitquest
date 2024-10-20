import { isLoggedIn } from '@/utils/auth';
import { Href, Redirect, useRootNavigationState } from 'expo-router';
import React from 'react';

const Index = () => {
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key) return null;

  if (!isLoggedIn()) {
    return <Redirect href={'/sign-in' as Href} />;
  }

  return <Redirect href={'/sign-out' as Href} />;
};

export default Index;
