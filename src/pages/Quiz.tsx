import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

// Sample quiz data (will be replaced with real data later)
const quizQuestions = [
  {
    id: 1,
    question: "What is the main greenhouse gas responsible for climate change?",
    options: [
      "Oxygen",
      "Carbon Dioxide",
      "Nitrogen",
      "Hydrogen",
    ],
    correctAnswer: 1,
    explanation: "Carbon dioxide (CO₂) is the primary greenhouse gas emitted through human activities, mainly from burning fossil fuels.",
  },
  {
    id: 2,
    question: "What percentage of climate scientists agree that humans are causing global warming?",
    options: [
      "50-60%",
      "70-80%",
      "90-95%",
      "97-99%",
    ],
    correctAnswer: 3,
    explanation: "Multiple studies show that 97-99% of actively publishing climate scientists agree that climate-warming trends are extremely likely due to human activities.",
  },
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const question = quizQuestions[currentQuestion];

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

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
      // Quiz completed
      alert(`Quiz completed! Your score: ${score + (selectedAnswer === question.correctAnswer ? 1 : 0)}/${quizQuestions.length}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">ClimateSage Quiz</h1>
          <Link to="/">
            <Button variant="ghost" size="icon">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Quiz Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Score Display */}
        <div className="mb-6 text-center">
          <p className="text-lg text-muted-foreground">
            Question {currentQuestion + 1} of {quizQuestions.length} | Score: {score}
          </p>
        </div>

        {/* Question Card */}
        <Card className="p-8 shadow-medium gradient-card mb-6">
          <h2 className="text-2xl font-bold mb-6">{question.question}</h2>

          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
          >
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-lg cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="mt-8">
            {!showResult ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="w-full bg-accent hover:bg-accent/90"
                size="lg"
              >
                Submit Answer
              </Button>
            ) : (
              <>
                <Card
                  className={`p-6 mb-4 ${
                    selectedAnswer === question.correctAnswer
                      ? "bg-accent/10 border-accent"
                      : "bg-destructive/10 border-destructive"
                  }`}
                >
                  <h3 className="font-bold text-xl mb-2">
                    {selectedAnswer === question.correctAnswer ? "Correct! ✓" : "Incorrect ✗"}
                  </h3>
                  <p className="text-foreground/90">{question.explanation}</p>
                  
                  {/* Audio Player Placeholder */}
                  <div className="mt-4">
                    <audio controls className="w-full">
                      <source src="#" type="audio/mpeg" />
                      Audio explanation will be available when backend is connected.
                    </audio>
                  </div>
                </Card>

                <Button
                  onClick={handleNext}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              </>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Quiz;
