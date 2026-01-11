import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, LogOut, MapPin, Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import Footer from "@/components/footer";


export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <MapPin className="h-6 w-6" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-foreground">
            InfraAlert
          </span>
        </div>
        
        <div className="space-y-1">
          <Link href="/dashboard">
            <Button
              variant={location === "/dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start gap-3 font-medium h-12"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5" />
              Overview
            </Button>
          </Link>
          
          {user?.role === "admin" && (
            <Link href="/admin">
              <Button
                variant={location === "/admin" ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 font-medium h-12"
                onClick={() => setIsOpen(false)}
              >
                <ShieldCheck className="h-5 w-5" />
                Admin Console
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="mt-auto px-6 py-8 border-t border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate capitalize">{user?.role}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 bg-white border-r border-border fixed h-full z-30">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-border z-30 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
            <MapPin className="h-5 w-5" />
          </div>
          <span className="font-display font-bold text-xl">InfraAlert</span>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content
      <main className="flex-1 md:ml-72 pt-16 md:pt-0 p-6 md:p-10 max-w-[1600px] mx-auto w-full animate-enter">
        {children}
      </main> */}
      <main className="flex-1 md:ml-72 pt-16 md:pt-0 p-6 md:p-10 max-w-[1600px] mx-auto w-full animate-enter flex flex-col">
        <div className="flex-1">
          {children}
        </div>

        <Footer />
      </main>

    </div>
  );
}
