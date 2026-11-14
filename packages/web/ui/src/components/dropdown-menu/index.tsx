import { DropdownMenuCheckboxItem } from "./components/dropdown-menu-checkbox-item";
import { DropdownMenuContent } from "./components/dropdown-menu-content";
import { DropdownMenuGroup } from "./components/dropdown-menu-group";
import { DropdownMenuGroupLabel } from "./components/dropdown-menu-group-label";
import { DropdownMenuItem } from "./components/dropdown-menu-item";
import { DropdownMenuPortal } from "./components/dropdown-menu-portal";
import { DropdownMenuRadioGroup } from "./components/dropdown-menu-radio-group";
import { DropdownMenuRadioItem } from "./components/dropdown-menu-radio-item";
import { DropdownMenuRoot } from "./components/dropdown-menu-root";
import { DropdownMenuSeparator } from "./components/dropdown-menu-separator";
import { DropdownMenuShortcut } from "./components/dropdown-menu-shortcut";
import { DropdownMenuSub } from "./components/dropdown-menu-submenu";
import { DropdownMenuSubContent } from "./components/dropdown-menu-submenu-content";
import { DropdownMenuSubTrigger } from "./components/dropdown-menu-submenu-trigger";
import { DropdownMenuTrigger } from "./components/dropdown-menu-trigger";

/** A menu that opens from a button. Use `DropdownMenu.trigger`, `DropdownMenu.content`, `DropdownMenu.item` and the other parts. */
export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  portal: DropdownMenuPortal,
  trigger: DropdownMenuTrigger,
  content: DropdownMenuContent,
  group: DropdownMenuGroup,
  groupLabel: DropdownMenuGroupLabel,
  item: DropdownMenuItem,
  checkboxItem: DropdownMenuCheckboxItem,
  radioGroup: DropdownMenuRadioGroup,
  radioItem: DropdownMenuRadioItem,
  separator: DropdownMenuSeparator,
  shortcut: DropdownMenuShortcut,
  submenu: DropdownMenuSub,
  submenuTrigger: DropdownMenuSubTrigger,
  submenuContent: DropdownMenuSubContent,
});
