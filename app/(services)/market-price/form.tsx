import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getDemandOptions,
  predictDemand,
  type DemandOptionsResponse,
} from "../../../services/MarketintelligenceApi";

type Option = { label: string; value: string };
type RawOption =
  | string
  | number
  | {
      label?: string | number;
      value?: string | number;
      name?: string | number;
      title?: string | number;
      month?: string | number;
      month_name?: string | number;
      week?: string | number;
    };

const DEFAULT_OPTIONS: DemandOptionsResponse = {
  oil_types: [
    "Silani Ravana",
    "Silani Savera",
    "Silani Cobra",
    "Silani Junglefowl",
    "Silani Butterfly",
    "Silani Peacock",
  ],
  oil_grades: ["Premium", "Standard", "Budget"],
  market_regions: [
    "Middle East",
    "East Asia",
    "Southeast Asia",
    "Europe",
    "South Asia",
  ],
  countries_by_region: {
    "Middle East": ["UAE", "Saudi Arabia"],
    "East Asia": ["China", "Taiwan", "Japan", "Hong Kong"],
    "Southeast Asia": ["Malaysia", "Indonesia", "Vietnam", "Singapore"],
    Europe: ["Spain", "Slovakia"],
    "South Asia": ["India", "Pakistan"],
  },
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  weeks: [1, 2, 3, 4],
};

const TopBar = ({ title }: { title: string }) => (
  <View style={styles.topBar}>
    <TouchableOpacity onPress={() => router.back()} style={styles.topIconBtn}>
      <Ionicons name="arrow-back" size={22} color="#111827" />
    </TouchableOpacity>
    <View style={styles.topTitleWrap}>
      <Text style={styles.topBarTitle}>{title}</Text>
      <Text style={styles.topBarSubtitle}>
        Structured forecast for export demand and pricing
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

function asOptions(values: RawOption[] = []): Option[] {
  return values.map((item) => {
    if (typeof item !== "object" || item === null) {
      return { label: String(item), value: String(item) };
    }

    const label =
      item.label ??
      item.month_name ??
      item.name ??
      item.title ??
      item.value ??
      item.week ??
      item.month ??
      "";

    const value =
      item.value ??
      item.month_name ??
      item.name ??
      item.label ??
      item.week ??
      item.month ??
      label;

    return {
      label: String(label),
      value: String(value),
    };
  });
}

function SelectField({
  label,
  value,
  options,
  onChange,
  icon,
  disabled,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  return (
    <View style={[styles.fieldWrap, open && styles.fieldWrapOpen]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity
        onPress={() => !disabled && setOpen((current) => !current)}
        style={[styles.selectButton, disabled && styles.selectButtonDisabled]}
        activeOpacity={0.75}
        disabled={disabled}
      >
        <View style={styles.selectIcon}>
          <Ionicons name={icon} size={15} color="#10B981" />
        </View>
        <Text
          style={[
            styles.selectText,
            !selected && styles.selectPlaceholder,
            disabled && styles.selectTextDisabled,
          ]}
          numberOfLines={1}
        >
          {selected?.label ?? `Select ${label}`}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={17}
          color={disabled ? "#9CA3AF" : "#10B981"}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownList}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
              style={[
                styles.dropdownOption,
                option.value === value && styles.dropdownOptionActive,
              ]}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.dropdownOptionText,
                  option.value === value && styles.dropdownOptionTextActive,
                ]}
              >
                {option.label}
              </Text>
              {option.value === value && (
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default function MarketDemandForm() {
  const [options, setOptions] = useState<DemandOptionsResponse>(DEFAULT_OPTIONS);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState("");

  const [oilType, setOilType] = useState("");
  const [oilGrade, setOilGrade] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [month, setMonth] = useState("");
  const [week, setWeek] = useState("");
  const [festival, setFestival] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadOptions() {
      setOptionsLoading(true);
      setError("");

      try {
        const data = await getDemandOptions();
        if (!active) return;
        setOptions({
          ...DEFAULT_OPTIONS,
          ...data,
          countries_by_region:
            data.countries_by_region ?? DEFAULT_OPTIONS.countries_by_region,
        });
      } catch (err: any) {
        if (!active) return;
        setError(
          err?.message ||
            "Could not load backend options. Default options are available."
        );
        setOptions(DEFAULT_OPTIONS);
      } finally {
        if (active) setOptionsLoading(false);
      }
    }

    loadOptions();

    return () => {
      active = false;
    };
  }, []);

  const countries = useMemo(
    () => (region ? options.countries_by_region[region] ?? [] : []),
    [options.countries_by_region, region]
  );

  const isComplete =
    !!oilType && !!oilGrade && !!region && !!country && !!month && !!week;

  const submit = async () => {
    setError("");

    if (!isComplete) {
      setError("Please select all required fields before predicting demand.");
      return;
    }

    if (!countries.includes(country)) {
      setError("Export country must match the selected market region.");
      return;
    }

    setLoading(true);

    try {
      const result = await predictDemand({
        oil_type: oilType,
        oil_grade: oilGrade,
        market_region: region,
        market_country: country,
        prediction_month: month,
        prediction_week: Number(week),
        festival_season: festival,
      });

      if (!result || typeof result.demand_index !== "number") {
        throw new Error("Invalid prediction response from server.");
      }

      router.push({
        pathname: "/(services)/market-price/result",
        params: {
          oilName: result.oil_name,
          oilGrade: result.oil_grade,
          exportCountry: result.export_country,
          exportDate: result.export_date,
          marketRegion: result.market_region ?? region,
          demandIndex: String(result.demand_index),
          demandCategory: result.demand_category,
          minPrice: String(result.recommended_price_range.min_price_lkr),
          maxPrice: String(result.recommended_price_range.max_price_lkr),
          currentPrice: String(
            result.recommended_price_range.current_selling_price_lkr ?? ""
          ),
          reasons: JSON.stringify(result.reasons ?? []),
          festival: festival ? "1" : "0",
        },
      });
    } catch (err: any) {
      const message =
        err?.message ||
        "Could not predict demand. Please check the backend and try again.";
      setError(message);
      Alert.alert("Prediction Failed", message, [{ text: "OK" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <TopBar title="Market Intelligence - Demand" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {optionsLoading && (
            <View style={styles.statusBanner}>
              <ActivityIndicator size="small" color="#10B981" />
              <Text style={styles.statusText}>Loading demand options...</Text>
            </View>
          )}

          {error ? (
            <View style={styles.errorBanner}>
              <Ionicons name="warning-outline" size={17} color="#B45309" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.formCard}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionTitle}>Input form</Text>
            </View>

            <SelectField
              label="Oil Type"
              value={oilType}
              options={asOptions(options.oil_types)}
              onChange={setOilType}
              icon="flask"
            />
            <SelectField
              label="Oil Grade"
              value={oilGrade}
              options={asOptions(options.oil_grades)}
              onChange={setOilGrade}
              icon="star"
            />
            <SelectField
              label="Market Region"
              value={region}
              options={asOptions(options.market_regions)}
              onChange={(value) => {
                setRegion(value);
                setCountry("");
              }}
              icon="globe"
            />
            <SelectField
              label="Export Country"
              value={country}
              options={asOptions(countries)}
              onChange={setCountry}
              icon="location"
              disabled={!region}
            />
            <SelectField
              label="Prediction Month"
              value={month}
              options={asOptions(options.months)}
              onChange={setMonth}
              icon="calendar"
            />
            <SelectField
              label="Prediction Week"
              value={week}
              options={asOptions(options.weeks)}
              onChange={setWeek}
              icon="today"
            />

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextWrap}>
                <View
                  style={[
                    styles.selectIcon,
                    festival && styles.selectIconActive,
                  ]}
                >
                  <Ionicons
                    name="sparkles"
                    size={15}
                    color={festival ? "#10B981" : "#9CA3AF"}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>Festival Season</Text>
                  <Text style={styles.toggleHint}>
                    Enable if the target period has festival demand
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

          <TouchableOpacity
            onPress={submit}
            style={[
              styles.submitButton,
              (!isComplete || loading) && styles.submitButtonDisabled,
            ]}
            disabled={!isComplete || loading}
            activeOpacity={0.86}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="white"
                style={{ marginRight: 10 }}
              />
            ) : (
              <Ionicons
                name="analytics"
                size={18}
                color="white"
                style={{ marginRight: 8 }}
              />
            )}
            <Text style={styles.submitText}>
              {loading ? "Predicting..." : "Predict Demand"}
            </Text>
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
    paddingBottom: 28,
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
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d1fae5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  statusText: { color: "#047857", fontSize: 13, fontWeight: "600" },
  errorBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: { flex: 1, color: "#92400E", fontSize: 12, lineHeight: 17 },
  formCard: {
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
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 14,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  sectionTitle: {
    color: "#047857",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  fieldWrap: { marginBottom: 12, zIndex: 1 },
  fieldWrapOpen: { zIndex: 20 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
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
    gap: 9,
  },
  selectButtonDisabled: { backgroundColor: "#f3f4f6" },
  selectIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
  },
  selectIconActive: { backgroundColor: "#d1fae5" },
  selectText: {
    flex: 1,
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  selectPlaceholder: { color: "#9CA3AF", fontWeight: "500" },
  selectTextDisabled: { color: "#9CA3AF" },
  dropdownList: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownOptionActive: { backgroundColor: "#f0fdf4" },
  dropdownOptionText: { color: "#374151", fontSize: 14 },
  dropdownOptionTextActive: { color: "#047857", fontWeight: "800" },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingTop: 4,
  },
  toggleTextWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  toggleHint: { color: "#6B7280", fontSize: 11, lineHeight: 15 },
  submitButton: {
    marginTop: 16,
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
  submitButtonDisabled: {
    backgroundColor: "#A7F3D0",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitText: { color: "white", fontSize: 15, fontWeight: "800" },
});
