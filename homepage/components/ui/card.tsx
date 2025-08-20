import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "flex flex-col rounded-xl border transition-all duration-200",
  {
    variants: {
      variant: {
        default: "group bg-white border-gray-200 shadow-sm hover:shadow-lg cursor-pointer",
        elevated: "group bg-white border-gray-200 shadow-md hover:shadow-xl",
        interactive: "group bg-white border-gray-200 shadow-sm hover:shadow-md hover:translate-y-[-2px] cursor-pointer",
        ghost: "border-transparent shadow-none bg-transparent",
        bordered: "bg-white border-2 border-purple-200",
        gradient: "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200",
      },
      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
      spacing: {
        none: "",
        sm: "gap-4",
        default: "gap-6",
        lg: "gap-8",
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      spacing: "default",
    },
  }
)

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, spacing, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card"
        className={cn(cardVariants({ variant, padding, spacing }), className)}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-header"
    className={cn(
      "grid auto-rows-min items-start gap-1.5 px-6 py-6",
      "has-[data-slot=card-action]:grid-cols-[1fr_auto]",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="card-title"
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-gray-900 group-hover:text-purple-600 transition-colors",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="card-description"
    className={cn("text-sm text-gray-600", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-action"
    className={cn(
      "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
      className
    )}
    {...props}
  />
))
CardAction.displayName = "CardAction"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-content"
    className={cn("px-6", className)}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-footer"
    className={cn("flex items-center px-6 py-6", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Special creator card variant
const CreatorCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    featured?: boolean
  }
>(({ className, featured = false, children, ...props }, ref) => (
  <Card
    ref={ref}
    variant={featured ? "gradient" : "interactive"}
    className={cn(
      "relative overflow-hidden",
      featured && "ring-2 ring-purple-500 ring-offset-2",
      className
    )}
    {...props}
  >
    {featured && (
      <div className="absolute top-2 right-2 z-10">
        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
          Featured
        </span>
      </div>
    )}
    {children}
  </Card>
))
CreatorCard.displayName = "CreatorCard"

// Stats card variant for dashboards
const StatsCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    trend?: "up" | "down" | "neutral"
    trendValue?: string
  }
>(({ className, trend, trendValue, children, ...props }, ref) => (
  <Card
    ref={ref}
    variant="elevated"
    className={cn("relative bg-white", className)}
    {...props}
  >
    {trend && trendValue && (
      <div className={cn(
        "absolute top-4 right-4 text-sm font-medium",
        trend === "up" && "text-green-600",
        trend === "down" && "text-red-600",
        trend === "neutral" && "text-gray-600"
      )}>
        {trend === "up" && "↑"}
        {trend === "down" && "↓"}
        {trendValue}
      </div>
    )}
    {children}
  </Card>
))
StatsCard.displayName = "StatsCard"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CreatorCard,
  StatsCard,
  cardVariants,
}