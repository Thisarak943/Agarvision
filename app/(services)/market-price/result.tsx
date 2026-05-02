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
    <TouchableOpacity onPress={() => router.back()} style={styles.topIconBtn}>
      <Ionicons name="arrow-back" size={22} color="#111827" />
    </TouchableOpacity>
    <View style={styles.topTitleWrap}>
      <Text style={styles.topBarTitle}>{title}</Text>
      <Text style={styles.topBarSubtitle}>
        Demand forecast and recommended pricing
      </Text>
    </View>
    <TouchableOpacity
      onPress={() => router.push("/(services)/market-price/chat")}
      style={styles.chatBtn}
      activeOpacity={0.8}
    >
      <Ionicons name="chatbubble-ellipses" size={18} color="#10B981" />
    </TouchableOpacity>
  </View>
);

function demandTone(category: string) {
  const normalized = category.trim().toLowerCase();

  if (normalized.includes("high")) {
    return {
      color: "#10B981",
      backgroundColor: "#D1FAE5",
      textColor: "#065F46",
    };
  }

  if (normalized.includes("medium")) {
    return {
      color: "#F59E0B",
      backgroundColor: "#FEF3C7",
      textColor: "#92400E",
    };
  }

  return {
    color: "#EF4444",
    backgroundColor: "#FEE2E2",
    textColor: "#991B1B",
  };
}

function formatLkr(value: number) {
  if (!value || Number.isNaN(value)) return "-";
  return `LKR ${value.toLocaleString()}`;
}

function formatBooleanParam(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value;
  const normalized = String(raw ?? "").trim().toLowerCase();
  return ["1", "true", "yes", "y"].includes(normalized) ? "Yes" : "No";
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={2}>
        {value || "-"}
      </Text>
    </View>
  );
}

export default function MarketDemandResult() {
  const params = useLocalSearchParams();

  const oilName = String(params.oilName ?? "");
  const oilGrade = String(params.oilGrade ?? "");
  const exportCountry = String(params.exportCountry ?? "");
  const exportDate = String(params.exportDate ?? "");
  const marketRegion = String(params.marketRegion ?? "");
  const demandIndex = Number(params.demandIndex ?? 0);
  const demandCategory = String(params.demandCategory ?? "Medium");
  const festivalSeason = formatBooleanParam(params.festival);
  const minPrice = Number(params.minPrice ?? 0);
  const maxPrice = Number(params.maxPrice ?? 0);
  const currentPrice = Number(params.currentPrice ?? 0);

  let reasons: string[] = [];
  try {
    reasons = JSON.parse(String(params.reasons ?? "[]"));
  } catch {
    reasons = [];
  }

  const categoryTone = demandTone(demandCategory);

  return (
    <SafeAreaView style={styles.screen}>
      <TopBar title="Market Intelligence - Demand" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.resultTitle}>Demand Prediction Result</Text>
                <Text style={styles.resultSubtitle}>{exportDate}</Text>
              </View>
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: categoryTone.backgroundColor },
                ]}
              >
                <Text
                  style={[
                    styles.categoryBadgeText,
                    { color: categoryTone.textColor },
                  ]}
                >
                  {demandCategory}
                </Text>
              </View>
            </View>

            <View style={styles.detailGrid}>
              <DetailItem label="Oil" value={oilName} />
              <DetailItem label="Grade" value={oilGrade} />
              <DetailItem label="Export country" value={exportCountry} />
              <DetailItem label="Market region" value={marketRegion} />
              <DetailItem label="Festival season" value={festivalSeason} />
            </View>

            <View style={styles.demandCard}>
              <Text style={styles.cardSectionLabel}>Demand</Text>
              <View style={styles.demandRow}>
                <View>
                  <Text style={styles.demandIndexLabel}>Demand Index</Text>
                  <Text
                    style={[
                      styles.demandIndexValue,
                      { color: categoryTone.color },
                    ]}
                  >
                    {demandIndex.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.gaugeTrack}>
                  <View
                    style={[
                      styles.gaugeFill,
                      {
                        width: `${Math.min(100, Math.max(0, demandIndex))}%` as any,
                        backgroundColor: categoryTone.color,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={styles.priceCard}>
              <View style={styles.priceTitleRow}>
                <Ionicons name="pricetag" size={17} color="#10B981" />
                <Text style={styles.cardSectionLabel}>Recommended Price</Text>
              </View>
              <Text style={styles.priceValue}>
                {formatLkr(minPrice)} - {formatLkr(maxPrice)}
              </Text>
              {currentPrice ? (
                <Text style={styles.currentPrice}>
                  Current selling price: {formatLkr(currentPrice)}
                </Text>
              ) : null}
            </View>

            {reasons.length ? (
              <View style={styles.reasonsCard}>
                <View style={styles.priceTitleRow}>
                  <Ionicons
                    name="information-circle"
                    size={17}
                    color="#10B981"
                  />
                  <Text style={styles.cardSectionLabel}>
                    Reasons for prediction
                  </Text>
                </View>
                {reasons.map((reason, index) => (
                  <View key={`${reason}-${index}`} style={styles.reasonRow}>
                    <View style={styles.reasonDot} />
                    <Text style={styles.reasonText}>{reason}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={() => router.replace("/(services)/market-price/form")}
            style={styles.secondaryButton}
            activeOpacity={0.82}
          >
            <Ionicons
              name="refresh"
              size={18}
              color="#10B981"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.secondaryButtonText}>New Prediction</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(services)/market-price/chat")}
            style={styles.primaryButton}
            activeOpacity={0.86}
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={18}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.primaryButtonText}>Ask Assistant</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f0fdf4" },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 30,
    ...(Platform.OS === "web"
      ? {
          alignItems: "center",
        }
      : {}),
  },
  container: {
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
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  topIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitleWrap: { flex: 1 },
  topBarTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
  topBarSubtitle: { fontSize: 11, color: "#6B7280", marginTop: 2 },
  chatBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    alignItems: "center",
    justifyContent: "center",
  },
  resultCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#d1fae5",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 7,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },
  resultTitle: { color: "#111827", fontSize: 18, fontWeight: "900" },
  resultSubtitle: { color: "#6B7280", fontSize: 12, marginTop: 3 },
  categoryBadge: {
    borderRadius: 18,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  categoryBadgeText: { color: "white", fontSize: 12, fontWeight: "900" },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginBottom: 12,
  },
  detailItem: {
    width: "48%",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 11,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  detailLabel: {
    color: "#9CA3AF",
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  detailValue: { color: "#111827", fontSize: 13, fontWeight: "800" },
  demandCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 13,
    padding: 13,
    marginBottom: 12,
  },
  cardSectionLabel: {
    color: "#047857",
    fontSize: 12,
    fontWeight: "900",
  },
  demandRow: { marginTop: 8, gap: 10 },
  demandIndexLabel: { color: "#6B7280", fontSize: 11, fontWeight: "700" },
  demandIndexValue: { fontSize: 28, fontWeight: "900", marginTop: 1 },
  gaugeTrack: {
    height: 11,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  gaugeFill: { height: "100%", borderRadius: 6 },
  priceCard: {
    backgroundColor: "#ecfdf5",
    borderRadius: 13,
    padding: 13,
    marginBottom: 12,
  },
  priceTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 8,
  },
  priceValue: { color: "#111827", fontSize: 18, fontWeight: "900" },
  currentPrice: { color: "#6B7280", fontSize: 12, marginTop: 4 },
  reasonsCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 13,
    padding: 13,
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  reasonDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginTop: 6,
    flexShrink: 0,
  },
  reasonText: { flex: 1, color: "#4B5563", fontSize: 13, lineHeight: 19 },
  secondaryButton: {
    marginTop: 16,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#10B981",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  secondaryButtonText: { color: "#10B981", fontSize: 15, fontWeight: "800" },
  primaryButton: {
    marginTop: 10,
    backgroundColor: "#10B981",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: { color: "white", fontSize: 15, fontWeight: "900" },
});
