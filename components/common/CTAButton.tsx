import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface CTAButtonProps {
  text: string
  href: string
  variant?: 'primary' | 'secondary'
  className?: string
}

/**
 * CTAButton - Consolidated to use main Button component
 * Maintains backward compatibility while using unified button system
 */
export function CTAButton({ text, href, variant = 'primary', className = '' }: CTAButtonProps) {
  // Map CTAButton variants to Button component variants
  const buttonVariant = variant === 'primary' ? 'default' : 'outline'
  
  return (
    <Button 
      asChild
      variant={buttonVariant}
      className={cn(
        variant === 'primary' && 'shadow-lg hover:shadow-xl',
        className
      )}
    >
      <Link href={href}>
        {text}
      </Link>
    </Button>
  )
}

interface CategoryCTAProps {
  categoryName: string
  description: string
  href: string
}

export function CategoryCTA({ categoryName, description, href }: CategoryCTAProps) {
  return (
    <div className="bg-gradient-to-r from-success-50 to-primary-50 dark:from-success-900/20 dark:to-primary-900/20 rounded-xl p-8 text-center">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Explore {categoryName}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
        {description}
      </p>
      <CTAButton 
        text={`View All ${categoryName} Articles`}
        href={href}
        variant="primary"
      />
    </div>
  )
}

export default CTAButton
