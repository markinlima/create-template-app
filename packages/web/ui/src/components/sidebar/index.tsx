import { SidebarContent } from "./sidebar-content";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarGroup } from "./sidebar-group";
import { SidebarGroupAction } from "./sidebar-group-action";
import { SidebarGroupContent } from "./sidebar-group-content";
import { SidebarGroupLabel } from "./sidebar-group-label";
import { SidebarHeader } from "./sidebar-header";
import { SidebarInput } from "./sidebar-input";
import { SidebarInset } from "./sidebar-inset";
import { SidebarMenu } from "./sidebar-menu";
import { SidebarMenuAction } from "./sidebar-menu-action";
import { SidebarMenuBadge } from "./sidebar-menu-badge";
import { SidebarMenuButton } from "./sidebar-menu-button";
import { SidebarMenuItem } from "./sidebar-menu-item";
import { SidebarMenuSkeleton } from "./sidebar-menu-skeleton";
import { SidebarMenuSub } from "./sidebar-menu-sub";
import { SidebarMenuSubButton } from "./sidebar-menu-sub-button";
import { SidebarMenuSubItem } from "./sidebar-menu-sub-item";
import { SidebarPanel } from "./sidebar-panel";
import { SidebarRail } from "./sidebar-rail";
import { SidebarProvider } from "./sidebar-root";
import { SidebarSeparator } from "./sidebar-separator";
import { SidebarTrigger } from "./sidebar-trigger";

export const Sidebar = Object.assign(SidebarProvider, {
  panel: SidebarPanel,
  content: SidebarContent,
  header: SidebarHeader,
  footer: SidebarFooter,
  separator: SidebarSeparator,
  trigger: SidebarTrigger,
  rail: SidebarRail,
  inset: SidebarInset,
  input: SidebarInput,
  group: SidebarGroup,
  groupLabel: SidebarGroupLabel,
  groupContent: SidebarGroupContent,
  groupAction: SidebarGroupAction,
  menu: SidebarMenu,
  menuItem: SidebarMenuItem,
  menuButton: SidebarMenuButton,
  menuAction: SidebarMenuAction,
  menuBadge: SidebarMenuBadge,
  menuSkeleton: SidebarMenuSkeleton,
  menuSub: SidebarMenuSub,
  menuSubItem: SidebarMenuSubItem,
  menuSubButton: SidebarMenuSubButton,
});
