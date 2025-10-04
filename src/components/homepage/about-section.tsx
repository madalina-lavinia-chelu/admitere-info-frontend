"use client";

import { Lightning, CheckCircle, CurrencyDollar } from "@phosphor-icons/react";
import MotionWrapper from "@/components/ui/motion-wrapper";

export function AboutSection() {
  return (
    <section
      id="about"
      className="bg-blue-50/50 dark:bg-blue-950/20 py-16 md:py-24">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <MotionWrapper type="slide-fade-up" duration={0.7} delay={0.1}>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                Despre Grile - Platforma ta de învățare
              </h2>
              <p className="md:text-lg text-muted-foreground mb-6">
                Suntem o echipă pasionată de educație și tehnologie, dedicată să
                transforme modul în care studenții și profesioniștii se
                pregătesc pentru examene și își dezvoltă cunoștințele.
              </p>
              <p className="md:text-lg text-muted-foreground mb-8">
                Platforma noastră combină o interfață modernă și intuitivă cu
                algoritmi avansați de analiză pentru a oferi o experiență de
                învățare personalizată și eficientă.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    5000+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Întrebări disponibile
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    1000+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Utilizatori activi
                  </div>
                </div>
              </div>
            </div>
          </MotionWrapper>

          <MotionWrapper type="slide-fade-up" duration={0.7} delay={0.3}>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100/80 to-blue-50/50 dark:from-blue-900/30 dark:to-blue-950/20 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/30">
                <div className="space-y-6">
                  {" "}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-200/50 dark:bg-blue-800/30 flex items-center justify-center">
                      <Lightning
                        size={24}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Învățare rapidă</h3>
                      <p className="text-sm text-muted-foreground">
                        Algoritmi optimizați pentru eficiență
                      </p>
                    </div>
                  </div>{" "}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-200/50 dark:bg-blue-800/30 flex items-center justify-center">
                      <CheckCircle
                        size={24}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Calitate garantată</h3>
                      <p className="text-sm text-muted-foreground">
                        Conținut verificat de experți
                      </p>
                    </div>
                  </div>{" "}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-200/50 dark:bg-blue-800/30 flex items-center justify-center">
                      <CurrencyDollar
                        size={24}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Preț accesibil</h3>
                      <p className="text-sm text-muted-foreground">
                        Educație de calitate pentru toți
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
