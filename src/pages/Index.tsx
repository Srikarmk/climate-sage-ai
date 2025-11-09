import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MessageSquare, Brain, BookOpen, BarChart3, Database, TrendingUp, Users, Award, Zap, Target, Globe, Lightbulb } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-animated relative overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-12 relative">
        <div className="text-center max-w-4xl mx-auto relative z-10">
          {/* Logo/Icon - Clean with Depth */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 glass-strong rounded-full flex items-center justify-center glass-transition depth-shadow-strong">
              <Brain className="w-12 h-12 text-accent" />
            </div>
          </div>

          {/* Main Content */}
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-4">
            ClimateSage
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-8">
            Your AI Teacher for Climate Literacy
          </p>
          <p className="text-base md:text-lg text-foreground/70 mb-12 max-w-2xl mx-auto">
            Master climate science with AI-powered learning, interactive quizzes, and data-driven insights. 
            Build your knowledge and make informed decisions for our planet.
          </p>

          {/* CTA Buttons - Clean with Depth */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/chat">
              <Button
                size="lg"
                variant="elevated"
                className="text-accent hover:text-accent/80 depth-shadow"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Learning
              </Button>
            </Link>
            <Link to="/quiz">
              <Button
                size="lg"
                variant="pressed"
                className="text-foreground hover:text-accent depth-shadow"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Take Quiz
              </Button>
            </Link>
          </div>

          {/* Features - Clean Interactive Cards with Depth */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 glass-card-dark whimsical-card depth-shadow depth-glow">
              <div className="w-12 h-12 glass rounded-lg flex items-center justify-center mb-4 mx-auto depth-shadow">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">AI-Powered Learning</h3>
              <p className="text-sm text-muted-foreground">Ask questions and get instant, accurate answers about climate change</p>
            </Card>
            <Card className="p-6 glass-card-dark whimsical-card depth-shadow depth-glow">
              <div className="w-12 h-12 glass rounded-lg flex items-center justify-center mb-4 mx-auto depth-shadow">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Interactive Quizzes</h3>
              <p className="text-sm text-muted-foreground">Test your knowledge with engaging climate science questions</p>
            </Card>
            <Card className="p-6 glass-card-dark whimsical-card depth-shadow depth-glow">
              <div className="w-12 h-12 glass rounded-lg flex items-center justify-center mb-4 mx-auto depth-shadow">
                <Database className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Data-Driven</h3>
              <p className="text-sm text-muted-foreground">Learn with real climate data and scientific facts</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Learn climate science in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 glass-card-dark depth-shadow depth-glow text-center">
              <div className="w-16 h-16 glass rounded-full flex items-center justify-center mb-6 mx-auto depth-shadow">
                <MessageSquare className="w-8 h-8 text-accent" />
              </div>
              <div className="w-8 h-8 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-xl mb-3 text-foreground">Ask Questions</h3>
              <p className="text-sm text-muted-foreground">
                Start a conversation with our AI teacher. Ask anything about climate change, 
                renewable energy, or environmental science.
              </p>
            </Card>

            <Card className="p-8 glass-card-dark depth-shadow depth-glow text-center">
              <div className="w-16 h-16 glass rounded-full flex items-center justify-center mb-6 mx-auto depth-shadow">
                <Lightbulb className="w-8 h-8 text-accent" />
              </div>
              <div className="w-8 h-8 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-xl mb-3 text-foreground">Learn & Understand</h3>
              <p className="text-sm text-muted-foreground">
                Get comprehensive, easy-to-understand explanations backed by scientific data.
              </p>
            </Card>

            <Card className="p-8 glass-card-dark depth-shadow depth-glow text-center">
              <div className="w-16 h-16 glass rounded-full flex items-center justify-center mb-6 mx-auto depth-shadow">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <div className="w-8 h-8 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-xl mb-3 text-foreground">Test Your Knowledge</h3>
              <p className="text-sm text-muted-foreground">
                Take personalized quizzes to reinforce your learning and track your progress over time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Climate Education Matters
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Understanding climate change is the first step toward meaningful action
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 glass-card-dark depth-shadow depth-glow text-center">
              <div className="w-14 h-14 glass rounded-lg flex items-center justify-center mb-4 mx-auto depth-shadow">
                <TrendingUp className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-bold text-2xl mb-2 text-accent">421 ppm</h3>
              <p className="text-sm text-muted-foreground">Current CO₂ levels in the atmosphere</p>
            </Card>

            <Card className="p-6 glass-card-dark depth-shadow depth-glow text-center">
              <div className="w-14 h-14 glass rounded-lg flex items-center justify-center mb-4 mx-auto depth-shadow">
                <Globe className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-bold text-2xl mb-2 text-accent">1.5°C</h3>
              <p className="text-sm text-muted-foreground">Target limit for global warming increase</p>
            </Card>

            <Card className="p-6 glass-card-dark depth-shadow depth-glow text-center">
              <div className="w-14 h-14 glass rounded-lg flex items-center justify-center mb-4 mx-auto depth-shadow">
                <Zap className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-bold text-2xl mb-2 text-accent">30%</h3>
              <p className="text-sm text-muted-foreground">CO₂ absorbed by oceans annually</p>
            </Card>

            <Card className="p-6 glass-card-dark depth-shadow depth-glow text-center">
              <div className="w-14 h-14 glass rounded-lg flex items-center justify-center mb-4 mx-auto depth-shadow">
                <Users className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-bold text-2xl mb-2 text-accent">97%</h3>
              <p className="text-sm text-muted-foreground">Of climate scientists agree on human impact</p>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="p-8 glass-card-dark depth-shadow depth-glow max-w-3xl mx-auto">
              <Award className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-bold text-2xl mb-4 text-foreground">
                Knowledge is Power
              </h3>
              <p className="text-base text-muted-foreground mb-6">
                Climate literacy empowers individuals to make informed decisions, 
                advocate for sustainable policies, and contribute to global solutions. 
                Every educated person becomes a catalyst for positive change.
              </p>
              <Link to="/chat">
                <Button
                  size="lg"
                  variant="elevated"
                  className="text-accent hover:text-accent/80 depth-shadow"
                >
                  Start Your Journey
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
