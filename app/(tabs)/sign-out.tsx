import { signOut } from '@/utils/auth';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignOut = () => {
  const handleSignOut = async () => {
    const signOutResponse = await signOut();

    if (signOutResponse.error) {
      Alert.alert('Error signing out', signOutResponse.error);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center h-full bg-off-white px-5">
      <Text className="text-3xl text-black mb-5">Sign Out</Text>
      <Text className="mb-5">
        Temporary screen used for signing out. Will be deleted once Profile
        settings screen is implemented.
      </Text>

      <View className="items-center justify-center">
        <TouchableOpacity className="mb-5" onPress={handleSignOut}>
          <Text className="text-base font-semibold text-red-500">SIGN OUT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignOut;
