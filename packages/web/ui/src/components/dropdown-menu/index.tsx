import { DropdownMenuCheckboxItem } from "./dropdown-menu-checkbox-item";
import { DropdownMenuContent } from "./dropdown-menu-content";
import { DropdownMenuGroup } from "./dropdown-menu-group";
import { DropdownMenuGroupLabel } from "./dropdown-menu-group-label";
import { DropdownMenuItem } from "./dropdown-menu-item";
import { DropdownMenuPortal } from "./dropdown-menu-portal";
import { DropdownMenuRadioGroup } from "./dropdown-menu-radio-group";
import { DropdownMenuRadioItem } from "./dropdown-menu-radio-item";
import { DropdownMenuRoot } from "./dropdown-menu-root";
import { DropdownMenuSeparator } from "./dropdown-menu-separator";
import { DropdownMenuShortcut } from "./dropdown-menu-shortcut";
import { DropdownMenuSub } from "./dropdown-menu-submenu";
import { DropdownMenuSubContent } from "./dropdown-menu-submenu-content";
import { DropdownMenuSubTrigger } from "./dropdown-menu-submenu-trigger";
import { DropdownMenuTrigger } from "./dropdown-menu-trigger";

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
