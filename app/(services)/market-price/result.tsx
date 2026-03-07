import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TopBar = ({ title }: { title: string }) => (
  <View style={styles.topBar}>
    <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
      <Ionicons name="arrow-back" size={22} color="#111827" />
    </TouchableOpacity>
    <Text style={styles.topBarTitle}>{title}</Text>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <TouchableOpacity style={{ padding: 4 }}>
        <Ionicons name="notifications" size={22} color="#10B981" />
      </TouchableOpacity>
      <TouchableOpacity style={{ padding: 4 }}>
        <Ionicons name="settings-outline" size={22} color="#10B981" />
      </TouchableOpacity>
    </View>
  </View>
);

const FloatingChat = ({ params }: { params: any }) => (
  <TouchableOpacity
    onPress={() =>
      router.push({ pathname: "/(services)/market-price/chat", params })
    }
    style={styles.floatingBtn}
  >
    <Ionicons name="chatbubble-ellipses" size={22} color="white" />
  </TouchableOpacity>
);

function DemandGauge({ index, level }: { index: number; level: string }) {
  const color =
    level === "High" ? "#10B981" : level === "Medium" ? "#F59E0B" : "#EF4444";
  const bgColor =
    level === "High" ? "#ecfdf5" : level === "Medium" ? "#fffbeb" : "#fef2f2";
  const borderColor =
    level === "High" ? "#a7f3d0" : level === "Medium" ? "#fde68a" : "#fecaca";
  const icon =
    level === "High"
      ? "trending-up"
      : level === "Medium"
        ? "remove"
        : "trending-down";

  return (
    <View style={[styles.gaugeCard, { backgroundColor: bgColor, borderColor }]}>
      <View style={styles.gaugeLabelRow}>
        <Text style={styles.gaugeLabelText}>Demand Index</Text>
        <View style={[styles.demandBadge, { backgroundColor: color }]}>
          <Ionicons
            name={icon as any}
            size={12}
            color="white"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.demandBadgeText}>{level}</Text>
        </View>
      </View>
      <View style={styles.gaugeBarTrack}>
        <View
          style={[
            styles.gaugeBarFill,
            {
              width: `${Math.min(100, Math.max(0, index))}%` as any,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      <View style={styles.gaugeFooter}>
        <Text style={styles.gaugeMinMax}>0</Text>
        <Text style={[styles.gaugeScore, { color }]}>{index} / 100</Text>
        <Text style={styles.gaugeMinMax}>100</Text>
      </View>
    </View>
  );
}

export default function MarketPriceResult() {
  const p = useLocalSearchParams();

  // All params come directly from the real API response (via form.tsx)
  const oilType = String(p.oilType ?? "");
  const oilGrade = String(p.oilGrade ?? "");
  const country = String(p.country ?? "");
  const period = String(p.period ?? "");
  const demandIndex = Number(p.demandIndex ?? 0);
  const demandLevel = String(p.demandLevel ?? "Medium");
  const minPrice = Number(p.minPrice ?? 0);
  const maxPrice = Number(p.maxPrice ?? 0);

  let reasons: string[] = [];
  try {
    reasons = JSON.parse(String(p.reasons ?? "[]"));
  } catch {
    reasons = [];
  }

  return (
    <SafeAreaView style={styles.screen}>
      <TopBar title="Market Intelligence.." />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Prediction Result</Text>

        {/* Selected Details Card */}
        <View style={styles.detailsCard}>
          <View style={{ alignItems: "flex-start", marginBottom: 14 }}>
            <View style={styles.cardTitleBadge}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color="white"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.cardTitleText}>Selected Details</Text>
            </View>
          </View>
          <View style={styles.detailGrid}>
            {[
              { key: "Oil Type", val: oilType },
              { key: "Grade", val: oilGrade },
              { key: "Market", val: country },
              { key: "Period", val: period },
            ].map(({ key, val }) => (
              <View key={key} style={styles.detailItem}>
                <Text style={styles.detailKey}>{key.toUpperCase()}</Text>
                <Text style={styles.detailVal}>{val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Demand Gauge */}
        <DemandGauge index={demandIndex} level={demandLevel} />

        {/* Price Card */}
        <View style={styles.priceCard}>
          <View style={styles.priceTitleRow}>
            <Ionicons name="pricetag" size={16} color="#10B981" />
            <Text style={styles.priceTitle}>Recommended Price Range</Text>
            <Text style={styles.priceUnit}>Per 1ml</Text>
          </View>
          <View style={styles.priceRow}>
            <View style={[styles.priceBox, styles.priceBoxMin]}>
              <Text style={styles.priceBoxLabel}>MIN PRICE</Text>
              <Text style={[styles.priceBoxValue, { color: "#6B7280" }]}>
                LKR {minPrice.toLocaleString()}
              </Text>
              <Text style={styles.priceBoxHint}>Floor price</Text>
            </View>
            <View style={styles.priceArrow}>
              <Ionicons name="arrow-forward" size={18} color="#10B981" />
            </View>
            <View style={[styles.priceBox, styles.priceBoxMax]}>
              <Text style={styles.priceBoxLabel}>MAX PRICE</Text>
              <Text style={[styles.priceBoxValue, { color: "#10B981" }]}>
                LKR {maxPrice.toLocaleString()}
              </Text>
              <Text style={styles.priceBoxHint}>Optimal price</Text>
            </View>
          </View>
        </View>

        {/* Why Card */}
        <View style={styles.whyCard}>
          <View style={styles.whyTitleRow}>
            <Ionicons name="information-circle" size={18} color="#10B981" />
            <Text style={styles.whyTitle}>Why this recommendation?</Text>
          </View>
          {reasons.map((r, idx) => (
            <View key={idx} style={styles.whyRow}>
              <View style={styles.whyBullet} />
              <Text style={styles.whyText}>{r}</Text>
            </View>
          ))}
        </View>

        {/* Buttons */}
        <TouchableOpacity
          onPress={() => router.replace("/(services)/market-price/form")}
          style={styles.secondaryBtn}
          activeOpacity={0.8}
        >
          <Ionicons
            name="refresh"
            size={18}
            color="#10B981"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.secondaryBtnText}>New Prediction</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/home" as any)}
          style={styles.primaryBtn}
          activeOpacity={0.85}
        >
          <Ionicons
            name="home"
            size={18}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: "white", fontWeight: "700", fontSize: 15 }}>
            Back to Home
          </Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>

      <FloatingChat params={p} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f0fdf4" },
  scrollContent: {
    paddingHorizontal: Platform.OS === "web" ? 20 : 20,
    paddingTop: 20,
    paddingBottom: 20,
    ...(Platform.OS === "web"
      ? {
          alignItems: "center",
        }
      : {}),
  },
  responsiveContainer: {
    width: "100%",
    ...(Platform.OS === "web"
      ? {
          maxWidth: 640,
        }
      : {}),
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  topBarTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  detailsCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d1fae5",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitleBadge: {
    backgroundColor: "#10B981",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitleText: { color: "white", fontWeight: "700", fontSize: 12 },
  detailGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  detailItem: {
    width: "47%",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  detailKey: {
    fontSize: 10,
    fontWeight: "600",
    color: "#9CA3AF",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  detailVal: { fontSize: 13, fontWeight: "600", color: "#111827" },
  gaugeCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  gaugeLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  gaugeLabelText: { fontSize: 13, fontWeight: "600", color: "#374151" },
  demandBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  demandBadgeText: { color: "white", fontSize: 12, fontWeight: "700" },
  gaugeBarTrack: {
    height: 12,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 6,
    overflow: "hidden",
  },
  gaugeBarFill: { height: "100%", borderRadius: 6 },
  gaugeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    alignItems: "center",
  },
  gaugeMinMax: { fontSize: 10, color: "#9CA3AF", fontWeight: "500" },
  gaugeScore: { fontSize: 20, fontWeight: "800" },
  priceCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  priceTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  priceTitle: { fontSize: 13, fontWeight: "700", color: "#111827", flex: 1 },
  priceUnit: {
    fontSize: 10,
    color: "#9CA3AF",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontWeight: "600",
  },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  priceBox: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  priceBoxMin: { backgroundColor: "#f9fafb", borderColor: "#e5e7eb" },
  priceBoxMax: { backgroundColor: "#f0fdf4", borderColor: "#a7f3d0" },
  priceBoxLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 1,
    marginBottom: 4,
  },
  priceBoxValue: { fontSize: 15, fontWeight: "800", marginBottom: 2 },
  priceBoxHint: { fontSize: 10, color: "#9CA3AF" },
  priceArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
  },
  whyCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  whyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  whyTitle: { fontSize: 13, fontWeight: "700", color: "#111827" },
  whyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  whyBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginTop: 5,
    flexShrink: 0,
  },
  whyText: { fontSize: 13, color: "#4B5563", flex: 1, lineHeight: 20 },
  secondaryBtn: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#10B981",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  secondaryBtnText: { color: "#10B981", fontWeight: "700", fontSize: 15 },
  primaryBtn: {
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
});
