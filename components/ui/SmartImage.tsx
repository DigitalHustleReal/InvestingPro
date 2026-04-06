"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { resolveFeaturedImage } from "@/lib/media/image-resolver";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartImageProps {
  src: string | null | undefined;
  alt?: string;
  category?: string;
  className?: string;
  fallbackUrl?: string;
  showPlaceholder?: boolean;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

/**
 * SmartImage Component
 *
 * Wraps next/image with automatic URL resolution and graceful fallback.
 * Handles 404 errors by attempting a fallback URL or showing a consistent placeholder.
 */
export default function SmartImage({
  src,
  alt = "",
  category,
  className,
  fallbackUrl = "https://images.unsplash.com/photo-1611974714024-462740941821?w=400&h=400&fit=crop&auto=format&q=80",
  showPlaceholder = true,
  width,
  height,
  fill = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
}: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  // Initial resolution
  useEffect(() => {
    const resolved = resolveFeaturedImage(src, category);
    setCurrentSrc(resolved);
    setHasError(false);
  }, [src, category]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Try the secondary fallback if the first resolution failed
      setCurrentSrc(fallbackUrl);
    }
  };

  if (hasError && !showPlaceholder && !currentSrc) {
    return null;
  }

  if (!currentSrc || (hasError && currentSrc === fallbackUrl && !currentSrc)) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200",
          className,
        )}
      >
        <FileText className="w-1/3 h-1/3 text-gray-400/50" />
      </div>
    );
  }

  // Determine if it's an external URL (Unsplash, etc.) or local
  const isExternal =
    currentSrc.startsWith("http://") || currentSrc.startsWith("https://");

  // For fill mode (default) — parent must have relative positioning
  if (fill && !width && !height) {
    return (
      <Image
        src={currentSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={cn("object-cover", className)}
        onError={handleError}
        loading={priority ? undefined : "lazy"}
        priority={priority}
        {...(isExternal ? { unoptimized: false } : {})}
      />
    );
  }

  // For explicit width/height mode
  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={width || 400}
      height={height || 300}
      sizes={sizes}
      className={cn("object-cover", className)}
      onError={handleError}
      loading={priority ? undefined : "lazy"}
      priority={priority}
      {...(isExternal ? { unoptimized: false } : {})}
    />
  );
}
