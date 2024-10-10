import { Colors } from '@/constants/Colors';
import { Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      className={`flex-1 items-center justify-center h-full`}
      style={{
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      }}
    >
      <Text
        className="text-3xl"
        style={{
          color: Colors[colorScheme ?? 'light'].text,
        }}
      >
        Profile
      </Text>
    </SafeAreaView>
  );
};

export default Profile;
