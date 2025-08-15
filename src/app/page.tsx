"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { ArrowRight, Shield, TrendingUp, Zap } from "lucide-react";

import { Header } from "@/components/home/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types/ui";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  /**
   * Fetch user session
   */
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoadingSession(true);
        const response = await authClient.getSession();

        if (response.data?.user) {
          setUser({
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: (response.data.user.role || "user") as UserProfile["role"],
            image: response.data.user.image || undefined,
            createdAt: new Date(response.data.user.createdAt || Date.now()),
            emailVerified: response.data.user.emailVerified || false,
          });
        }
      } catch {
        // Session fetch failed - user is not logged in
        console.log("No active session");
      } finally {
        setIsLoadingSession(false);
      }
    };

    fetchSession();
  }, []);

  /**
   * Handle real-time role updates
   */
  const handleRoleUpdate = (newRole: UserProfile["role"]) => {
    if (user) {
      setUser({ ...user, role: newRole });
      console.log(`Role updated to: ${newRole}`);
    }
  };

  /**
   * Feature cards for the hero section
   */
  const features = [
    {
      icon: TrendingUp,
      title: "Live Pricing",
      description: "Real-time market prices updated every minute",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Bank-level security with Stripe payments",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Insured shipping or local pickup available",
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <Header
        user={user}
        isLoading={isLoadingSession}
        onRoleUpdate={handleRoleUpdate}
      />

      {/* Hero Section */}
      <section className="from-muted/50 to-background border-b bg-gradient-to-b">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-6xl">
              Invest in{" "}
              <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                Precious Metals
              </span>
            </h1>
            <p className="text-muted-foreground mb-8 text-lg lg:text-xl">
              Buy gold, silver, platinum, and palladium bars with live market
              pricing. Secure, transparent, and delivered to your door.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="gap-2"
                onClick={() => {
                  const element = document.getElementById("products");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 grid gap-6 sm:grid-cols-3"
          >
            {features.map((feature, index) => (
              <Card key={index} className="border-muted">
                <CardHeader>
                  <feature.icon className={cn("mb-2 h-8 w-8", feature.color)} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
