import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Header from "../../components/ui/Header";

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export default function Report() {
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [reportTitle, setReportTitle] = useState<string>('');
  const [reportDescription, setReportDescription] = useState<string>('');

  const reportTypes: ReportType[] = [
    {
      id: 'technical',
      title: 'Technical Issue',
      description: 'Report bugs, app crashes, or technical problems',
      icon: 'bug-outline',
      color: '#EF4444'
    },
    {
      id: 'order',
      title: 'Order Issue',
      description: 'Problems with orders, delivery, or payment',
      icon: 'receipt-outline',
      color: '#F59E0B'
    },
    {
      id: 'account',
      title: 'Account Issue',
      description: 'Problems with your account or profile',
      icon: 'person-circle-outline',
      color: '#3B82F6'
    },
    {
      id: 'product',
      title: 'Product Issue',
      description: 'Report defective or incorrect products',
      icon: 'cube-outline',
      color: '#8B5CF6'
    },
    {
      id: 'service',
      title: 'Service Quality',
      description: 'Feedback about customer service experience',
      icon: 'headset-outline',
      color: '#10B981'
    },
    {
      id: 'other',
      title: 'Other',
      description: 'Report other issues or provide general feedback',
      icon: 'chatbubble-outline',
      color: '#6B7280'
    }
  ];

  const handleSubmitReport = () => {
    if (!selectedReportType) {
      Alert.alert('Error', 'Please select a report type');
      return;
    }
    if (!reportTitle.trim()) {
      Alert.alert('Error', 'Please enter a report title');
      return;
    }
    if (!reportDescription.trim()) {
      Alert.alert('Error', 'Please provide a description');
      return;
    }

    // In a real app, you would send this data to your backend
    Alert.alert(
      'Report Submitted',
      'Thank you for your report. We will review it and get back to you soon.',
      [
        {
          text: 'OK',
          onPress: () => {
            setSelectedReportType('');
            setReportTitle('');
            setReportDescription('');
            router.back();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Report an Issue" />

      <ScrollView className="flex-1 px-6 py-4">
        {/* Report Type Selection */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            What type of issue would you like to report?
          </Text>
          <View className="space-y-3">
            {reportTypes.map((type, index) => (
              <Animated.View
                key={type.id}
                entering={FadeInUp.delay(index * 100)}
              >
                <TouchableOpacity
                  onPress={() => setSelectedReportType(type.id)}
                  className={`p-4 rounded-xl border mb-2 ${
                    selectedReportType === type.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <View className="flex-row items-center">
                    <View 
                      className="w-10 h-10 rounded-full justify-center items-center mr-3"
                      style={{ backgroundColor: type.color + '20' }}
                    >
                      <Ionicons name={type.icon as any} size={20} color={type.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-md font-semibold text-gray-900 mb-1">
                        {type.title}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {type.description}
                      </Text>
                    </View>
                    {selectedReportType === type.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Report Details Form */}
        {selectedReportType && (
          <Animated.View entering={FadeInUp} className="space-y-4">
            <View>
              <Text className="text-md font-semibold text-gray-900 mb-2">
                Report Title *
              </Text>
              <TextInput
                value={reportTitle}
                onChangeText={setReportTitle}
                placeholder="Enter a brief title for your report"
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                maxLength={100}
              />
            </View>

            <View>
              <Text className="text-md font-semibold text-gray-900 mb-2 mt-4">
                Description *
              </Text>
              <TextInput
                value={reportDescription}
                onChangeText={setReportDescription}
                placeholder="Provide detailed information about the issue..."
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 h-32"
                multiline
                textAlignVertical="top"
                maxLength={1000}
              />
              <Text className="text-xs text-gray-500 mt-1">
                {reportDescription.length}/1000 characters
              </Text>
            </View>

            <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <View className="flex-row items-start">
                <Ionicons name="information-circle" size={20} color="#3B82F6" className="mr-2" />
                <View className="flex-1 ml-2">
                  <Text className="text-sm font-medium text-blue-800 mb-1">
                    Tips for better reports:
                  </Text>
                  <Text className="text-sm text-blue-700">
                    • Be specific about what happened{'\n'}
                    • Include steps to reproduce the issue{'\n'}
                    • Mention your device and app version if relevant{'\n'}
                    • Add any error messages you received
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSubmitReport}
              className="bg-primary rounded-lg px-6 py-4 mt-6 active:bg-primary/80"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Submit Report
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Contact Information */}
        <View className="mt-4 mb-6 bg-white rounded-xl p-4 border border-gray-100">
          <Text className="text-md font-semibold text-gray-900 mb-3">
            Need immediate help?
          </Text>
          <View className="space-y-2">
            <View className="flex-row items-center mb-1">
              <Ionicons name="call-outline" size={18} color="#10B981" />
              <Text className="text-sm text-gray-600 ml-2">Call us: +1 (234) 567-8900</Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Ionicons name="mail-outline" size={18} color="#10B981" />
              <Text className="text-sm text-gray-600 ml-2">Email: support@yourcompany.com</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={18} color="#10B981" />
              <Text className="text-sm text-gray-600 ml-2">Hours: Mon-Fri 9AM-6PM EST</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}