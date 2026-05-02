import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  checkMarketHealth,
  checkMarketLlmHealth,
  resetChatConversation,
  sendChatMessage,
  type MarketChatPrediction,
} from "../../../services/MarketintelligenceApi";

const SESSION_KEY = "OSHINI_MARKET_CHATBOT_SESSION_ID";

type Msg = {
  id: string;
  role: "bot" | "user";
  text: string;
  status?: string;
  intent?: string;
  prediction?: MarketChatPrediction | null;
};

const QUICK_PROMPTS = [
  "Hello",
  "What you can do in here?",
  "What is the demand for Silani Ravana Premium oil in UAE for December Week 4 on festival season?",
  "Current oil prices",
  "Agarwood oil details",
];

function createSessionId() {
  return `mobile_user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function getStableSessionId() {
  const existing = await AsyncStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const next = createSessionId();
  await AsyncStorage.setItem(SESSION_KEY, next);
  return next;
}

const TopBar = ({
  backendOnline,
  resetting,
  onReset,
}: {
  backendOnline: boolean | null;
  resetting: boolean;
  onReset: () => void;
}) => (
  <View style={styles.topBar}>
    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
      <Ionicons name="arrow-back" size={22} color="#111827" />
    </TouchableOpacity>

    <View style={styles.headerTextWrap}>
      <Text style={styles.topBarTitle}>Agarwood Market Assistant</Text>
      <View style={styles.subtitleRow}>
        <View
          style={[
            styles.onlineDot,
            backendOnline === false && styles.offlineDot,
            backendOnline === null && styles.checkingDot,
          ]}
        />
        <Text style={styles.subtitleText}>
          Ask about demand, prices, oil types, and export markets
        </Text>
      </View>
    </View>

    <TouchableOpacity
      onPress={onReset}
      style={[styles.resetBtn, resetting && styles.resetBtnDisabled]}
      disabled={resetting}
      activeOpacity={0.8}
    >
      {resetting ? (
        <ActivityIndicator size="small" color="#10B981" />
      ) : (
        <Ionicons name="refresh" size={18} color="#10B981" />
      )}
    </TouchableOpacity>
  </View>
);

function BotAvatar() {
  return (
    <View style={styles.botAvatar}>
      <Ionicons name="analytics" size={16} color="white" />
    </View>
  );
}

function UserAvatar() {
  return (
    <View style={styles.userAvatar}>
      <Ionicons name="person" size={14} color="#10B981" />
    </View>
  );
}

function formatLkr(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `LKR ${value.toLocaleString()}`;
}

function getBotDisplayText(
  reply: string | undefined,
  prediction?: MarketChatPrediction | null
) {
  if (!prediction) {
    return (
      reply ||
      "I can help with agarwood oil demand, prices, oil types, and export markets."
    );
  }

  const price = prediction.recommended_price_range;
  const priceText = price
    ? `For pricing, I would keep it around ${formatLkr(
        price.min_price_lkr
      )} to ${formatLkr(price.max_price_lkr)}.`
    : "";
  const currentPriceText =
    typeof price?.current_selling_price_lkr === "number"
      ? ` The current selling price is about ${formatLkr(
          price.current_selling_price_lkr
        )}.`
      : "";
  const reasons = prediction.reasons?.slice(0, 2).join(" Also, ");
  const reasonText = reasons ? ` ${reasons}` : "";
  const backendReply = reply ? `${reply.trim()} ` : "";

  return `${backendReply}For ${prediction.oil_name} ${prediction.oil_grade} oil in ${prediction.export_country}, the demand looks ${prediction.demand_category.toLowerCase()} for ${prediction.export_date}. The demand index is ${prediction.demand_index}.${reasonText} ${priceText}${currentPriceText}`.trim();
}

function TypingIndicator() {
  return (
    <View style={styles.msgRowBot}>
      <BotAvatar />
      <View style={styles.typingBubble}>
        <ActivityIndicator size="small" color="white" />
        <Text style={styles.typingText}>Thinking...</Text>
      </View>
    </View>
  );
}

export default function MarketPriceChat() {
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Hello! I’m here to help with agarwood oil questions.",
    },
  ]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [llmOnline, setLlmOnline] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    let active = true;

    async function init() {
      const id = await getStableSessionId();
      const [online, llmReady] = await Promise.all([
        checkMarketHealth(),
        checkMarketLlmHealth(),
      ]);

      if (!active) return;
      setSessionId(id);
      setBackendOnline(online);
      setLlmOnline(llmReady);
      if (!online) {
        setError(
          "Backend is unavailable. Please start the chatbot API and try again."
        );
      } else if (!llmReady) {
        setError(
          "Chatbot backend is running, but the LLM service is not configured."
        );
      }
    }

    init();

    return () => {
      active = false;
    };
  }, []);

  const scrollToEnd = () => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  };

  const send = async (overrideText?: string) => {
    const trimmed = (overrideText ?? text).trim();
    if (!trimmed || isTyping) return;

    const activeSessionId = sessionId || (await getStableSessionId());
    if (!sessionId) setSessionId(activeSessionId);

    const userMsg: Msg = {
      id: `${Date.now()}-user`,
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setText("");
    setIsTyping(true);
    setError("");
    scrollToEnd();

    try {
      const res = await sendChatMessage(trimmed, activeSessionId);

      const botMsg: Msg = {
        id: `${Date.now()}-bot`,
        role: "bot",
        text: getBotDisplayText(res.reply, res.prediction),
        status: res.status,
        intent: res.intent,
        prediction: res.prediction,
      };

      setBackendOnline(true);
      setLlmOnline(true);
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setBackendOnline(false);
      setLlmOnline(false);
      const msg =
        err?.message ||
        "Could not reach the chatbot service. Please check the backend.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: "bot",
          text: msg,
          status: "error",
        },
      ]);
    } finally {
      setIsTyping(false);
      scrollToEnd();
    }
  };

  const resetChat = async () => {
    const activeSessionId = sessionId || (await getStableSessionId());
    setResetting(true);
    setError("");

    try {
      await resetChatConversation(activeSessionId);
      setMessages([
        {
          id: "welcome-reset",
          role: "bot",
          text: "Chat reset. Ask me about agarwood oil demand, prices, oil details, or export markets.",
        },
      ]);
      setBackendOnline(true);
      setLlmOnline(true);
    } catch (err: any) {
      setError(err?.message || "Could not reset the chat session.");
    } finally {
      setResetting(false);
    }
  };

  const renderItem = ({ item }: { item: Msg }) => {
    const isUser = item.role === "user";

    return (
      <View style={isUser ? styles.msgRowUser : styles.msgRowBot}>
        {!isUser && <BotAvatar />}
        <View style={styles.messageContent}>
          <View
            style={[
              styles.bubble,
              isUser ? styles.bubbleUser : styles.bubbleBot,
              item.status === "error" && styles.errorBubble,
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                isUser ? styles.bubbleTextUser : styles.bubbleTextBot,
                item.status === "error" && styles.errorText,
              ]}
            >
              {item.text}
            </Text>
          </View>
        </View>
        {isUser && <UserAvatar />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        backendOnline={backendOnline}
        resetting={resetting}
        onReset={resetChat}
      />

      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {error || llmOnline === false ? (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={16} color="#B45309" />
            <Text style={styles.errorBannerText}>
              {error ||
                "Chatbot backend is running, but the LLM service is not configured."}
            </Text>
          </View>
        ) : null}

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={scrollToEnd}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        <View style={styles.bottomSection}>
          <View style={styles.chipsRow}>
            {QUICK_PROMPTS.map((prompt) => (
              <TouchableOpacity
                key={prompt}
                style={styles.chip}
                onPress={() => send(prompt)}
                disabled={isTyping}
                activeOpacity={0.75}
              >
                <Text style={styles.chipText} numberOfLines={1}>
                  {prompt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputWrap}>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Type your market question..."
                placeholderTextColor="#9CA3AF"
                style={styles.textInput}
                multiline
                returnKeyType="send"
                onSubmitEditing={() => send()}
                blurOnSubmit
              />
            </View>

            <TouchableOpacity
              onPress={() => send()}
              style={[
                styles.sendBtn,
                (!text.trim() || isTyping) && styles.sendBtnDisabled,
              ]}
              disabled={!text.trim() || isTyping}
              activeOpacity={0.85}
            >
              {isTyping ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="send" size={18} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  keyboardWrap: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    gap: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextWrap: { flex: 1 },
  topBarTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 3,
  },
  subtitleText: { flex: 1, fontSize: 11, color: "#6B7280", lineHeight: 15 },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  offlineDot: { backgroundColor: "#EF4444" },
  checkingDot: { backgroundColor: "#F59E0B" },
  resetBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    alignItems: "center",
    justifyContent: "center",
  },
  resetBtnDisabled: { opacity: 0.7 },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 8,
    ...(Platform.OS === "web"
      ? {
          maxWidth: 720,
          width: "100%",
          alignSelf: "center",
        }
      : {}),
  },
  msgRowBot: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    gap: 8,
    marginBottom: 14,
  },
  msgRowUser: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 8,
    marginBottom: 14,
  },
  messageContent: { maxWidth: "82%" },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleBot: {
    backgroundColor: "#10B981",
    borderBottomLeftRadius: 5,
  },
  bubbleUser: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d1fae5",
    borderBottomRightRadius: 5,
  },
  errorBubble: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  bubbleTextBot: { color: "white" },
  bubbleTextUser: { color: "#111827" },
  errorText: { color: "#92400E" },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#10B981",
    borderRadius: 18,
    borderBottomLeftRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  typingText: { color: "white", fontSize: 13, fontWeight: "600" },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFBEB",
    borderBottomWidth: 1,
    borderBottomColor: "#FDE68A",
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  errorBannerText: { flex: 1, color: "#92400E", fontSize: 12 },
  bottomSection: {
    backgroundColor: "#f0fdf4",
    paddingTop: 8,
    ...(Platform.OS === "web"
      ? {
          maxWidth: 720,
          width: "100%",
          alignSelf: "center",
        }
      : {}),
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  chip: {
    maxWidth: 180,
    backgroundColor: "white",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#d1fae5",
  },
  chipText: { color: "#047857", fontSize: 11, fontWeight: "600" },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingBottom: 16,
    gap: 8,
  },
  inputWrap: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    backgroundColor: "white",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#d1fae5",
    paddingHorizontal: 15,
    paddingVertical: 9,
    justifyContent: "center",
  },
  textInput: {
    color: "#111827",
    fontSize: 14,
    lineHeight: 20,
    maxHeight: 90,
    padding: 0,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  sendBtnDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
    elevation: 0,
  },
});
