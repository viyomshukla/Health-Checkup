import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Loader2,
  X,
  MapPin,
  Stethoscope,
  Search,
  ChevronRight,
  Sparkles,
  Heart,
  Minimize2,
} from "lucide-react";
import { symptomsList } from "@/data/symptoms";

type ChatStep = "welcome" | "symptoms" | "location" | "loading" | "result";

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  content: string;
  type?: "text" | "result";
  timestamp: Date;
}

interface ChatbotResult {
  symptoms: string;
  location: string;
  recommendation: string;
}

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ChatStep>("welcome");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomSearch, setSymptomSearch] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ChatbotResult | null>(null);
  const [showSymptomDropdown, setShowSymptomDropdown] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const symptomSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, step]);

  // Start chat on first open
  useEffect(() => {
    if (isOpen && !hasStarted) {
      setHasStarted(true);
      setTimeout(() => {
        addBotMessage(
          "👋 Hi! I'm your AI Health Assistant.\n\nTell me your symptoms and location — I'll suggest precautions and find the best doctors near you.\n\nSelect your symptoms below."
        );
        setStep("symptoms");
      }, 400);
    }
  }, [isOpen, hasStarted]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleSymptomsSubmit = () => {
    if (selectedSymptoms.length === 0) return;
    const labels = selectedSymptoms
      .map((v) => symptomsList.find((s) => s.value === v)?.label ?? v.replace(/_/g, " "))
      .join(", ");
    addUserMessage(`My symptoms: ${labels}`);
    setTimeout(() => {
      addBotMessage("📍 Now enter your city or area so I can find nearby doctors for you.");
      setStep("location");
    }, 400);
  };

  const handleLocationSubmit = async () => {
    if (!location.trim()) return;
    addUserMessage(`📍 ${location.trim()}`);
    setStep("loading");
    setTimeout(() => {
      addBotMessage("🔍 Analyzing symptoms and finding doctors near you…");
    }, 300);

    setIsLoading(true);
    try {
      const res = await fetch("https://health-checkup-4.onrender.com/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          location: location.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setResult(data);
      setStep("result");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "bot", content: "", type: "result", timestamp: new Date() },
        ]);
      }, 600);
    } catch (err: any) {
      addBotMessage(`❌ ${err.message || "Could not connect to the backend."}`);
      setStep("location");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setSelectedSymptoms([]);
    setSymptomSearch("");
    setLocation("");
    setResult(null);
    setHasStarted(false);
    setStep("welcome");
    setTimeout(() => {
      setHasStarted(true);
      addBotMessage("👋 Ready for a new check! Select your symptoms below.");
      setStep("symptoms");
    }, 300);
  };

  const formatMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^### (.*$)/gm, '<h4 class="text-sm font-semibold mt-3 mb-1 text-primary">$1</h4>')
      .replace(/^## (.*$)/gm, '<h3 class="text-base font-bold mt-4 mb-1 text-foreground">$1</h3>')
      .replace(/^# (.*$)/gm, '<h2 class="text-lg font-bold mt-4 mb-2 text-foreground">$1</h2>')
      .replace(/^- (.*$)/gm, '<li class="ml-3 mb-0.5 text-xs">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-3 mb-0.5 text-xs">$1</li>')
      .replace(/\n/g, "<br/>");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-cyan-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        id="chatbot-toggle"
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform group-hover:rotate-90" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          </>
        )}
      </button>

      {/* Popup Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-fadeIn"
          style={{
            boxShadow: "0 25px 60px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)",
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-cyan-500 px-4 py-3 flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">AI Health Assistant</h3>
              <p className="text-white/70 text-[10px]">Powered by Groq AI</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[300px] max-h-[360px] bg-gray-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 animate-fadeIn ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                    msg.role === "bot"
                      ? "bg-gradient-to-br from-primary to-cyan-500"
                      : "bg-gradient-to-br from-violet-500 to-purple-600"
                  }`}
                >
                  {msg.role === "bot" ? (
                    <Bot className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <User className="h-3.5 w-3.5 text-white" />
                  )}
                </div>

                {msg.type === "result" && result ? (
                  <div className="flex-1 max-w-[85%] bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      <span className="font-bold text-sm text-foreground">Health Advisory</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground mb-2">
                      <Heart className="h-3 w-3" />
                      <span>{result.symptoms}</span>
                      {result.location && (
                        <>
                          <span>·</span>
                          <MapPin className="h-3 w-3" />
                          <span>{result.location}</span>
                        </>
                      )}
                    </div>
                    <div className="border-t border-green-200 pt-2">
                      <div
                        className="text-xs text-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatMarkdown(result.recommendation) }}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
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

            {isLoading && (
              <div className="flex items-start gap-2 animate-fadeIn">
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-cyan-500">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 bg-white p-3">
            {step === "symptoms" && (
              <div className="space-y-2">
                {selectedSymptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedSymptoms.map((symptom) => {
                      const label = symptomsList.find((s) => s.value === symptom)?.label ?? symptom;
                      return (
                        <span
                          key={symptom}
                          className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-medium px-2 py-1 rounded-full"
                        >
                          {label}
                          <button onClick={() => removeSymptom(symptom)} className="hover:text-destructive">
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
                <div className="flex gap-1.5">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
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
                      className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                    {showSymptomDropdown && symptomSearch && (
                      <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-32 overflow-y-auto bottom-full mb-1">
                        {filteredSymptoms.length > 0 ? (
                          filteredSymptoms.slice(0, 6).map((symptom) => (
                            <button
                              key={symptom.value}
                              onClick={() => addSymptom(symptom.value)}
                              className="w-full px-3 py-1.5 text-left hover:bg-primary/5 text-xs transition-colors flex items-center gap-1.5"
                            >
                              <span className="w-1 h-1 bg-primary rounded-full" />
                              {symptom.label}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-muted-foreground text-xs text-center">
                            No matches
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleSymptomsSubmit}
                    disabled={selectedSymptoms.length === 0}
                    size="sm"
                    className="bg-gradient-to-r from-primary to-cyan-500 text-white rounded-lg px-3 shadow-md hover:shadow-lg"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {selectedSymptoms.length} selected{selectedSymptoms.length === 0 && " — type to search"}
                </p>
              </div>
            )}

            {step === "location" && (
              <div className="flex gap-1.5">
                <div className="relative flex-1">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLocationSubmit()}
                    placeholder="Enter your city or area…"
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    autoFocus
                  />
                </div>
                <Button
                  onClick={handleLocationSubmit}
                  disabled={!location.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-cyan-500 text-white rounded-lg px-3 shadow-md hover:shadow-lg"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}

            {step === "loading" && (
              <div className="flex items-center justify-center gap-2 py-1 text-muted-foreground text-xs">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>Getting health advisory…</span>
              </div>
            )}

            {step === "result" && (
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground">✅ Advisory ready!</p>
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-primary/30 hover:bg-primary/5 text-primary text-xs h-7 px-3"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  New Chat
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
