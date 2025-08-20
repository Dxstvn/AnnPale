import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle } from "lucide-react"

const textareaVariants = cva(
  "flex w-full rounded-lg border bg-transparent text-base transition-all placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 outline-none resize-vertical",
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
      textareaSize: {
        sm: "px-3 py-2 text-sm min-h-[80px]",
        default: "px-4 py-3 text-base min-h-[100px]",
        lg: "px-5 py-4 text-lg min-h-[120px]",
      },
    },
    defaultVariants: {
      variant: "default",
      textareaSize: "default",
    },
  }
)

export interface TextareaProps 
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: string
  success?: string
  showCount?: boolean
  maxLength?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant, 
    textareaSize,
    error,
    success,
    showCount,
    maxLength,
    ...props 
  }, ref) => {
    const [charCount, setCharCount] = React.useState(0)
    
    // Determine variant based on error/success states
    const computedVariant = error ? "error" : success ? "success" : variant

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (showCount) {
        setCharCount(e.target.value.length)
      }
      props.onChange?.(e)
    }

    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            textareaVariants({ variant: computedVariant, textareaSize }),
            showCount && "pb-8",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : success ? `${props.id}-success` : undefined}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
        
        {/* Character count */}
        {showCount && (
          <div className={cn(
            "absolute bottom-2 right-2 text-xs text-gray-500",
            maxLength && charCount >= maxLength && "text-red-500"
          )}>
            {charCount}{maxLength && `/${maxLength}`}
          </div>
        )}
        
        {/* Status icons */}
        <div className="absolute top-3 right-3">
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
Textarea.displayName = "Textarea"

// Auto-resize Textarea
interface AutoResizeTextareaProps extends TextareaProps {
  minRows?: number
  maxRows?: number
}

const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
  ({ minRows = 3, maxRows = 10, className, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
    
    const adjustHeight = () => {
      const textarea = textareaRef.current
      if (!textarea) return
      
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'
      
      // Calculate new height
      const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight)
      const minHeight = minRows * lineHeight
      const maxHeight = maxRows * lineHeight
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
      
      textarea.style.height = `${newHeight}px`
    }
    
    React.useEffect(() => {
      adjustHeight()
    }, [props.value])
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      adjustHeight()
      props.onChange?.(e)
    }
    
    return (
      <Textarea
        ref={(element) => {
          textareaRef.current = element
          if (typeof ref === 'function') {
            ref(element)
          } else if (ref) {
            ref.current = element
          }
        }}
        className={cn("resize-none", className)}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
AutoResizeTextarea.displayName = "AutoResizeTextarea"

// Textarea with label and hint
interface TextareaGroupProps {
  children: React.ReactNode
  label?: string
  required?: boolean
  hint?: string
  className?: string
}

const TextareaGroup: React.FC<TextareaGroupProps> = ({
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

export { 
  Textarea, 
  AutoResizeTextarea, 
  TextareaGroup,
  textareaVariants 
}