"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarStackProps {
  size?: number;
  limit?: number;
  className?: string;
}

export function AvatarStack({ size = 40, limit = 4, className }: AvatarStackProps) {
  // AI Generated "Real Human" Avatars
  const avatars = [
    '/images/avatars/avatar_indian_woman_pro_1769390234620.png',
    '/images/avatars/avatar_indian_man_young_1769390247434.png',
    '/images/avatars/avatar_indian_man_senior_1769390261893.png',
    '/images/avatars/avatar_indian_woman_student_1769390279347.png'
  ];

  return (
    <div className={cn("flex -space-x-3 overflow-hidden p-1", className)}>
      {avatars.slice(0, limit).map((src, i) => (
        <div 
            key={i} 
            className="relative inline-block rounded-full ring-2 ring-white dark:ring-gray-900 bg-gray-100"
            style={{ width: size, height: size }}
        >
          <Image
            className="h-full w-full rounded-full object-cover"
            src={src}
            alt={`User ${i + 1}`}
            width={size}
            height={size}
          />
        </div>
      ))}
      <div 
        className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 ring-2 ring-white dark:ring-gray-900 border border-gray-200 dark:border-gray-700 font-medium text-xs text-gray-600 dark:text-gray-300"
        style={{ width: size, height: size }}
      >
        +2M
      </div>
    </div>
  );
}
