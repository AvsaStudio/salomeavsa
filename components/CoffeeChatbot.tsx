/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useRef, useCallback, useEffect } from "react";
import { sendCoffeeChat, ChatMessage } from "../services/coffeeChat";
import * as orderApi from "../services/orderApi";
import { getMenu } from "../services/menuApi";

type Message = { from: "bot" | "user"; text: string; chips?: string[] };

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  dx: number;
}
interface OrderItem {
  clientId: string;
  name: string;
  size: string;
  price: number;
  addOns: string[];
  persistenceId?: number;
}

const MENU = [
  { name: "Espresso", emoji: "☕", base: 3.5, desc: "Rich & bold" },
  { name: "Americano", emoji: "☕", base: 4.0, desc: "Smooth & clean" },
  { name: "Cappuccino", emoji: "☕", base: 4.5, desc: "Frothy & classic" },
  { name: "Latte", emoji: "☕", base: 5.0, desc: "Creamy & smooth" },
  { name: "Flat White", emoji: "☕", base: 5.0, desc: "Velvety & strong" },
  { name: "Cortado", emoji: "☕", base: 4.5, desc: "Bold & balanced" },
  { name: "Mocha", emoji: "🍫", base: 5.5, desc: "Chocolatey delight" },
  { name: "Cold Brew", emoji: "🧊", base: 5.5, desc: "Smooth & cold" },
  { name: "Iced Latte", emoji: "🧊", base: 5.5, desc: "Cool & creamy" },
  { name: "Matcha Latte", emoji: "🌿", base: 5.5, desc: "Earthy & calm" },
];

const SIZE_MOD: Record<string, number> = {
  Small: -0.5,
  Medium: 0,
  Large: 0.75,
};

const ADD_ONS: Record<string, { label: string; price: number }> = {
  "Extra shot +$0.75": { label: "Extra shot", price: 0.75 },
  "Oat milk +$0.50": { label: "Oat milk", price: 0.5 },
  "Vanilla syrup +$0.50": { label: "Vanilla syrup", price: 0.5 },
};

const EMOJI_SET = [
  "😊",
  "😄",
  "🥳",
  "😎",
  "☕",
  "🤩",
  "😂",
  "💙",
  "✨",
  "🫶",
  "🔥",
  "😴",
];

const RESTART_GREETINGS = [
  "Hey! How are your coffee levels today? I just fired up the espresso machine ☕",
  "Good news — the espresso machine is warmed up and ready! What are we brewing today? ☕",
  "Welcome back! Coffee emergency? I've got you. What can I make for you? ✨",
  "Hi there! ☕ The beans are fresh and I'm ready to make your perfect cup — what'll it be?",
];

const makeInitial = (): Message => ({
  from: "bot",
  text: "Hi! Welcome to Brewed Beans Café ☕ What can I get started for you today?",
  chips: ["☕ See Menu", "💬 Brewing Tips", "I need a pick-me-up"],
});

/* ── SVGs ── */
const BrewBot = () => (
  <svg
    width="56"
    height="58"
    viewBox="0 0 56 58"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 9 Q18 5 20 2 Q22 5 20 9"
      stroke="#222"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M28 7 Q26 3 28 0 Q30 3 28 7"
      stroke="#222"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M36 9 Q34 5 36 2 Q38 5 36 9"
      stroke="#222"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M11 15 L15 47 Q15 49 17 49 L39 49 Q41 49 41 47 L45 15 Z"
      fill="white"
      stroke="#222"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M41 24 Q50 24 50 32 Q50 40 41 40"
      stroke="#222"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <ellipse
      cx="28"
      cy="50"
      rx="19"
      ry="3.5"
      fill="white"
      stroke="#222"
      strokeWidth="1.5"
    />
    <circle cx="22" cy="30" r="2.2" fill="#222" />
    <circle cx="34" cy="30" r="2.2" fill="#222" />
    <circle cx="22.9" cy="29.1" r="0.8" fill="white" />
    <circle cx="34.9" cy="29.1" r="0.8" fill="white" />
    <path
      d="M21 37 Q28 42 35 37"
      stroke="#222"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M23 22 Q24.5 19 28 22 Q31.5 19 33 22 Q31.5 25 28 27 Q24.5 25 23 22Z"
      fill="#e0e0e0"
      stroke="#222"
      strokeWidth="0.8"
    />
  </svg>
);

const BeanBuddy = () => (
  <svg
    width="46"
    height="58"
    viewBox="0 0 46 58"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse
      cx="23"
      cy="30"
      rx="17"
      ry="22"
      fill="white"
      stroke="#222"
      strokeWidth="2"
    />
    <path
      d="M23 8 Q14 18 14 30 Q14 42 23 52"
      stroke="#222"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="18" cy="25" r="2.2" fill="#222" />
    <circle cx="28" cy="25" r="2.2" fill="#222" />
    <circle cx="18.8" cy="24.2" r="0.8" fill="white" />
    <circle cx="28.8" cy="24.2" r="0.8" fill="white" />
    <path
      d="M17 33 Q23 38 29 33"
      stroke="#222"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M38 22 Q44 17 45 13"
      stroke="#222"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle
      cx="45"
      cy="12"
      r="2.8"
      fill="white"
      stroke="#222"
      strokeWidth="1.6"
    />
    <path
      d="M43 10 L47 14 M47 10 L43 14"
      stroke="#222"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const Knob = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle
      cx="14"
      cy="14"
      r="12"
      fill="#d4d4d4"
      stroke="#555"
      strokeWidth="1.5"
    />
    <circle cx="14" cy="14" r="8" fill="#bbb" stroke="#555" strokeWidth="1" />
    <circle cx="14" cy="14" r="3" fill="#888" stroke="#555" strokeWidth="1" />
    <line
      x1="14"
      y1="6"
      x2="14"
      y2="11"
      stroke="#333"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
      <line
        key={i}
        x1={14 + 10.5 * Math.sin((a * Math.PI) / 180)}
        y1={14 - 10.5 * Math.cos((a * Math.PI) / 180)}
        x2={14 + 12 * Math.sin((a * Math.PI) / 180)}
        y2={14 - 12 * Math.cos((a * Math.PI) / 180)}
        stroke="#666"
        strokeWidth="1"
        strokeLinecap="round"
      />
    ))}
  </svg>
);

const Gauge = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <circle
      cx="19"
      cy="19"
      r="17"
      fill="#d8d8d8"
      stroke="#555"
      strokeWidth="1.5"
    />
    <circle cx="19" cy="19" r="13" fill="#eee" stroke="#888" strokeWidth="1" />
    {[150, 170, 190, 210, 230].map((a, i) => (
      <line
        key={i}
        x1={19 + 11 * Math.cos((a * Math.PI) / 180)}
        y1={19 + 11 * Math.sin((a * Math.PI) / 180)}
        x2={19 + 13 * Math.cos((a * Math.PI) / 180)}
        y2={19 + 13 * Math.sin((a * Math.PI) / 180)}
        stroke="#666"
        strokeWidth="1"
        strokeLinecap="round"
      />
    ))}
    <text
      x="19"
      y="28"
      textAnchor="middle"
      fontSize="5"
      fill="#555"
      fontFamily="monospace"
    >
      °F
    </text>
    <line
      x1="19"
      y1="19"
      x2={19 + 9 * Math.cos((205 * Math.PI) / 180)}
      y2={19 + 9 * Math.sin((205 * Math.PI) / 180)}
      stroke="#222"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="19" cy="19" r="1.8" fill="#555" />
  </svg>
);

const SendIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export const CoffeeChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([makeInitial()]);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const [showCoffeeMenu, setShowCoffeeMenu] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [emojiIdx, setEmojiIdx] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingItem, setPendingItem] = useState<(typeof MENU)[0] | null>(null);
  const [menuItems, setMenuItems] = useState(MENU);
  const [persistentOrderId, setPersistentOrderId] = useState<string | null>(
    null
  );
  const [persistenceStatus, setPersistenceStatus] = useState<
    "local" | "saving" | "saved"
  >("local");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const heartBtnRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const persistentOrderCredentialsRef = useRef<orderApi.OrderCredentials | null>(
    null
  );
  const orderCreationPromiseRef = useRef<
    Promise<orderApi.OrderCredentials> | undefined
  >(undefined);
  const pendingItemSavesRef = useRef(
    new Map<string, Promise<number | undefined>>()
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    getMenu()
      .then((menu) => {
        setMenuItems(
          menu.items.map((databaseItem) => {
            const fallback = MENU.find(
              (item) => item.name === databaseItem.name
            );
            return {
              name: databaseItem.name,
              base: databaseItem.basePrice,
              emoji: fallback?.emoji ?? "☕",
              desc: fallback?.desc ?? "Freshly prepared",
            };
          })
        );
      })
      .catch(() => setMenuItems(MENU));
  }, []);

  useEffect(() => {
    const storedCredentials = localStorage.getItem("brewedBeansOrder");
    if (!storedCredentials) return;

    let credentials: orderApi.OrderCredentials;
    try {
      credentials = JSON.parse(storedCredentials) as orderApi.OrderCredentials;
      if (!credentials.id || !credentials.accessToken) throw new Error();
    } catch {
      localStorage.removeItem("brewedBeansOrder");
      return;
    }

    setPersistenceStatus("saving");
    orderApi
      .getOrder(credentials)
      .then((savedOrder) => {
        if (savedOrder.status !== "pending") {
          localStorage.removeItem("brewedBeansOrder");
          return;
        }

        persistentOrderCredentialsRef.current = credentials;
        setPersistentOrderId(savedOrder.id);
        setOrder(
          savedOrder.items.map((item) => ({
            clientId: crypto.randomUUID(),
            name: item.productName,
            size: item.size,
            price:
              (item.unitPrice +
                item.addOns.reduce((sum, addOn) => sum + addOn.price, 0)) *
              item.quantity,
            addOns: item.addOns.map((addOn) => addOn.name),
            persistenceId: item.id,
          }))
        );
        setPersistenceStatus("saved");
      })
      .catch((error: unknown) => {
        if (
          error instanceof orderApi.OrderApiError &&
          [401, 404].includes(error.status)
        ) {
          localStorage.removeItem("brewedBeansOrder");
        }
        setPersistenceStatus("local");
      });
  }, []);

  const ensurePersistentOrder = async () => {
    if (persistentOrderCredentialsRef.current) {
      return persistentOrderCredentialsRef.current;
    }
    if (orderCreationPromiseRef.current) return orderCreationPromiseRef.current;

    setPersistenceStatus("saving");
    const creation = orderApi.createOrder().then((savedOrder) => {
      if (!savedOrder.accessToken) throw new Error("Order token was not returned");
      const credentials = {
        id: savedOrder.id,
        accessToken: savedOrder.accessToken,
      };
      persistentOrderCredentialsRef.current = credentials;
      setPersistentOrderId(savedOrder.id);
      localStorage.setItem("brewedBeansOrder", JSON.stringify(credentials));
      return credentials;
    });
    orderCreationPromiseRef.current = creation;

    try {
      return await creation;
    } finally {
      orderCreationPromiseRef.current = undefined;
    }
  };

  const persistNewItem = (item: OrderItem) => {
    const task = (async () => {
      try {
        const credentials = await ensurePersistentOrder();
        const savedOrder = await orderApi.addOrderItem(credentials, {
          productName: item.name,
          size: item.size as "Small" | "Medium" | "Large",
        });
        const savedItem = savedOrder.items.at(-1);
        if (savedItem) {
          setOrder((currentOrder) =>
            currentOrder.map((currentItem) =>
              currentItem.clientId === item.clientId
                ? { ...currentItem, persistenceId: savedItem.id }
                : currentItem
            )
          );
        }
        setPersistenceStatus("saved");
        return savedItem?.id;
      } catch {
        setPersistenceStatus("local");
        return undefined;
      }
    })();

    pendingItemSavesRef.current.set(item.clientId, task);
    void task.finally(() => pendingItemSavesRef.current.delete(item.clientId));
    return task;
  };

  const persistUpdatedItem = async (item: OrderItem) => {
    const persistenceId =
      item.persistenceId ??
      (await pendingItemSavesRef.current.get(item.clientId));
    const credentials = persistentOrderCredentialsRef.current;
    if (!credentials || !persistenceId) return;

    setPersistenceStatus("saving");
    try {
      await orderApi.updateOrderItem(credentials, persistenceId, {
        productName: item.name,
        size: item.size as "Small" | "Medium" | "Large",
        addOns: item.addOns,
      });
      setPersistenceStatus("saved");
    } catch {
      setPersistenceStatus("local");
    }
  };

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;
      setShowCoffeeMenu(false);
      setShowEmojiPicker(false);

      const userMsg: Message = { from: "user", text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        const botText = await sendCoffeeChat(text, history);
        const lower = botText.toLowerCase();

        const chips =
          lower.includes("size") ||
          lower.includes("small") ||
          lower.includes("large")
            ? ["Small", "Medium", "Large"]
            : lower.includes("pickup") ||
              lower.includes("pick up") ||
              lower.includes("when")
            ? ["Now", "10 mins", "20 mins"]
            : lower.includes("add-on") ||
              lower.includes("extra") ||
              lower.includes("customize")
            ? [
                "Extra shot +$0.75",
                "Oat milk +$0.50",
                "Vanilla syrup +$0.50",
                "No thanks",
              ]
            : lower.includes("pay") ||
              lower.includes("checkout") ||
              lower.includes("total")
            ? ["💳 Pay Now", "Keep ordering"]
            : undefined;

        // Detect payment trigger
        if (
          order.length > 0 &&
          (lower.includes("ready to pay") ||
            lower.includes("proceed to pay"))
        ) {
          setTimeout(() => setShowPayment(true), 800);
        }

        const botMsg: Message = { from: "bot", text: botText, chips };
        setMessages((prev) => [...prev, botMsg]);
        setHistory((prev) => [
          ...prev,
          { role: "user", content: text },
          { role: "assistant", content: botText },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: "Oops! Our espresso machine had a hiccup. Try again in a moment ☕",
          },
        ]);
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [history, isLoading, order.length]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // ── Heart button ──
  const spawnHearts = () => {
    if (!heartBtnRef.current || !sectionRef.current) return;
    const btnRect = heartBtnRef.current.getBoundingClientRect();
    const heartEmojis = ["❤️", "🧡", "💛", "💚", "💙", "💜", "🤍", "🩷"];
    const newHearts: HeartParticle[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: btnRect.left + btnRect.width / 2 + (Math.random() - 0.5) * 60,
      y: btnRect.top,
      emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
      dx: (Math.random() - 0.5) * 40,
    }));
    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(
      () =>
        setHearts((prev) =>
          prev.filter((h) => !newHearts.find((nh) => nh.id === h.id))
        ),
      1400
    );
  };

  // ── Coffee menu select ──
  const selectCoffeeItem = (item: (typeof MENU)[0]) => {
    setPendingItem(item);
  };

  const confirmSize = (size: string) => {
    if (!pendingItem) return;
    const price = pendingItem.base + SIZE_MOD[size];
    const newItem: OrderItem = {
      clientId: crypto.randomUUID(),
      name: pendingItem.name,
      size,
      price,
      addOns: [],
    };
    setOrder((prev) => [...prev, newItem]);
    void persistNewItem(newItem);
    const msg = `I'd like a ${size} ${pendingItem.name} please`;
    setPendingItem(null);
    setShowCoffeeMenu(false);
    sendMessage(msg);
  };

  const handleChipClick = (chip: string) => {
    if (chip === "☕ See Menu") {
      setShowCoffeeMenu(true);
      setPendingItem(null);
      return;
    }

    if (chip === "💳 Pay Now") {
      if (order.length > 0) setShowPayment(true);
      else setShowCoffeeMenu(true);
      return;
    }

    const addOn = ADD_ONS[chip];
    if (addOn && order.length > 0) {
      const latestItem = order[order.length - 1];
      if (!latestItem.addOns.includes(addOn.label)) {
        const updatedItem = {
          ...latestItem,
          price: latestItem.price + addOn.price,
          addOns: [...latestItem.addOns, addOn.label],
        };
        setOrder((currentOrder) =>
          currentOrder.map((item, index) =>
            index === currentOrder.length - 1 ? updatedItem : item
          )
        );

        void persistUpdatedItem(updatedItem);
      }
    }

    sendMessage(chip);
  };

  // ── Emoji picker ──
  const pickEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  // ── Power / Restart ──
  const restart = () => {
    const credentials = persistentOrderCredentialsRef.current;
    if (credentials && !paymentDone) {
      void orderApi
        .updateOrderStatus(credentials, "cancelled")
        .catch(() => undefined);
    }
    persistentOrderCredentialsRef.current = null;
    setPersistentOrderId(null);
    localStorage.removeItem("brewedBeansOrder");
    setPersistenceStatus("local");
    setPaymentError(null);
    const greeting =
      RESTART_GREETINGS[Math.floor(Math.random() * RESTART_GREETINGS.length)];
    setMessages([
      {
        from: "bot",
        text: greeting,
        chips: ["☕ See Menu", "Surprise me!", "I need caffeine"],
      },
    ]);
    setHistory([]);
    setOrder([]);
    setShowCoffeeMenu(false);
    setShowPayment(false);
    setPaymentDone(false);
    setShowEmojiPicker(false);
    setPendingItem(null);
  };

  const completePayment = async () => {
    setPaymentError(null);
    const credentials = persistentOrderCredentialsRef.current;
    if (!credentials) {
      setPaymentError("Save the order to PostgreSQL before completing payment.");
      return;
    }

    setPersistenceStatus("saving");
    try {
      await Promise.all(pendingItemSavesRef.current.values());
      await orderApi.updateOrderStatus(credentials, "paid");
      localStorage.removeItem("brewedBeansOrder");
      setPersistenceStatus("saved");
      setPaymentDone(true);
    } catch (error) {
      setPersistenceStatus("local");
      setPaymentError(
        error instanceof Error ? error.message : "Payment could not be saved."
      );
    }
  };

  const removeItem = async (item: OrderItem) => {
    setPaymentError(null);
    const persistenceId =
      item.persistenceId ??
      (await pendingItemSavesRef.current.get(item.clientId));
    const credentials = persistentOrderCredentialsRef.current;

    if (credentials && persistenceId) {
      setPersistenceStatus("saving");
      try {
        await orderApi.removeOrderItem(credentials, persistenceId);
        setPersistenceStatus("saved");
      } catch (error) {
        setPersistenceStatus("local");
        setPaymentError(
          error instanceof Error ? error.message : "Item could not be removed."
        );
        return;
      }
    }

    setOrder((currentOrder) =>
      currentOrder.filter((currentItem) => currentItem.clientId !== item.clientId)
    );
  };

  const deleteCurrentOrder = async () => {
    const credentials = persistentOrderCredentialsRef.current;
    if (credentials) {
      setPersistenceStatus("saving");
      try {
        await orderApi.deleteOrder(credentials);
      } catch (error) {
        setPersistenceStatus("local");
        setPaymentError(
          error instanceof Error ? error.message : "Order could not be cancelled."
        );
        return;
      }
    }

    persistentOrderCredentialsRef.current = null;
    localStorage.removeItem("brewedBeansOrder");
    restart();
  };

  const orderTotal = order.reduce((s, i) => s + i.price, 0);
  const lastBotIdx = messages.reduce(
    (acc, m, i) => (m.from === "bot" ? i : acc),
    -1
  );

  return (
    <section ref={sectionRef} className="py-14 px-4 max-w-7xl mx-auto relative">
      {/* Floating hearts — fixed to viewport */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="fixed pointer-events-none z-[9999] text-xl heart-float"
          style={{ left: h.x, top: h.y, transform: `translateX(${h.dx}px)` }}
        >
          {h.emoji}
        </div>
      ))}

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xl">☕</span>
        <h2 className="text-2xl font-bold text-white tracking-tighter font-gemola">
          Coffee Chatbot
        </h2>
        <span className="text-zinc-600 text-sm font-mono hidden sm:block">
          — Node.js · OpenAI API
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* ── Espresso Machine ── */}
        <div className="shrink-0 mx-auto lg:mx-0" style={{ width: 330 }}>
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg,#e0e0e0 0%,#c8c8c8 40%,#d4d4d4 100%)",
              border: "2.5px solid #555",
              boxShadow:
                "4px 6px 24px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.6)",
            }}
          >
            {/* Top control panel */}
            <div
              className="px-4 pt-3 pb-2"
              style={{
                background: "linear-gradient(to bottom,#aaa,#999)",
                borderBottom: "2px solid #666",
              }}
            >
              <div
                className="h-1 rounded-full mb-3"
                style={{
                  background: "linear-gradient(to right,#777,#bbb,#777)",
                }}
              />
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[9px] font-bold text-zinc-700 tracking-widest uppercase">
                    STEAM
                  </span>
                  <Knob />
                  <div className="flex items-center gap-1 mt-0.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-green-500"
                      style={{ boxShadow: "0 0 4px #22c55e" }}
                    />
                    <span className="text-[8px] text-zinc-600 font-mono">
                      Ready
                    </span>
                  </div>
                </div>
                <div className="flex-1 mx-3">
                  <div
                    className="rounded-md px-2 py-1.5 text-center"
                    style={{
                      background: "#1a1a1a",
                      border: "1.5px solid #444",
                      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    <div className="text-[11px] font-bold tracking-[0.18em] text-white font-mono">
                      CAPPUCCINO
                    </div>
                    <div className="flex justify-center gap-1.5 mt-1">
                      <div className="w-2 h-2 rounded-full bg-amber-400 opacity-90" />
                      <div className="w-2 h-2 rounded-full bg-amber-400 opacity-40" />
                      <div className="w-2 h-2 rounded-full bg-zinc-600" />
                    </div>
                    <div className="text-[8px] text-zinc-500 font-mono mt-0.5 tracking-wider">
                      {isLoading ? "BREWING..." : "READY"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Gauge />
                </div>
              </div>
            </div>

            {/* Screen / Chat area */}
            <div
              className="mx-3 my-2 rounded-lg overflow-hidden flex flex-col relative"
              style={{
                background: "white",
                border: "2px solid #888",
                height: 420,
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              {/* Banner */}
              <div
                className="px-3 pt-2 pb-1 border-b border-zinc-200 shrink-0"
                style={{ background: "#fafafa" }}
              >
                <div className="text-center text-[11px] font-bold text-zinc-800 tracking-wide">
                  Brewed Beans Café — AI Barista ☕
                </div>
              </div>

              {/* Mascots */}
              <div
                className="relative flex items-end justify-center gap-4 py-2 border-b border-zinc-100 overflow-hidden shrink-0"
                style={{ background: "#f8f7f5" }}
              >
                {["✦", "♥", "✧", "✦", "♥", "✧", "✦"].map((s, i) => (
                  <span
                    key={i}
                    className="absolute text-[9px] select-none"
                    style={{
                      top: i % 2 === 0 ? 3 : 8,
                      left: i < 4 ? 14 + i * 28 : undefined,
                      right: i >= 4 ? 14 + (i - 4) * 28 : undefined,
                      opacity: 0.4,
                    }}
                  >
                    {s}
                  </span>
                ))}
                <BrewBot />
                <div className="mb-6 px-2 py-1 bg-white border border-zinc-300 rounded-xl text-[9px] text-zinc-600 font-mono shadow-sm relative leading-tight">
                  hi! ☕✨
                  <div
                    className="absolute -left-[7px] top-2 w-0 h-0"
                    style={{
                      borderTop: "4px solid transparent",
                      borderBottom: "4px solid transparent",
                      borderRight: "7px solid #d4d4d8",
                    }}
                  />
                  <div
                    className="absolute -left-[5px] top-2 w-0 h-0"
                    style={{
                      borderTop: "4px solid transparent",
                      borderBottom: "4px solid transparent",
                      borderRight: "7px solid white",
                    }}
                  />
                </div>
                <BeanBuddy />
              </div>

              {/* Chat messages */}
              <div
                className="flex-1 overflow-y-auto flex flex-col px-3 py-2 gap-1.5 relative"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#d1d5db transparent",
                }}
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col gap-1 ${
                      msg.from === "user" ? "items-end" : "items-start"
                    } machine-in`}
                  >
                    <div
                      className={`px-2.5 py-1.5 text-[10.5px] leading-relaxed max-w-[84%] ${
                        msg.from === "bot"
                          ? "bg-white text-zinc-800 border border-zinc-300 shadow-sm"
                          : "bg-zinc-800 text-white"
                      }`}
                      style={{
                        borderRadius:
                          msg.from === "bot"
                            ? "12px 12px 12px 2px"
                            : "12px 12px 2px 12px",
                      }}
                    >
                      {msg.text}
                    </div>
                    {msg.from === "bot" &&
                      i === lastBotIdx &&
                      msg.chips &&
                      !isLoading && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {msg.chips.map((chip) => (
                            <button
                              key={chip}
                              onClick={() => handleChipClick(chip)}
                              disabled={isLoading}
                              className="px-2 py-0.5 text-[9.5px] text-zinc-600 bg-white border border-zinc-300 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-colors cursor-pointer"
                              style={{ borderRadius: 20 }}
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-1 machine-in">
                    <div
                      className="bg-white border border-zinc-300 px-3 py-2 shadow-sm flex gap-1"
                      style={{ borderRadius: "12px 12px 12px 2px" }}
                    >
                      {[0, 150, 300].map((d) => (
                        <span
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* ── Coffee Menu Overlay ── */}
              {showCoffeeMenu && (
                <div
                  className="absolute inset-0 bg-white z-20 flex flex-col"
                  style={{ top: 0 }}
                >
                  <div
                    className="flex items-center justify-between px-3 py-2 border-b border-zinc-200 shrink-0"
                    style={{ background: "#fafafa" }}
                  >
                    <span className="text-[11px] font-bold text-zinc-800 tracking-wide">
                      ☕ Brewed Beans Menu
                    </span>
                    <button
                      onClick={() => {
                        setShowCoffeeMenu(false);
                        setPendingItem(null);
                      }}
                      className="text-zinc-400 hover:text-zinc-700 text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>

                  {!pendingItem ? (
                    <div
                      className="flex-1 overflow-y-auto py-1"
                      style={{ scrollbarWidth: "thin" }}
                    >
                      {menuItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => selectCoffeeItem(item)}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-amber-50 transition-colors border-b border-zinc-100 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{item.emoji}</span>
                            <div>
                              <div className="text-[11px] font-bold text-zinc-800">
                                {item.name}
                              </div>
                              <div className="text-[9px] text-zinc-400">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-amber-700">
                            from ${(item.base + SIZE_MOD.Small).toFixed(2)}
                          </span>
                        </button>
                      ))}
                      <div className="px-3 py-1.5 text-[8px] text-zinc-400 font-mono text-center">
                        Add-ons available after size selection
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
                      <div className="text-3xl">{pendingItem.emoji}</div>
                      <div className="text-[12px] font-bold text-zinc-800">
                        {pendingItem.name}
                      </div>
                      <div className="text-[9px] text-zinc-400 mb-1">
                        Choose your size:
                      </div>
                      {(["Small", "Medium", "Large"] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => confirmSize(size)}
                          className="w-full py-2 border border-zinc-300 rounded-xl text-[11px] font-medium text-zinc-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 transition-colors flex justify-between px-4"
                        >
                          <span>{size}</span>
                          <span className="font-mono text-amber-700">
                            ${(pendingItem.base + SIZE_MOD[size]).toFixed(2)}
                          </span>
                        </button>
                      ))}
                      <button
                        onClick={() => setPendingItem(null)}
                        className="text-[9px] text-zinc-400 hover:text-zinc-600 mt-1"
                      >
                        ← Back to menu
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── Payment Overlay ── */}
              {showPayment && (
                <div className="absolute inset-0 bg-white z-30 flex flex-col">
                  {!paymentDone ? (
                    <>
                      <div
                        className="px-3 py-2 border-b border-zinc-200 shrink-0"
                        style={{ background: "#fafafa" }}
                      >
                        <div className="text-center text-[11px] font-bold text-zinc-800 tracking-wide">
                          💳 Checkout
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto px-3 py-2">
                        {order.length > 0 ? (
                          <>
                            <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
                              Your Order
                            </div>
                            {order.map((item) => (
                              <div
                                key={item.clientId}
                                className="flex justify-between text-[10.5px] text-zinc-700 py-1 border-b border-zinc-100"
                              >
                                <span>
                                  {item.size} {item.name}
                                  {item.addOns.length > 0 && (
                                    <span className="block text-[8px] text-zinc-400">
                                      + {item.addOns.join(", ")}
                                    </span>
                                  )}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <span className="font-mono text-amber-700">
                                    ${item.price.toFixed(2)}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => void removeItem(item)}
                                    aria-label={`Remove ${item.size} ${item.name}`}
                                    title="Remove item"
                                    className="text-zinc-400 hover:text-red-600"
                                  >
                                    ×
                                  </button>
                                </span>
                              </div>
                            ))}
                            <div className="flex justify-between text-[11px] font-bold text-zinc-900 pt-2 mt-1">
                              <span>Total</span>
                              <span className="font-mono">
                                ${orderTotal.toFixed(2)}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center text-[10px] text-zinc-400 py-4">
                            Your order is being tracked in the chat.
                            <br />
                            Use the menu button to add items.
                          </div>
                        )}
                        <div className="text-[8px] text-zinc-400 text-center mt-2 font-mono">
                          Tax included · Pickup in 3–5 min
                        </div>
                        {paymentError && (
                          <div className="mt-2 text-center text-[9px] text-red-600">
                            {paymentError}
                          </div>
                        )}
                      </div>
                      <div className="px-3 pb-3 flex flex-col gap-2 shrink-0">
                        <button
                          onClick={completePayment}
                          disabled={
                            order.length === 0 || persistenceStatus === "saving"
                          }
                          className="w-full py-2 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-2"
                          style={{
                            background: order.length > 0 ? "#000" : "#a8a29e",
                          }}
                        >
                          <span>🍎</span> Apple Pay
                        </button>
                        <button
                          onClick={completePayment}
                          disabled={
                            order.length === 0 || persistenceStatus === "saving"
                          }
                          className="w-full py-2 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-2"
                          style={{
                            background:
                              order.length > 0
                                ? "linear-gradient(135deg,#1a56db,#3b82f6)"
                                : "#a8a29e",
                          }}
                        >
                          <span>💳</span> Credit Card
                        </button>
                        <button
                          onClick={() => setShowPayment(false)}
                          className="text-[9px] text-zinc-400 hover:text-zinc-600 text-center mt-1"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteCurrentOrder()}
                          disabled={persistenceStatus === "saving"}
                          className="text-[9px] text-red-500 hover:text-red-700 text-center"
                        >
                          Cancel and delete order
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4 text-center">
                      <div className="text-4xl animate-bounce">☕</div>
                      <div className="text-[13px] font-bold text-zinc-800">
                        Payment confirmed!
                      </div>
                      <div className="text-[10px] text-zinc-500 leading-relaxed">
                        Thank you! Your order is being prepared.
                        <br />
                        Ready in approximately 3–5 minutes ✨
                      </div>
                      <button
                        onClick={() => {
                          setShowPayment(false);
                          setPaymentDone(false);
                          setOrder([]);
                          restart();
                        }}
                        className="mt-2 px-4 py-1.5 bg-amber-600 text-white text-[10px] font-bold rounded-full hover:bg-amber-700 transition-colors"
                      >
                        Start New Order
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── Emoji Picker ── */}
              {showEmojiPicker && (
                <div className="absolute bottom-10 left-2 right-2 z-20 bg-white border border-zinc-200 rounded-xl shadow-lg p-2">
                  <div className="grid grid-cols-6 gap-1">
                    {EMOJI_SET.map((em) => (
                      <button
                        key={em}
                        onClick={() => pickEmoji(em)}
                        className="text-base hover:bg-amber-50 rounded-lg p-1 transition-colors"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input row */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-1.5 px-2 py-1.5 border-t border-zinc-200 shrink-0"
                style={{ background: "#f5f4f2" }}
              >
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker((p) => !p)}
                  className="text-base select-none hover:scale-110 transition-transform"
                  title="Choose emoji"
                >
                  {EMOJI_SET[emojiIdx]}
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message BrewBot..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-[10px] text-zinc-700 placeholder-zinc-400 font-mono outline-none disabled:opacity-50"
                />
                {order.length > 0 && !showPayment && (
                  <button
                    type="button"
                    onClick={() => setShowPayment(true)}
                    className="text-[8px] font-mono bg-amber-600 text-white px-1.5 py-0.5 rounded-full hover:bg-amber-700 transition-colors whitespace-nowrap"
                  >
                    Pay ${orderTotal.toFixed(2)}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex items-center justify-center w-6 h-6 rounded-full text-white transition-colors disabled:opacity-40"
                  style={{
                    background:
                      input.trim() && !isLoading ? "#92400e" : "#a8a29e",
                  }}
                  aria-label="Send"
                >
                  <SendIcon />
                </button>
              </form>
            </div>

            {/* Bottom control buttons */}
            <div
              className="flex items-center justify-between px-5 py-2"
              style={{
                background: "linear-gradient(to bottom,#b0b0b0,#a0a0a0)",
                borderTop: "1.5px solid #777",
              }}
            >
              {/* ♥ Heart */}
              <button
                ref={heartBtnRef}
                onClick={spawnHearts}
                title="Spread the love"
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer active:scale-95 transition-transform hover:brightness-110"
                style={{
                  background: "linear-gradient(145deg,#c8c8c8,#aaa)",
                  border: "1.5px solid #777",
                  boxShadow:
                    "0 2px 4px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                <span style={{ fontSize: 13 }}>♥</span>
              </button>

              {/* ☕ Coffee Menu */}
              <button
                onClick={() => {
                  setShowCoffeeMenu((p) => !p);
                  setPendingItem(null);
                }}
                title="See coffee menu"
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer active:scale-95 transition-transform hover:brightness-110"
                style={{
                  background: showCoffeeMenu
                    ? "linear-gradient(145deg,#f5c842,#e0a800)"
                    : "linear-gradient(145deg,#c8c8c8,#aaa)",
                  border: "1.5px solid #777",
                  boxShadow:
                    "0 2px 4px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                <span style={{ fontSize: 13 }}>☕</span>
              </button>

              {/* 🙂 Emoji Cycle */}
              <button
                onClick={() => setEmojiIdx((p) => (p + 1) % EMOJI_SET.length)}
                title="Change emoji"
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer active:scale-95 transition-transform hover:brightness-110"
                style={{
                  background: "linear-gradient(145deg,#c8c8c8,#aaa)",
                  border: "1.5px solid #777",
                  boxShadow:
                    "0 2px 4px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                <span style={{ fontSize: 13 }}>{EMOJI_SET[emojiIdx]}</span>
              </button>

              {/* ⏻ Restart */}
              <button
                onClick={restart}
                disabled={persistenceStatus === "saving"}
                title="Restart conversation"
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer active:scale-95 transition-transform hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(145deg,#c8c8c8,#aaa)",
                  border: "1.5px solid #777",
                  boxShadow:
                    "0 2px 4px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                <span style={{ fontSize: 13 }}>⏻</span>
              </button>
            </div>

            {/* Logo row */}
            <div className="flex items-end justify-between px-3 mb-1">
              <div className="flex flex-col items-center gap-0.5">
                <svg width="30" height="28" viewBox="0 0 30 28" fill="none">
                  <path
                    d="M8 4 Q7 2 8 0 Q9 2 8 4"
                    stroke="#555"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M15 3 Q14 1 15 0 Q16 1 15 3"
                    stroke="#555"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M22 4 Q21 2 22 0 Q23 2 22 4"
                    stroke="#555"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M3 7 L5 23 Q5 24 6 24 L24 24 Q25 24 25 23 L27 7 Z"
                    fill="white"
                    stroke="#555"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M25 12 Q29 12 29 16 Q29 20 25 20"
                    stroke="#555"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <ellipse
                    cx="15"
                    cy="25"
                    rx="11"
                    ry="2"
                    fill="white"
                    stroke="#555"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M11 14 Q12 12 15 14 Q18 12 19 14 Q18 16 15 17.5 Q12 16 11 14Z"
                    fill="#ddd"
                    stroke="#555"
                    strokeWidth="0.7"
                  />
                </svg>
                <span className="text-[7px] text-zinc-500 font-mono tracking-wider">
                  AVSA
                </span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
                  <ellipse
                    cx="11"
                    cy="13"
                    rx="8"
                    ry="10"
                    fill="white"
                    stroke="#555"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M11 3 Q7 8 7 13 Q7 18 11 23"
                    stroke="#555"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="8.5" cy="11" r="1" fill="#555" />
                  <circle cx="13.5" cy="11" r="1" fill="#555" />
                  <path
                    d="M8 15 Q11 17.5 14 15"
                    stroke="#555"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="text-[7px] text-zinc-500 font-mono tracking-wider">
                  BEAN
                </span>
              </div>
            </div>

            {/* Drip tray */}
            <div
              className="mx-3 mb-3 rounded-b-lg overflow-hidden"
              style={{
                background: "#bbb",
                border: "1.5px solid #777",
                borderTop: "none",
              }}
            >
              <div className="h-6 flex items-center justify-center relative overflow-hidden">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 w-px"
                    style={{ left: `${(i + 1) * 5.5}%`, background: "#999" }}
                  />
                ))}
                <div className="absolute inset-0 flex flex-col justify-around">
                  <div className="w-full h-px" style={{ background: "#999" }} />
                  <div className="w-full h-px" style={{ background: "#999" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Machine feet */}
          <div className="flex justify-between px-6 mt-1">
            <div
              className="w-8 h-2 rounded-b-full"
              style={{ background: "#888", border: "1px solid #666" }}
            />
            <div
              className="w-8 h-2 rounded-b-full"
              style={{ background: "#888", border: "1px solid #666" }}
            />
          </div>
        </div>

        {/* ── Description ── */}
        <div className="flex flex-col items-center text-center gap-6 max-w-md mx-auto">
          <div className="flex flex-col items-center gap-2">
            <div
              className="text-6xl select-none"
              style={{ filter: "drop-shadow(0 4px 16px rgba(180,120,60,0.3))" }}
            >
              ☕
            </div>
            <div className="flex flex-col gap-1 items-center">
              <div className="flex gap-2 items-center">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isLoading ? "bg-amber-500 animate-pulse" : "bg-green-500"
                  }`}
                />
                <span
                  className={`text-xs font-mono uppercase tracking-widest ${
                    isLoading ? "text-amber-500/80" : "text-green-500/80"
                  }`}
                >
                  {isLoading ? "Brewing a response..." : "BrewBot is ready"}
                </span>
              </div>
              <div className="text-zinc-600 text-xs font-mono">
                python coffeebot.py --mood tired
              </div>
              <div className="text-zinc-600 text-[10px] font-mono">
                {persistenceStatus === "saved"
                  ? `PostgreSQL order #${
                      persistentOrderId?.slice(0, 8) ?? "complete"
                    } saved`
                  : persistenceStatus === "saving"
                  ? "Saving order to PostgreSQL..."
                  : "Local order mode · configure DATABASE_URL for persistence"}
              </div>
            </div>
          </div>

          <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-left">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">
              Machine Controls
            </div>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex gap-3">
                <span className="w-5 text-center">♥</span>
                <span>Spread some love — pop hearts on screen</span>
              </div>
              <div className="flex gap-3">
                <span className="w-5 text-center">☕</span>
                <span>Open the full menu with prices to order</span>
              </div>
              <div className="flex gap-3">
                <span className="w-5 text-center">🙂</span>
                <span>Cycle emoji — click to change your chat face</span>
              </div>
              <div className="flex gap-3">
                <span className="w-5 text-center">⏻</span>
                <span>Restart — fresh greeting, new conversation</span>
              </div>
            </div>
          </div>

          <p className="text-zinc-400 text-sm leading-relaxed">
            A conversational AI barista powered by OpenAI. Full menu ordering
            with live price calculation, Apple Pay & Credit Card checkout, and a
            coffee machine interface built in React.
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            {["Node.js", "Express", "React", "OpenAI", "TypeScript", "CSS"].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono rounded-full"
                >
                  {tag}
                </span>
              )
            )}
          </div>

          <a
            href="https://github.com/AvsaStudio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-200 text-sm transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>

      <style>{`
        @keyframes machineIn { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
        .machine-in { animation: machineIn 0.25s ease-out forwards; }
        @keyframes heartFloat {
          0%   { opacity:1; transform:translateY(0) scale(0.9); }
          60%  { opacity:0.8; transform:translateY(-80px) scale(1.3); }
          100% { opacity:0; transform:translateY(-140px) scale(0.5); }
        }
        .heart-float { animation: heartFloat 1.3s ease-out forwards; }
      `}</style>
    </section>
  );
};
