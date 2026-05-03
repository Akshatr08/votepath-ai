"use client";

import React, { useState, useEffect, useRef, useCallback, type JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Vote, Sun, Moon, LogIn, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { NAV_LINKS, APP_NAME } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LanguageSelector } from "./LanguageSelector";

export function Navbar(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { user, isAuthenticated, signInWithGoogle, logout, loading } = useAuthContext();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when navigation occurs (adjusting state during render)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (isOpen) setIsOpen(false);
    if (userMenuOpen) setUserMenuOpen(false);
  }

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  // Close user menu on outside click or Escape key (WCAG menu pattern)
  const userMenuRef = useRef<HTMLDivElement>(null);
  const closeUserMenu = useCallback(() => setUserMenuOpen(false), []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) closeUserMenu();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeUserMenu();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [userMenuOpen, closeUserMenu]);

  return (
    <>
      {/* Skip to main content — keyboard & screen reader accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
    <header
      role="banner"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-card/90 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
            aria-label={`${APP_NAME} – Go to homepage`}
          >
            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
              <Vote className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <span className="font-bold text-lg gradient-text hidden sm:block">
              VotePath AI
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-1" role="list">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <LanguageSelector />
            
            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            {/* Settings */}
            <Link
              href="/settings"
              aria-label="Accessibility Settings"
              className="hidden sm:flex p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
            </Link>

            {/* Auth */}
            {!loading && (
              <>
                {isAuthenticated ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      id="user-menu-button"
                      onClick={() => setUserMenuOpen((v) => !v)}
                      aria-expanded={userMenuOpen}
                      aria-haspopup="menu"
                      aria-label="User menu"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border hover:border-accent/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {user?.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt={user.displayName ?? "User"}
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" aria-hidden="true" />
                        </div>
                      )}
                      <span className="hidden sm:block text-sm font-medium max-w-24 truncate">
                        {user?.displayName?.split(" ")[0] ?? "Account"}
                      </span>
                      <ChevronDown className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          role="menu"
                          aria-label="User account menu"
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card shadow-lg py-1 z-50"
                        >
                          <div className="px-3 py-2 border-b border-border">
                            <p className="text-sm font-medium truncate">{user?.displayName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                          </div>
                          <Link
                            href="/checklist"
                            role="menuitem"
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                          >
                            My Checklist
                          </Link>
                          <Link
                            href="/settings"
                            role="menuitem"
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                          >
                            Settings
                          </Link>
                          <button
                            role="menuitem"
                            onClick={logout}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-secondary transition-colors"
                          >
                            <LogOut className="w-4 h-4" aria-hidden="true" />
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Button
                    id="sign-in-button"
                    onClick={signInWithGoogle}
                    size="sm"
                    className="hidden sm:flex gap-2"
                    aria-label="Sign in with Google"
                  >
                    <LogIn className="w-4 h-4" aria-hidden="true" />
                    Sign In
                  </Button>
                )}
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-button"
              onClick={() => setIsOpen((v) => !v)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {isOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              role="navigation"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-border"
            >
              <ul className="py-3 space-y-1" role="list">
                {NAV_LINKS.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "block px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
                {!isAuthenticated && (
                  <li>
                    <Button
                      onClick={signInWithGoogle}
                      className="w-full mt-2"
                      size="sm"
                    >
                      <LogIn className="w-4 h-4" aria-hidden="true" />
                      Sign In with Google
                    </Button>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
    </>
  );
}
