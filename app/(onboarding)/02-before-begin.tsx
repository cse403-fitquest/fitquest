import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FQButton from '@/components/FQButton';
import { router } from 'expo-router';

const BeforeBegin = () => {
  return (
    <SafeAreaView className="relative w-full h-full px-12 py-8 justify-center items-center">
      <View className="w-full">
        <Text className="text-4xl font-bold mb-16">
          Before we begin, let's determine your fitness level...
        </Text>

        <FQButton
          onPress={() => router.replace('./03-frequency')}
          className="mb-5"
        >
          NEXT
        </FQButton>
        <View className="w-full items-center">
          <TouchableOpacity
            onPress={() => router.replace('./07-fitness-level')}
          >
            <Text className="text-lg font-black text-gray">
              OR SKIP THIS STEP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BeforeBegin;
