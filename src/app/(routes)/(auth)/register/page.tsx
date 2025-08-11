"use client";

import React, { useState } from "react";

// shadcn Input
import PasswordStrengthBar from "@/components/auth/password-strength-bar";
import { Input } from "@/components/ui/input";

export default function PasswordTestPage() {
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow">
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Enter Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <PasswordStrengthBar password={password} />
      </div>
    </div>
  );
}
