import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center h-full bg-off-white">
      <Text className="text-3xl text-black">Profile</Text>
    </SafeAreaView>
  );
};

export default Profile;
