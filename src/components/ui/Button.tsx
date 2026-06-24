import { memo, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = memo(function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "font-display tracking-wider uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]";
  const variants = {
    primary:
      "bg-[var(--color-gold)] text-[var(--color-broadcast)] hover:bg-[var(--color-gold-light)] shadow-lg",
    secondary:
      "bg-[var(--color-pitch-light)] text-[var(--color-cream)] border border-[var(--color-gold)]/40 hover:border-[var(--color-gold)]",
    ghost:
      "bg-transparent text-[var(--color-cream)] hover:text-[var(--color-gold)] underline-offset-4 hover:underline",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-xl",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
