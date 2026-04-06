import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MessageCircle,
  Bot,
  User,
  Loader2,
  X,
  Stethoscope,
  Search,
  ChevronRight,
  Sparkles,
  Heart,
} from "lucide-react";
import { symptomsList } from "@/data/symptoms";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type ChatStep = "welcome" | "symptoms" | "loading" | "result";

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  content: string;
  type?: "text" | "result";
  timestamp: Date;
}

interface ChatbotResult {
  symptoms: string;
  recommendation: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const Chatbot = () => {
  const [step, setStep] = useState<ChatStep>("welcome");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomSearch, setSymptomSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ChatbotResult | null>(null);
  const [showSymptomDropdown, setShowSymptomDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const symptomSearchRef = useRef<HTMLInputElement>(null);

  /* Auto-scroll ----------------------------------------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, step]);

  /* Welcome on mount ------------------------------------------------ */
  useEffect(() => {
    const timer = setTimeout(() => {
      addBotMessage(
        "👋 Hello! I'm your AI Health Assistant powered by Gemini.\n\nTell me your symptoms and I'll provide precautions, possible conditions, recommended specialists, and home care tips.\n\nSelect your symptoms below to get started."
      );
      setStep("symptoms");
    }, 600);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Helpers --------------------------------------------------------- */
  const uid = () => Math.random().toString(36).slice(2, 10);

  const addBotMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "bot", content, type: "text", timestamp: new Date() },
    ]);
  };

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", content, type: "text", timestamp: new Date() },
    ]);
  };

  /* Symptom management ---------------------------------------------- */
  const filteredSymptoms = symptomsList.filter(
    (s) =>
      s.label.toLowerCase().includes(symptomSearch.toLowerCase()) &&
      !selectedSymptoms.includes(s.value)
  );

  const addSymptom = (value: string) => {
    setSelectedSymptoms((prev) => [...prev, value]);
    setSymptomSearch("");
    setShowSymptomDropdown(false);
    symptomSearchRef.current?.focus();
  };

  const removeSymptom = (value: string) => {
    setSelectedSymptoms((prev) => prev.filter((s) => s !== value));
  };

  /* Submit symptoms & call API directly ----------------------------- */
  const handleSymptomsSubmit = async () => {
    if (selectedSymptoms.length === 0) return;

    const labels = selectedSymptoms
      .map(
        (v) =>
          symptomsList.find((s) => s.value === v)?.label ?? v.replace(/_/g, " ")
      )
      .join(", ");
    addUserMessage(`My symptoms: ${labels}`);
    setStep("loading");

    setTimeout(() => {
      addBotMessage("🔍 Analyzing your symptoms and preparing health advisory…");
    }, 300);

    setIsLoading(true);
    try {
      const res = await fetch("https://health-checkup-3.onrender.com/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setResult(data);
      setStep("result");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "bot",
            content: "",
            type: "result",
            timestamp: new Date(),
          },
        ]);
      }, 800);
    } catch (err: any) {
      addBotMessage(
        `❌ ${err.message || "Could not connect to the backend. Make sure the Flask server is running on port 5000."}`
      );
      setStep("symptoms");
    } finally {
      setIsLoading(false);
    }
  };

  /* Reset flow ------------------------------------------------------ */
  const handleRestart = () => {
    setMessages([]);
    setSelectedSymptoms([]);
    setSymptomSearch("");
    setResult(null);
    setStep("welcome");

    setTimeout(() => {
      addBotMessage(
        "👋 Hello again! Ready for a new health check?\n\nSelect your symptoms below."
      );
      setStep("symptoms");
    }, 400);
  };

  /* Format Gemini markdown → simple HTML ----------------------------- */
  const formatMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^### (.*$)/gm, '<h4 class="text-lg font-semibold mt-4 mb-2 text-primary">$1</h4>')
      .replace(/^## (.*$)/gm, '<h3 class="text-xl font-bold mt-5 mb-2 text-foreground">$1</h3>')
      .replace(/^# (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3 text-foreground">$1</h2>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
      .replace(/\n/g, "<br/>");
  };

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-cyan-500 py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                AI Health Chatbot
              </h1>
              <p className="text-white/80 text-sm">
                Powered by Gemini AI · Symptoms → Precautions & Measures
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Card className="bg-white/80 backdrop-blur-md border border-white/40 shadow-2xl rounded-2xl overflow-hidden">
          {/* Messages Area */}
          <div className="h-[520px] overflow-y-auto p-5 space-y-4" id="chatbot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 animate-fadeIn ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
                    msg.role === "bot"
                      ? "bg-gradient-to-br from-primary to-cyan-500"
                      : "bg-gradient-to-br from-violet-500 to-purple-600"
                  }`}
                >
                  {msg.role === "bot" ? (
                    <Bot className="h-5 w-5 text-white" />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>

                {/* Bubble */}
                {msg.type === "result" && result ? (
                  <div className="flex-1 max-w-[85%] bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      <span className="font-bold text-lg text-foreground">
                        Health Advisory
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                      <Heart className="h-3.5 w-3.5" />
                      <span>Symptoms: {result.symptoms}</span>
                    </div>

                    <div className="border-t border-green-200 pt-4">
                      <div
                        className="text-sm text-foreground leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: formatMarkdown(result.recommendation),
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      msg.role === "bot"
                        ? "bg-white border border-gray-100 text-foreground"
                        : "bg-gradient-to-r from-primary to-cyan-500 text-white"
                    }`}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {msg.content}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-start gap-3 animate-fadeIn">
                <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-cyan-500 shadow-md">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm p-4">
            {/* Symptom picker */}
            {step === "symptoms" && (
              <div className="space-y-3">
                {/* Selected symptom chips */}
                {selectedSymptoms.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom) => {
                      const label =
                        symptomsList.find((s) => s.value === symptom)?.label ?? symptom;
                      return (
                        <span
                          key={symptom}
                          className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:bg-primary/20"
                        >
                          {label}
                          <button
                            onClick={() => removeSymptom(symptom)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="relative">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        ref={symptomSearchRef}
                        type="text"
                        value={symptomSearch}
                        onChange={(e) => {
                          setSymptomSearch(e.target.value);
                          setShowSymptomDropdown(true);
                        }}
                        onFocus={() => setShowSymptomDropdown(true)}
                        placeholder="Search symptoms…"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />

                      {showSymptomDropdown && symptomSearch && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                          {filteredSymptoms.length > 0 ? (
                            filteredSymptoms.slice(0, 8).map((symptom) => (
                              <button
                                key={symptom.value}
                                onClick={() => addSymptom(symptom.value)}
                                className="w-full px-4 py-2.5 text-left hover:bg-primary/5 text-sm transition-colors flex items-center gap-2"
                              >
                                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                {symptom.label}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-muted-foreground text-sm text-center">
                              No matching symptoms
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleSymptomsSubmit}
                      disabled={selectedSymptoms.length === 0 || isLoading}
                      className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-white rounded-xl px-5 shadow-md hover:shadow-lg transition-all"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1.5 ml-1">
                    {selectedSymptoms.length} symptom
                    {selectedSymptoms.length !== 1 ? "s" : ""} selected
                    {selectedSymptoms.length === 0 && " — start typing to search"}
                  </p>
                </div>
              </div>
            )}

            {/* Loading state */}
            {step === "loading" && (
              <div className="flex items-center justify-center gap-2 py-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Consulting Gemini AI for health advisory…</span>
              </div>
            )}

            {/* Result → restart */}
            {step === "result" && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  ✅ Health advisory ready!
                </p>
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  className="rounded-xl border-primary/30 hover:bg-primary/5 text-primary"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;
