import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-purple-500/20 focus-visible:ring-offset-2 active:scale-[0.98] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:translate-y-[-2px]",
        primary:
          "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md hover:shadow-lg hover:translate-y-[-2px] hover:from-purple-700 hover:to-pink-700",
        secondary:
          "bg-purple-600 text-white shadow-md hover:bg-purple-700 hover:shadow-lg hover:translate-y-[-2px]",
        destructive:
          "bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg hover:translate-y-[-2px] focus-visible:ring-red-500/20",
        danger:
          "bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg hover:translate-y-[-2px]",
        success:
          "bg-green-600 text-white shadow-md hover:bg-green-700 hover:shadow-lg hover:translate-y-[-2px]",
        outline:
          "border-2 border-purple-600 bg-transparent text-purple-600 hover:bg-purple-600 hover:text-white hover:shadow-md hover:translate-y-[-2px]",
        ghost:
          "hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300",
        link: "text-purple-600 underline-offset-4 hover:underline dark:text-purple-400",
      },
      size: {
        xs: "h-7 px-2.5 text-xs gap-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 px-3.5 text-sm gap-1.5",
        default: "h-11 px-5 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-[52px] px-8 text-base",
        xl: "h-[60px] px-10 text-lg font-semibold",
        icon: "size-11",
        "icon-xs": "size-7",
        "icon-sm": "size-9",
        "icon-lg": "size-[52px]",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    // Disable button when loading
    const isDisabled = disabled || loading

    // When using asChild, we need to pass all props through the Slot
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(
            buttonVariants({ variant, size, fullWidth, className }),
            loading && "opacity-70 cursor-wait"
          )}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        ref={ref}
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size, fullWidth, className }),
          loading && "opacity-70 cursor-wait"
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 className="animate-spin" aria-hidden="true" />
        )}
        {!loading && leftIcon && (
          <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
