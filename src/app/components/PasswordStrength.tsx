import { passwordStrength } from "check-password-strength";
import { cn } from "clsx-tailwind-merge";
import { div } from "framer-motion/client";
import React from "react";
import { array } from "zod";
interface PasswordStrengthProps {
  passStrength: number;
  message: string;
}

export default function PasswordStrength({
  passStrength,
  message,
}: PasswordStrengthProps) {
  return (
    <div className='col-span-2 '>
      <div className={cn("flex gap-2", {})}>
        {Array.from({ length: passStrength + 1 }).map((i, index) => (
          <div
            className={cn("h-2 w-32 rounded-md", {
              "bg-red-500": passStrength === 0,
              "bg-orange-500": passStrength === 1,
              "bg-yellow-500 ": passStrength === 2,
              "bg-green-500": passStrength === 3,
            })}
            key={index}
          ></div>
        ))}
      </div>
      <p
        className={cn("font-normal text-sm mt-2", {
          "text-red-500": passStrength === 0,
          "text-orange-500": passStrength === 1,
          "text-yellow-500 ": passStrength === 2,
          "text-green-500": passStrength === 3,
        })}
      >
        {message}
      </p>
    </div>
  );
}
