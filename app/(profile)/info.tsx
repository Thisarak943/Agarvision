// app/(profile)/info.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/ui/Header';

type InfoType = 'history' | 'contact' | 'email' | 'about';

export default function InfoScreen() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  const activeType = (type as InfoType) || 'about';

  // ✅ Edit these once and everything updates
  const APP = {
    name: 'AgarVision',
    slogan: 'Agarwood Quality • Export Readiness • Smart Trading',
    supportEmail: 'support@agarvision.com',
    phone: '+94 77 123 4567',
    whatsapp: '+94 77 123 4567',
    website: 'https://agarvision.com',
    locationText: 'Colombo, Sri Lanka',
    mapUrl: 'https://maps.google.com/?q=Colombo,Sri%20Lanka',
    hours: 'Mon–Sun • 8:00 AM – 8:00 PM',
  };

  const [selectedTab, setSelectedTab] = useState<InfoType>(activeType);

  const title = useMemo(() => {
    switch (selectedTab) {
      case 'history':
        return 'History';
      case 'contact':
        return 'Contact';
      case 'email':
        return 'Email';
      case 'about':
      default:
        return 'About Us';
    }
  }, [selectedTab]);

  const tabItems: { key: InfoType; label: string; icon: any }[] = [
    { key: 'history', label: 'History', icon: 'time-outline' },
    { key: 'contact', label: 'Contact', icon: 'call-outline' },
    { key: 'email', label: 'Email', icon: 'mail-outline' },
    { key: 'about', label: 'About', icon: 'information-circle-outline' },
  ];

  // ✅ helpers
  const safeOpen = async (url: string, failMsg: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) throw new Error('Not supported');
      await Linking.openURL(url);
    } catch {
      Alert.alert('Error', failMsg);
    }
  };

  const copyText = async (label: string, value: string) => {
    try {
      // expo-clipboard is best, but if you don't have it installed,
      // we can still show the value so user can copy manually.
      // If you want proper copy, install: expo install expo-clipboard
      Alert.alert(`${label} 📋`, value);
    } catch {
      Alert.alert('Copy', value);
    }
  };

  const Badge = ({ text, tone = 'green' }: { text: string; tone?: 'green' | 'blue' | 'red' | 'gray' }) => {
    const styles =
      tone === 'green'
        ? 'bg-green-100 border-green-200 text-green-800'
        : tone === 'blue'
        ? 'bg-blue-100 border-blue-200 text-blue-800'
        : tone === 'red'
        ? 'bg-red-100 border-red-200 text-red-800'
        : 'bg-gray-100 border-gray-200 text-gray-800';

    return (
      <View className={`px-3 py-1 rounded-full border ${styles}`}>
        <Text className="text-xs font-semibold">{text}</Text>
      </View>
    );
  };

  const SectionTitle = ({ icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) => (
    <View className="mb-3">
      <View className="flex-row items-center">
        <View className="w-9 h-9 rounded-xl bg-primary items-center justify-center mr-3">
          <Ionicons name={icon} size={18} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{title}</Text>
          {subtitle ? <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );

  const Card = ({ children }: { children: any }) => (
    <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 shadow-sm">
      {children}
    </View>
  );

  const ActionButton = ({
    icon,
    label,
    onPress,
    color = 'bg-gray-900',
  }: {
    icon: any;
    label: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-center rounded-xl px-4 py-3 ${color}`}
      activeOpacity={0.9}
    >
      <Ionicons name={icon} size={18} color="white" />
      <Text className="text-white font-semibold ml-2">{label}</Text>
    </TouchableOpacity>
  );

  const Row = ({
    icon,
    label,
    value,
    onPress,
    rightIcon = 'chevron-forward',
  }: {
    icon: any;
    label: string;
    value: string;
    onPress?: () => void;
    rightIcon?: any;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className={`flex-row items-center justify-between py-3 ${onPress ? 'active:bg-gray-50' : ''}`}
    >
      <View className="flex-row items-center flex-1 pr-3">
        <Ionicons name={icon} size={18} color="#10B981" />
        <View className="ml-3 flex-1">
          <Text className="text-sm text-gray-500">{label}</Text>
          <Text className="text-base font-semibold text-gray-900">{value}</Text>
        </View>
      </View>
      {onPress ? <Ionicons name={rightIcon} size={18} color="#9CA3AF" /> : null}
    </TouchableOpacity>
  );

  const Tabs = () => (
    <View className="flex-row bg-white border border-gray-200 rounded-2xl p-1 mb-4">
      {tabItems.map((t) => {
        const active = selectedTab === t.key;
        return (
          <TouchableOpacity
            key={t.key}
            onPress={() => {
              setSelectedTab(t.key);
              router.setParams({ type: t.key });
            }}
            className={`flex-1 flex-row items-center justify-center py-2 rounded-xl ${
              active ? 'bg-primary' : 'bg-transparent'
            }`}
            activeOpacity={0.9}
          >
            <Ionicons name={t.icon} size={16} color={active ? 'white' : '#6B7280'} />
            <Text className={`ml-2 text-sm font-semibold ${active ? 'text-white' : 'text-gray-600'}`}>
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // ✅ CONTENT: HISTORY
  const HistoryContent = () => (
    <View>
      <SectionTitle
        icon="time-outline"
        title="Your Activity Timeline ⏳"
        subtitle="A clean view of your recent actions, checks, and requests."
      />

      <Card>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-bold text-gray-900">Recent Records</Text>
          <Badge text="UPDATED" tone="blue" />
        </View>

        {[
          { icon: 'leaf-outline', title: 'Quality Check Completed', sub: 'Premium prediction • 92% confidence ✅', time: 'Today • 10:12 AM' },
          { icon: 'cloud-upload-outline', title: 'Image Uploaded', sub: 'Agarwood chip photo submitted 📸', time: 'Yesterday • 6:40 PM' },
          { icon: 'document-text-outline', title: 'Export Readiness Saved', sub: 'Report generated & stored 🧾', time: 'Dec 20 • 3:05 PM' },
          { icon: 'shield-checkmark-outline', title: 'Account Verified', sub: 'Security check passed 🔐', time: 'Dec 18 • 9:11 AM' },
        ].map((item, idx) => (
          <View key={idx} className={`py-3 ${idx !== 3 ? 'border-b border-gray-100' : ''}`}>
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center">
                <Ionicons name={item.icon as any} size={18} color="#111827" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="font-semibold text-gray-900">{item.title}</Text>
                <Text className="text-sm text-gray-500 mt-1">{item.sub}</Text>
                <Text className="text-xs text-gray-400 mt-2">{item.time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </View>
          </View>
        ))}
      </Card>

      <Card>
        <SectionTitle
          icon="sparkles-outline"
          title="Tip 💡"
          subtitle="Keep your history clean by running checks with clear photos + correct numeric inputs."
        />
        <Text className="text-sm text-gray-600 leading-5">
          ✅ Use bright lighting{"\n"}
          ✅ Capture resin/chip texture clearly{"\n"}
          ✅ Enter numeric values accurately{"\n"}
          ✅ Save reports for viva/demo
        </Text>
      </Card>
    </View>
  );

  // ✅ CONTENT: CONTACT
  const ContactContent = () => (
    <View>
      <SectionTitle
        icon="call-outline"
        title="Contact Support ☎️"
        subtitle="Fast help for app issues, export help, or quality-check guidance."
      />

      <Card>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-bold text-gray-900">Support Status</Text>
          <Badge text="ONLINE • 24/7" tone="green" />
        </View>

        <Row
          icon="call-outline"
          label="Phone"
          value={APP.phone}
          onPress={() => safeOpen(`tel:${APP.phone.replace(/\s/g, '')}`, 'Unable to make phone call')}
        />
        <View className="border-b border-gray-100" />
        <Row
          icon="logo-whatsapp"
          label="WhatsApp"
          value={APP.whatsapp}
          onPress={() =>
            safeOpen(
              `https://wa.me/${APP.whatsapp.replace(/\D/g, '')}`,
              'Unable to open WhatsApp'
            )
          }
        />
        <View className="border-b border-gray-100" />
        <Row
          icon="time-outline"
          label="Working Hours"
          value={APP.hours}
        />
      </Card>

      <View className="flex-row" style={{ gap: 10 }}>
        <View className="flex-1">
          <ActionButton
            icon="call"
            label="Call Now"
            color="bg-primary"
            onPress={() => safeOpen(`tel:${APP.phone.replace(/\s/g, '')}`, 'Unable to make phone call')}
          />
        </View>
        <View className="flex-1">
          <ActionButton
            icon="copy-outline"
            label="Copy Phone"
            color="bg-gray-900"
            onPress={() => copyText('Phone Number', APP.phone)}
          />
        </View>
      </View>

      <Card>
        <SectionTitle icon="location-outline" title="Office Location 📍" subtitle="Visit us or use maps for directions." />
        <Row
          icon="pin-outline"
          label="Location"
          value={APP.locationText}
          onPress={() => safeOpen(APP.mapUrl, 'Unable to open maps')}
          rightIcon="navigate-outline"
        />
      </Card>
    </View>
  );

  // ✅ CONTENT: EMAIL
  const EmailContent = () => (
    <View>
      <SectionTitle
        icon="mail-outline"
        title="Email Us ✉️"
        subtitle="Send screenshots, model results, or error logs — we reply quickly."
      />

      <Card>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-bold text-gray-900">Primary Email</Text>
          <Badge text="VERIFIED" tone="blue" />
        </View>

        <Row
          icon="mail-outline"
          label="Support Email"
          value={APP.supportEmail}
          onPress={() =>
            safeOpen(
              `mailto:${APP.supportEmail}?subject=${encodeURIComponent('Support Request - ' + APP.name)}&body=${encodeURIComponent(
                'Hi Support Team,\n\nI need help with:\n\n1) Issue:\n2) Steps to reproduce:\n3) Screenshot/Logs:\n\nThanks.'
              )}`,
              'Unable to open email app'
            )
          }
          rightIcon="send-outline"
        />

        <View className="border-b border-gray-100" />

        <Row
          icon="copy-outline"
          label="Copy Email"
          value={APP.supportEmail}
          onPress={() => copyText('Support Email', APP.supportEmail)}
          rightIcon="copy-outline"
        />
      </Card>

      <Card>
        <SectionTitle icon="alert-circle-outline" title="What to include ✅" subtitle="This helps us solve fast." />
        <Text className="text-sm text-gray-600 leading-6">
          🔹 App screen name (ex: Profile → Info){"\n"}
          🔹 What you expected vs what happened{"\n"}
          🔹 Screenshot / screen recording{"\n"}
          🔹 Device model + Android/iOS version{"\n"}
          🔹 Any error text (copy/paste)
        </Text>
      </Card>
    </View>
  );

  // ✅ CONTENT: ABOUT
  const AboutContent = () => (
    <View>
      <SectionTitle
        icon="information-circle-outline"
        title={`${APP.name} 🌿`}
        subtitle={APP.slogan}
      />

      <Card>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-bold text-gray-900">What we do</Text>
          <Badge text="AGARWOOD" tone="green" />
        </View>

        <Text className="text-sm text-gray-600 leading-6">
          ✅ Identify agarwood resin/chips quality quickly{"\n"}
          ✅ Support export readiness decisions{"\n"}
          ✅ Provide market guidance + grading consistency{"\n"}
          ✅ Save reports for verification & documentation
        </Text>
      </Card>

      <Card>
        <SectionTitle icon="ribbon-outline" title="Key Features ⭐" subtitle="Designed for real-world agarwood trade." />
        {[
          { icon: 'camera-outline', t: 'Image-based Checking', s: 'Capture chips/resin and get grade suggestions.' },
          { icon: 'stats-chart-outline', t: 'Confidence & Insights', s: 'See confidence + recommendations for next steps.' },
          { icon: 'document-text-outline', t: 'Report Saving', s: 'Generate reports for export documentation.' },
          { icon: 'shield-checkmark-outline', t: 'Secure & Private', s: 'Your data is handled with care.' },
        ].map((x, i) => (
          <View key={i} className={`flex-row items-start py-3 ${i !== 3 ? 'border-b border-gray-100' : ''}`}>
            <View className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center">
              <Ionicons name={x.icon as any} size={18} color="#111827" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="font-semibold text-gray-900">{x.t}</Text>
              <Text className="text-sm text-gray-500 mt-1">{x.s}</Text>
            </View>
          </View>
        ))}
      </Card>

      <Card>
        <SectionTitle icon="globe-outline" title="Links 🔗" subtitle="Quick access to official channels." />
        <Row
          icon="link-outline"
          label="Website"
          value={APP.website}
          onPress={() => safeOpen(APP.website, 'Unable to open website')}
          rightIcon="open-outline"
        />
      </Card>
    </View>
  );

  const renderBody = () => {
    switch (selectedTab) {
      case 'history':
        return <HistoryContent />;
      case 'contact':
        return <ContactContent />;
      case 'email':
        return <EmailContent />;
      case 'about':
      default:
        return <AboutContent />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title={title} />

      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
        <Tabs />
        {renderBody()}

        <View className="h-6" />
        <View className="items-center pb-8">
          <Text className="text-xs text-gray-400">© {new Date().getFullYear()} {APP.name} • All rights reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
