import React from "react";

import clsx from "clsx";
import { motion } from "framer-motion";

type Strength = {
  score: number; // 0..4
  label: string;
  hint?: string;
  color: string; // tailwind color class (bg-...)
  width: number; // percentage
};

function analyzePassword(password: string): Strength {
  if (!password || password.length === 0) {
    return {
      score: 0,
      label: "Too short",
      hint: "Type a password",
      color: "bg-gray-200",
      width: 0,
    };
  }

  let score = 0;

  // length
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // variety
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const varietyCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(
    Boolean,
  ).length;
  if (varietyCount >= 2) score++;
  if (varietyCount >= 3) score++;

  // cap score between 0 and 4
  score = Math.min(4, Math.max(0, score));

  const map: Record<number, Omit<Strength, "width">> = {
    0: {
      score: 0,
      label: "Very weak",
      hint: "Too short or empty",
      color: "bg-red-300",
    },
    1: {
      score: 1,
      label: "Weak",
      hint: "Add more characters and variety",
      color: "bg-red-400",
    },
    2: {
      score: 2,
      label: "Okay",
      hint: "Add numbers and symbols",
      color: "bg-yellow-300",
    },
    3: {
      score: 3,
      label: "Good",
      hint: "Use more length or different character types",
      color: "bg-emerald-300",
    },
    4: {
      score: 4,
      label: "Strong",
      hint: "Nice — hard to guess",
      color: "bg-green-500",
    },
  };

  const base = map[score];
  const width = Math.round((score / 4) * 100);

  return {
    score,
    label: base.label,
    hint: base.hint,
    color: base.color,
    width,
  };
}

export default function PasswordStrengthBar({
  password,
  className,
  showHint = true,
}: {
  password: string;
  className?: string;
  showHint?: boolean;
}) {
  const { label, hint, color, width } = analyzePassword(password);

  return (
    <div className={clsx("w-full", className)}>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        {/* Background track */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className={clsx("h-3 rounded-full", color)}
          aria-hidden
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[13px]">
        <div className="flex items-center gap-2">
          {/* visual micro-bars like shadcn */}
          <div className="flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className={clsx(
                  "block h-2 w-6 rounded-sm",
                  i < Math.ceil((width / 100) * 4) ? color : "bg-slate-200",
                )}
              />
            ))}
          </div>
          {showHint && <div className="text-slate-500">{hint}</div>}
        </div>

        <div className="text-xs text-slate-500">{width}%</div>
      </div>

      {/* Accessibility: hidden live region to announce changes */}
      <div aria-live="polite" className="sr-only">
        {`${label}, ${width}%`}
      </div>
    </div>
  );
}
