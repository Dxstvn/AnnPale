import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Search, Eye, EyeOff, AlertCircle, CheckCircle, X } from "lucide-react"

const inputVariants = cva(
  "flex w-full rounded-lg border bg-transparent text-base transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 outline-none",
  {
    variants: {
      variant: {
        default: 
          "border-gray-300 dark:border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20",
        error: 
          "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 text-red-900 dark:text-red-400",
        success: 
          "border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/20",
        ghost: 
          "border-transparent bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-purple-500",
      },
      inputSize: {
        xs: "h-7 px-2 text-xs",
        sm: "h-9 px-3 text-sm",
        default: "h-11 px-4 text-base",
        lg: "h-13 px-5 text-lg",
        xl: "h-14 px-6 text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: string
  success?: string
  clearable?: boolean
  onClear?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    variant, 
    inputSize, 
    leftIcon, 
    rightIcon,
    error,
    success,
    clearable,
    onClear,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === "password"
    
    // Determine variant based on error/success states
    const computedVariant = error ? "error" : success ? "success" : variant

    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {leftIcon}
          </div>
        )}
        
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={cn(
            inputVariants({ variant: computedVariant, inputSize }),
            leftIcon && "pl-10",
            (rightIcon || isPassword || clearable) && "pr-10",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : success ? `${props.id}-success` : undefined}
          {...props}
        />
        
        {/* Right side icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {clearable && props.value && (
            <button
              type="button"
              onClick={onClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          
          {rightIcon && !isPassword && !clearable && rightIcon}
          
          {error && <AlertCircle className="h-4 w-4 text-red-500" />}
          {success && !error && <CheckCircle className="h-4 w-4 text-green-500" />}
        </div>
        
        {/* Error/Success messages */}
        {error && (
          <p id={`${props.id}-error`} className="mt-1 text-xs text-red-500">
            {error}
          </p>
        )}
        {success && !error && (
          <p id={`${props.id}-success`} className="mt-1 text-xs text-green-500">
            {success}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// Search Input Component
export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'type'> {
  onSearch?: (value: string) => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(e.currentTarget.value)
      }
    }

    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={<Search className="h-4 w-4" />}
        placeholder="Search..."
        onKeyDown={handleKeyDown}
        className={className}
        {...props}
      />
    )
  }
)
SearchInput.displayName = "SearchInput"

// Input Group Component for forms
interface InputGroupProps {
  children: React.ReactNode
  label?: string
  required?: boolean
  hint?: string
  className?: string
}

const InputGroup: React.FC<InputGroupProps> = ({
  children,
  label,
  required,
  hint,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      )}
    </div>
  )
}

// Floating Label Input
interface FloatingLabelInputProps extends InputProps {
  label: string
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)

    return (
      <div className="relative">
        <Input
          ref={ref}
          className={cn("pt-6 pb-2", className)}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false)
            setHasValue(!!e.target.value)
          }}
          onChange={(e) => {
            setHasValue(!!e.target.value)
            props.onChange?.(e)
          }}
          {...props}
        />
        <label
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            isFocused || hasValue
              ? "top-2 text-xs text-purple-600"
              : "top-1/2 -translate-y-1/2 text-base text-gray-500"
          )}
        >
          {label}
        </label>
      </div>
    )
  }
)
FloatingLabelInput.displayName = "FloatingLabelInput"

export { 
  Input, 
  SearchInput, 
  InputGroup, 
  FloatingLabelInput,
  inputVariants 
}