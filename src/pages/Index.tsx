import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, Brain } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="text-center max-w-3xl mx-auto">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-medium">
            <Brain className="w-10 h-10 text-accent-foreground" />
          </div>
        </div>

        {/* Main Content */}
        <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
          ClimateSage
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-12">
          Your AI Teacher for Climate Literacy
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/chat">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg shadow-medium"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Learning
            </Button>
          </Link>
          <Link to="/quiz">
            <Button
              size="lg"
              variant="outline"
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 px-8 py-6 text-lg"
            >
              Take Quiz
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-primary-foreground/80">
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-2">AI-Powered Learning</h3>
            <p className="text-sm">Ask questions and get instant, accurate answers about climate change</p>
          </div>
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-2">Interactive Quizzes</h3>
            <p className="text-sm">Test your knowledge with engaging climate science questions</p>
          </div>
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-2">Data-Driven</h3>
            <p className="text-sm">Learn with real climate data and scientific facts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
