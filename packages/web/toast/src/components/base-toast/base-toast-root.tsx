import { Toast, type ToastObject } from "@base-ui/react/toast";
import { XIcon } from "lucide-react";
import { cn } from "tailwind-variants";

import { Button } from "@web/ui/button";

import type { ToastData } from "../../types/toast-data";
import type { ToastVariantConfig } from "../../types/toast-variant-config";

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
      <div className="bg-primary/10 text-primary relative flex w-fit shrink-0 items-center justify-center rounded-md">
        <Icon
          aria-hidden="true"
          size={25}
          className={cn("stroke-accent", variant.iconClassName)}
        />
      </div>
      <div className="relative ml-4 min-w-0 flex-1">
        <div className="mb-2">
          <Toast.Title className="mb-1 text-left text-sm font-bold" />
          <Toast.Description className="text-muted-foreground text-xs" />
        </div>
        {!!toast.actionProps && (
          <Toast.Action render={<Button size="sm" variant="outline" />} />
        )}
      </div>
      <Toast.Close
        aria-label="Fechar"
        render={
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 size-7"
          />
        }
      >
        <XIcon aria-hidden="true" size={14} />
      </Toast.Close>
    </Toast.Content>
  );
}
