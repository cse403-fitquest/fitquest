import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTitle from '@/components/AppTitle';
import FQTextInput from '@/components/FQTextInput';
import FQButton from '@/components/FQButton';
import { Href, router } from 'expo-router';
import { signIn } from '@/services/auth';
import { AnimatedSprite } from '@/components/AnimatedSprite';
import { AnimatedSpriteID, SpriteState } from '@/constants/sprite';

const SPRITE_MOVE_DURATION = 600;

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

  const windowWidth = Dimensions.get('window').width;
  // const windowHeight = Dimensions.get('window').height;

  const xPosTopAnimatedValue = useRef(new Animated.Value(-500)).current;
  const xPosBottomAnimatedValue = useRef(
    new Animated.Value(windowWidth),
  ).current;

  useEffect(() => {
    const loopTopAnimation = () =>
      Animated.timing(xPosTopAnimatedValue, {
        toValue: windowWidth,
        duration: 4500,
        delay: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        xPosTopAnimatedValue.setValue(-500); // Reset value after animation completes
        loopBottomAnimation(); // Start the animation again
      });

    const loopBottomAnimation = () =>
      Animated.timing(xPosBottomAnimatedValue, {
        toValue: -500,
        duration: 4500,
        delay: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        xPosBottomAnimatedValue.setValue(windowWidth); // Reset value after animation completes
        loopTopAnimation(); // Start the animation again
      });

    // loopBottomAnimation();
    loopTopAnimation();

    return () => {
      xPosTopAnimatedValue.stopAnimation();
      xPosBottomAnimatedValue.stopAnimation();
    };
  }, []);

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

    if (signInResponse.success && !signInResponse.error) {
      // If there is no error, reset the form and save the user to global state
      resetForm();
    } else {
      setErrors({
        ...errors,
        general: signInResponse.error ?? 'An error occurred while signing in',
      });

      if (signInResponse.success) {
        Alert.alert(
          'Sign In Error',
          signInResponse.error ?? 'An error occurred while signing in',
        );
      }

      setLoading(false);
    }
  };

  const renderSignInButtonContent = () => {
    if (loading) {
      return (
        <View className="h-full justify-center items-center">
          <ActivityIndicator size="small" color="white" />
        </View>
      );
    }

    return 'SIGN IN';
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center h-full bg-off-white px-5">
      <View className="relative h-[100px] w-full bottom-5">
        <Animated.View
          className="absolute top-0 flex-row justify-end"
          style={{
            transform: [
              {
                translateX: xPosTopAnimatedValue,
              },
            ],
          }}
        >
          <View>
            <AnimatedSprite
              id={AnimatedSpriteID.HERO_15}
              state={SpriteState.MOVE}
              duration={SPRITE_MOVE_DURATION}
            />
          </View>
          <View>
            <AnimatedSprite
              id={AnimatedSpriteID.HERO_24}
              state={SpriteState.MOVE}
              duration={SPRITE_MOVE_DURATION}
            />
          </View>
          <View>
            <AnimatedSprite
              id={AnimatedSpriteID.HERO_25}
              state={SpriteState.MOVE}
              duration={SPRITE_MOVE_DURATION}
            />
          </View>
        </Animated.View>
      </View>

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
          {renderSignInButtonContent()}
        </FQButton>
      </View>

      <View className="flex flex-row justify-center items-center">
        <Text className="text-base font-regular">Don't have an account? </Text>
        <TouchableOpacity
          onPress={() => {
            resetForm();
            router.replace('/sign-up' as Href);
          }}
        >
          <Text className="text-blue font-bold text-base">Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View className="relative h-[100px] top-0 right-0">
        <Animated.View
          className="absolute top-0 flex-row"
          style={{
            transform: [
              {
                translateX: xPosBottomAnimatedValue,
              },
            ],
          }}
        >
          <View>
            <AnimatedSprite
              id={AnimatedSpriteID.HERO_25}
              state={SpriteState.MOVE}
              direction="left"
              duration={SPRITE_MOVE_DURATION}
            />
          </View>
          <View>
            <AnimatedSprite
              id={AnimatedSpriteID.HERO_24}
              state={SpriteState.MOVE}
              direction="left"
              duration={SPRITE_MOVE_DURATION}
            />
          </View>
          <View>
            <AnimatedSprite
              id={AnimatedSpriteID.HERO_15}
              state={SpriteState.MOVE}
              direction="left"
              duration={SPRITE_MOVE_DURATION}
            />
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
