"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Timer, X } from "lucide-react";
import { NAV_ITEMS, type NavItem } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: NavItem["href"]): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavLink({ item, active, onNavigate }: { item: NavItem; active: boolean; onNavigate?: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-primary-soft text-primary-strong" : "text-ink-muted hover:bg-surface-muted hover:text-ink",
      )}
    >
      <Icon className="size-4" aria-hidden />
      {item.label}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Principal">
        <Link href="/" onClick={close} className="flex items-center gap-2 font-bold text-ink">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary-soft text-primary-strong">
            <Timer className="size-4" aria-hidden />
          </span>
          {siteConfig.name}
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink item={item} active={isActive(pathname, item.href)} />
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="rounded-xl p-2 text-ink-muted hover:bg-surface-muted md:hidden"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {isOpen && (
        <ul id="mobile-menu" className="space-y-1 border-t border-line bg-surface px-4 py-3 md:hidden">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink item={item} active={isActive(pathname, item.href)} onNavigate={close} />
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
