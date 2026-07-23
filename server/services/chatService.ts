import OpenAI from "openai";
import { AppError } from "../errors/AppError.js";
import type { ChatRequest } from "../schemas/chat.js";
import { getMenu } from "./menuService.js";

const FALLBACK_MENU = `MENU AND PRICING:
Espresso $3.50 | Americano $4.00 | Cappuccino $4.50 | Latte $5.00 | Flat White $5.00 | Cortado $4.50 | Mocha $5.50 | Cold Brew $5.50 | Iced Latte $5.50 | Matcha Latte $5.50
Size: Small -$0.50 / Medium base / Large +$0.75
Add-ons: Extra shot +$0.75 | Oat milk +$0.50 | Vanilla or Caramel syrup +$0.50`;

const COFFEE_SYSTEM_PROMPT = `You are BrewBot, a charming, witty, and knowledgeable AI barista at Brewed Beans Cafe.

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

const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generateCoffeeReply(input: ChatRequest) {
  if (!openai) {
    throw new AppError(503, "The chatbot is not configured yet.", "AI_UNAVAILABLE");
  }

  try {
    const menuInstructions = await getMenu()
      .then(
        (menu) => `MENU AND PRICING:
${menu.items
  .map((item) => `${item.name} $${item.basePrice.toFixed(2)}`)
  .join(" | ")}
Size: Small -$0.50 / Medium base / Large +$0.75
Add-ons: ${menu.addOns
          .map((addOn) => `${addOn.name} +$${addOn.price.toFixed(2)}`)
          .join(" | ")}`
      )
      .catch(() => FALLBACK_MENU);
    const result = await openai.responses.create({
      model,
      instructions: `${COFFEE_SYSTEM_PROMPT}\n\n${menuInstructions}`,
      input: [...input.history, { role: "user", content: input.message }],
      max_output_tokens: 200,
    });
    const reply = result.output_text.trim();
    if (!reply) throw new Error("OpenAI returned an empty response");
    return reply;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Coffee chat error:", error);
    throw new AppError(
      502,
      "The barista is temporarily unavailable.",
      "AI_REQUEST_FAILED"
    );
  }
}
