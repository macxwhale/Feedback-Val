
import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const cardVariants = cva(
  "material-card transition-all duration-200",
  {
    variants: {
      variant: {
        elevated: "elevation-1 hover:elevation-3",
        filled: "bg-surface-container",
        outlined: "border border-outline-variant bg-surface",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "outlined",
      size: "default",
    },
  }
)

export interface MaterialCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const MaterialCard = React.forwardRef<HTMLDivElement, MaterialCardProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, className }))}
      {...props}
    />
  )
)
MaterialCard.displayName = "MaterialCard"

const MaterialCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))
MaterialCardHeader.displayName = "MaterialCardHeader"

const MaterialCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-title-large text-on-surface font-medium tracking-tight",
      className
    )}
    {...props}
  />
))
MaterialCardTitle.displayName = "MaterialCardTitle"

const MaterialCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-body-medium text-on-surface-variant", className)}
    {...props}
  />
))
MaterialCardDescription.displayName = "MaterialCardDescription"

const MaterialCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
MaterialCardContent.displayName = "MaterialCardContent"

const MaterialCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
))
MaterialCardFooter.displayName = "MaterialCardFooter"

export { 
  MaterialCard, 
  MaterialCardHeader, 
  MaterialCardFooter, 
  MaterialCardTitle, 
  MaterialCardDescription, 
  MaterialCardContent,
  cardVariants
}
