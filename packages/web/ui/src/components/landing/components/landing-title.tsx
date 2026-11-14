import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

interface LandingTitleProps extends ComponentProps<"h2"> {
  title: string;
  description?: string;
  isH1?: boolean;
}

/** The title of a landing section. */
export function LandingTitle({
  className,
  title,
  description,
  isH1,
}: LandingTitleProps) {
  const TitleElement = isH1 ? "h1" : "h2";
  return (
    <div
      className={cn(
        "mb-10 flex flex-col items-center text-center text-2xl font-bold md:text-4xl",
        className,
      )}
    >
      <TitleElement>{title}</TitleElement>
      <div className="bg-primary mt-2 h-0.5 w-1/2 rounded-full" />
      {!!description && (
        <p className="text-muted-foreground mt-4 text-sm font-medium">
          {description}
        </p>
      )}
    </div>
  );
}
