'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';
import { CurrentUserAvatar } from './ui/current-user-avatar';
import { useUser } from "@/context/userContext";
import { LogoutButton } from './ui/logout-button';
import { useRouter } from 'next/navigation';
import { ModeToggle } from './ui/theme-toggle';

const Logo = () => (
  <div
    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-sm font-bold tracking-tight text-primary-foreground shadow-sm ring-1 ring-primary/20"
    aria-hidden
  >
    L
  </div>
);


// Hamburger icon component
const HamburgerIcon = ({ className, ...props }: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn('pointer-events-none', className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

// Types
export interface Navbar01NavLink {
  href: string;
  label: string;
  active?: boolean;
}

export interface Navbar01Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
}

export const Navbar = React.forwardRef<HTMLElement, Navbar01Props>(
  (
    {
      className,
      logo = <Logo />,
      logoHref = '/home',
      ...props
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Combine refs
    const combinedRef = React.useCallback((node: HTMLElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);

    const user = useUser();
    const router = useRouter();

    return (
      <header
        ref={combinedRef}
        className={cn(
          'sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 [&_*]:no-underline',
          className
        )}
        {...props}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-48 p-2">
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-1">
                      {/* {navigationLinks.map((link, index) => (
                        <NavigationMenuItem key={index} className="w-full">
                          <button
                            onClick={(e) => e.preventDefault()}
                            className={cn(
                              "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer no-underline",
                              link.active
                                ? "bg-accent text-accent-foreground"
                                : "text-foreground/80"
                            )}
                          >
                            {link.label}
                          </button>
                        </NavigationMenuItem>
                      ))} */}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            {/* Main nav */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.push(logoHref)}
                className="flex cursor-pointer items-center gap-3 text-foreground transition-opacity hover:opacity-90"
              >
                {logo}
                <span className="font-display hidden text-2xl font-semibold tracking-tight sm:inline-block">
                  Lumina
                </span>
              </button>
              {/* Navigation menu */}
              {!isMobile && (
                <NavigationMenu className="flex">
                  <NavigationMenuList className="gap-1">
                    {/* {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index}>
                        <button
                          onClick={(e) => e.preventDefault()}
                          className={cn(
                            "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer no-underline",
                            link.active
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground/80 hover:text-foreground"
                          )}
                        >
                          {link.label}
                        </button>
                      </NavigationMenuItem>
                    ))} */}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ModeToggle />
            <Link
              href="/wishlist"
              aria-label="Saved sessions"
              className="rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <Link
              href="/checkout-cart"
              aria-label="Registration cart"
              className="rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>
            <CurrentUserAvatar />
            {
              user ? <LogoutButton /> : <span> Please Log In </span>
            }
          </div>
        </div>
      </header>
    );
  }
);

Navbar.displayName = 'Navbar';

export { Logo, HamburgerIcon };