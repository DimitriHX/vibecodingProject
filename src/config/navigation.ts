import { BarChart3, Compass, LayoutDashboard, ListChecks, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: "/" | "/tasks" | "/explore" | "/analytics";
  label: string;
  icon: LucideIcon;
}

/** Single source of truth for the app routes: add an entry to add a menu item. */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tareas", icon: ListChecks },
  { href: "/explore", label: "Explorar", icon: Compass },
  { href: "/analytics", label: "Analíticas", icon: BarChart3 },
];
