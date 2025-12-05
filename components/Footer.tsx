import { Github, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full mt-20 border-t border-border/40 bg-gradient-to-b from-card/10 to-card/30 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-10">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Message */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            
            <span className="font-medium">by ProForm AI</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="font-medium">GitHub</span>
            </a>
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-border/30 my-6" />

        {/* Bottom Section */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>© {new Date().getFullYear()} ProForm AI.</p>
        </div>
      </div>
    </footer>
  );
};
