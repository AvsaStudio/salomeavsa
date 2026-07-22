import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const COFFEE_SYSTEM_PROMPT = `You are BrewBot, a charming, witty, and knowledgeable AI barista at Brewed Beans Cafe.

MENU AND PRICING:
Espresso $3.50 | Americano $4.00 | Cappuccino $4.50 | Latte $5.00 | Flat White $5.00
Cortado $4.50 | Mocha $5.50 | Cold Brew $5.50 | Iced Latte $5.50 | Matcha Latte $5.50
Size: Small -$0.50 / Medium base / Large +$0.75
Add-ons: Extra shot +$0.75 | Oat milk +$0.50 | Vanilla or Caramel syrup +$0.50

PERSONALITY:
- Be warm, witty, coffee-obsessed, and helpful.
- Remember details from the supplied conversation.
- Empathize when a customer seems tired or stressed.

ORDER FLOW:
1. Ask what the customer would like.
2. Confirm size and customizations for each item.
3. Summarize the order with an itemized price breakdown and total.
4. Ask whether they are ready to pay and mention Apple Pay or Credit Card.
5. After payment confirmation, thank them and give a 3-5 minute wait time.

RULES:
- Keep replies to 2-3 sentences, or 4 for a complex order.
- Use at most one coffee emoji per response.
- Never invent menu items or prices.
- Always remain in character.`;

const app = express();
const port = Number(process.env.PORT) || 3001;
const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/api/chat", async (request, response) => {
  const message = typeof request.body?.message === "string"
    ? request.body.message.trim()
    : "";
  const rawHistory = Array.isArray(request.body?.history)
    ? request.body.history
    : [];

  if (!message || message.length > 1_000) {
    response.status(400).json({ error: "Message must contain 1-1000 characters." });
    return;
  }

  const history: ChatMessage[] = rawHistory
    .filter(
      (item: unknown): item is ChatMessage =>
        typeof item === "object" &&
        item !== null &&
        (item as ChatMessage).role !== undefined &&
        ["user", "assistant"].includes((item as ChatMessage).role) &&
        typeof (item as ChatMessage).content === "string"
    )
    .slice(-20)
    .map((item) => ({
      role: item.role,
      content: item.content.slice(0, 2_000),
    }));

  if (!process.env.OPENAI_API_KEY) {
    response.status(503).json({ error: "The chatbot is not configured yet." });
    return;
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await openai.responses.create({
      model,
      instructions: COFFEE_SYSTEM_PROMPT,
      input: [...history, { role: "user", content: message }],
      max_output_tokens: 200,
    });

    const reply = result.output_text.trim();
    if (!reply) throw new Error("OpenAI returned an empty response.");

    response.json({ message: reply });
  } catch (error) {
    console.error("Coffee chat error:", error);
    response.status(502).json({ error: "The barista is temporarily unavailable." });
  }
});

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.resolve(currentDirectory, "../dist");
app.use(express.static(distDirectory));
app.get("/{*splat}", (_request, response) => {
  response.sendFile(path.join(distDirectory, "index.html"));
});

app.listen(port, () => {
  console.log(`BrewBot API listening on http://localhost:${port}`);
});
