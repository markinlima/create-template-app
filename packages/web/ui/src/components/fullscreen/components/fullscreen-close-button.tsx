import { XIcon } from "lucide-react";
import { cn } from "tailwind-variants";

import { Button } from "../../button";
import { useFullscreenContext } from "../hooks/use-fullscreen-context";

interface FullscreenCloseButtonProps {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  onClick?: () => void;
}

/** A button that closes its {@link Fullscreen}. */
export function FullscreenCloseButton({
  className,
  children,
  onClick,
  asChild,
  ...props
}: FullscreenCloseButtonProps) {
  const { handleChangeFullscreenState } = useFullscreenContext();

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    onClick?.();
    handleChangeFullscreenState(false);
  }

  if (asChild) {
    return (
      // biome-ignore lint/a11y/useKeyWithClickEvents: Ta tudo bem biome
      // biome-ignore lint/a11y/noStaticElementInteractions: Ta tudo bem biome
      <div onClick={handleClick} {...props}>
        {children}
      </div>
    );
  }

  return (
    <Button
      className={cn("fixed top-2 right-2 z-50", className)}
      variant="ghost"
      onClick={handleClick}
      {...props}
    >
      <XIcon />
    </Button>
  );
}
