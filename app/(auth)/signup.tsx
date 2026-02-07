// app/(auth)/signup.tsx
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
} from "react-native-reanimated";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { authAPI } from "../../services/api"; // ✅ backend

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    shippingAddress: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const opacity = useSharedValue(0);
  const translateX = useSharedValue(50);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    translateX.value = withTiming(0, { duration: 600 });
  }, [currentStep]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateX: translateX.value }],
    };
  });

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidMobile = (mobile: string) => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const isValidPassword = (password: string) => {
    return (
      password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)
    );
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim()) {
      Alert.alert("Validation Error", "Please enter your first name");
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert("Validation Error", "Please enter your last name");
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert("Validation Error", "Please enter your email address");
      return false;
    }
    if (!isValidEmail(formData.email.trim())) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return false;
    }
    if (!formData.mobile.trim()) {
      Alert.alert("Validation Error", "Please enter your mobile number");
      return false;
    }
    if (!isValidMobile(formData.mobile.trim())) {
      Alert.alert("Validation Error", "Please enter a valid 10-digit mobile number");
      return false;
    }
    if (!formData.shippingAddress.trim()) {
      Alert.alert("Validation Error", "Please enter your shipping address");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password.trim()) {
      Alert.alert("Validation Error", "Please enter a password");
      return false;
    }
    if (!isValidPassword(formData.password.trim())) {
      Alert.alert(
        "Validation Error",
        "Password must be at least 8 characters long and contain both letters and numbers"
      );
      return false;
    }
    if (!formData.confirmPassword.trim()) {
      Alert.alert("Validation Error", "Please confirm your password");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;

      opacity.value = withTiming(0, { duration: 300 });
      translateX.value = withTiming(-50, { duration: 300 });

      setTimeout(() => {
        setCurrentStep(2);
        translateX.value = 50;
      }, 300);
    } else {
      handleSignUp();
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      opacity.value = withTiming(0, { duration: 300 });
      translateX.value = withTiming(50, { duration: 300 });

      setTimeout(() => {
        setCurrentStep(1);
        translateX.value = -50;
      }, 300);
    } else {
      router.back();
    }
  };

  const handleSignUp = async () => {
    if (!validateStep2()) return;

    setLoading(true);

    try {
      const userData = {
        firstname: formData.firstName.trim(),
        lastname: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: `+1${formData.mobile.trim()}`,
        address: formData.shippingAddress.trim(),
        password: formData.password.trim(),
      };

      const response = await authAPI.register(userData);
      console.log("Register success:", response);

      setLoading(false);

      Alert.alert(
        "Registration Successful",
        "Account created successfully. You can login now.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]
      );
    } catch (error: any) {
      setLoading(false);

      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred during registration. Please try again.";

      Alert.alert("Registration Failed", msg);
    }
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
              Sign up
            </Text>
            <Text className="text-sm text-gray-500 text-center mt-2">
              Step {currentStep} of 2
            </Text>
          </View>

          <Animated.View style={animatedStyle} className="flex-1">
            {currentStep === 1 ? (
              <View className="space-y-4 flex-1">
                <Input
                  label="First Name"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChangeText={(text) => updateFormData("firstName", text)}
                  autoCapitalize="words"
                />

                <Input
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChangeText={(text) => updateFormData("lastName", text)}
                  autoCapitalize="words"
                />

                <Input
                  label="Email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChangeText={(text) => updateFormData("email", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Mobile
                  </Text>
                  <View className="flex-row items-center">
                    <View className="bg-gray-100 px-3 py-3 rounded-lg mr-2">
                      <Text className="text-gray-700 font-medium">+1</Text>
                    </View>
                    <View className="flex-1">
                      <Input
                        placeholder="Enter your mobile number"
                        value={formData.mobile}
                        onChangeText={(text) => {
                          const cleaned = text.replace(/[^0-9]/g, "").slice(0, 10);
                          updateFormData("mobile", cleaned);
                        }}
                        keyboardType="phone-pad"
                        maxLength={10}
                      />
                    </View>
                  </View>
                </View>

                <Input
                  label="Shipping Address"
                  placeholder="Enter the shipping address"
                  value={formData.shippingAddress}
                  onChangeText={(text) => updateFormData("shippingAddress", text)}
                  multiline
                  numberOfLines={3}
                />
              </View>
            ) : (
              <View className="space-y-4 flex-1">
                <Input
                  label="Password"
                  placeholder="Enter a password"
                  value={formData.password}
                  onChangeText={(text) => updateFormData("password", text)}
                  secureTextEntry
                />
                <Text className="text-xs text-gray-500 -mt-2">
                  Password must be at least 8 characters with letters and numbers
                </Text>

                <Input
                  label="Re-enter Password"
                  placeholder="Re-enter the password"
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateFormData("confirmPassword", text)}
                  secureTextEntry
                />
              </View>
            )}

            <View className="flex-row justify-between mt-8 mb-6">
              <Button
                title="Back"
                onPress={handleBack}
                variant="outline"
                className="flex-1 mr-3"
                disabled={loading}
              />
              <Button
                title={currentStep === 1 ? "Next" : "Sign Up"}
                onPress={handleNext}
                loading={loading && currentStep === 2}
                className="flex-1 ml-3"
              />
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
