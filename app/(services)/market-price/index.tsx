import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PremiumServiceGuard } from "../../../components/PremiumServiceGuard";

const TopBar = ({ title }: { title: string }) => (
  <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
    <TouchableOpacity onPress={() => router.back()} className="p-1">
      <Ionicons name="arrow-back" size={22} color="#111827" />
    </TouchableOpacity>
    <Text className="font-semibold text-gray-900 text-base">{title}</Text>
    <View className="flex-row items-center" style={{ gap: 10 }}>
      <TouchableOpacity className="p-1">
        <Ionicons name="notifications" size={22} color="#10B981" />
      </TouchableOpacity>
      <TouchableOpacity className="p-1">
        <Ionicons name="settings-outline" size={22} color="#10B981" />
      </TouchableOpacity>
    </View>
  </View>
);

const FloatingChat = () => (
  <TouchableOpacity
    onPress={() => router.push("/(services)/market-price/chat")}
    style={styles.floatingBtn}
  >
    <Ionicons name="chatbubble-ellipses" size={22} color="white" />
    <View style={styles.chatDots}>
      <View style={[styles.dot, { backgroundColor: "#a7f3d0" }]} />
      <View style={[styles.dot, { backgroundColor: "#6ee7b7" }]} />
      <View style={[styles.dot, { backgroundColor: "#34d399" }]} />
    </View>
  </TouchableOpacity>
);

const FeatureRow = ({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) => (
  <View className="flex-row items-center mb-3" style={{ gap: 12 }}>
    <View style={styles.featureIconWrap}>
      <Ionicons name={icon} size={18} color="#10B981" />
    </View>
    <Text className="text-gray-600 flex-1 text-sm leading-5">{text}</Text>
  </View>
);

export default function MarketPriceLanding() {
  return (
    <PremiumServiceGuard serviceName="Market Intelligence">
      <SafeAreaView className="flex-1 bg-emerald-50">
      <TopBar title="Market Intelligence.." />

      <View style={styles.responsiveContainer}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          {/* Icon Badge */}
          <View style={styles.iconBadge}>
            <View style={styles.iconInner}>
              <Ionicons name="analytics" size={32} color="#10B981" />
            </View>
          </View>

          <Text style={styles.heroTitle}>
            Market Demand Forecast{"\n"}& Price Recommendation
          </Text>

          <Text className="text-center text-gray-500 text-sm leading-6 mb-5 px-2">
            AI-powered insights for Sri Lankan agarwood exporters — predict
            demand and get optimal pricing.
          </Text>

          {/* Divider with label */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>WHAT YOU GET</Text>
            <View style={styles.dividerLine} />
          </View>

          <View className="mt-4 w-full">
            <FeatureRow
              icon="trending-up"
              text="Future demand levels for your target markets"
            />
            <FeatureRow
              icon="pricetag"
              text="Recommended min & max price ranges per 1ml"
            />
            <FeatureRow
              icon="chatbubble-ellipses"
              text="Supports English & Sinhala for easy communication"
            />
          </View>
        </View>

        {/* Value proposition banner */}
        <View style={styles.valueBanner}>
          <Ionicons name="shield-checkmark" size={18} color="#10B981" />
          <Text className="text-gray-600 text-sm ml-2 flex-1">
            Make informed decisions and reduce pricing uncertainty with
            AI-powered insights.
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={() => router.push("/(services)/market-price/form")}
          style={styles.ctaButton}
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-base mr-2">
            Get Started
          </Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <FloatingChat />
      </SafeAreaView>
    </PremiumServiceGuard>
  );
}

const styles = StyleSheet.create({
  responsiveContainer: {
    flex: 1,
    paddingHorizontal: Platform.OS === "web" ? 20 : 20,
    paddingTop: 24,
    paddingBottom: 16,
    ...(Platform.OS === "web"
      ? {
          maxWidth: 640,
          alignSelf: "center",
          width: "100%",
        }
      : {}),
  },
  heroCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#d1fae5",
  },
  iconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#a7f3d0",
  },
  iconInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 10,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#d1fae5",
  },
  dividerLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 1.2,
    marginHorizontal: 10,
  },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
  },
  valueBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#d1fae5",
  },
  ctaButton: {
    marginTop: 16,
    backgroundColor: "#10B981",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  floatingBtn: {
    position: "absolute",
    right: 16,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  chatDots: {
    flexDirection: "row",
    position: "absolute",
    bottom: 8,
    gap: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
