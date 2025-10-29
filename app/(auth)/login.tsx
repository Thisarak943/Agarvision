// app/(auth)/login.tsx
import React, { useState, useEffect } from 'react';
// import { authAPI } from '../../services/api'; // COMMENTED OUT - Backend API
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay 
} from 'react-native-reanimated';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(100, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(100, withTiming(0, { duration: 600 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResendVerification = async (unverifiedEmail: string) => {
    setResendingVerification(true);
    
    try {
      // COMMENTED OUT - Backend API call
      // const response = await authAPI.resendVerification(unverifiedEmail);
      
      // Simulated response for frontend testing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Verification Email Sent',
        'A new verification email has been sent. Please check your inbox.'
      );
    } catch (error) {
      Alert.alert(
        'Failed to Resend',
        error.message || 'Could not resend verification email. Please try again later.'
      );
    } finally {
      setResendingVerification(false);
    }
  };

  const handleLogin = async () => {
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // COMMENTED OUT - Backend API call
      // const response = await authAPI.login(email, password);
      
      // Simulated login for frontend testing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Handle successful login
      console.log('Login successful (Frontend Only)');
      
      setLoading(false);
      
      // Navigate to loading/home screen
      router.replace('/loading');
      
    } catch (error) {
      setLoading(false);
      
      // Check if error response contains unverified email info
      if (error.unverified_email && error.can_resend_verification) {
        // Show alert with resend verification option
        Alert.alert(
          'Email Not Verified',
          error.message || 'Please verify your email address first',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Resend Verification',
              onPress: () => handleResendVerification(error.unverified_email)
            }
          ]
        );
      } else {
        // Show generic error
        Alert.alert('Login Failed', error.message || 'Invalid email or password');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      // COMMENTED OUT - Backend API call
      // const response = await authAPI.googleSignIn();
      
      // Simulated Google sign-in for frontend testing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLoading(false);
      
      // Handle successful Google sign-in
      console.log('Google sign-in successful (Frontend Only)');
      
      // Navigate to loading/home screen
      router.replace('/loading');
      
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Google Sign-In Failed',
        error.message || 'Could not sign in with Google. Please try again.'
      );
    }
  };

  const handleForgotPassword = () => {
    // Show input dialog for email
    Alert.prompt(
      'Forgot Password',
      'Enter your email address to receive password reset instructions',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Send',
          onPress: async (inputEmail) => {
            if (!inputEmail || !inputEmail.trim()) {
              Alert.alert('Error', 'Please enter your email address');
              return;
            }

            if (!isValidEmail(inputEmail.trim())) {
              Alert.alert('Error', 'Please enter a valid email address');
              return;
            }

            try {
              // COMMENTED OUT - Backend API call
              // const response = await authAPI.forgotPassword(inputEmail.trim());
              
              // Simulated response for frontend testing
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              Alert.alert(
                'Email Sent',
                'Password reset instructions have been sent to your email'
              );
            } catch (error) {
              Alert.alert(
                'Error',
                error.message || 'Could not send password reset email. Please try again.'
              );
            }
          }
        }
      ],
      'plain-text',
      '',
      'email-address'
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          className="flex-1 px-6"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="py-6">
            <Text className="text-2xl font-bold text-gray-900 text-center">Login</Text>
          </View>

          <Animated.View style={animatedStyle} className="flex-1 justify-center">
            <View className="space-y-4">
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity 
                className="self-end mb-6"
                onPress={handleForgotPassword}
              >
                <Text className="text-primary text-sm">Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                className="mb-4"
              />

              <Button
                title="Sign in with Google"
                onPress={handleGoogleSignIn}
                variant="outline"
                className="mb-6"
                disabled={loading}
              />

              <View className="flex-row justify-center">
                <Text className="text-gray-600">Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                  <Text className="text-primary font-semibold">Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}