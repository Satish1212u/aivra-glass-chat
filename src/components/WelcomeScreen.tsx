import { Sparkles, Image, Code, Lightbulb } from "lucide-react";

interface WelcomeScreenProps {
  onSuggestionClick: (message: string) => void;
}

const suggestions = [
  { icon: Sparkles, text: "Write a story about a robot" },
  { icon: Image, text: "Describe an image for me" },
  { icon: Code, text: "Help me write code" },
  { icon: Lightbulb, text: "Give me creative ideas" },
];

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <div className="text-center space-y-6 max-w-2xl">
        {/* AI Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center ai-glow">
          <Sparkles className="h-10 w-10 text-primary-foreground" />
        </div>
        
        {/* Greeting */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            👋 Hi, I'm Aivra
          </h1>
          <p className="text-xl text-muted-foreground">
            What can I help you with today?
          </p>
        </div>
        
        {/* Suggestion chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="flex items-center gap-3 p-4 rounded-xl glass hover:bg-secondary/30 transition-all text-left group"
            >
              <suggestion.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm text-foreground">{suggestion.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
