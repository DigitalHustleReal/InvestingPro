'use client';

/**
 * Testimonials Carousel Component
 * Displays customer testimonials in a rotating carousel
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  avatar_url?: string;
  featured: boolean;
}

interface TestimonialsCarouselProps {
  featured?: boolean;
  limit?: number;
  autoRotate?: boolean;
  rotateInterval?: number; // in milliseconds
}

export default function TestimonialsCarousel({
  featured = true,
  limit = 5,
  autoRotate = true,
  rotateInterval = 5000
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch testimonials
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ['testimonials', featured, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (featured) params.append('featured', 'true');
      if (limit) params.append('limit', limit.toString());
      
      const response = await fetch(`/api/testimonials?${params}`);
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      return response.json();
    }
  });

  // Auto-rotate testimonials
  useEffect(() => {
    if (!autoRotate || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  if (isLoading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          What Our Users Say
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Join thousands of satisfied users making smarter financial decisions
        </p>
      </div>

      {/* Testimonial Card */}
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 md:p-12">
        {/* Quote Icon */}
        <div className="absolute top-6 left-6 text-primary-200 dark:text-primary-900 opacity-20">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Rating */}
          <div className="flex items-center justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < currentTestimonial.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Testimonial Text */}
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 text-center mb-8 leading-relaxed">
            "{currentTestimonial.content}"
          </p>

          {/* Author */}
          <div className="flex items-center justify-center gap-4">
            {currentTestimonial.avatar_url && (
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-primary-100 dark:ring-primary-900">
                <Image
                  src={currentTestimonial.avatar_url}
                  alt={currentTestimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="text-left">
              <p className="font-bold text-lg text-slate-900 dark:text-white">
                {currentTestimonial.name}
              </p>
              {currentTestimonial.role && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {currentTestimonial.role}
                  {currentTestimonial.company && ` at ${currentTestimonial.company}`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {testimonials.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white dark:bg-slate-700 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white dark:bg-slate-700 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {testimonials.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary-600 w-8'
                  : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
