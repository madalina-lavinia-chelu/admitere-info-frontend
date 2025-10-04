"use client";

import MotionWrapper from "../ui/motion-wrapper";
import { Button } from "../ui/button";
import Link from "next/link";
import { paths } from "@/routes/paths";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 pt-36 md:pt-64 md:pb-16 flex flex-col items-center text-center">
      <MotionWrapper type="slide-fade-up" duration={0.8} delay={0.1}>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
          Platformă modernă de învățare prin teste grilă
        </h1>
      </MotionWrapper>
      <MotionWrapper type="fade-up" duration={0.7} delay={0.3}>
        <p className="mt-6 text-md md:text-xl font-medium text-muted-foreground max-w-2xl">
          Învață eficient și evaluează-ți cunoștințele cu ajutorul celei mai
          moderne platforme de teste grilă din România.
        </p>
      </MotionWrapper>
      <MotionWrapper type="gentle-bounce" duration={0.6} delay={0.5}>
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href={paths.auth.register}>Începe gratuit</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">Află mai multe</Link>
          </Button>
        </div>{" "}
      </MotionWrapper>{" "}
      <MotionWrapper type="fade-scale" duration={0.8} delay={0.7}>
        <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
          <div
            aria-hidden
            className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
          />
          <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-7xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
            <Image
              className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
              src="/hero-dark-1.png"
              alt="app screen"
              width="2700"
              height="1440"
            />
            <Image
              className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
              src="/hero-1.png"
              alt="app screen"
              width="2700"
              height="1440"
            />
          </div>
        </div>
      </MotionWrapper>
    </section>
  );
}
