import { CompactContainerHeader } from "./components/compact-container-header";
import { CompactContainerItem } from "./components/compact-container-item";
import { CompactContainerRoot } from "./components/compact-container-root";

/** A compact bordered list of rows, with an optional header. */
export const CompactContainer = Object.assign(CompactContainerRoot, {
  header: CompactContainerHeader,
  item: CompactContainerItem,
});
