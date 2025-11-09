import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Send, Volume2, MessageSquare, BookOpen, Loader2, Sparkles, TrendingUp, Plus, Trash2, Speaker, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Message {
  id: string;
  type: "user" | "assistant";
  text: string;
  data?: string;
  audioUrl?: string;
  topic?: string;
  chartData?: { year: number; co2: number }[];
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  elevenLabsConversationId?: string; // Store ElevenLabs conversation ID for agent continuity
}

// Conversation Starters
const conversationStarters = [
  { question: "What causes global warming?", topic: "Climate Science" },
  { question: "How do renewable energies work?", topic: "Renewable Energy" },
  { question: "What is the Paris Agreement?", topic: "Policy" },
  { question: "What are the impacts of climate change?", topic: "Impact" },
];

// Educational Tips for Loading
const educationalTips = [
  "Did you know? The ocean absorbs 30% of CO₂ emissions",
  "Fun fact: Renewable energy sources are now cheaper than fossil fuels in many regions",
  "Interesting: The Paris Agreement aims to limit global warming to 1.5°C above pre-industrial levels",
  "Amazing: Solar and wind power have grown 10x faster than fossil fuels in the past decade",
  "Fascinating: Trees can absorb up to 48 pounds of CO₂ per year",
  "Cool fact: Electric vehicles produce 50% fewer emissions than gas-powered cars",
];

// CO₂ Historical Data (1970-2024)
const co2HistoricalData = [
  { year: 1970, co2: 325 },
  { year: 1975, co2: 331 },
  { year: 1980, co2: 339 },
  { year: 1985, co2: 346 },
  { year: 1990, co2: 354 },
  { year: 1995, co2: 361 },
  { year: 2000, co2: 369 },
  { year: 2005, co2: 380 },
  { year: 2010, co2: 389 },
  { year: 2015, co2: 401 },
  { year: 2020, co2: 414 },
  { year: 2024, co2: 421 },
];

// Topic Colors
const topicColors: Record<string, string> = {
  "Climate Science": "bg-blue-500/20 text-blue-300 border-blue-500/40",
  "Renewable Energy": "bg-green-500/20 text-green-300 border-green-500/40",
  "Policy": "bg-purple-500/20 text-purple-300 border-purple-500/40",
  "Impact": "bg-orange-500/20 text-orange-300 border-orange-500/40",
};

const STORAGE_KEY = "climatesage_chats";

const Chat = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState("");
  const [audioSpeed, setAudioSpeed] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [elevenLabsConversationId, setElevenLabsConversationId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const tipIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Load chats from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const sessions = JSON.parse(stored) as ChatSession[];
        setChatSessions(sessions);
        // Load the most recent chat or first chat
        if (sessions.length > 0) {
          const mostRecent = sessions.sort((a, b) => b.updatedAt - a.updatedAt)[0];
          setCurrentChatId(mostRecent.id);
          setMessages(mostRecent.messages);
          setElevenLabsConversationId(mostRecent.elevenLabsConversationId || null);
        }
      } catch (error) {
        console.error("Error loading chats from storage:", error);
      }
    }
  }, []);

  // Save chats to local storage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  // Save current chat messages when they change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages, updatedAt: Date.now(), elevenLabsConversationId: elevenLabsConversationId || undefined }
            : chat
        )
      );
    }
  }, [messages, currentChatId, elevenLabsConversationId]);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Rotate educational tips during loading
  useEffect(() => {
    if (isLoading) {
      let tipIndex = 0;
      setLoadingTip(educationalTips[0]);
      
      tipIntervalRef.current = setInterval(() => {
        tipIndex = (tipIndex + 1) % educationalTips.length;
        setLoadingTip(educationalTips[tipIndex]);
      }, 3000);

      return () => {
        if (tipIntervalRef.current) {
          clearInterval(tipIntervalRef.current);
        }
      };
    } else {
      setLoadingTip("");
      if (tipIntervalRef.current) {
        clearInterval(tipIntervalRef.current);
      }
    }
  }, [isLoading]);

  // Update audio playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = audioSpeed;
    }
  }, [audioSpeed]);

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setChatSessions((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages([]);
    setInput("");
    setElevenLabsConversationId(null); // Reset conversation ID for new chat
  };

  const deleteChat = (chatId: string) => {
    setChatSessions((prev) => prev.filter((chat) => chat.id !== chatId));
    if (currentChatId === chatId) {
      const remaining = chatSessions.filter((chat) => chat.id !== chatId);
      if (remaining.length > 0) {
        const mostRecent = remaining.sort((a, b) => b.updatedAt - a.updatedAt)[0];
        setCurrentChatId(mostRecent.id);
        setMessages(mostRecent.messages);
      } else {
        setCurrentChatId(null);
        setMessages([]);
        setElevenLabsConversationId(null);
      }
    }
  };

  const selectChat = (chatId: string) => {
    const chat = chatSessions.find((c) => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
      setElevenLabsConversationId(chat.elevenLabsConversationId || null);
    }
  };

  const updateChatTitle = (chatId: string, title: string) => {
    setChatSessions((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, title, updatedAt: Date.now() } : chat))
    );
  };

  const detectTopic = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes("renewable") || lowerQuestion.includes("solar") || lowerQuestion.includes("wind") || lowerQuestion.includes("energy")) {
      return "Renewable Energy";
    }
    if (lowerQuestion.includes("paris") || lowerQuestion.includes("agreement") || lowerQuestion.includes("policy") || lowerQuestion.includes("treaty")) {
      return "Policy";
    }
    if (lowerQuestion.includes("impact") || lowerQuestion.includes("effect") || lowerQuestion.includes("consequence") || lowerQuestion.includes("damage")) {
      return "Impact";
    }
    return "Climate Science";
  };

  // Determine if CO2 chart should be shown based on question/topic
  const shouldShowCO2Chart = (question: string, topic: string, response: string): boolean => {
    const lowerQuestion = question.toLowerCase();
    const lowerResponse = response.toLowerCase();
    const combined = `${lowerQuestion} ${lowerResponse}`;
    
    // Show CO2 chart ONLY if the question/response is specifically about:
    // - CO2, carbon dioxide, carbon emissions
    // - Greenhouse gases (general overview - not specific gases)
    // - Global warming (temperature/atmospheric CO2 trends)
    // - Climate change (general CO2/emissions trends)
    const co2Keywords = [
      "co2", "carbon dioxide", "carbon emissions", "carbon concentration",
      "atmospheric co2", "co2 levels", "co2 concentration", "co2 ppm",
      "carbon ppm", "carbon dioxide levels", "carbon dioxide concentration"
    ];
    
    // General climate keywords that might warrant CO2 chart (but be careful)
    // Only use these if they're in context of CO2/emissions
    const generalClimateKeywords = [
      "greenhouse gas", "greenhouse gases", "global warming", 
      "climate change"
    ];
    
    // Check for specific CO2 keywords (always show chart)
    const hasSpecificCO2Keyword = co2Keywords.some(keyword => combined.includes(keyword));
    
    // Check for general climate keywords (show chart only if not about specific non-CO2 topics)
    const hasGeneralClimateKeyword = generalClimateKeywords.some(keyword => combined.includes(keyword));
    
    // Don't show for specific topics that aren't CO2-related
    const nonCO2Topics = [
      "renewable", "solar", "wind", "energy", "paris", "agreement", "policy",
      "treaty", "renewable energy", "solar power", "wind power",
      "cloud", "clouds", "altitude", "altitudes", "weather", "precipitation",
      "rain", "snow", "temperature", "humidity", "pressure", "atmospheric pressure",
      "wind speed", "weather pattern", "meteorology", "atmospheric physics"
    ];
    const isNonCO2Topic = nonCO2Topics.some(topic => lowerQuestion.includes(topic));
    
    // Don't show for questions about specific gases (ozone, methane, HFCs, PFCs, SF6, etc.) 
    // unless also explicitly about CO2
    const specificGases = [
      "ozone", "methane", "nitrous oxide", "hfc", "pfc", "sf6", 
      "sulfur hexafluoride", "nitrogen trifluoride", "nf3",
      "hydrofluorocarbon", "perfluorocarbon", "water vapor", "nitrogen", "oxygen"
    ];
    const isSpecificGas = specificGases.some(gas => 
      combined.includes(gas) && !combined.includes("co2") && !combined.includes("carbon dioxide")
    );
    
    // Don't show for atmospheric/weather topics unless specifically about CO2
    const atmosphericTopics = [
      "cloud", "clouds", "atmospheric", "atmosphere", "weather", "meteorology",
      "precipitation", "rain", "snow", "wind", "pressure", "humidity", "temperature"
    ];
    const isAtmosphericTopic = atmosphericTopics.some(topic => 
      combined.includes(topic) && !hasSpecificCO2Keyword && !combined.includes("co2") && !combined.includes("carbon dioxide")
    );
    
    // Show chart ONLY if:
    // 1. Has specific CO2 keywords, OR
    // 2. Has general climate keywords AND not about specific non-CO2 topics AND not about specific gases AND not about atmospheric/weather
    return hasSpecificCO2Keyword || (hasGeneralClimateKeyword && !isNonCO2Topic && !isSpecificGas && !isAtmosphericTopic);
  };


  const callAI = async (question: string): Promise<string> => {
    console.log("🤖 [AGENT CALL] Using Direct Gemini API (via Supabase function)");
    const CHAT_URL = `https://wpgpnrhumhckbbnjnegr.supabase.co/functions/v1/climate-chat`;
    
    const response = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZ3Bucmh1bWhja2JibmpuZWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MTk5MjcsImV4cCI6MjA3ODE5NTkyN30.fly2rfm41VFRIR1R0PulpdwSLkLja51DX01u-k2v9fk`,
      },
      body: JSON.stringify({ message: question }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ [AGENT CALL] Direct Gemini API response received");
    return data.response;
  };

  // Use the climate-chat edge function for all AI responses
  const callElevenLabsAgent = async (message: string, conversationId?: string | null): Promise<{ response: string; conversationId: string }> => {
    console.log(`🤖 [AGENT CALL] Using climate-chat edge function`);
    console.log(`   Conversation ID: ${conversationId || "NEW"}`);

    const response = await callAI(message);
    
    // Generate or reuse conversation ID
    const newConversationId = conversationId || `conv_${Date.now()}`;
    console.log(`   Conversation ID: ${newConversationId}`);
    
    return { response, conversationId: newConversationId };
  };

  const handleAsk = async () => {
    if (!input.trim() || isLoading) return;

    // Create new chat if none exists
    if (!currentChatId) {
      createNewChat();
      // Wait a bit for state to update
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const question = input.trim();
    const topic = detectTopic(question);
    
    // Update chat title if it's the first message
    const currentChat = chatSessions.find((c) => c.id === currentChatId);
    if (currentChat && currentChat.messages.length === 0) {
      const title = question.length > 30 ? question.substring(0, 30) + "..." : question;
      updateChatTitle(currentChatId!, title);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: question,
      topic,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Check if this is the first message in the conversation
      const currentChat = chatSessions.find((c) => c.id === currentChatId);
      const isFirstMessage = currentChat && currentChat.messages.length === 0;

      let response: string;
      let newConversationId: string | null = null;

      if (isFirstMessage) {
        // First message: use direct Gemini API (callAI)
        console.log("📝 [CHAT] First message - using Direct Gemini API");
        response = await callAI(question);
      } else {
        // After first message: use ElevenLabs agent
        console.log("📝 [CHAT] Subsequent message - using ElevenLabs Agent");
        const agentResponse = await callElevenLabsAgent(question, elevenLabsConversationId);
        response = agentResponse.response;
        newConversationId = agentResponse.conversationId;
        
        // Update conversation ID if we got a new one
        if (newConversationId && newConversationId !== elevenLabsConversationId) {
          console.log(`💾 [CHAT] Saving new conversation ID: ${newConversationId}`);
          setElevenLabsConversationId(newConversationId);
        }
      }
      
      // Only show CO2 chart if the topic is actually CO2-related
      // Don't hardcode charts for other topics - only show when relevant
      const shouldDisplayChart = shouldShowCO2Chart(question, topic, response);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        text: response,
        data: shouldDisplayChart ? "CO₂: 421 ppm" : undefined,
        topic,
        chartData: shouldDisplayChart ? co2HistoricalData : undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling AI:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        text: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please check your API key configuration.`,
        topic: "Error",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarterClick = (question: string) => {
    // Create new chat if none exists
    if (!currentChatId) {
      createNewChat();
    }
    setInput(question);
    // Auto-focus the input after setting the question
    setTimeout(() => {
      const inputElement = document.querySelector('input[placeholder="Ask about climate change..."]') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  };

  const handleSpeak = () => {
    if (!synthRef.current) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    // Get the last assistant message
    const lastAssistantMessage = [...messages].reverse().find((msg) => msg.type === "assistant");
    
    if (!lastAssistantMessage) {
      alert("No response to read. Please ask a question first.");
      return;
    }

    // Stop any ongoing speech
    synthRef.current.cancel();

    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(lastAssistantMessage.text);
    utterance.rate = audioSpeed;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = "en-US";

    synthRef.current.speak(utterance);
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await transcribeAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

    if (!apiKey) {
      alert("ElevenLabs API key not found. Please add it to your .env file.");
      return;
    }

    setIsTranscribing(true);

    try {
      // Prepare audio for ElevenLabs STT API
      // The API requires: model_id (scribe_v1 or scribe_v1_experimental) and file parameter
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");
      formData.append("model_id", "scribe_v1"); // Use scribe_v1 as default, can be changed to scribe_v1_experimental

      // Use ElevenLabs Speech-to-Text API
      const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("ElevenLabs API Error:", errorData);
        throw new Error(errorData.detail?.message || errorData.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("ElevenLabs STT Response:", data);
      
      // Extract transcribed text from response
      // Response format: { text: "transcribed text" }
      const transcribedText = data.text || data.transcript || data.transcription;
      
      if (transcribedText) {
        setInput(transcribedText);
        // User can review and click "Ask" to send to Gemini
      } else {
        console.error("Unexpected response format:", data);
        alert("Could not extract transcribed text from response. Please try again.");
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
      alert(
        error instanceof Error 
          ? `Speech-to-text failed: ${error.message}` 
          : "Speech-to-text failed. Please check your ElevenLabs API configuration."
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleTalk = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const speedOptions = [0.75, 1, 1.25, 1.5];

  const currentChat = chatSessions.find((c) => c.id === currentChatId);

  return (
    <SidebarProvider>
      <div className="min-h-screen gradient-page-light flex w-full">
        {/* Sidebar */}
        <Sidebar variant="floating" className="border-r border-border/30">
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-foreground/80 mb-2">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuButton asChild className="glass-transition">
                    <Link to="/" className="flex items-center gap-2 w-full">
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuButton className="bg-primary/20 border-primary/40 glass-transition" disabled>
                    <div className="flex items-center gap-2 w-full">
                      <MessageSquare className="h-4 w-4" />
                      <span>Chat</span>
                    </div>
                  </SidebarMenuButton>
                  <SidebarMenuButton asChild className="glass-transition">
                    <Link to="/quiz" className="flex items-center gap-2 w-full">
                      <BookOpen className="h-4 w-4" />
                      <span>Quiz</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <div className="flex items-center justify-between mb-2">
                <SidebarGroupLabel className="text-foreground/80">Chat History</SidebarGroupLabel>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={createNewChat}
                  className="h-6 w-6 p-0 glass-transition"
                  title="New Chat"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {chatSessions.length === 0 ? (
                    <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                      No chats yet. Start a conversation!
                    </div>
                  ) : (
                    chatSessions
                      .sort((a, b) => b.updatedAt - a.updatedAt)
                      .map((chat) => (
                        <div
                          key={chat.id}
                          className={`flex items-center gap-2 p-2 rounded-lg mb-1 glass-transition cursor-pointer ${
                            currentChatId === chat.id
                              ? "bg-primary/20 border-primary/40"
                              : "hover:bg-primary/10"
                          }`}
                          onClick={() => selectChat(chat.id)}
                        >
                          <MessageSquare className="h-3 w-3 flex-shrink-0" />
                          <span className="text-sm text-foreground flex-1 truncate" title={chat.title}>
                            {chat.title}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChat(chat.id);
                            }}
                            title="Delete Chat"
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ))
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header - Glassmorphic */}
          <header className="glass-strong sticky top-0 z-50 border-b border-border/30">
            <div className="flex items-center gap-2 px-4 py-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-2xl font-bold text-foreground">ClimateSage</h1>
              {currentChat && (
                <span className="text-sm text-muted-foreground ml-2">- {currentChat.title}</span>
              )}
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={createNewChat}
                  className="glass-transition"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
          <Link to="/">
                  <Button variant="ghost" size="icon" className="rounded-full">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
              </div>
        </div>
      </header>

      {/* Messages Area */}
          <main className="flex-1 overflow-y-auto px-4 py-8">
            <div className="container mx-auto max-w-4xl">
        <div className="space-y-6 mb-32">
          {messages.length === 0 ? (
                  <>
                    {/* Conversation Starters */}
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-accent" />
                        Conversation Starters
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {conversationStarters.map((starter, index) => (
                          <Card
                            key={index}
                            className="p-4 glass-card-dark whimsical-card cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => handleStarterClick(starter.question)}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm text-foreground flex-1">{starter.question}</p>
                              <Badge className={topicColors[starter.topic] || "bg-primary/20 text-primary border-primary/40"}>
                                {starter.topic}
                              </Badge>
                            </div>
                          </Card>
                        ))}
                      </div>
            </div>
                    <Card className="p-12 text-center">
                      <p className="text-lg text-muted-foreground">Ask me anything about climate change!</p>
                    </Card>
                  </>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <Card
                        className={`p-5 max-w-[80%] overflow-visible ${
                    message.type === "user"
                            ? "bg-primary/20 border-primary/40"
                            : ""
                        }`}
                      >
                        {message.topic && message.topic !== "Error" && (
                          <div className="mb-3">
                            <Badge className={topicColors[message.topic] || "bg-primary/20 text-primary border-primary/40"}>
                              {message.topic}
                            </Badge>
                          </div>
                        )}
                        <div 
                          className="mb-3 text-foreground whitespace-pre-wrap prose prose-invert max-w-none break-words overflow-visible"
                          style={{ lineHeight: '1.6', wordBreak: 'break-word' }}
                        >
                          {message.text.split('\n').map((line, idx) => {
                            // Process markdown formatting in the line
                            let processedLine = line;
                            const parts: (string | JSX.Element)[] = [];
                            
                            // Handle bold text (**text**)
                            const boldRegex = /\*\*(.+?)\*\*/g;
                            let lastIndex = 0;
                            let match;
                            
                            while ((match = boldRegex.exec(line)) !== null) {
                              // Add text before the bold
                              if (match.index > lastIndex) {
                                parts.push(line.substring(lastIndex, match.index));
                              }
                              // Add bold text
                              parts.push(
                                <strong key={`bold-${idx}-${match.index}`} className="font-semibold">
                                  {match[1]}
                                </strong>
                              );
                              lastIndex = match.index + match[0].length;
                            }
                            
                            // Add remaining text
                            if (lastIndex < line.length) {
                              parts.push(line.substring(lastIndex));
                            }
                            
                            // If no bold found, use original line
                            if (parts.length === 0) {
                              parts.push(line);
                            }
                            
                            // Check if line is a bullet point or numbered list
                            if (/^[\*\-\•]\s/.test(line) || /^\d+\.\s/.test(line)) {
                              return (
                                <div key={idx} className="ml-4 mb-1">
                                  {parts}
                                </div>
                              );
                            }
                            
                            // Check if line is a heading (starts with ## or ###)
                            if (/^#{1,3}\s/.test(line)) {
                              const level = line.match(/^(#{1,3})/)?.[1].length || 1;
                              const headingText = line.replace(/^#{1,3}\s/, '');
                              return (
                                <div 
                                  key={idx} 
                                  className={`mb-2 font-bold ${level === 1 ? 'text-lg' : level === 2 ? 'text-base' : 'text-sm'}`}
                                >
                                  {headingText}
                                </div>
                              );
                            }
                            
                            return <div key={idx} className="mb-1">{parts}</div>;
                          })}
                        </div>
                  {message.data && (
                          <div className="mt-4 pt-4 border-t border-border/30">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-accent glass"></div>
                      <p className="text-sm font-semibold text-accent">{message.data}</p>
                            </div>
                          </div>
                        )}
                        {message.chartData && (
                          <div className="mt-4 pt-4 border-t border-border/30">
                            <div className="mb-2 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-accent" />
                              <span className="text-sm font-semibold text-accent">CO₂ Trends (1970-2024)</span>
                            </div>
                            <div className="h-64 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={message.chartData}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                  <XAxis 
                                    dataKey="year" 
                                    stroke="hsl(var(--muted-foreground))"
                                    style={{ fontSize: '12px' }}
                                  />
                                  <YAxis 
                                    stroke="hsl(var(--muted-foreground))"
                                    style={{ fontSize: '12px' }}
                                    label={{ value: 'CO₂ (ppm)', angle: -90, position: 'insideLeft', style: { fill: 'hsl(var(--muted-foreground))' } }}
                                  />
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: 'hsl(var(--card))',
                                      border: '1px solid hsl(var(--border))',
                                      borderRadius: '8px',
                                      color: 'hsl(var(--foreground))'
                                    }}
                                  />
                                  <Line 
                                    type="monotone" 
                                    dataKey="co2" 
                                    stroke="hsl(152 76% 46%)" 
                                    strokeWidth={2}
                                    dot={{ fill: 'hsl(152 76% 46%)', r: 4 }}
                                    activeDot={{ r: 6 }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                    </div>
                  )}
                  {message.audioUrl && (
                          <div className="mt-4 pt-4 border-t border-border/30">
                            <div className="glass-audio p-3 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <Volume2 className="h-4 w-4 text-accent" />
                                  <span className="text-sm text-muted-foreground">Audio Response</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {speedOptions.map((speed) => (
                                    <Button
                                      key={speed}
                                      variant={audioSpeed === speed ? "default" : "ghost"}
                                      size="sm"
                                      className="h-6 px-2 text-xs"
                                      onClick={() => setAudioSpeed(speed)}
                                    >
                                      {speed}x
                                    </Button>
                                  ))}
                                </div>
                              </div>
                              <audio 
                                ref={audioRef}
                                controls 
                                className="w-full"
                                style={{ display: 'block' }}
                              >
                        <source src={message.audioUrl} type="audio/mpeg" />
                      </audio>
                            </div>
                    </div>
                  )}
                </Card>
              </div>
            ))
          )}
                
                {/* Loading State */}
                {isLoading && (
                  <div className="flex justify-start">
                    <Card className="p-5 max-w-[80%]">
                      <div className="flex items-center gap-3 mb-3">
                        <Loader2 className="h-5 w-5 text-accent animate-spin" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                      {loadingTip && (
                        <div className="mt-3 pt-3 border-t border-border/30">
                          <div className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground italic">{loadingTip}</p>
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                )}
              </div>
        </div>
      </main>

          {/* Input Area - Fixed at bottom with Glassmorphic */}
          <div className="glass-strong border-t border-border/30 py-4 z-50">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAsk()}
              placeholder="Ask about climate change..."
              className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleTalk}
                  variant="outline"
                  size="lg"
                  className={`text-foreground hover:text-accent ${isRecording ? "bg-destructive/20 border-destructive/40" : ""}`}
                  disabled={isLoading || isTranscribing}
                  title={isRecording ? "Click to stop recording" : "Click to start voice input"}
                >
                  {isTranscribing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mic className={`h-4 w-4 mr-2 ${isRecording ? "text-destructive animate-pulse" : ""}`} />
                  )}
                  {isRecording ? "Stop" : isTranscribing ? "Transcribing..." : "Talk"}
                </Button>
                <Button 
                  onClick={handleSpeak}
                  variant="outline"
                  size="lg"
                  className="text-foreground hover:text-accent"
                  disabled={isLoading || messages.filter(m => m.type === "assistant").length === 0}
                  title="Read last response aloud"
                >
                  <Speaker className="h-4 w-4 mr-2" />
                  Speech
                </Button>
                <Button 
                  onClick={handleAsk} 
                  variant="elevated"
                  size="lg"
                  className="text-accent hover:text-accent/80"
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
              <Send className="h-4 w-4 mr-2" />
                  )}
              Ask
            </Button>
          </div>
        </div>
      </div>
    </div>
      </div>
    </SidebarProvider>
  );
};

export default Chat;
