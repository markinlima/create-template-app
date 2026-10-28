import { afterEach, describe, expect, it, vi } from "vitest";

import { resolveToastPosition, toast, toastConfig } from "./toast";
import { toastManagers } from "./toast-managers";
import type { ToastPosition } from "./types";

function spyOnManagers() {
  return Object.fromEntries(
    (Object.keys(toastManagers) as ToastPosition[]).map((position) => [
      position,
      {
        add: vi.spyOn(toastManagers[position], "add"),
        close: vi.spyOn(toastManagers[position], "close"),
      },
    ]),
  ) as Record<
    ToastPosition,
    { add: ReturnType<typeof vi.spyOn>; close: ReturnType<typeof vi.spyOn> }
  >;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  toastConfig.defaultPosition = "bottom-right";
});

describe("toast", () => {
  it("should show toasts at the default position", () => {
    const managers = spyOnManagers();

    toast.success({ title: "Saved" });

    expect(managers["bottom-right"].add).toHaveBeenCalledOnce();
    expect(managers["top-left"].add).not.toHaveBeenCalled();
  });

  it("should use the configured default position", () => {
    const managers = spyOnManagers();
    toastConfig.defaultPosition = "top-left";

    toast.info({ title: "Hi" });

    expect(managers["top-left"].add).toHaveBeenCalledOnce();
  });

  it("should let a toast override the position", () => {
    const managers = spyOnManagers();

    toast.error({ title: "Oops", position: "bottom-center" });

    expect(managers["bottom-center"].add).toHaveBeenCalledOnce();
  });

  it("should carry the variant and position in the toast data", () => {
    const managers = spyOnManagers();

    toast.warning({ title: "Careful", position: "top-right" });

    expect(managers["top-right"].add).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "warning",
        data: expect.objectContaining({
          variant: "warning",
          position: "top-right",
        }),
      }),
    );
  });

  it("should map the action to the Base UI action props", () => {
    const managers = spyOnManagers();
    const onClick = vi.fn();

    toast.error({ title: "Oops", action: { label: "Retry", onClick } });

    expect(managers["bottom-right"].add).toHaveBeenCalledWith(
      expect.objectContaining({ actionProps: { children: "Retry", onClick } }),
    );
  });

  it("should show custom toasts with their render function", () => {
    const managers = spyOnManagers();
    const render = vi.fn();

    toast.custom(render, { position: "top-center", className: "p-0" });

    expect(managers["top-center"].add).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "custom",
        data: expect.objectContaining({ render, className: "p-0" }),
      }),
    );
  });

  it("should always use the top on mobile", () => {
    vi.stubGlobal("window", { matchMedia: () => ({ matches: true }) });
    const managers = spyOnManagers();

    toast.success({ title: "Saved", position: "bottom-left" });

    expect(managers["top-center"].add).toHaveBeenCalledOnce();
    expect(managers["bottom-left"].add).not.toHaveBeenCalled();
  });

  it("should dismiss a toast in the manager of its position", () => {
    const managers = spyOnManagers();
    const id = toast.success({ title: "Saved", position: "top-right" });

    toast.dismiss(id);

    expect(managers["top-right"].close).toHaveBeenCalledWith(id);
  });

  it("should dismiss every toast when no id is given", () => {
    const managers = spyOnManagers();

    toast.dismiss();

    for (const position of Object.keys(managers) as ToastPosition[]) {
      expect(managers[position].close).toHaveBeenCalledOnce();
    }
  });
});

describe("resolveToastPosition", () => {
  it("should keep the position on desktop", () => {
    expect(resolveToastPosition("bottom-left")).toBe("bottom-left");
  });
});
