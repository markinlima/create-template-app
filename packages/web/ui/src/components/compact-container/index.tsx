import { CompactContainerHeader } from "./compact-container-header";
import { CompactContainerItem } from "./compact-container-item";
import { CompactContainerRoot } from "./compact-container-root";

export const CompactContainer = Object.assign(CompactContainerRoot, {
  header: CompactContainerHeader,
  item: CompactContainerItem,
});
