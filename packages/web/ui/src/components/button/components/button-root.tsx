import {
  Button as BaseUiButton,
  type ButtonProps as BaseUiButtonProps,
} from "@base-ui/react/button";
import { cn, tv, type VariantProps } from "tailwind-variants";

const shadowVariants = tv({
  base: [
    "duration-150 ease-[cubic-bezier(0,0,0.58,1)]",

    // 1. Base (Sombra inicial 6px)
    "shadow-[0_var(--shadow-button-size)_0_0_rgba(0,0,0,0.2)] dark:shadow-[0_var(--shadow-button-size)_0_0_rgba(100,100,100,0.2)]",

    // 2. Hover (SÓ aplica se NÃO estiver clicando)
    "hover:not-active:shadow-[0_var(--hovered-shadow-button-size)_0_0_rgba(0,0,0,0.2)] dark:hover:not-active:shadow-[0_var(--hovered-shadow-button-size)_0_0_rgba(100,100,100,0.2)]",
    "hover:not-active:translate-y-0.5",

    // 3. Active (Clique total)
    "active:translate-y-(--shadow-button-size) active:shadow-[0_0px_0_0_rgba(0,0,0,0.2)]",

    // 4. Disabled (Fica afundado sem sombra)
    "disabled:translate-y-(--shadow-button-size) disabled:shadow-none",
  ],
  variants: {
    variant: {
      primary: [
        "shadow-[0_var(--shadow-button-size)_0_0_var(--primary-shadow)]",
        "hover:not-active:shadow-[0_var(--hovered-shadow-button-size)_0_0_var(--primary-shadow)]",
        "dark:shadow-[0_var(--shadow-button-size)_0_0_var(--primary-shadow)]",
        "dark:hover:not-active:shadow-[0_var(--hovered-shadow-button-size)_0_0_var(--primary-shadow)]",
      ],
      outline:
        "shadow-[0_var(--shadow-button-size)_0_0_var(--input)] hover:not-active:shadow-[0_var(--hovered-shadow-button-size)_0_0_var(--input)]",
      secondary: "",
      ghost:
        "shadow-none hover:not-active:translate-y-0 hover:not-active:shadow-none active:translate-y-0 active:shadow-none dark:shadow-none hover:dark:shadow-none dark:hover:not-active:shadow-none",
      destructive: [
        "shadow-[0_var(--shadow-button-size)_0_0_var(--destructive-shadow)]",
        "hover:not-active:shadow-[0_var(--hovered-shadow-button-size)_0_0_var(--destructive-shadow)]",
        "dark:shadow-[0_var(--shadow-button-size)_0_0_var(--destructive-shadow)]",
        "dark:hover:not-active:shadow-[0_var(--hovered-shadow-button-size)_0_0_var(--destructive-shadow)]",
      ],
      link: "shadow-none hover:not-active:translate-y-0 hover:not-active:shadow-none active:translate-y-0 active:shadow-none dark:shadow-none hover:dark:shadow-none dark:hover:not-active:shadow-none",
    },
  },
});

const buttonVariants = tv({
  base: "group/button relative inline-flex shrink-0 cursor-pointer flex-nowrap items-center justify-center gap-2 rounded-md border-2 font-medium tracking-wide whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  variants: {
    variant: {
      primary:
        "border-primary-foreground/20 bg-primary text-primary-foreground",
      outline:
        "border-input bg-background/80 text-foreground hover:bg-accent hover:text-accent-foreground",
      secondary:
        "border-secondary-foreground/10 bg-secondary text-secondary-foreground",
      ghost:
        "hover:border-input/50 hover:bg-accent hover:text-accent-foreground border-transparent",
      destructive:
        "border-destructive-foreground/20 bg-destructive text-destructive-foreground",
      link: "text-primary border-none underline-offset-4 hover:underline",
    },
    size: {
      default: "h-10 px-6 py-3 text-base",
      sm: "h-9 px-3 text-xs",
      lg: "h-14 px-10 text-lg",
      icon: "size-10",
    },
  },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type ShadowVariants = VariantProps<typeof shadowVariants>;

export interface ButtonProps
  extends BaseUiButtonProps,
    ButtonVariants,
    ShadowVariants {
  className?: string;
  raised?: boolean;
}

/** The root of a {@link Button}: the variants and sizes of the lib on a native button. */
export function ButtonRoot({
  ref,
  className,
  children,
  type = "button",
  size = "default",
  variant = "primary",
  raised = false,
  ...props
}: ButtonProps) {
  return (
    <BaseUiButton
      className={cn(
        buttonVariants({ size, variant, className }),
        raised ? shadowVariants({ variant, className }) : undefined,
      )}
      data-variant={variant}
      data-size={size}
      type={type}
      ref={ref}
      // A custom element (e.g. a link) is not a native <button>; callers rendering a real <button> can pass `nativeButton` explicitly.
      nativeButton={props.render ? false : undefined}
      {...props}
    >
      {children}
    </BaseUiButton>
  );
}
