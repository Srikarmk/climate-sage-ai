import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Home, CheckCircle2, XCircle, Volume2, MessageSquare, BookOpen, Loader2, Sparkles, Trash2, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizHistory {
  id: string;
  topic: string;
  prompt: string;
  score: number;
  totalQuestions: number;
  completedAt: number;
  questions: QuizQuestion[];
}

const STORAGE_KEY = "climateSageQuizHistory";

// Educational tips to show while generating quiz
const loadingTips = [
  "Did you know? The ocean absorbs about 30% of CO₂ emissions.",
  "Fun fact: Renewable energy sources are becoming cheaper than fossil fuels.",
  "Interesting: Climate change affects weather patterns globally.",
  "Tip: Reducing energy consumption helps fight climate change.",
  "Fact: Trees are natural carbon sinks that help reduce CO₂.",
];

const Quiz = () => {
  const [quizPrompt, setQuizPrompt] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingTip, setLoadingTip] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [finalScore, setFinalScore] = useState<{ score: number; total: number } | null>(null);

  const question = quizQuestions[currentQuestion];

  const handleSubmit = () => {
    if (selectedAnswer === null || !question) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed - use current score (already incremented in handleSubmit)
      setFinalScore({ score: score, total: quizQuestions.length });
      setShowCompletion(true);
      
      // Save to history
      const newHistoryEntry: QuizHistory = {
        id: Date.now().toString(),
        topic: quizPrompt || "General Climate Topics",
        prompt: quizPrompt,
        score: score,
        totalQuestions: quizQuestions.length,
        completedAt: Date.now(),
        questions: quizQuestions,
      };
      
      setQuizHistory((prev) => [newHistoryEntry, ...prev]);
    }
  };

  const handleStartNewQuiz = () => {
    setShowCompletion(false);
    setFinalScore(null);
    setQuizStarted(false);
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizPrompt("");
  };

  const handleDeleteHistory = (id: string) => {
    setQuizHistory((prev) => prev.filter((quiz) => quiz.id !== id));
  };

  // Load quiz history from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const history = JSON.parse(stored) as QuizHistory[];
        setQuizHistory(history);
      } catch (error) {
        console.error("Error loading quiz history from storage:", error);
      }
    }
  }, []);

  // Save quiz history to local storage whenever it changes
  useEffect(() => {
    if (quizHistory.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quizHistory));
    }
  }, [quizHistory]);

  // Rotate educational tips during loading
  useEffect(() => {
    if (isGenerating) {
      let tipIndex = 0;
      setLoadingTip(loadingTips[tipIndex]);
      const interval = setInterval(() => {
        tipIndex = (tipIndex + 1) % loadingTips.length;
        setLoadingTip(loadingTips[tipIndex]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const callGeminiAPI = async (prompt: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file");
    }

    const modelConfigs = [
      { model: "gemini-2.0-flash-exp", version: "v1beta" },
      { model: "gemini-2.0-flash-lite", version: "v1" },
      { model: "gemini-1.5-flash", version: "v1" },
      { model: "gemini-pro", version: "v1" },
    ];

    const systemPrompt = `You are a climate education quiz generator. Generate exactly 5 multiple-choice questions about climate change based on the user's prompt.

Return ONLY a valid JSON array with this exact structure (no markdown, no code blocks, just pure JSON):
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this answer is correct"
  },
  ...
]

Rules:
- Generate exactly 5 questions
- Each question must have exactly 4 options
- correctAnswer is the index (0-3) of the correct option - MUST be a valid index (0, 1, 2, or 3)
- Make questions educational and relevant to climate change
- If the user's prompt is vague, create questions about general climate science
- Ensure explanations are clear and educational
- IMPORTANT: Verify that correctAnswer matches one of the options indices (0-3)
- Ensure all options are distinct and plausible

User prompt: ${prompt || "general climate change topics"}`;

    let lastError: Error | null = null;

    for (const config of modelConfigs) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: systemPrompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          lastError = new Error(errorData.error?.message || `API error: ${response.status}`);
          continue;
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
        throw new Error("Unexpected response format from Gemini API");
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`Failed with model ${config.model}, trying next...`, error);
        continue;
      }
    }

    throw lastError || new Error("All Gemini models failed. Please check your API key and available models.");
  };

  const handleGenerateQuiz = async () => {
    if (!quizPrompt.trim()) {
      setError("Please enter a topic for the quiz");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setQuizStarted(false);
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);

    try {
      const response = await callGeminiAPI(quizPrompt);
      
      // Clean the response - remove markdown code blocks if present
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
      }
      
      // Parse JSON
      const questions = JSON.parse(cleanedResponse) as QuizQuestion[];
      
      // Validate and format questions
      const formattedQuestions: QuizQuestion[] = questions.slice(0, 5).map((q, index) => {
        const options = q.options.slice(0, 4); // Ensure exactly 4 options
        // Ensure correctAnswer is a valid index (0-3)
        let correctAnswer = Math.max(0, Math.min(3, Math.floor(q.correctAnswer)));
        // If correctAnswer is out of bounds, default to 0
        if (correctAnswer < 0 || correctAnswer >= options.length) {
          correctAnswer = 0;
        }
        return {
          id: index + 1,
          question: q.question,
          options: options,
          correctAnswer: correctAnswer,
          explanation: q.explanation,
        };
      });

      if (formattedQuestions.length === 0) {
        throw new Error("No questions were generated. Please try again.");
      }

      setQuizQuestions(formattedQuestions);
      setQuizStarted(true);
      setCurrentQuestion(0);
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate quiz. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

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
                  <SidebarMenuButton asChild className="glass-transition">
                    <Link to="/chat" className="flex items-center gap-2 w-full">
                      <MessageSquare className="h-4 w-4" />
                      <span>Chat</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuButton className="bg-primary/20 border-primary/40 glass-transition" disabled>
                    <div className="flex items-center gap-2 w-full">
                      <BookOpen className="h-4 w-4" />
                      <span>Quiz</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel className="text-foreground/80 mb-2">Quiz Progress</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    {quizStarted && quizQuestions.length > 0 ? (
                      <>
                        Question {currentQuestion + 1} of {quizQuestions.length}
                      </>
                    ) : (
                      "No quiz started"
                    )}
                  </div>
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    Score: <span className="font-semibold text-accent">{score}</span>
                  </div>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel className="text-foreground/80 mb-2">Quiz History</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {quizHistory.length === 0 ? (
                    <div className="px-2 py-2 text-sm text-muted-foreground">
                      No quiz history yet
                    </div>
                  ) : (
                    quizHistory
                      .sort((a, b) => b.completedAt - a.completedAt)
                      .map((quiz) => (
                        <div
                          key={quiz.id}
                          className="flex items-center gap-2 p-2 rounded-lg mb-1 glass-transition hover:bg-primary/10 group"
                        >
                          <Trophy className="h-3 w-3 flex-shrink-0 text-accent" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-foreground truncate" title={quiz.topic}>
                              {quiz.topic}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {quiz.score}/{quiz.totalQuestions} • {new Date(quiz.completedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/20"
                            onClick={() => handleDeleteHistory(quiz.id)}
                            title="Delete Quiz"
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
              <h1 className="text-xl font-bold text-foreground">ClimateSage Quiz</h1>
              <div className="ml-auto">
                <Link to="/">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Home className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          {/* Quiz Content */}
          <main className="flex-1 overflow-y-auto px-4 py-8">
            <div className="container mx-auto max-w-3xl">
              {/* Quiz Prompt Input */}
              {!quizStarted && !showCompletion && (
                <Card className="mb-6 p-6">
                  <h2 className="text-xl font-bold mb-4 text-foreground">Generate Your Quiz</h2>
                  <p className="text-muted-foreground mb-4">
                    Enter a topic or question to generate 5 climate-related quiz questions
                  </p>
                  <div className="flex gap-3 mb-4">
                    <Input
                      value={quizPrompt}
                      onChange={(e) => setQuizPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleGenerateQuiz()}
                      placeholder="e.g., renewable energy, greenhouse gases, climate policy..."
                      className="flex-1"
                      disabled={isGenerating}
                    />
                    <Button
                      onClick={handleGenerateQuiz}
                      variant="elevated"
                      size="lg"
                      className="text-accent hover:text-accent/80"
                      disabled={isGenerating || !quizPrompt.trim()}
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      {isGenerating ? "Generating..." : "Generate Quiz"}
                    </Button>
                  </div>
                  
                  {error && (
                    <Card className="p-4 bg-destructive/10 border-destructive/40">
                      <p className="text-destructive text-sm">{error}</p>
                    </Card>
                  )}

                  {isGenerating && (
                    <Card className="p-6 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-4" />
                      <p className="text-foreground mb-2">Generating your quiz...</p>
                      {loadingTip && (
                        <p className="text-sm text-muted-foreground italic">
                          💡 {loadingTip}
                        </p>
                      )}
                    </Card>
                  )}
                </Card>
              )}

              {/* Quiz Questions */}
              {quizStarted && quizQuestions.length > 0 && question && (
                <>
                  {/* Score Display - Glassmorphic */}
                  <Card className="mb-6 p-4 text-center">
                    <p className="text-base text-foreground">
                      Question <span className="font-bold text-accent">{currentQuestion + 1}</span> of <span className="font-bold">{quizQuestions.length}</span> | 
                      Score: <span className="font-bold text-accent">{score}</span>
                    </p>
                  </Card>

              {/* Question Card - Glassmorphic */}
              <Card className="p-6 mb-6">
          <h2 className="text-lg font-bold mb-6 text-foreground">{question.question}</h2>

          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            className="space-y-4"
          >
            {question.options.map((option, index) => (
              <Card
                key={index}
                className={`p-4 cursor-pointer glass-transition ${
                  selectedAnswer === index
                    ? "bg-primary/20 border-primary/40 scale-105"
                    : ""
                }`}
                onClick={() => setSelectedAnswer(index)}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value={index.toString()} 
                    id={`option-${index}`}
                    className="glass"
                  />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="text-base cursor-pointer flex-1 text-foreground"
                  >
                    {option}
                  </Label>
                </div>
              </Card>
            ))}
          </RadioGroup>

          <div className="mt-8">
            {!showResult ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                variant="elevated"
                className="w-full text-accent hover:text-accent/80 disabled:opacity-50"
                size="lg"
              >
                Submit Answer
              </Button>
            ) : (
              <>
                <Card
                  className={`p-6 mb-4 ${
                    selectedAnswer === question.correctAnswer
                      ? "bg-accent/10 border-accent/40"
                      : "bg-destructive/10 border-destructive/40"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {selectedAnswer === question.correctAnswer ? (
                      <CheckCircle2 className="h-6 w-6 text-accent" />
                    ) : (
                      <XCircle className="h-6 w-6 text-destructive" />
                    )}
                    <h3 className="font-bold text-lg text-foreground">
                      {selectedAnswer === question.correctAnswer ? "Correct! ✓" : "Incorrect ✗"}
                    </h3>
                  </div>
                  <p className="text-foreground/90 mb-4">{question.explanation}</p>
                  
                  {/* Audio Player - Glassmorphic */}
                  <div className="mt-4 pt-4 border-t border-border/30">
                    <div className="glass-audio p-3 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Volume2 className="h-4 w-4 text-accent" />
                        <span className="text-sm text-muted-foreground">Audio Explanation</span>
                      </div>
                      <audio controls className="w-full">
                        <source src="#" type="audio/mpeg" />
                        Audio explanation will be available when backend is connected.
                      </audio>
                    </div>
                  </div>
                </Card>

                <Button
                  onClick={handleNext}
                  variant="elevated"
                  className="w-full text-foreground hover:text-accent"
                  size="lg"
                >
                  {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              </>
            )}
              </div>
            </Card>
                </>
              )}

              {/* Quiz Completion Card */}
              {showCompletion && finalScore && (
                <Card className="p-8 mb-6 text-center">
                  <Trophy className="h-16 w-16 text-accent mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Completed!</h2>
                  <div className="mb-6">
                    <p className="text-xl font-bold text-accent mb-2">
                      {finalScore.score} / {finalScore.total}
                    </p>
                    <p className="text-muted-foreground">
                      {Math.round((finalScore.score / finalScore.total) * 100)}% Correct
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={handleStartNewQuiz}
                      variant="elevated"
                      size="lg"
                      className="text-accent hover:text-accent/80"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start New Quiz
                    </Button>
                  </div>
                </Card>
              )}

              {/* Empty State */}
              {!quizStarted && !isGenerating && !showCompletion && quizQuestions.length === 0 && (
                <Card className="p-8 text-center">
                  <BookOpen className="h-16 w-16 text-accent mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-bold text-foreground mb-2">Ready to Test Your Knowledge?</h3>
                  <p className="text-muted-foreground">
                    Enter a topic above to generate a personalized climate quiz
                  </p>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Quiz;
