import { SidebarContent } from "./components/sidebar-content";
import { SidebarFooter } from "./components/sidebar-footer";
import { SidebarGroup } from "./components/sidebar-group";
import { SidebarGroupAction } from "./components/sidebar-group-action";
import { SidebarGroupContent } from "./components/sidebar-group-content";
import { SidebarGroupLabel } from "./components/sidebar-group-label";
import { SidebarHeader } from "./components/sidebar-header";
import { SidebarInput } from "./components/sidebar-input";
import { SidebarInset } from "./components/sidebar-inset";
import { SidebarMenu } from "./components/sidebar-menu";
import { SidebarMenuAction } from "./components/sidebar-menu-action";
import { SidebarMenuBadge } from "./components/sidebar-menu-badge";
import { SidebarMenuButton } from "./components/sidebar-menu-button";
import { SidebarMenuItem } from "./components/sidebar-menu-item";
import { SidebarMenuSkeleton } from "./components/sidebar-menu-skeleton";
import { SidebarMenuSub } from "./components/sidebar-menu-sub";
import { SidebarMenuSubButton } from "./components/sidebar-menu-sub-button";
import { SidebarMenuSubItem } from "./components/sidebar-menu-sub-item";
import { SidebarPanel } from "./components/sidebar-panel";
import { SidebarRail } from "./components/sidebar-rail";
import { SidebarProvider } from "./components/sidebar-root";
import { SidebarSeparator } from "./components/sidebar-separator";
import { SidebarTrigger } from "./components/sidebar-trigger";

/** A side navigation panel, made of a provider and its parts. */
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
