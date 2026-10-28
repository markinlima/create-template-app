import { Toast, type ToastObject } from "@base-ui/react/toast";
import { cn } from "tailwind-variants";

import { Button } from "@web/ui/button";
import { RoundedIcon } from "@web/ui/rounded-icon";

import type { ToastData, ToastVariantConfig } from "../../types";

export interface BaseToastProps {
  toast: ToastObject<ToastData>;
  /** Icon and colors of the toast's variant (success, error, warning or info). */
  variant: ToastVariantConfig;
}

/**
 * Layout of the basic toasts (success, error, warning, info). Replace it with the `baseToast`
 * prop of `<ToastProvider>` to match the project, reusing `BaseToastProps`.
 */
export function BaseToastRoot({ toast, variant }: BaseToastProps) {
  const Icon = variant.icon;

  return (
    <Toast.Content className="flex w-full items-center gap-0">
      <div
        className={cn(
          "pointer-events-none absolute top-0 left-0 size-full bg-linear-to-r via-transparent to-transparent",
          variant.className,
        )}
      />
      <RoundedIcon className="relative shrink-0 p-0">
        <Icon
          size={25}
          className={cn("stroke-accent", variant.iconClassName)}
        />
      </RoundedIcon>
      <div className="relative ml-4 min-w-0 flex-1">
        <div className="mb-2">
          <Toast.Title className="mb-1 text-left font-bold text-sm" />
          <Toast.Description className="text-muted-foreground text-xs" />
        </div>
        {!!toast.actionProps && (
          <Toast.Action render={<Button variant="outline" size="sm" />} />
        )}
      </div>
    </Toast.Content>
  );
}
