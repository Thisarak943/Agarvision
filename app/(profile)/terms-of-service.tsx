// app/(profile)/terms-of-service.tsx
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Header from '../../components/ui/Header';

type Section = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  body: string[];
};

export default function TermsOfService() {
  const [expanded, setExpanded] = useState<string | null>('intro');

  const APP_NAME = 'AgarVision';
  const SUPPORT_EMAIL = 'support@agarvision.com';

  const sections: Section[] = [
    {
      id: 'intro',
      title: 'Overview',
      icon: 'document-text-outline',
      body: [
        `Welcome to ${APP_NAME}. By using this app, you agree to these Terms of Service.`,
        'If you do not agree, please stop using the app.',
        'These terms are written for general guidance and do not replace legal advice.',
      ],
    },
    {
      id: 'eligibility',
      title: 'Eligibility',
      icon: 'person-outline',
      body: [
        'You must have permission to use this app and provide information truthfully.',
        'If you are under the required age in your country, use the app only with a parent/guardian’s permission.',
      ],
    },
    {
      id: 'use',
      title: 'Acceptable Use',
      icon: 'shield-checkmark-outline',
      body: [
        'Use the app for lawful purposes only.',
        'Do not attempt to hack, overload, reverse engineer, or misuse the app or its services.',
        'Do not upload harmful, illegal, or copyrighted content you do not have rights to use.',
      ],
    },
    {
      id: 'predictions',
      title: 'AI Predictions Disclaimer',
      icon: 'sparkles-outline',
      body: [
        `${APP_NAME} provides AI-based predictions (e.g., quality grade / readiness guidance). These are estimates and may be incorrect.`,
        'Do not treat predictions as a guaranteed certification, laboratory report, or legal export approval.',
        'For high-stakes decisions (pricing, export, compliance), verify with qualified experts and official standards.',
      ],
    },
    {
      id: 'data',
      title: 'Data & Privacy',
      icon: 'lock-closed-outline',
      body: [
        'We may process uploaded images and entered data to provide predictions and improve the service.',
        'We aim to protect your data, but no system is 100% secure.',
        'For details on what is collected and how it is used, refer to the Privacy Policy (if available) or contact support.',
      ],
    },
    {
      id: 'content',
      title: 'User Content',
      icon: 'images-outline',
      body: [
        'You keep ownership of the images/data you upload.',
        'By uploading content, you grant permission for the app to process it to generate results and improve model quality (if enabled).',
        'Do not upload sensitive personal information in images or text.',
      ],
    },
    {
      id: 'availability',
      title: 'Service Availability',
      icon: 'cloud-outline',
      body: [
        'We may update, change, or temporarily stop parts of the app to improve performance or security.',
        'We are not responsible for downtime caused by internet issues, device limitations, or third-party services.',
      ],
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: 'alert-circle-outline',
      body: [
        'The app is provided “as is” without warranties of accuracy, fitness, or uninterrupted availability.',
        'To the maximum extent allowed by law, we are not liable for losses arising from use of predictions or app usage.',
      ],
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: 'close-circle-outline',
      body: [
        'We may suspend or terminate access if the app is misused or terms are violated.',
        'You may stop using the app at any time.',
      ],
    },
    {
      id: 'changes',
      title: 'Changes to These Terms',
      icon: 'refresh-outline',
      body: [
        'We may update these terms from time to time.',
        'If we make important changes, we may show a notice inside the app.',
      ],
    },
    {
      id: 'contact',
      title: 'Contact',
      icon: 'mail-outline',
      body: [
        `If you have questions, contact us at: ${SUPPORT_EMAIL}`,
        'Include screenshots and your device model for faster support.',
      ],
    },
  ];

  const toggle = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Terms of Service" />

      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
        {/* Top card */}
        <Animated.View
          entering={FadeInUp.duration(350)}
          className="bg-white border border-gray-200 rounded-2xl p-4 mb-4"
        >
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 bg-primary rounded-xl items-center justify-center mr-3">
              <Ionicons name="document-text-outline" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">{APP_NAME} Terms</Text>
              <Text className="text-sm text-gray-500">Last updated: (add your date)</Text>
            </View>
          </View>

          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl p-3">
            <Ionicons name="information-circle-outline" size={18} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-2 flex-1 leading-5">
              AI results are guidance only. For exports, always verify with official standards and experts.
            </Text>
          </View>
        </Animated.View>

        {/* Sections */}
        <View className="mb-8">
          {sections.map((s, idx) => {
            const open = expanded === s.id;
            return (
              <Animated.View
                key={s.id}
                entering={FadeInUp.delay(120 + idx * 60)}
                className="mb-3"
              >
                <TouchableOpacity
                  onPress={() => toggle(s.id)}
                  activeOpacity={0.9}
                  className="bg-white border border-gray-200 rounded-2xl p-4"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1 pr-3">
                      <View className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center mr-3">
                        <Ionicons name={s.icon} size={20} color="#10B981" />
                      </View>
                      <Text className="text-base font-semibold text-gray-900 flex-1">
                        {s.title}
                      </Text>
                    </View>

                    <Ionicons
                      name={open ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#6b7280"
                    />
                  </View>

                  {open && (
                    <View className="mt-3 pt-3 border-t border-gray-100">
                      {s.body.map((line, i) => (
                        <View key={i} className="flex-row mb-2">
                          <Text className="text-primary mr-2">•</Text>
                          <Text className="text-sm text-gray-600 flex-1 leading-6">
                            {line}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Bottom action */}
        <View className="pb-10">
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Support',
                `Email us at ${SUPPORT_EMAIL}`,
                [{ text: 'OK' }]
              )
            }
            className="bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center"
            activeOpacity={0.9}
          >
            <View className="w-10 h-10 bg-primary rounded-xl items-center justify-center mr-3">
              <Ionicons name="mail-outline" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">Need clarification?</Text>
              <Text className="text-sm text-gray-500">Contact support for help</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
