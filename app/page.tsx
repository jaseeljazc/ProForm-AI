'use client'
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dumbbell, UtensilsCrossed, Sparkles, TrendingUp, Zap, Brain } from "lucide-react";
import Link from "next/link";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Meal Plans",
      description: "Get personalized nutrition plans tailored to your goals, dietary preferences, and lifestyle."
    },
    {
      icon: Zap,
      title: "Smart Workout Programs",
      description: "Custom workout routines based on your fitness level, available equipment, and training goals."
    },
    {
      icon: Sparkles,
      title: "Exercise Library",
      description: "Access thousands of exercises with detailed demonstrations, instructions, and alternatives."
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your transformation with photo tracking and detailed progress analytics."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial opacity-50"></div>
          <div className="container mx-auto px-4 py-20 md:py-32 relative">
            <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
             
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Transform Your Body <br/>with
                <span className="block gradient-text mt-2">FitMaster AI</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Your personal AI fitness coach. Get customized meal plans, intelligent workout routines, 
                and track your progress—all powered by cutting-edge artificial intelligence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/meal-plan">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 transition-opacity group">
                    <UtensilsCrossed className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Generate Meal Plan
                  </Button>
                </Link>
                <Link href="/workout-plan">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/50 hover:bg-primary/10 group">
                    <Dumbbell className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Create Workout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to
                <span className="gradient-text"> Succeed</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools and AI-driven insights to help you achieve your fitness goals faster.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={index}
                    className="glass-card p-6 hover-lift group cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-primary group-hover:animate-pulse-glow">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <Card className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial opacity-30"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Start Your
                  <span className="gradient-text"> Transformation?</span>
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands who are already achieving their fitness goals with FitMaster AI.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/meal-plan">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-primary hover:opacity-90">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/progress">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/50 hover:bg-primary/10">
                      Track Progress
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

    </div>
  );
};

export default Index;
