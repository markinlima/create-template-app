import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { RenderSlot } from "./render-slot";

describe("RenderSlot", () => {
  it("should render what the function returns with the given props", () => {
    const html = renderToStaticMarkup(
      <RenderSlot
        render={({ name }: { name: string }) => <b>hi {name}</b>}
        props={{ name: "ana" }}
      />,
    );

    expect(html).toBe("<b>hi ana</b>");
  });

  it("should allow the render function to use hooks", () => {
    function WithHook() {
      const [value] = useState("state");
      return <i>{value}</i>;
    }

    const html = renderToStaticMarkup(
      <RenderSlot render={() => <WithHook />} props={undefined} />,
    );

    expect(html).toBe("<i>state</i>");
  });

  it("should render nothing when the function returns null", () => {
    expect(
      renderToStaticMarkup(
        <RenderSlot render={() => null} props={undefined} />,
      ),
    ).toBe("");
  });
});
