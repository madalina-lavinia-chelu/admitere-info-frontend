import React from "react";
import { cn } from "@/lib/utils";

type TypographyProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "display"
    | "large"
    | "default"
    | "small"
    | "muted"
    | "lead";
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export const Typography = ({
  as = "p",
  variant,
  className,
  children,
  ...props
}: TypographyProps) => {
  // Default variant to the element type if not specified
  const textVariant =
    variant ||
    (as === "h1"
      ? "h1"
      : as === "h2"
      ? "h2"
      : as === "h3"
      ? "h3"
      : as === "h4"
      ? "h4"
      : as === "h5"
      ? "h5"
      : as === "h6"
      ? "h6"
      : "default");

  // Variant styles using shadcn's approach with foreground/primary tokens
  const variantStyles = {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "scroll-m-20 text-3xl font-extrabold tracking-tight first:mt-0",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    h4: "scroll-m-20 text-xl font-semibold tracking-tight",
    h5: "scroll-m-20 text-lg font-semibold tracking-tight",
    h6: "scroll-m-20 text-base font-semibold tracking-tight",
    display: "text-4xl font-bold lg:text-5xl tracking-tight",
    lead: "text-xl text-muted-foreground",
    large: "text-lg font-semibold",
    default: "text-base font-semibold leading-7",
    small: "text-sm font-medium leading-none",
    muted: "text-sm text-muted-foreground",
  };

  // Combine variant style with any additional className
  const styles = cn(variantStyles[textVariant], className);

  // Dynamically render the element based on the 'as' prop
  const Component = as;

  return (
    <Component className={styles} {...props}>
      {children}
    </Component>
  );
};
