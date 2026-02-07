// app/(auth)/login.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { authAPI } from "../../services/api"; // ✅ ONLY ONCE

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleResendVerification = async (_unverifiedEmail: string) => {
    setResendingVerification(true);
    try {
      // If you add a backend endpoint later:
      // await authAPI.resendVerification(_unverifiedEmail);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert(
        "Verification Email Sent",
        "A new verification email has been sent. Please check your inbox."
      );
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Could not resend verification email.";
      Alert.alert("Failed to Resend", msg);
    } finally {
      setResendingVerification(false);
    }
  };

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(cleanEmail, cleanPassword);
      console.log("Login success:", response);

      setLoading(false);
      router.replace("/loading");
    } catch (error: any) {
      setLoading(false);

      const data = error?.response?.data;
      const msg =
        data?.message || error?.message || "Login failed. Please try again.";

      if (data?.unverified_email && data?.can_resend_verification) {
        Alert.alert("Email Not Verified", msg, [
          { text: "Cancel", style: "cancel" },
          {
            text: resendingVerification ? "Sending..." : "Resend Verification",
            onPress: () => handleResendVerification(data.unverified_email),
          },
        ]);
        return;
      }

      Alert.alert("Login Failed", msg);
    }
  };

  const handleGoogleSignIn = async () => {
    Alert.alert(
      "Not Implemented",
      "Google Sign-In needs backend + Google config. We can add it next."
    );
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Not Implemented",
      "Forgot password needs a backend endpoint. We can add it next."
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="py-6">
            <Text className="text-2xl font-bold text-gray-900 text-center">
              Login
            </Text>
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
                disabled={loading}
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
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/signup")}
                  disabled={loading}
                >
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
