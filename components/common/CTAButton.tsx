import Link from 'next/link'

interface CTAButtonProps {
  text: string
  href: string
  variant?: 'primary' | 'secondary'
  className?: string
}

export function CTAButton({ text, href, variant = 'primary', className = '' }: CTAButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200'
  
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-50'
  }
  
  return (
    <Link 
      href={href}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {text}
    </Link>
  )
}

interface CategoryCTAProps {
  categoryName: string
  description: string
  href: string
}

export function CategoryCTA({ categoryName, description, href }: CategoryCTAProps) {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 text-center">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Explore {categoryName}
      </h3>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
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
