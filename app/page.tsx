
"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const welcomeMessage: Message = {
  role: "assistant",
  content:
    "Hey there! ☕ Welcome to Daily Brew. I'm your friendly cafe assistant. Ask me about our coffee, menu, or opening hours! And may I recommend our Caramel Cold Brew? It's a customer favorite!",
};

const menu = [
  {
    emoji: "🧋",
    name: "Caramel Cold Brew",
    description: "Smooth, chilled coffee with caramel",
    price: "$5.00",
  },
  {
    emoji: "🥛",
    name: "Iced Latte",
    description: "Espresso with creamy chilled milk",
    price: "$4.50",
  },
  {
    emoji: "🫐",
    name: "Blueberry Muffin",
    description: "A sweet bakery treat",
    price: "$3.50",
  },
];

const suggestions = [
  "Show me the menu",
  "What are your hours?",
  "Recommend a drink",
];

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(
    event?: FormEvent<HTMLFormElement>,
    suggestedMessage?: string
  ) {
    event?.preventDefault();

    const question = (suggestedMessage ?? input).trim();

    if (!question || isLoading) return;

    const history = messages.slice(1).map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setMessages((previous) => [
      ...previous,
      { role: "user", content: question },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, history }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The assistant is unavailable.");
      }

      if (typeof data.reply !== "string") {
        throw new Error("The assistant returned an unexpected response.");
      }

      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: data.reply },
      ]);
  } catch (error) {
  const detail =
    error instanceof Error ? error.message : "Unknown error";

  setMessages((previous) => [
    ...previous,
    {
      role: "assistant",
      content: `Debug error: ${detail}`,
    },
  ]);
} finally {
  setIsLoading(false);
}
}

return (
    <main className="min-h-screen bg-[#faf7f0] text-[#263b32]">
      <header className="border-b border-[#e9e2d5] bg-[#faf7f0]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#284a3a] text-2xl">
              ☕
            </span>
            <span>
              <span className="block text-xl font-bold tracking-tight">
                Daily Brew
              </span>
              <span className="text-xs tracking-wide text-[#7f887d]">
                YOUR LITTLE COFFEE CORNER
              </span>
            </span>
          </a>

          <span className="rounded-full border border-[#d9e5d6] bg-[#edf4e9] px-4 py-2 text-sm font-medium text-[#456748]">
            ● Cafe assistant online
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-2 lg:gap-14 lg:py-16">
        <section className="flex flex-col justify-center">
          <span className="mb-5 w-fit rounded-full bg-[#e9eee0] px-4 py-2 text-xs font-bold tracking-[0.18em] text-[#49664b]">
            GOOD COFFEE, GOOD MOOD
          </span>

          <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Your daily dose
            <br />
            of <span className="text-[#a16f45]">happy.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-[#777b70]">
            A cozy little coffee shop for your everyday favorites. Chat with
            our cafe assistant to explore the menu, check our hours, and find
            something delicious.
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {menu.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-[#e9e2d5] bg-white p-4 shadow-sm"
              >
                <span className="text-3xl">{item.emoji}</span>
                <h2 className="mt-4 text-sm font-bold">{item.name}</h2>
                <p className="mt-2 min-h-10 text-xs leading-5 text-[#85877d]">
                  {item.description}
                </p>
                <p className="mt-3 text-lg font-bold text-[#a16f45]">
                  {item.price}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-[#777b70]">
            <span className="rounded-full bg-white px-4 py-2">
              🕒 Open daily
            </span>
            <span className="rounded-full bg-white px-4 py-2">
              7 AM – 9 PM
            </span>
          </div>

          <p className="mt-8 text-sm text-[#96968a]">
            Freshly brewed, warmly served. Made for your everyday moments.
          </p>
        </section>

        <section className="overflow-hidden rounded-3xl border border-[#e3dfd2] bg-white shadow-xl shadow-[#544a3210]">
          <div className="flex items-center justify-between bg-[#284a3a] px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-xl">
                ☕
              </span>
              <div>
                <h2 className="font-bold">Chat with Daily Brew</h2>
                <p className="mt-1 text-xs text-white/70">
                  Your friendly cafe barista
                </p>
              </div>
            </div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
              Here to help
            </span>
          </div>

          <div
            className="h-[400px] space-y-5 overflow-y-auto bg-[#fdfbf6] p-5 sm:p-6"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <span className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#e9eee0]">
                    ☕
                  </span>
                )}
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-sm bg-[#284a3a] text-white"
                      : "rounded-bl-sm border border-[#eee7da] bg-white text-[#424a40]"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 text-sm text-[#85877d]">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e9eee0]">
                  ☕
                </span>
                Brewing an answer...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-[#eee7da] bg-white p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={isLoading}
                  onClick={() => void sendMessage(undefined, suggestion)}
                  className="rounded-full border border-[#dfe5d8] px-3 py-2 text-xs text-[#4d684f] transition hover:bg-[#edf4e9] disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about our coffee or menu..."
                aria-label="Your message"
                disabled={isLoading}
                className="min-w-0 flex-1 rounded-2xl border border-[#e5e0d6] bg-[#fdfbf6] px-4 py-3 text-sm outline-none transition placeholder:text-[#aaa99f] focus:border-[#729174] focus:ring-2 focus:ring-[#729174]/15 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-2xl bg-[#284a3a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3c2e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </form>

            <p className="mt-3 text-center text-[11px] text-[#a3a196]">
              Daily Brew assistant · Cafe questions only
            </p>
          </div>
        </section>
      </div>

      <footer className="border-t border-[#e9e2d5] px-6 py-6 text-center text-xs text-[#96968a]">
        © Daily Brew · A little coffee, a lot of comfort.
      </footer>
    </main>
  );
}
