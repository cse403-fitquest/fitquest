import { ActivityIndicator, Alert, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTitle from '@/components/AppTitle';
import FQTextInput from '@/components/FQTextInput';
import FQButton from '@/components/FQButton';
import { Href, Link } from 'expo-router';
import { signIn } from '@/utils/auth';

const DEFAULT_SIGN_IN_ERRORS = {
  general: '',
  email: '',
  password: '',
} as const;

interface ErrorState {
  general: string;
  email: string;
  password: string;
}

const SignIn = () => {
  const [form, setForm] = React.useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = React.useState<ErrorState>(
    DEFAULT_SIGN_IN_ERRORS,
  );

  const [loading, setLoading] = React.useState(false);

  const resetForm = () => {
    setForm({
      email: '',
      password: '',
    });
    setErrors(DEFAULT_SIGN_IN_ERRORS);
  };

  const handleSignIn = async () => {
    let newErrors: ErrorState = { ...DEFAULT_SIGN_IN_ERRORS };

    // Validation logic

    // Email validation
    if (!form.email) {
      newErrors = {
        ...newErrors,
        email: 'Email is required',
      };
    }

    // Password validation
    if (!form.password) {
      newErrors = {
        ...newErrors,
        password: 'Password is required',
      };
    }

    // If email is not empty, check if it's a valid email
    if (!newErrors.email) {
      // Email regex used from https://emailregex.com/
      const emailRegex =
        // eslint-disable-next-line no-control-regex
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      if (!emailRegex.test(form.email)) {
        newErrors = {
          ...newErrors,
          email: 'Must be a valid email address',
        };
      }
    }

    // If password is not empty, check if it's at least 6 characters long
    if (!newErrors.password && form.password.length < 6) {
      newErrors = {
        ...newErrors,
        password: 'Password are at least 6 characters long',
      };
    }

    // If there are errors, set the errors and return
    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    // Sign in logic
    setLoading(true);

    // No need for try-catch block since signIn function handles errors
    const signInResponse = await signIn(form.email, form.password);

    if (signInResponse.error) {
      setErrors(signInResponse.error);

      if (signInResponse.error.general) {
        Alert.alert('Sign In Error', signInResponse.error.general);
      }
    } else {
      resetForm();
    }

    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center h-full bg-off-white px-5">
      <View className="w-full mb-10">
        <AppTitle />
        <Text className="text-2xl text-black font-semibold">Sign In</Text>
      </View>

      <View className="w-full mb-5">
        <FQTextInput
          label="Email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) => {
            setForm({
              ...form,
              email: e.nativeEvent.text,
            });
            setErrors({
              ...errors,
              email: '',
            });
          }}
          error={errors.email}
          containerClassName="w-full mb-2"
        />
        <FQTextInput
          label="Password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => {
            setForm({
              ...form,
              password: e.nativeEvent.text,
            });
            setErrors({
              ...errors,
              password: '',
            });
          }}
          error={errors.password}
          containerClassName="w-full"
          secureTextEntry={true}
        />
      </View>

      <View className="mb-5">
        {errors.general ? (
          <Text className="text-red-500 font-semibold text-sm">
            {errors.general}
          </Text>
        ) : null}
      </View>

      <View className="w-full max-w-[250px] mb-5">
        <FQButton
          onPress={handleSignIn}
          disabled={!!(errors.email || errors.password || loading)}
        >
          {loading ? (
            <View className="w-full flex-1 justify-center items-center">
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Text>SIGN IN</Text>
          )}
        </FQButton>
      </View>

      <View className="flex flex-row justify-center items-center">
        <Text className="text-base font-regular">Don't have an account? </Text>
        <Link href={'/sign-up' as Href} onPress={resetForm}>
          <Text className="text-blue font-bold text-base">Sign Up</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
