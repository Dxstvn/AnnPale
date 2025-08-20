import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-purple-600 text-white [a&]:hover:bg-purple-700",
        secondary:
          "border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 [a&]:hover:bg-gray-200 dark:[a&]:hover:bg-gray-700",
        destructive:
          "border-transparent bg-red-500 text-white [a&]:hover:bg-red-600 dark:bg-red-600 dark:[a&]:hover:bg-red-700",
        danger:
          "border-transparent bg-red-500 text-white [a&]:hover:bg-red-600",
        success:
          "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-white [a&]:hover:bg-yellow-600",
        info:
          "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600",
        outline:
          "text-foreground border-current [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
