import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: number;
  showCount?: boolean;
  count?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

export default function RatingStars({
  rating,
  max = 5,
  size = 16,
  showCount = false,
  count = 0,
  interactive = false,
  onRate,
  className = ""
}: RatingStarsProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(max)].map((_, i) => {
        const value = i + 1;
        const isFilled = value <= rating;
        
        return (
          <Star
            key={i}
            size={size}
            className={`
              ${isFilled ? 'fill-accent-400 text-accent-400' : 'text-gray-300 dark:text-gray-600'}
              ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
            `}
            onClick={() => interactive && onRate && onRate(value)}
          />
        );
      })}
      
      {showCount && (
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-600">
          ({count} reviews)
        </span>
      )}
    </div>
  );
}
