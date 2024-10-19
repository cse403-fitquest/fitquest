import { Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTitle from '@/components/AppTitle';
import FQTextInput from '@/components/FQTextInput';
import FQButton from '@/components/FQButton';
import { Href, Link } from 'expo-router';

const SignUp = () => {
  const [form, setForm] = React.useState({
    username: '',
    email: '',
    password: '',
    rePassword: '',
  });

  return (
    <SafeAreaView className="flex-1 items-center justify-center h-full bg-off-white px-5">
      <View className="w-full mb-10">
        <AppTitle />
        <Text className="text-2xl text-black font-semibold">Sign Up</Text>
      </View>

      <View className="w-full mb-10">
        <FQTextInput
          label="Username"
          placeholder="Enter your username"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.nativeEvent.text,
            })
          }
          containerClassName="w-full mb-2"
        />
        <FQTextInput
          label="Email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.nativeEvent.text,
            })
          }
          containerClassName="w-full mb-2"
        />
        <FQTextInput
          label="Password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.nativeEvent.text,
            })
          }
          containerClassName="w-full mb-2"
          secureTextEntry={true}
        />
        <FQTextInput
          label="Retype Password"
          placeholder="Retype your password"
          value={form.rePassword}
          onChange={(e) =>
            setForm({
              ...form,
              rePassword: e.nativeEvent.text,
            })
          }
          containerClassName="w-full mb-2"
          secureTextEntry={true}
        />
      </View>

      <View className="w-full max-w-[250px] mb-3">
        <FQButton>SIGN UP</FQButton>
      </View>

      <View className="flex flex-row justify-center items-center">
        <Text className="text-base font-regular">
          Already have an account?{' '}
        </Text>
        <Link href={'/sign-in' as Href}>
          <Text className="text-blue font-bold text-base">Sign In</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
