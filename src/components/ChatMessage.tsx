import { User, Sparkles } from "lucide-react";
import { Message, MessageContent } from "@/lib/chat";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  
  const getTextContent = (content: string | MessageContent[]): string => {
    if (typeof content === "string") return content;
    const textPart = content.find(c => c.type === "text");
    return textPart?.type === "text" ? textPart.text : "";
  };

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isUser 
          ? "bg-secondary" 
          : "bg-gradient-to-br from-primary to-accent"
      }`}>
        {isUser ? (
          <User className="h-4 w-4 text-foreground" />
        ) : (
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="text-sm font-medium text-foreground">
          {isUser ? "You" : "Aivra"}
        </div>
        
        {/* Show image if present */}
        {message.imageUrl && (
          <img 
            src={message.imageUrl} 
            alt="Uploaded" 
            className="max-w-sm rounded-lg border border-border/50"
          />
        )}
        
        {/* Message text */}
        <div className="text-foreground whitespace-pre-wrap">
          {getTextContent(message.content)}
        </div>
      </div>
    </div>
  );
}
