import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView as SafeArea } from "react-native-safe-area-context";
import {
    predictDemand,
    type MarketRegion,
    type OilGrade,
    type OilType,
    type PredictionPeriod,
} from "../../../services/MarketintelligenceApi";

type Option = { label: string; value: string };

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

function SelectField({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const [open, setOpen] = useState(false);
  const currentLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? `Select ${label}`,
    [value, options, label],
  );

  return (
    <View style={{ marginBottom: open ? 16 : 12, zIndex: open ? 1000 : 1 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={styles.selectButton}
        activeOpacity={0.7}
      >
        {icon && (
          <View style={styles.selectIcon}>
            <Ionicons name={icon} size={14} color="#10B981" />
          </View>
        )}
        <Text
          style={{
            color: value ? "#1F2937" : "#9CA3AF",
            flex: 1,
            fontSize: 14,
          }}
        >
          {currentLabel}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color="#10B981"
        />
      </TouchableOpacity>

      {open && (
        <>
          <TouchableOpacity
            style={styles.dropdownOverlay}
            activeOpacity={1}
            onPress={() => setOpen(false)}
          />
          <View style={styles.dropdownList}>
            {options.map((o) => (
              <TouchableOpacity
                key={o.value}
                onPress={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                style={[
                  styles.dropdownOption,
                  o.value === value && styles.dropdownOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    o.value === value && styles.dropdownOptionTextActive,
                  ]}
                >
                  {o.label}
                </Text>
                {o.value === value && (
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const FloatingChat = () => (
  <TouchableOpacity
    onPress={() => router.push("/(services)/market-price/chat")}
    style={styles.floatingBtn}
  >
    <Ionicons name="chatbubble-ellipses" size={22} color="white" />
  </TouchableOpacity>
);

// ─── Static data matching backend exactly ─────────────────────────────────────

const OIL_TYPES: Option[] = [
  { label: "Silani Ravana", value: "Silani Ravana" },
  { label: "Silani Savera", value: "Silani Savera" },
  { label: "Silani Cobra", value: "Silani Cobra" },
  { label: "Silani Junglefowl", value: "Silani Junglefowl" },
  { label: "Silani Butterfly", value: "Silani Butterfly" },
  { label: "Silani Peacock", value: "Silani Peacock" },
];

const GRADES: Option[] = [
  { label: "Premium", value: "Premium" },
  { label: "Standard", value: "Standard" },
  { label: "Budget", value: "Budget" },
];

const REGIONS: Option[] = [
  { label: "Middle East", value: "Middle East" },
  { label: "East Asia", value: "East Asia" },
  { label: "Southeast Asia", value: "Southeast Asia" },
  { label: "Europe", value: "Europe" },
  { label: "South Asia", value: "South Asia" },
];

const COUNTRIES_BY_REGION: Record<string, Option[]> = {
  "Middle East": [
    { label: "UAE", value: "UAE" },
    { label: "Saudi Arabia", value: "Saudi Arabia" },
  ],
  "East Asia": [
    { label: "China", value: "China" },
    { label: "Taiwan", value: "Taiwan" },
    { label: "Japan", value: "Japan" },
  ],
  "Southeast Asia": [
    { label: "Singapore", value: "Singapore" },
    { label: "Malaysia", value: "Malaysia" },
  ],
  Europe: [
    { label: "Spain", value: "Spain" },
    { label: "Slovakia", value: "Slovakia" },
  ],
  "South Asia": [{ label: "India", value: "India" }],
};

const PERIODS: Option[] = [
  { label: "Next Week", value: "Next Week" },
  { label: "Next Month", value: "Next Month" },
  { label: "Next Quarter", value: "Next Quarter" },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function MarketPriceForm() {
  const [oilType, setOilType] = useState<OilType>("" as OilType);
  const [oilGrade, setOilGrade] = useState<OilGrade>("" as OilGrade);
  const [region, setRegion] = useState<MarketRegion>("" as MarketRegion);
  const [country, setCountry] = useState("");
  const [period, setPeriod] = useState<PredictionPeriod>(
    "" as PredictionPeriod,
  );
  const [festival, setFestival] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const generate = async () => {
    // Rate limiting - prevent spam submissions (3 second cooldown)
    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      Alert.alert(
        "Please Wait",
        "Please wait a moment before generating another prediction.",
        [{ text: "OK" }],
      );
      return;
    }

    // Validate all fields are filled
    if (!oilType || !oilGrade || !region || !country || !period) {
      Alert.alert(
        "Missing Information",
        "Please fill in all fields before generating prediction.",
        [{ text: "OK" }],
      );
      return;
    }

    // Country-region consistency check
    const validCountries =
      COUNTRIES_BY_REGION[region]?.map((c) => c.value) || [];
    if (!validCountries.includes(country)) {
      Alert.alert(
        "Invalid Selection",
        "Selected country doesn't match the region. Please reselect your market region.",
        [{ text: "OK" }],
      );
      return;
    }

    // Valid option checks
    const validOilTypes = OIL_TYPES.map((o) => o.value);
    const validGrades = GRADES.map((g) => g.value);
    const validRegions = REGIONS.map((r) => r.value);
    const validPeriods = PERIODS.map((p) => p.value);

    if (!validOilTypes.includes(oilType)) {
      Alert.alert("Invalid Selection", "Please select a valid oil type.", [
        { text: "OK" },
      ]);
      return;
    }
    if (!validGrades.includes(oilGrade)) {
      Alert.alert("Invalid Selection", "Please select a valid oil grade.", [
        { text: "OK" },
      ]);
      return;
    }
    if (!validRegions.includes(region)) {
      Alert.alert("Invalid Selection", "Please select a valid market region.", [
        { text: "OK" },
      ]);
      return;
    }
    if (!validPeriods.includes(period)) {
      Alert.alert(
        "Invalid Selection",
        "Please select a valid prediction period.",
        [{ text: "OK" }],
      );
      return;
    }

    setLastSubmitTime(now);

    setLoading(true);
    try {
      const result = await predictDemand({
        oil_type: oilType,
        oil_grade: oilGrade,
        market_region: region,
        market_country: country,
        prediction_period: period,
        festival_season: festival,
      });

      // Validate API response structure
      if (
        !result ||
        !result.demand_index ||
        !result.demand_level ||
        !result.recommended_price_range
      ) {
        throw new Error("Invalid response from server. Please try again.");
      }

      // Validate demand index range (0-100)
      if (result.demand_index < 0 || result.demand_index > 100) {
        throw new Error("Invalid demand index received. Please try again.");
      }

      // Validate price range
      if (
        result.recommended_price_range.min_price_lkr >=
        result.recommended_price_range.max_price_lkr
      ) {
        throw new Error("Invalid price range received. Please try again.");
      }

      // Validate price values are positive
      if (
        result.recommended_price_range.min_price_lkr <= 0 ||
        result.recommended_price_range.max_price_lkr <= 0
      ) {
        throw new Error("Invalid price values received. Please try again.");
      }

      router.push({
        pathname: "/(services)/market-price/result",
        params: {
          oilType: result.selected_details.oil_type,
          oilGrade: result.selected_details.oil_grade,
          country: result.selected_details.market_country,
          period: result.selected_details.prediction_period,
          demandIndex: String(result.demand_index),
          demandLevel: result.demand_level,
          minPrice: String(result.recommended_price_range.min_price_lkr),
          maxPrice: String(result.recommended_price_range.max_price_lkr),
          reasons: JSON.stringify(result.why),
          region,
          festival: festival ? "1" : "0",
        },
      });
    } catch (err: any) {
      Alert.alert(
        "Prediction Failed",
        err?.message ??
          "Could not connect to the server. Please check your network.",
        [{ text: "OK" }],
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeArea style={styles.screen}>
      <TopBar title="Market Intelligence.." />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View
          style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 }}
        >
          <View style={styles.sectionHeader}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#6B7280"
            />
            <Text style={styles.sectionHeaderText}>
              Fill below fields to continue
            </Text>
          </View>

          {/* Oil Details */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionCardLabel}>OIL DETAILS</Text>
            </View>
            <SelectField
              label="Oil Type"
              value={oilType}
              options={OIL_TYPES}
              onChange={(v) => setOilType(v as OilType)}
              icon="flask"
            />
            <SelectField
              label="Oil Grade"
              value={oilGrade}
              options={GRADES}
              onChange={(v) => setOilGrade(v as OilGrade)}
              icon="star"
            />
          </View>

          {/* Target Market */}
          <View style={[styles.sectionCard, { marginTop: 12 }]}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionCardLabel}>TARGET MARKET</Text>
            </View>
            <SelectField
              label="Market Region"
              value={region}
              options={REGIONS}
              onChange={(v) => {
                setRegion(v as MarketRegion);
                setCountry(COUNTRIES_BY_REGION[v]?.[0]?.value ?? "");
              }}
              icon="globe"
            />
            <SelectField
              label="Market Country"
              value={country}
              options={COUNTRIES_BY_REGION[region] ?? []}
              onChange={setCountry}
              icon="location"
            />
          </View>

          {/* Forecast Settings */}
          <View style={[styles.sectionCard, { marginTop: 12 }]}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionCardLabel}>FORECAST SETTINGS</Text>
            </View>
            <SelectField
              label="Prediction Period"
              value={period}
              options={PERIODS}
              onChange={(v) => setPeriod(v as PredictionPeriod)}
              icon="calendar"
            />
            <View style={styles.toggleRow}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View
                  style={[
                    styles.selectIcon,
                    { backgroundColor: festival ? "#ecfdf5" : "#f3f4f6" },
                  ]}
                >
                  <Ionicons
                    name="sparkles"
                    size={14}
                    color={festival ? "#10B981" : "#9CA3AF"}
                  />
                </View>
                <View>
                  <Text style={styles.fieldLabel}>Festival Season</Text>
                  <Text style={styles.toggleHint}>
                    Higher demand expected during festivals
                  </Text>
                </View>
              </View>
              <Switch
                value={festival}
                onValueChange={setFestival}
                trackColor={{ false: "#E5E7EB", true: "#6ee7b7" }}
                thumbColor={festival ? "#10B981" : "#9CA3AF"}
              />
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity
            onPress={generate}
            style={[styles.ctaButton, loading && { opacity: 0.75 }]}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="white"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.ctaText}>Predicting...</Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="flash"
                  size={18}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.ctaText}>Generate Prediction</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <FloatingChat />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f0fdf4" },
  scrollContent: {
    paddingHorizontal: Platform.OS === "web" ? 20 : 20,
    paddingTop: 20,
    paddingBottom: 80,
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionHeaderText: { fontSize: 15, fontWeight: "600", color: "#374151" },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 6,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  sectionCardLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 1.2,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  selectButton: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  selectIcon: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  dropdownList: {
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: 240,
    zIndex: 1001,
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownOptionActive: {
    backgroundColor: "#f0fdf4",
  },
  dropdownOptionText: {
    fontSize: 14,
    color: "#374151",
  },
  dropdownOptionTextActive: {
    color: "#10B981",
    fontWeight: "600",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  toggleHint: { fontSize: 11, color: "#9CA3AF", marginTop: 1 },
  ctaButton: {
    marginTop: 20,
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
  ctaText: { color: "white", fontWeight: "700", fontSize: 15 },
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
