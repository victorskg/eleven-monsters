import { memo, type ReactNode } from "react";

interface ScreenLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export const ScreenLayout = memo(function ScreenLayout({
  children,
  title,
  subtitle,
}: ScreenLayoutProps) {
  return (
    <div className="grass-texture relative min-h-screen scanlines">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 sm:px-6">
        {(title || subtitle) && (
          <header className="mb-8 text-center">
            {title && (
              <h1 className="font-display text-5xl tracking-[0.15em] text-[var(--color-gold)] sm:text-6xl">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-2 text-sm italic text-[var(--color-cream)]/80 sm:text-base">
                {subtitle}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </div>
  );
});
