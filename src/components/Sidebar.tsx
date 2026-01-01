import { X, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
}

export function Sidebar({ isOpen, onClose, onNewChat }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 glass-strong flex flex-col transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        "md:flex"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <Button 
            variant="outline" 
            className="flex-1 justify-start gap-2"
            onClick={() => {
              onNewChat();
              onClose();
            }}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden ml-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-xs text-muted-foreground px-3 py-2">Today</div>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 text-left text-sm text-foreground transition-colors">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">New conversation</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
