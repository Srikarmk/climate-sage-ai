import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MessageSquare, Brain, BookOpen, BarChart3, Database, TrendingUp, Users, Award, Zap, Target, Globe, Lightbulb } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-animated relative overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
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

          {/* Features - Horizontal Layout with Icons */}
          <div className="flex flex-col md:flex-row gap-4 mt-16 justify-center items-center">
            <div className="flex items-center gap-3 px-6 py-4 glass-card-dark rounded-xl depth-shadow">
              <div className="w-10 h-10 glass rounded-lg flex items-center justify-center depth-shadow">
                <Brain className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm text-foreground">AI-Powered</h3>
                <p className="text-xs text-muted-foreground">Instant answers</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 glass-card-dark rounded-xl depth-shadow">
              <div className="w-10 h-10 glass rounded-lg flex items-center justify-center depth-shadow">
                <BarChart3 className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm text-foreground">Interactive</h3>
                <p className="text-xs text-muted-foreground">Engaging quizzes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 glass-card-dark rounded-xl depth-shadow">
              <div className="w-10 h-10 glass rounded-lg flex items-center justify-center depth-shadow">
                <Database className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm text-foreground">Data-Driven</h3>
                <p className="text-xs text-muted-foreground">Real facts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 relative bg-gradient-to-b from-transparent via-accent/5 to-transparent border-y border-border/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Learn climate science in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
            
            <div className="relative">
              <Card className="p-8 glass-strong depth-shadow depth-glow text-center border-2 border-accent/20">
                <div className="w-16 h-16 glass rounded-full flex items-center justify-center mb-6 mx-auto depth-shadow bg-accent/10">
                  <MessageSquare className="w-8 h-8 text-accent" />
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/30 text-accent font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                  1
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Ask Questions</h3>
                <p className="text-sm text-muted-foreground">
                  Start a conversation with our AI teacher. Ask anything about climate change, 
                  renewable energy, or environmental science.
                </p>
              </Card>
            </div>

            <div className="relative">
              <Card className="p-8 glass-strong depth-shadow depth-glow text-center border-2 border-accent/20">
                <div className="w-16 h-16 glass rounded-full flex items-center justify-center mb-6 mx-auto depth-shadow bg-accent/10">
                  <Lightbulb className="w-8 h-8 text-accent" />
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/30 text-accent font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                  2
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Learn & Understand</h3>
                <p className="text-sm text-muted-foreground">
                  Get comprehensive, easy-to-understand explanations backed by scientific data.
                </p>
              </Card>
            </div>

            <div className="relative">
              <Card className="p-8 glass-strong depth-shadow depth-glow text-center border-2 border-accent/20">
                <div className="w-16 h-16 glass rounded-full flex items-center justify-center mb-6 mx-auto depth-shadow bg-accent/10">
                  <Target className="w-8 h-8 text-accent" />
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/30 text-accent font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                  3
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Test Your Knowledge</h3>
                <p className="text-sm text-muted-foreground">
                  Take personalized quizzes to reinforce your learning and track your progress over time.
                </p>
              </Card>
            </div>
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

          {/* Statistics Grid - Compact Design */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="p-6 glass rounded-xl depth-shadow text-center hover:scale-105 transition-transform">
              <TrendingUp className="w-10 h-10 text-accent mx-auto mb-3" />
              <h3 className="font-bold text-3xl mb-1 text-accent">421</h3>
              <p className="text-xs text-muted-foreground">ppm CO₂</p>
            </div>

            <div className="p-6 glass rounded-xl depth-shadow text-center hover:scale-105 transition-transform">
              <Globe className="w-10 h-10 text-accent mx-auto mb-3" />
              <h3 className="font-bold text-3xl mb-1 text-accent">1.5°C</h3>
              <p className="text-xs text-muted-foreground">Target limit</p>
            </div>

            <div className="p-6 glass rounded-xl depth-shadow text-center hover:scale-105 transition-transform">
              <Zap className="w-10 h-10 text-accent mx-auto mb-3" />
              <h3 className="font-bold text-3xl mb-1 text-accent">30%</h3>
              <p className="text-xs text-muted-foreground">Ocean absorption</p>
            </div>

            <div className="p-6 glass rounded-xl depth-shadow text-center hover:scale-105 transition-transform">
              <Users className="w-10 h-10 text-accent mx-auto mb-3" />
              <h3 className="font-bold text-3xl mb-1 text-accent">97%</h3>
              <p className="text-xs text-muted-foreground">Scientific consensus</p>
            </div>
          </div>

          {/* Call to Action - Different Style */}
          <div className="mt-12 text-center">
            <div className="p-10 glass-strong rounded-2xl depth-shadow depth-glow max-w-3xl mx-auto border-2 border-accent/20">
              <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-6 bg-accent/10">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-bold text-3xl mb-4 text-foreground">
                Knowledge is Power
              </h3>
              <p className="text-base text-muted-foreground mb-8 max-w-xl mx-auto">
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
