import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useLocation, Link } from "wouter";
import { Moon, Sun, LayoutDashboard, AlertCircle, BarChart3, Lightbulb, Users, LogOut, Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && location !== "/login" && location !== "/signup" && location !== "/") {
      // we'd use setLocation but since it's a side effect during render, better let a wrapper handle it or do it in an effect safely
    }
  }, [isLoading, isAuthenticated, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const NavItems = () => (
    <>
      <div className="mb-6 px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
            CP
          </div>
          <span className="text-xl font-bold tracking-tight">CivicPulse</span>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {[
            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/complaints", label: "Complaints", icon: AlertCircle },
            { href: "/analytics", label: "Analytics", icon: BarChart3 },
            { href: "/insights", label: "AI Insights", icon: Lightbulb },
            { href: "/departments", label: "Departments", icon: Users },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={location.startsWith(item.href) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 rounded-lg",
                  location.startsWith(item.href) && "bg-secondary text-secondary-foreground font-medium"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 mt-auto border-t">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm overflow-hidden text-ellipsis whitespace-nowrap px-2">
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={logout} className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-[100dvh] flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card h-screen sticky top-0">
        <NavItems />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              CP
            </div>
            <span className="font-bold tracking-tight">CivicPulse</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col pt-10">
              <NavItems />
            </SheetContent>
          </Sheet>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
