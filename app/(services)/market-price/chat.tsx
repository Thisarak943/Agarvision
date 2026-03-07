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
    resetChatConversation,
    sendChatMessage,
} from "../../../services/MarketintelligenceApi";

type Msg = {
  id: string;
  role: "bot" | "user";
  text: string;
  intent?: string;
  confidence?: number;
};

const TopBar = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <View style={styles.topBar}>
    <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
      <Ionicons name="arrow-back" size={22} color="#111827" />
    </TouchableOpacity>

    <View style={styles.topBarCenter}>
      <View style={styles.botAvatarSmall}>
        <Ionicons name="analytics" size={14} color="#10B981" />
      </View>
      <View>
        <Text style={styles.topBarTitle}>{title}</Text>
        <View style={styles.onlineRow}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>AI Assistant · Online</Text>
        </View>
      </View>
    </View>

    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
      <Ionicons name="close" size={18} color="white" />
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

function TypingIndicator() {
  return (
    <View style={styles.typingWrap}>
      <BotAvatar />
      <View style={styles.typingBubble}>
        <View style={styles.typingDots}>
          {[0.4, 0.7, 1].map((op, i) => (
            <View key={i} style={[styles.typingDot, { opacity: op }]} />
          ))}
        </View>
      </View>
    </View>
  );
}

// Quick prompts the user can tap to pre-fill the input
const QUICK_PROMPTS = [
  "Predict demand for Cobra in UAE next month",
  "Recommend price for Ravana",
  "What can you do?",
  "Tell me about the oil types",
];

export default function MarketPriceChat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Hello! I'm your Agarwood Market Assistant 🌿\nAsk me about demand forecasts, price recommendations, or market trends.",
    },
  ]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  // Reset backend conversation state when component mounts
  useEffect(() => {
    resetChatConversation();
  }, []);

  const send = async (overrideText?: string) => {
    const trimmed = (overrideText ?? text).trim();
    if (!trimmed) return;

    const userMsg: Msg = {
      id: String(Date.now()),
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setText("");
    setIsTyping(true);

    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);

    try {
      const res = await sendChatMessage(trimmed);

      const botMsg: Msg = {
        id: String(Date.now() + 1),
        role: "bot",
        text: res.response,
        intent: res.intent,
        confidence: res.confidence,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Msg = {
        id: String(Date.now() + 2),
        role: "bot",
        text: "Sorry, I couldn't reach the server. Please check your connection and try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleClose = async () => {
    await resetChatConversation();
    router.back();
  };

  const renderItem = ({ item }: { item: Msg }) => {
    const isUser = item.role === "user";
    return (
      <View
        style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowBot]}
      >
        {!isUser && <BotAvatar />}
        <View
          style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}
        >
          <Text
            style={[
              styles.bubbleText,
              isUser ? styles.bubbleTextUser : styles.bubbleTextBot,
            ]}
          >
            {item.text}
          </Text>
          {__DEV__ && !isUser && item.intent && item.intent !== "greeting" && (
            <View style={styles.intentBadge}>
              <Text style={styles.intentBadgeText}>
                {item.intent} · {Math.round((item.confidence ?? 0) * 100)}%
              </Text>
            </View>
          )}
        </View>
        {isUser && (
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={14} color="#10B981" />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar title="Market Intelligence.." onClose={handleClose} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        <View style={styles.bottomSection}>
          {/* Quick prompt chips */}
          <View style={styles.chipsRow}>
            {QUICK_PROMPTS.map((q) => (
              <TouchableOpacity
                key={q}
                style={styles.chip}
                onPress={() => send(q)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input row */}
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.micBtn}>
              <Ionicons name="mic" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.inputWrap}>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Ask a question..."
                placeholderTextColor="#9CA3AF"
                style={styles.textInput}
                multiline
                onSubmitEditing={() => send()}
                returnKeyType="send"
                blurOnSubmit
              />
            </View>

            <TouchableOpacity
              onPress={() => send()}
              style={[
                styles.sendBtn,
                (!text.trim() || isTyping) && styles.sendBtnDisabled,
              ]}
              activeOpacity={0.85}
              disabled={!text.trim() || isTyping}
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
  listContent: {
    padding: 16,
    paddingBottom: 8,
    ...(Platform.OS === "web"
      ? {
          maxWidth: 768,
          alignSelf: "center",
          width: "100%",
        }
      : {}),
  },
  bottomSection: {
    ...(Platform.OS === "web"
      ? {
          maxWidth: 768,
          alignSelf: "center",
          width: "100%",
        }
      : {}),
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  topBarCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 8,
  },
  botAvatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ecfdf5",
    borderWidth: 2,
    borderColor: "#a7f3d0",
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
  onlineRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  onlineText: { fontSize: 10, color: "#10B981", fontWeight: "500" },
  closeBtn: {
    backgroundColor: "#EF4444",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  msgRow: { flexDirection: "row", marginBottom: 12, gap: 8 },
  msgRowBot: { alignItems: "flex-end", justifyContent: "flex-start" },
  msgRowUser: { alignItems: "flex-end", justifyContent: "flex-end" },
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
    backgroundColor: "#ecfdf5",
    borderWidth: 1.5,
    borderColor: "#a7f3d0",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bubble: {
    maxWidth: "75%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleBot: { backgroundColor: "#10B981", borderBottomLeftRadius: 4 },
  bubbleUser: {
    backgroundColor: "white",
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: "#d1fae5",
  },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  bubbleTextBot: { color: "white" },
  bubbleTextUser: { color: "#111827" },
  intentBadge: {
    marginTop: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  intentBadgeText: {
    fontSize: 9,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
  },
  typingWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 12,
  },
  typingBubble: {
    backgroundColor: "#10B981",
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  typingDots: { flexDirection: "row", gap: 4, alignItems: "center" },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "white" },
  chipsRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#d1fae5",
  },
  chipText: { fontSize: 11, color: "#10B981", fontWeight: "500" },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingBottom: 16,
    paddingTop: 8,
    gap: 8,
    backgroundColor: "#f0fdf4",
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputWrap: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minHeight: 44,
    justifyContent: "center",
  },
  textInput: { fontSize: 14, color: "#111827", maxHeight: 100 },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendBtnDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
    elevation: 0,
  },
});
