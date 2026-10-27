
import { NextResponse } from "next/server";

// Server-side configuration for the Daily Brew demo assistant.
// This configuration implements the assignment rules without a live AI model.
const SYSTEM_PROMPT_SPEC = {
  persona: "A friendly, cheerful, helpful coffee shop barista.",
  menu: [
    { name: "Caramel Cold Brew", price: "$5.00" },
    { name: "Iced Latte", price: "$4.50" },
    { name: "Blueberry Muffin", price: "$3.50" },
  ],
  openingHours: "7 AM – 9 PM",
  guardrails: [
    "Only answer questions about the cafe, menu, food, drinks, and opening hours.",
    "Always recommend the Caramel Cold Brew in cafe-related answers.",
    "Never offer free items or invent menu items, prices, or promotions.",
    "Politely decline unrelated questions.",
  ],
} as const;

function generateDemoReply(message: string): string {
  const question = message.toLowerCase();

  const isCafeRelated =
    /\b(cafe|café|coffee|drink|drinks|menu|food|hours|open|opening|close|closes|price|cost|caramel|cold brew|latte|muffin|recommend|recommendation|buy|order|available)\b/.test(
      question
    );

  if (!isCafeRelated) {
    return "I'm your Daily Brew cafe assistant, so I can only help with our menu, drinks, food, and opening hours. ☕ For your next cafe visit, I recommend our Caramel Cold Brew for $5.00!";
  }

  const menu = SYSTEM_PROMPT_SPEC.menu;
  const coldBrew = menu[0];

  if (
    question.includes("hour") ||
    question.includes("open") ||
    question.includes("close") ||
    question.includes("when are you")
  ) {
    return `We're open daily from ${SYSTEM_PROMPT_SPEC.openingHours}! ☕ When you visit, I recommend our ${coldBrew.name} (${coldBrew.price}).`;
  }

  if (
    question.includes("menu") ||
    question.includes("everything") ||
    question.includes("what do you have")
  ) {
    return `Here's our Daily Brew menu:\n\n${menu
      .map((item) => `${item.name} — ${item.price}`)
      .join("\n")}\n\nMy top recommendation is our ${coldBrew.name} (${coldBrew.price})! ☕`;
  }

  if (
    question.includes("recommend") ||
    question.includes("suggest") ||
    question.includes("favorite") ||
    question.includes("best drink")
  ) {
    return `I recommend our ${coldBrew.name} for ${coldBrew.price}! It's our featured coffee choice. ☕`;
  }

  if (question.includes("caramel") || question.includes("cold brew")) {
    return `Our Caramel Cold Brew costs ${coldBrew.price}. It's my top recommendation! ☕`;
  }

  if (question.includes("latte")) {
    return `Our Iced Latte costs ${menu[1].price}. It's a lovely chilled coffee choice! I also recommend our ${coldBrew.name} (${coldBrew.price}). ☕`;
  }

  if (question.includes("muffin") || question.includes("blueberry")) {
    return `Our Blueberry Muffin costs ${menu[2].price}. It's a sweet bakery treat! For a drink to go with it, I recommend our ${coldBrew.name} (${coldBrew.price}). ☕`;
  }

  if (question.includes("free") || question.includes("discount") || question.includes("promotion")) {
    return `I don't have any free-item offers or promotions to share. Our listed menu prices are: ${menu
      .map((item) => `${item.name} ${item.price}`)
      .join(", ")}. I recommend our ${coldBrew.name}! ☕`;
  }

  return `Happy to help with Daily Brew! We're open ${SYSTEM_PROMPT_SPEC.openingHours}. Our menu includes Caramel Cold Brew ($5.00), Iced Latte ($4.50), and Blueberry Muffin ($3.50). I recommend the Caramel Cold Brew! ☕`;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      !("message" in body) ||
      typeof body.message !== "string" ||
      body.message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Please enter a message." },
        { status: 400 }
      );
    }

    const reply = generateDemoReply(body.message.trim());

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Daily Brew demo chat error:", error);

    return NextResponse.json(
      { error: "Sorry, something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
