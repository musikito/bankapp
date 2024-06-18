/**
 * A React component that renders a button with various style and size variants.
 *
 * The `Button` component uses the `cva` (class-variance-authority) library to define
 * the available variants for the button. The variants include different background
 * colors, text colors, and sizes.
 *
 * The component can be used as a regular `<button>` element or as a custom component
 * by passing the `asChild` prop.
 *
 * @param {ButtonProps} props - The props for the Button component.
 * @param {string} [props.variant] - The variant of the button (e.g. 'default', 'destructive', 'outline', 'secondary', 'ghost', 'link').
 * @param {string} [props.size] - The size of the button (e.g. 'default', 'sm', 'lg', 'icon').
 * @param {boolean} [props.asChild] - If true, the component will render as a custom component instead of a `<button>` element.
 * @param {string} [props.className] - Additional CSS classes to apply to the button.
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props] - Any other props that a standard HTML button element can accept.
 * @returns {React.ReactElement} - The rendered Button component.
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
