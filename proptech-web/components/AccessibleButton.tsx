interface AccessibleButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  'aria-label'?: string
}

export const AccessibleButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false,
  type = 'button',
  'aria-label': ariaLabel,
  ...props 
}: AccessibleButtonProps) => {
  const baseClasses = "px-4 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300"
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  )
}
