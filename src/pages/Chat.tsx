import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Home, Send } from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  type: "user" | "assistant";
  text: string;
  data?: string;
  audioUrl?: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleAsk = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input,
    };

    // Simulate AI response (will be replaced with real AI later)
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      text: "This is a sample response. Connect backend to enable AI teacher functionality.",
      data: "CO₂: 421 ppm",
    };

    setMessages([...messages, userMessage, aiMessage]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">ClimateSage</h1>
          <Link to="/">
            <Button variant="ghost" size="icon">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Messages Area */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6 mb-32">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Ask me anything about climate change!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`p-4 max-w-[80%] shadow-soft ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "gradient-card"
                  }`}
                >
                  <p className="mb-2">{message.text}</p>
                  {message.data && (
                    <div className="mt-3 pt-3 border-t border-border/20">
                      <p className="text-sm font-semibold text-accent">{message.data}</p>
                    </div>
                  )}
                  {message.audioUrl && (
                    <div className="mt-3">
                      <audio controls className="w-full">
                        <source src={message.audioUrl} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}
                </Card>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-medium">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              placeholder="Ask about climate change..."
              className="flex-1"
            />
            <Button onClick={handleAsk} className="bg-accent hover:bg-accent/90">
              <Send className="h-4 w-4 mr-2" />
              Ask
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
