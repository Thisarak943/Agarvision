// app/(profile)/info-center.tsx
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import Header from "../../components/ui/Header";

interface Brand {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
}

interface DownloadItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  fileSize: string;
  downloadUrl: string;
}

export default function InfoCenter() {
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllDownloads, setShowAllDownloads] = useState(false);

  const brands: Brand[] = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      description: 'Leading provider of enterprise technology solutions',
      logo: '💻',
      website: 'https://techcorp.com'
    },
    {
      id: '2',
      name: 'GreenEnergy Inc',
      description: 'Sustainable energy and environmental solutions',
      logo: '🌱',
      website: 'https://greenenergy.com'
    },
    {
      id: '3',
      name: 'MediSupply Pro',
      description: 'Professional medical equipment and supplies',
      logo: '🏥',
      website: 'https://medisupply.com'
    },
    {
      id: '4',
      name: 'BuildMax Construction',
      description: 'Construction materials and equipment supplier',
      logo: '🏗️',
      website: 'https://buildmax.com'
    },
    {
      id: '5',
      name: 'SafeGuard Security',
      description: 'Advanced security systems and solutions',
      logo: '🔒',
      website: 'https://safeguard.com'
    },
    {
      id: '6',
      name: 'EduTech Learning',
      description: 'Educational technology and learning solutions',
      logo: '📚',
      website: 'https://edutech.com'
    }
  ];

  const downloadItems: DownloadItem[] = [
    {
      id: '1',
      title: 'Our Capability Statement',
      description: 'Comprehensive overview of our services and capabilities',
      icon: 'document-text-outline',
      fileSize: '2.4 MB',
      downloadUrl: 'https://example.com/capability-statement.pdf'
    },
    {
      id: '2',
      title: 'FL State Contract',
      description: 'Florida State contract terms and conditions',
      icon: 'shield-checkmark-outline',
      fileSize: '1.8 MB',
      downloadUrl: 'https://example.com/fl-state-contract.pdf'
    },
    {
      id: '3',
      title: 'For Government Buyers',
      description: 'Special procurement guide for government buyers',
      icon: 'business-outline',
      fileSize: '3.2 MB',
      downloadUrl: 'https://example.com/government-buyers-guide.pdf'
    },
    {
      id: '4',
      title: 'Product Catalog 2024',
      description: 'Complete product catalog with specifications',
      icon: 'library-outline',
      fileSize: '5.7 MB',
      downloadUrl: 'https://example.com/product-catalog-2024.pdf'
    },
    {
      id: '5',
      title: 'Compliance Certificates',
      description: 'Industry compliance and certification documents',
      icon: 'ribbon-outline',
      fileSize: '1.2 MB',
      downloadUrl: 'https://example.com/compliance-certificates.pdf'
    }
  ];

  const handleDownload = (item: DownloadItem) => {
    Alert.alert(
      'Download',
      `Download "${item.title}" (${item.fileSize})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: () => {
            // In a real app, you would handle the actual download
            Alert.alert('Download Started', `Downloading ${item.title}...`);
          }
        }
      ]
    );
  };

  const handleBrandPress = (brand: Brand) => {
    Alert.alert(
      brand.name,
      `Visit ${brand.name} website?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Visit Website',
          onPress: () => {
            Linking.openURL(brand.website).catch(() => {
              Alert.alert('Error', 'Unable to open website');
            });
          }
        }
      ]
    );
  };

  const displayedBrands = showAllBrands ? brands : brands.slice(0, 3);
  const displayedDownloads = showAllDownloads ? downloadItems : downloadItems.slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Info Center" />

      <ScrollView className="flex-1 px-6 py-4">
        {/* About Us Section */}
        <Animated.View entering={FadeInUp.delay(100)} className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
          <View className="flex-row items-center mb-4">
            <Ionicons name="information-circle" size={24} color="#10B981" />
            <Text className="text-xl font-bold text-gray-900 ml-2">About Us</Text>
          </View>
          <Text className="text-gray-700 leading-6 mb-4">
            We are a leading procurement and supply chain management company, dedicated to providing 
            comprehensive solutions for businesses, government agencies, and institutions across various industries.
          </Text>
          <Text className="text-gray-700 leading-6 mb-4">
            With over 20 years of experience, we specialize in connecting buyers with trusted suppliers, 
            streamlining procurement processes, and ensuring quality products and services reach our clients efficiently.
          </Text>
          <Text className="text-gray-700 leading-6">
            Our commitment to excellence, transparency, and customer satisfaction has made us a preferred 
            partner for organizations seeking reliable procurement solutions.
          </Text>
          
          <View className="mt-6 pt-4 border-t border-gray-200">
            <Text className="text-sm font-semibold text-gray-900 mb-2">Key Statistics:</Text>
            <View className="space-y-1">
              <Text className="text-sm text-gray-600">• 20+ years of industry experience</Text>
              <Text className="text-sm text-gray-600">• 500+ trusted suppliers network</Text>
              <Text className="text-sm text-gray-600">• 10,000+ satisfied customers</Text>
              <Text className="text-sm text-gray-600">• 50+ states coverage</Text>
            </View>
          </View>
        </Animated.View>

        {/* Partner Brands Section */}
        <Animated.View entering={FadeInUp.delay(200)} className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">Our Partner Brands</Text>
            {brands.length > 3 && (
              <TouchableOpacity
                onPress={() => setShowAllBrands(!showAllBrands)}
                className="bg-primary/10 px-3 py-1 rounded-full"
              >
                <Text className="text-primary text-sm font-medium">
                  {showAllBrands ? 'Show Less' : `View All (${brands.length})`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="space-y-3">
            {displayedBrands.map((brand, index) => (
              <Animated.View
                key={brand.id}
                entering={FadeInUp.delay(300 + index * 100)}
              >
                <TouchableOpacity
                  onPress={() => handleBrandPress(brand)}
                  className="bg-white rounded-xl p-4 mb-2 border border-gray-200 active:bg-gray-50"
                >
                  <View className="flex-row items-center">
                    <Text className="text-3xl mr-4">{brand.logo}</Text>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900 mb-1">
                        {brand.name}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {brand.description}
                      </Text>
                    </View>
                    <Ionicons name="open-outline" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Downloads Section */}
        <Animated.View entering={FadeInUp.delay(400)} className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">Document Downloads</Text>
            {downloadItems.length > 3 && (
              <TouchableOpacity
                onPress={() => setShowAllDownloads(!showAllDownloads)}
                className="bg-primary/10 px-3 py-1 rounded-full"
              >
                <Text className="text-primary text-sm font-medium">
                  {showAllDownloads ? 'Show Less' : `View All (${downloadItems.length})`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="space-y-3">
            {displayedDownloads.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInUp.delay(500 + index * 100)}
              >
                <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                  <View className="flex-row items-start">
                    <View className="w-12 h-12 bg-primary/10 rounded-full justify-center items-center mr-4">
                      <Ionicons name={item.icon as any} size={24} color="#10B981" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900 mb-1">
                        {item.title}
                      </Text>
                      <Text className="text-sm text-gray-600 mb-2">
                        {item.description}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        PDF • {item.fileSize}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDownload(item)}
                    className="bg-primary rounded-lg px-4 py-2 mt-3 active:bg-primary/80"
                  >
                    <View className="flex-row items-center justify-center">
                      <Ionicons name="download-outline" size={16} color="white" />
                      <Text className="text-white font-medium ml-2">Download PDF</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Contact Information */}
        <Animated.View entering={FadeInUp.delay(600)} className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-4">
            <Ionicons name="call" size={24} color="#10B981" />
            <Text className="text-xl font-bold text-gray-900 ml-2">Contact Information</Text>
          </View>
          
          <View className="space-y-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="location-outline" size={20} color="#6B7280" />
              <View className="ml-3">
                <Text className="text-sm font-medium text-gray-900">Address</Text>
                <Text className="text-sm text-gray-600">
                  123 Business Plaza, Suite 456{'\n'}
                  Miami, FL 33101
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center mb-2">
              <Ionicons name="call-outline" size={20} color="#6B7280" />
              <View className="ml-3">
                <Text className="text-sm font-medium text-gray-900">Phone</Text>
                <Text className="text-sm text-gray-600">+1 (305) 123-4567</Text>
              </View>
            </View>
            
            <View className="flex-row items-center mb-2">
              <Ionicons name="mail-outline" size={20} color="#6B7280" />
              <View className="ml-3">
                <Text className="text-sm font-medium text-gray-900">Email</Text>
                <Text className="text-sm text-gray-600">info@yourcompany.com</Text>
              </View>
            </View>
            
            <View className="flex-row items-center mb-2">
              <Ionicons name="globe-outline" size={20} color="#6B7280" />
              <View className="ml-3">
                <Text className="text-sm font-medium text-gray-900">Website</Text>
                <Text className="text-sm text-gray-600">www.yourcompany.com</Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={20} color="#6B7280" />
              <View className="ml-3">
                <Text className="text-sm font-medium text-gray-900">Business Hours</Text>
                <Text className="text-sm text-gray-600">
                  Monday - Friday: 8:00 AM - 6:00 PM EST{'\n'}
                  Saturday: 9:00 AM - 2:00 PM EST{'\n'}
                  Sunday: Closed
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Certifications */}
        <Animated.View entering={FadeInUp.delay(700)} className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-4">
            <Ionicons name="ribbon" size={24} color="#10B981" />
            <Text className="text-xl font-bold text-gray-900 ml-2">Certifications & Compliance</Text>
          </View>
          
          <View className="space-y-2">
            <Text className="text-sm text-gray-600 mb-1">✓ ISO 9001:2015 Quality Management</Text>
            <Text className="text-sm text-gray-600 mb-1">✓ GSA Schedule Contract Holder</Text>
            <Text className="text-sm text-gray-600 mb-1">✓ WBENC Certified Women Business Enterprise</Text>
            <Text className="text-sm text-gray-600 mb-1">✓ SBA 8(a) Certified Small Business</Text>
            <Text className="text-sm text-gray-600 mb-1">✓ NMSDC Certified Minority Business Enterprise</Text>
            <Text className="text-sm text-gray-600 mb-1">✓ HUBZone Certified</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}