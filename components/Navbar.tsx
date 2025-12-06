"use client";

import { Dumbbell, Home, UtensilsCrossed, Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoBarbellSharp } from "react-icons/io5";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: UtensilsCrossed, label: "Meal Plan", path: "/meal-plan" },
  { icon: Dumbbell, label: "Workout", path: "/workout-plan" },
  { icon: Calendar, label: "Overview", path: "/overview" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navbar - Top */}
      <nav className="hidden md:block sticky top-0 z-50 w-full border-b border-transparent bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary">
                <IoBarbellSharp className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">ProForm AI</span>
            </Link>

            {/* Desktop Menu */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Top Bar - Logo Only */}
      <nav className="md:hidden sticky top-0 z-50 w-full border-b border-transparent bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">FitMaster AI</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-xl">
        <div className="flex items-center justify-around px-0 smpx-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all flex-1 max-w-[80px]",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className=" h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

   
    </>
  );
};