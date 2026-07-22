export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

type ChatResponse = {
  message: string;
};

export async function sendCoffeeChat(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  const data = (await response.json()) as ChatResponse | { error?: string };

  if (!response.ok || !("message" in data)) {
    throw new Error("error" in data ? data.error : "Chat request failed");
  }

  return data.message;
}
