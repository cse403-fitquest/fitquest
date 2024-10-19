import { Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTitle from '@/components/AppTitle';
import FQTextInput from '@/components/FQTextInput';
import FQButton from '@/components/FQButton';
import { Href, Link } from 'expo-router';

const DEFAULT_SIGN_UP_ERRORS = {
  general: '',
  username: '',
  email: '',
  password: '',
  rePassword: '',
} as const;

interface ErrorState {
  general: string;
  username: string;
  email: string;
  password: string;
  rePassword: string;
}

const SignUp = () => {
  const [form, setForm] = React.useState({
    username: '',
    email: '',
    password: '',
    rePassword: '',
  });

  const [errors, setErrors] = React.useState<ErrorState>(
    DEFAULT_SIGN_UP_ERRORS,
  );

  const resetForm = () => {
    setForm({
      username: '',
      email: '',
      password: '',
      rePassword: '',
    });
    setErrors(DEFAULT_SIGN_UP_ERRORS);
  };

  const handleSignUp = () => {
    let newErrors: ErrorState = { ...DEFAULT_SIGN_UP_ERRORS };

    // Validation logic

    // Username validation
    if (!form.username) {
      newErrors = {
        ...newErrors,
        username: 'Username is required',
      };
    }

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

    // Re-enter password validation
    if (!form.rePassword) {
      newErrors = {
        ...newErrors,
        rePassword: 'Retype password is required',
      };
    }

    // If username is not empty, check if it's at least 4 characters long
    if (!newErrors.username && form.username.length < 4) {
      newErrors = {
        ...newErrors,
        username: 'Must be at least 3 characters long',
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
        password: 'Must be at least 6 characters long',
      };
    }

    // If re-enter password is not empty, check if it matches the password
    if (form.rePassword !== form.password) {
      newErrors = {
        ...newErrors,
        rePassword: 'Passwords do not match',
      };
    }

    // If there are errors, set the errors and return
    if (
      newErrors.username ||
      newErrors.email ||
      newErrors.password ||
      newErrors.rePassword
    ) {
      setErrors(newErrors);
      return;
    }

    // RODO: Do sign in logic here
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center h-full bg-off-white px-5">
      <View className="w-full mb-10">
        <AppTitle />
        <Text className="text-2xl text-black font-semibold">Sign Up</Text>
      </View>

      <View className="w-full mb-5">
        <FQTextInput
          label="Username"
          placeholder="Enter a username"
          value={form.username}
          onChange={(e) => {
            setForm({
              ...form,
              username: e.nativeEvent.text,
            });
            if (errors.username) {
              setErrors({
                ...errors,
                username: '',
              });
            }
          }}
          error={errors.username}
          containerClassName="w-full mb-2"
        />
        <FQTextInput
          label="Email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) => {
            setForm({
              ...form,
              email: e.nativeEvent.text,
            });
            if (errors.email) {
              setErrors({
                ...errors,
                email: '',
              });
            }
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
            if (errors.password) {
              setErrors({
                ...errors,
                password: '',
              });
            }
          }}
          error={errors.password}
          containerClassName="w-full mb-2"
          secureTextEntry={true}
        />
        <FQTextInput
          label="Retype Password"
          placeholder="Retype your password"
          value={form.rePassword}
          onChange={(e) => {
            setForm({
              ...form,
              rePassword: e.nativeEvent.text,
            });
            if (errors.rePassword) {
              setErrors({
                ...errors,
                rePassword: '',
              });
            }
          }}
          error={errors.rePassword}
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

      <View className="w-full max-w-[250px] mb-3">
        <FQButton
          onPress={handleSignUp}
          disabled={
            !!(
              errors.username ||
              errors.email ||
              errors.password ||
              errors.rePassword
            )
          }
        >
          SIGN UP
        </FQButton>
      </View>

      <View className="flex flex-row justify-center items-center">
        <Text className="text-base font-regular">
          Already have an account?{' '}
        </Text>
        <Link href={'/sign-in' as Href} onPress={resetForm}>
          <Text className="text-blue font-bold text-base">Sign In</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
