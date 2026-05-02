import { cn } from "@/lib/utils";
import { forwardRef, memo } from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hover?: boolean;
}

const CardBase = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        glass && "glass",
        hover &&
          "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-accent/30",
        className
      )}
      {...props}
    />
  )
);
CardBase.displayName = "Card";

const CardHeaderBase = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />
  )
);
CardHeaderBase.displayName = "CardHeader";

const CardTitleBase = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-xl font-bold leading-tight tracking-tight", className)}
      {...props}
    />
  )
);
CardTitleBase.displayName = "CardTitle";

const CardDescriptionBase = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescriptionBase.displayName = "CardDescription";

const CardContentBase = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContentBase.displayName = "CardContent";

const CardFooterBase = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooterBase.displayName = "CardFooter";

export const Card = memo(CardBase);
export const CardHeader = memo(CardHeaderBase);
export const CardTitle = memo(CardTitleBase);
export const CardDescription = memo(CardDescriptionBase);
export const CardContent = memo(CardContentBase);
export const CardFooter = memo(CardFooterBase);
