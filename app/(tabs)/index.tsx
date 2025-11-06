// app/(tabs)/index.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '../../contexts/UserContext';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import NotificationSlideView from '../views/NotificationSlideView';
import SettingsSlideView from '../views/SettingsSlideView';

import EmbroiederyContent from '../../components/contents/Embroidery';
import VFDContent from '../../components/contents/InternationalVFD';
import SafetyShoesContent from '../../components/contents/SafetyShoes';
import UniformsContent from '../../components/contents/Uniforms';

import SpecialServiceModal from '../../components/modals/SpecialServiceModal';
import GovernmentBuyersContent from '../../components/contents/GovernmentBuyers';
import FRClothingContent from '../../components/contents/FRClothing';
import BlackintonContent from '../../components/contents/Blackinton';

import GlobalSearch from '../../components/GlobalSearch';
import ServiceModal from '../../components/modals/ServiceModal';
import CategoryCard from '../../components/ui/CategoryCard';
import ServiceCard from '../../components/ui/ServiceCard';
import SpecialServiceCard from '../../components/ui/SpecialServiceCard';

// ----- Types -----
interface SearchResult {
  id: string;
  type: 'product' | 'service' | 'special_service' | 'category';
  title: string;
  subtitle?: string;
  description?: string;
  image?: any;
  category?: string;
  navigationParams?: any;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  read?: boolean;
}

type SectionKey = 'products' | 'services' | 'articles';

// ----- Component -----
export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  // Read ?section=products|services|articles (from /(tabs)?section=...)
  const params = useLocalSearchParams<{ section?: string | string[] }>();
  const section = Array.isArray(params.section)
    ? (params.section[0] as SectionKey)
    : (params.section as SectionKey | undefined);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeSSModal, setActiveSSModal] = useState<string | null>(null);

  const openModal = (service: string) => setActiveModal(service);
  const closeModal = () => setActiveModal(null);
  const openSSModal = (service: string) => setActiveSSModal(service);
  const closeSSModal = () => setActiveSSModal(null);

  const [showNotificationSlide, setShowNotificationSlide] = useState(false);
  const [showSettingsSlide, setShowSettingsSlide] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'Order Shipped', message: 'Your order #12345 has been shipped and is on its way', type: 'success' },
    { id: 2, title: 'Payment Issue', message: 'There was an issue processing your payment for order #12346', type: 'error' },
    { id: 3, title: 'New Products Available', message: 'Check out our latest collection of safety equipment', type: 'info' },
    { id: 4, title: 'Account Security', message: 'Your password will expire in 7 days. Please update it soon.', type: 'warning' },
  ]);

  // Animations
  const headerOpacity = useSharedValue(0);
  const searchOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    searchOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));
  const searchAnimatedStyle = useAnimatedStyle(() => ({ opacity: searchOpacity.value }));

  // ----- Scroll-to-section plumbing -----
  const scrollRef = useRef<ScrollView>(null);
  const [contentReady, setContentReady] = useState(false);
  const yOffsets = useRef<{ products?: number; services?: number; articles?: number }>({});

  const onProductsLayout = (e: any) => {
    yOffsets.current.products = e.nativeEvent.layout.y;
  };
  const onServicesLayout = (e: any) => {
    yOffsets.current.services = e.nativeEvent.layout.y;
  };
  const onArticlesLayout = (e: any) => {
    yOffsets.current.articles = e.nativeEvent.layout.y;
  };

  const onContentSizeChange = () => {
    if (!contentReady) setContentReady(true);
  };

  const scrollToSection = (key?: SectionKey) => {
    if (!key) return;
    const y = yOffsets.current[key] ?? 0;
    scrollRef.current?.scrollTo({ y, animated: true });
  };

  useEffect(() => {
    if (contentReady) {
      scrollToSection(section);
    }
  }, [contentReady, section]);

  // ----- Data -----
  const categories = [
    { title: 'Chips',    icon: require('../../assets/icons/chips.png') },
    { title: 'Oud Oil',  icon: require('../../assets/icons/oil.png') },
    { title: 'Perfumes', icon: require('../../assets/icons/perfume.png') },
    { title: 'Incence',  icon: require('../../assets/icons/incence.png') },
  ];

  const services = [
    { title: 'Chips & Resin Grading',    description: 'Efficient, reliable drives', icon: require('../../assets/icons/good.png') },
    { title: 'Disease Detection',        description: 'Durable workwear solutions', icon: require('../../assets/icons/leda.png') },
    { title: 'Market Price Forecasting', description: 'Protection with comfort',    icon: require('../../assets/icons/mprice.png') },
    { title: 'Stage Classification',     description: 'Sharp, precise stitching',   icon: require('../../assets/icons/data.png') },
  ];

  // (Internally still named specialServices; UI shows "Articles")
  const specialServices = [
    {
      title: 'Global Agarwood Market Prices on the Rise',
      description: 'Latest trends and price shifts worldwide.',
      image: require('../../assets/images/market.jpg'),
      images: [
        require('../../assets/images/gov1.jpg'),
        require('../../assets/images/gov2.jpg'),
        require('../../assets/images/gov3.jpg'),
      ],
      specifications: [
        { label: 'Contract Type', value: 'GSA Schedule' },
        { label: 'CAGE Code', value: '1ABC23' },
        { label: 'DUNS Number', value: '123456789' },
        { label: 'Minority Business', value: 'Certified' },
        { label: 'Processing Time', value: '5-10 Business Days' },
      ],
    },
    {
      title: 'Common Agarwood Tree Diseases and Prevention Tips',
      description: 'Identify and protect trees from infections.',
      image: require('../../assets/images/diesease.jpg'),
      images: [
        require('../../assets/images/fr1.jpg'),
        require('../../assets/images/fr2.jpg'),
        require('../../assets/images/fr3.jpg'),
      ],
      specifications: [
        { label: 'Protection Level', value: 'NFPA 70E & 2112' },
        { label: 'Arc Rating', value: 'Up to 40 cal/cm²' },
        { label: 'Fabric Weight', value: '7oz - 12oz' },
        { label: 'Fabric Type', value: '100% Cotton & Blends' },
        { label: 'Colors Available', value: 'Navy, Royal, Khaki' },
      ],
    },
    {
      title: 'Resin Quality Boost Through New Cultivation Methods',
      description: 'Research shows improved resin yield naturally.',
      image: require('../../assets/images/quality.jpg'),
      images: [
        require('../../assets/images/blackinton1.jpg'),
        require('../../assets/images/blackinton2.jpg'),
        require('../../assets/images/blackinton3.jpg'),
      ],
      specifications: [
        { label: 'Material', value: 'Brass & Nickel Silver' },
        { label: 'Finish Options', value: 'Gold, Silver, Antique' },
        { label: 'Customization', value: 'Full Custom Design' },
        { label: 'Turnaround Time', value: '2-4 Weeks' },
        { label: 'Warranty', value: 'Lifetime Craftsmanship' },
      ],
    },
  ];

  const displayUser = user || { firstname: 'Test', lastname: 'User' };

  // ----- REQUIRED by <GlobalSearch onResultSelect=...> -----
  const handleSearchResultSelect = (result: SearchResult) => {
    switch (result.type) {
      case 'service':
        openModal(result.title);
        break;
      case 'special_service':
        openSSModal(result.title);
        break;
      case 'category':
        // If a category is chosen in search, jump to Products section
        scrollToSection('products');
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <Animated.View style={headerAnimatedStyle} className="px-6 py-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-primary rounded-full justify-center items-center mr-3">
              <Ionicons name="person" size={20} color="white" />
            </View>
            <Text className="text-lg font-semibold text-gray-900">
              Hello {displayUser?.firstname} {displayUser?.lastname}!
            </Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity onPress={() => setShowNotificationSlide(true)} className="mr-4">
              <Ionicons name="notifications" size={24} color="#10B981" />
              {notifications.filter(n => !n.read).length > 0 && (
                <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSettingsSlide(true)}>
              <Ionicons name="settings" size={24} color="#10B981" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        ref={scrollRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onContentSizeChange={onContentSizeChange}
      >
        {/* Global Search */}
        <Animated.View style={searchAnimatedStyle}>
          <GlobalSearch onResultSelect={handleSearchResultSelect} />
        </Animated.View>

        {/* ===== PRODUCTS ===== */}
        <View className="px-6 mb-6" onLayout={onProductsLayout}>
          <Text className="text-2xl font-bold text-primary mb-4">Agarwood Products</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16, paddingLeft: 2, paddingBottom: 2, paddingTop: 2 }}
          >
            {categories.map((category, index) => (
              <Animated.View
                key={category.title}
                entering={FadeIn.delay(300 + index * 100)}
                className="mr-3 shadow-sm"
              >
                <CategoryCard
                  title={category.title}
                  icon={category.icon}
                  onPress={() => {
                    // Optional: keep same behavior + ensure top of products
                    scrollToSection('products');
                  }}
                  gradient={['#BDF9E5', '#FFFFFF']}
                />
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* ===== SERVICES ===== */}
        <View className="px-6 mb-6 mt-3" onLayout={onServicesLayout}>
          <Text className="text-2xl font-bold text-primary mb-4">Main Services</Text>
          {services.map((service, index) => (
            <Animated.View key={service.title} entering={FadeInUp.delay(500 + index * 200)}>
              <ServiceCard
                title={service.title}
                description={service.description}
                icon={service.icon}
                onPress={() => openModal(service.title)}
                accentColor="#10B981"
                overlayIcon="camera-outline"
                gradient={['#E8E8E8', '#FFFFFF']}
              />
            </Animated.View>
          ))}

          {/* Service Modals */}
          {activeModal === 'Chips & Resin Grading' && (
            <ServiceModal visible={true} onClose={closeModal} title="Chips & Resin Grading" content={<VFDContent />} />
          )}
          {activeModal === 'Disease Detection' && (
            <ServiceModal visible={true} onClose={closeModal} title="Disease Detection" content={<UniformsContent />} />
          )}
          {activeModal === 'Market Price Forecasting' && (
            <ServiceModal
              visible={true}
              onClose={closeModal}
              title="Market Price Forecasting"
              content={<SafetyShoesContent />}
            />
          )}
          {activeModal === 'Stage Classification' && (
            <ServiceModal visible={true} onClose={closeModal} title="Stage Classification" content={<EmbroiederyContent />} />
          )}
        </View>

        {/* ===== ARTICLES ===== */}
        <View className="px-6 mb-6 mt-3" onLayout={onArticlesLayout}>
          <Text className="text-2xl font-bold text-primary mb-4">Articles</Text>
          {specialServices.map((brand, index) => (
            <Animated.View key={brand.title} entering={FadeInUp.delay(500 + index * 200)}>
              <SpecialServiceCard
                title={brand.title}
                description={brand.description}
                image={brand.image}
                badge="Article"
                featured={true}
                onPress={() => openSSModal(brand.title)}
              />
            </Animated.View>
          ))}
        </View>

        {/* Article Modals */}
        {activeSSModal === 'Global Agarwood Market Prices on the Rise' && (
          <SpecialServiceModal
            visible={true}
            onClose={closeSSModal}
            title="Global Agarwood Market Prices on the Rise"
            images={specialServices[0].images}
            specifications={specialServices[0].specifications}
            content={<GovernmentBuyersContent />}
          />
        )}
        {activeSSModal === 'Common Agarwood Tree Diseases and Prevention Tips' && (
          <SpecialServiceModal
            visible={true}
            onClose={closeSSModal}
            title="Common Agarwood Tree Diseases and Prevention Tips"
            images={specialServices[1].images}
            specifications={specialServices[1].specifications}
            content={<FRClothingContent />}
          />
        )}
        {activeSSModal === 'Resin Quality Boost Through New Cultivation Methods' && (
          <SpecialServiceModal
            visible={true}
            onClose={closeSSModal}
            title="Resin Quality Boost Through New Cultivation Methods"
            images={specialServices[2].images}
            specifications={specialServices[2].specifications}
            content={<BlackintonContent />}
          />
        )}

        <View className="h-20" />
      </ScrollView>

      {/* Notifications & Settings */}
      <NotificationSlideView
        visible={showNotificationSlide}
        onClose={() => setShowNotificationSlide(false)}
        notifications={notifications as any}
        onNotificationRead={(id) =>
          setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
        }
        onNotificationAction={(id, action) => {
          if (action === 'view') Alert.alert('Action', `Viewing details for notification ${id}`);
        }}
        onClearAll={() => setNotifications([])}
      />

      <SettingsSlideView
        visible={showSettingsSlide}
        onClose={() => setShowSettingsSlide(false)}
        onNavigate={(screen) => router.push(screen)}
        onLogout={() => {
          Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => router.replace('/(auth)/welcome') },
          ]);
        }}
        userInfo={{ name: 'John Doe', email: 'john@example.com' }}
      />
    </SafeAreaView>
  );
}
