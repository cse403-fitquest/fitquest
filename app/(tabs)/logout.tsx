import { logout } from '@/utils/auth';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Logout = () => {
  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center h-full bg-off-white px-5">
      <Text className="text-3xl text-black mb-5">Logout</Text>
      <Text className="mb-5">
        Temporary screen used for logging out and deleting user account. Will be
        deleted once Profile settings screen is implemented.
      </Text>

      <View className="items-center justify-center">
        <TouchableOpacity className="mb-5" onPress={handleLogout}>
          <Text className="text-base font-semibold text-red-500">LOGOUT</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-base font-semibold text-red-500">
            DELETE ACCOUNT
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Logout;
