"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  ChevronDown,
  Coins,
  LogOut,
  Settings,
  Shield,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import type { UserProfile } from "@/types/ui";

interface HeaderProps {
  /** Current user profile */
  user: UserProfile | null;
  /** Loading state for user data */
  isLoading?: boolean;
  /** Callback for role updates */
  onRoleUpdate?: (role: UserProfile["role"]) => void;
}

/**
 * Main header component with navigation and profile dropdown
 * Includes real-time role updates and admin-specific features
 */
export function Header({ user, isLoading = false, onRoleUpdate }: HeaderProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Simulate real-time role updates (replace with actual WebSocket/Supabase listener)
  useEffect(() => {
    if (!user) return;

    // Simulated role change listener
    const checkRoleUpdates = setInterval(() => {
      // In production, this would be a real-time listener
      // For now, we'll just demonstrate the UI update capability
      console.log("Checking for role updates...");
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkRoleUpdates);
  }, [user, onRoleUpdate]);

  /**
   * Handle sign out
   */
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await authClient.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  /**
   * Get user initials for avatar fallback
   */
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Get role badge variant
   */
  const getRoleBadgeVariant = (
    role: UserProfile["role"],
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case "admin":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-sm">
              <Coins className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Emetals</span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              href="/products"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Contact
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="text-muted-foreground hover:text-foreground flex items-center text-sm font-medium transition-colors"
              >
                <Shield className="mr-1 h-3.5 w-3.5" />
                Admin
              </Link>
            )}
          </nav>

          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="bg-muted h-9 w-9 animate-pulse rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative flex items-center space-x-2 px-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="from-primary/20 to-primary/30 bg-gradient-to-br">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden flex-col items-start md:flex">
                      <span className="text-sm font-medium">{user.name}</span>
                      <Badge
                        variant={getRoleBadgeVariant(user.role)}
                        className="h-4 px-1.5 text-[10px] font-normal"
                      >
                        {user.role}
                      </Badge>
                    </div>
                    <ChevronDown className="text-muted-foreground h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {user.name}
                      </p>
                      <p className="text-muted-foreground text-xs leading-none">
                        {user.email}
                      </p>
                      <Badge
                        variant={getRoleBadgeVariant(user.role)}
                        className="mt-1 h-5 w-fit px-2 text-[11px]"
                      >
                        {user.role === "admin" ? "Administrator" : "Customer"}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* User Menu Items */}
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* Admin-only Menu Items */}
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin/products" className="cursor-pointer">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Manage Products</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/orders" className="cursor-pointer">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>View Orders</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
