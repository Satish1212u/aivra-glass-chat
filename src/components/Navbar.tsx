import { User } from "@supabase/supabase-js";
import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  user: User | null;
  onMenuClick: () => void;
  onAuthClick: () => void;
  onLogout: () => void;
}

export function Navbar({ user, onMenuClick, onAuthClick, onLogout }: NavbarProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border/50">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center ai-glow">
            <span className="text-sm font-bold text-primary-foreground">A</span>
          </div>
          <span className="font-semibold text-foreground">Aivra</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={onAuthClick}>
            <UserIcon className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
