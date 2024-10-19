import { Href, Redirect } from 'expo-router';
import React from 'react';

const Index = () => {
  return <Redirect href={'/sign-in' as Href} />;
};

export default Index;
