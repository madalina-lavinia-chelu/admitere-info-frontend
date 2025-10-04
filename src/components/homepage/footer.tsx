"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { paths } from "@/routes/paths";
import Logo from "@/components/logo";
import {
  FacebookLogo,
  InstagramLogo,
  TiktokLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";

export function HomepageFooter() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo />
            <p className="text-muted-foreground mt-4 max-w-md">
              Platforma modernă de învățare prin teste grilă care te ajută să
              îți atingi obiectivele educaționale prin practică eficientă și
              analiză detaliată.
            </p>
            <div className="flex gap-4 mt-6">
              <Button variant="outline" size="icon">
                <FacebookLogo className="h-6 w-6" />
              </Button>
              <Button variant="outline" size="icon">
                <InstagramLogo className="h-6 w-6" />
              </Button>
              <Button variant="outline" size="icon">
                <TiktokLogo className="h-6 w-6" />
              </Button>
              <Button variant="outline" size="icon">
                <YoutubeLogo className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platformă</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="#features"
                  className="hover:text-foreground transition-colors">
                  Funcționalități
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="hover:text-foreground transition-colors">
                  Prețuri
                </Link>
              </li>
              <li>
                <Link
                  href={paths.auth.register}
                  className="hover:text-foreground transition-colors">
                  Înregistrare
                </Link>
              </li>
              <li>
                <Link
                  href={paths.auth.login}
                  className="hover:text-foreground transition-colors">
                  Autentificare
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Suport</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="#contact"
                  className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="hover:text-foreground transition-colors">
                  Despre noi
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@grile.ro"
                  className="hover:text-foreground transition-colors">
                  Email
                </a>
              </li>
              <li>
                <a
                  href="tel:+40123456789"
                  className="hover:text-foreground transition-colors">
                  Telefon
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Grile. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </footer>
  );
}
