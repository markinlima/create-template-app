import {
  BadgeInfo,
  CheckIcon,
  InfoIcon,
  type LucideIcon,
  OctagonAlertIcon,
  TriangleAlert,
} from "lucide-react";
import { cn } from "tailwind-variants";

interface CalloutProps extends React.ComponentProps<"div"> {
  variant?: "destructive" | "warning" | "success" | "info" | "note";
  icon?: LucideIcon;
  title?: string;
  hideTitle?: boolean;
}

const callouts = {
  destructive: {
    icon: OctagonAlertIcon,
    title: "Aviso",
    colors: "border-destructive/30 bg-destructive/10",
  },
  warning: {
    icon: TriangleAlert,
    title: "Aviso",
    colors: "border-warn/30 bg-warn/10",
  },
  success: {
    icon: CheckIcon,
    title: "Sucesso",
    colors: "border-success/30 bg-success/10",
  },
  info: {
    icon: BadgeInfo,
    title: "Informação",
    colors: "border-info/30 bg-info/10",
  },
  note: {
    icon: InfoIcon,
    title: "Nota",
    colors: "",
  },
};

export function CalloutRoot({
  variant = "note",
  icon: Icon = callouts[variant].icon,
  title = callouts[variant].title,
  className,
  hideTitle,
  children,
  ...props
}: CalloutProps) {
  return (
    <div
      className={cn(
        "w-full space-y-2 rounded-md border-2 p-2",
        callouts[variant].colors,
        className,
      )}
      {...props}
    >
      {!hideTitle && (
        <div className="mb-2 flex items-center gap-2">
          <Icon />
          <span className="font-bold">{title}</span>
        </div>
      )}
      {children}
    </div>
  );
}
