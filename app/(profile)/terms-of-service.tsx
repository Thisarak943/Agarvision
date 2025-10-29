// app/(profile)/info-center.tsx
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import Header from "../../components/ui/Header";

export default function TermsOfService() {

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Terms of Service" />

      <ScrollView className="flex-1 px-6 py-4">
        
      </ScrollView>
    </SafeAreaView>
  );
}