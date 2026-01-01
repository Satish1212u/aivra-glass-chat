import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { AuthModal } from "@/components/AuthModal";
import { streamChat, Message, MessageContent } from "@/lib/chat";
import { useToast } from "@/hooks/use-toast";

const GUEST_MESSAGE_LIMIT = 3;

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [guestMessageCount, setGuestMessageCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSend = async (content: string, imageDataUrl?: string) => {
    // Guest mode: allow chatting but prompt after a few messages
    if (!user) {
      const newCount = guestMessageCount + 1;
      setGuestMessageCount(newCount);
      
      if (newCount >= GUEST_MESSAGE_LIMIT) {
        // Show auth modal after limit, but still allow the message
        setTimeout(() => setShowAuthModal(true), 1000);
      }
    }

    let messageContent: string | MessageContent[];
    
    if (imageDataUrl) {
      messageContent = [
        { type: "text" as const, text: content || "What's in this image?" },
        { type: "image_url" as const, image_url: { url: imageDataUrl } }
      ];
    } else {
      messageContent = content;
    }

    const userMessage: Message = { 
      role: "user", 
      content: messageContent,
      imageUrl: imageDataUrl
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    let assistantContent = "";

    const messagesForApi = [...messages, userMessage].map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    try {
      await streamChat({
        messages: messagesForApi,
        onDelta: (chunk) => {
          assistantContent += chunk;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, i) => 
                i === prev.length - 1 ? { ...m, content: assistantContent } : m
              );
            }
            return [...prev, { role: "assistant", content: assistantContent }];
          });
        },
        onDone: () => setIsLoading(false),
      });
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          user={user}
          onMenuClick={() => setIsSidebarOpen(true)}
          onAuthClick={() => setShowAuthModal(true)}
          onLogout={async () => {
            await supabase.auth.signOut();
            setMessages([]);
          }}
        />
        
        <main className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <WelcomeScreen onSuggestionClick={handleSend} />
          ) : (
            <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">A</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
        
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        isGuestPrompt={!user && guestMessageCount >= GUEST_MESSAGE_LIMIT}
      />
    </div>
  );
};

export default Index;
