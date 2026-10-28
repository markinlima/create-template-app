import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SimpleInfiniteList, type SimpleInfiniteListProps } from ".";

const baseProps: SimpleInfiniteListProps<{ id: number }> = {
  data: [{ id: 1 }, { id: 2 }],
  isLoadingInitialData: false,
  isFetchingNextPage: false,
  isNextPageAvailable: false,
  onScrollNearEnd: () => undefined,
  renderItem: ({ item }) => <span>item-{item.id}</span>,
  renderEmpty: () => <span>empty</span>,
  renderFooter: () => <span>footer</span>,
  renderNextPageLoader: () => <span>next-page-loader</span>,
  renderInitialLoader: () => <span>initial-loader</span>,
};

function render(props: Partial<SimpleInfiniteListProps<{ id: number }>> = {}) {
  return renderToStaticMarkup(<SimpleInfiniteList {...baseProps} {...props} />);
}

describe("SimpleInfiniteList", () => {
  it("should render the items and the footer when everything was loaded", () => {
    const html = render();

    expect(html).toContain("item-1");
    expect(html).toContain("item-2");
    expect(html).toContain("footer");
    expect(html).not.toContain("empty");
    expect(html).not.toContain("next-page-loader");
  });

  it("should render only the initial loader while the first page loads", () => {
    const html = render({ isLoadingInitialData: true });

    expect(html).toContain("initial-loader");
    expect(html).not.toContain("item-1");
  });

  it("should render the empty state when there are no items and no next page", () => {
    const html = render({ data: [] });

    expect(html).toContain("empty");
    expect(html).not.toContain("footer");
  });

  it("should treat undefined data as no items", () => {
    expect(render({ data: undefined })).toContain("empty");
  });

  it("should render the next page loader as soon as there is a next page, even before fetching", () => {
    const html = render({
      isNextPageAvailable: true,
      isFetchingNextPage: false,
    });

    expect(html).toContain("next-page-loader");
    expect(html).not.toContain("footer");
  });

  it("should keep the next page loader while the next page is being fetched", () => {
    expect(
      render({ isNextPageAvailable: true, isFetchingNextPage: true }),
    ).toContain("next-page-loader");
  });

  it("should use the item key when given", () => {
    const html = renderToStaticMarkup(
      <SimpleInfiniteList
        {...baseProps}
        getItemKey={(item) => `post-${item.id}`}
      />,
    );

    expect(html).toContain("item-1");
  });

  it("should render default slots when none is given", () => {
    const html = renderToStaticMarkup(
      <SimpleInfiniteList
        data={[]}
        isLoadingInitialData={false}
        isFetchingNextPage={false}
        isNextPageAvailable={false}
        renderItem={() => null}
      />,
    );

    expect(html).toContain("Nada por aqui.");
  });
});

describe("SimpleInfiniteList next page error", () => {
  it("should show the error slot with a retry instead of the loader when the next page failed", () => {
    const html = render({
      isNextPageAvailable: true,
      isNextPageError: true,
      renderNextPageError: ({ retry }) => <span>error-{typeof retry}</span>,
    });

    expect(html).toContain("error-function");
    expect(html).not.toContain("next-page-loader");
    expect(html).toContain("item-1");
  });

  it("should show the loader again while retrying", () => {
    const html = render({
      isNextPageAvailable: true,
      isNextPageError: true,
      isFetchingNextPage: true,
      renderNextPageError: () => <span>error-slot</span>,
    });

    expect(html).toContain("next-page-loader");
    expect(html).not.toContain("error-slot");
  });

  it("should not show the error without a next page", () => {
    expect(
      render({
        isNextPageAvailable: false,
        isNextPageError: true,
        renderNextPageError: () => <span>error-slot</span>,
      }),
    ).not.toContain("error-slot");
  });

  it("should render a default retry button", () => {
    expect(
      render({ isNextPageAvailable: true, isNextPageError: true }),
    ).toContain("Tentar novamente");
  });
});

describe("SimpleInfiniteList without onScrollNearEnd (manual pagination)", () => {
  it("should not show the loader nor the error just because there is a next page", () => {
    const html = render({
      isNextPageAvailable: true,
      onScrollNearEnd: undefined,
      isNextPageError: true,
    });

    expect(html).not.toContain("next-page-loader");
    expect(html).not.toContain("Tentar novamente");
  });

  it("should show the loader while a page is being fetched", () => {
    expect(
      render({
        isNextPageAvailable: true,
        isFetchingNextPage: true,
        onScrollNearEnd: undefined,
      }),
    ).toContain("next-page-loader");
  });
});

describe("SimpleInfiniteList accessibility", () => {
  it("should mark the list as busy while the next page is being fetched", () => {
    expect(
      render({ isNextPageAvailable: true, isFetchingNextPage: true }),
    ).toContain('aria-busy="true"');
    expect(render({ isFetchingNextPage: false })).toContain(
      'aria-busy="false"',
    );
  });
});
