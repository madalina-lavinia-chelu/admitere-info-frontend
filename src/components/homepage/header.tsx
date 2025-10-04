"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { paths } from "@/routes/paths";
import Logo from "@/components/logo";
import { ModeToggle } from "@/components/toggle-dark-mode";
import MotionWrapper from "@/components/ui/motion-wrapper";
import { Menu, X } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Funcționalități", href: "#features" },
  { name: "Prețuri", href: "#pricing" },
  { name: "Despre noi", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export function HomepageHeader() {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (href: string) => {
    // Close mobile menu
    setMenuState(false);

    // Handle smooth scroll for anchor links
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  return (
    <MotionWrapper type="fade-down" duration={0.6} delay={0.1}>
      <header>
        <nav
          data-state={menuState && "active"}
          className="fixed z-20 w-full px-2">
          <div
            className={cn(
              "mx-auto mt-2 max-w-7xl px-6 transition-all duration-300 lg:px-12",
              isScrolled &&
                "bg-background/50 max-w-5xl rounded-2xl border backdrop-blur-lg lg:px-5"
            )}>
            <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              <div className="flex w-full justify-between lg:w-auto">
                <Logo />
                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                  <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                  <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                </button>
              </div>{" "}
              <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSmoothScroll(item.href);
                        }}>
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Mobile menu */}
              {menuState && (
                <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/60 backdrop-blur-lg mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-blue-200/30 p-6 shadow-2xl shadow-blue-300/10 md:flex-nowrap dark:from-blue-950/20 dark:to-blue-900/10 dark:border-blue-800/20">
                  {" "}
                  <div className="lg:hidden">
                    <ul className="space-y-6 text-base tracking-tight">
                      {menuItems.map((item, index) => (
                        <li key={index}>
                          <Link
                            href={item.href}
                            className="text-muted-foreground hover:text-accent-foreground block duration-150"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSmoothScroll(item.href);
                            }}>
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                    <div className="flex items-center lg:order-last">
                      <ModeToggle />
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full lg:w-auto">
                      <Link href={paths.auth.login}>
                        <span>Autentificare</span>
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="w-full lg:w-auto">
                      <Link href={paths.auth.register}>
                        <span>Începe acum</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
              {/* Desktop buttons */}
              <div className="hidden lg:flex lg:w-fit lg:gap-6 lg:space-y-0">
                <div className="flex items-center w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className={cn(isScrolled && "lg:hidden")}>
                    <Link href={paths.auth.login}>
                      <span>Autentificare</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className={cn(isScrolled ? "lg:inline-flex" : "hidden")}>
                    <Link href={paths.auth.register}>
                      <span>Începe acum</span>
                    </Link>
                  </Button>
                  <div
                    className={cn(
                      "flex items-center",
                      isScrolled ? "lg:ml-2" : "ml-2"
                    )}>
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </MotionWrapper>
  );
}
