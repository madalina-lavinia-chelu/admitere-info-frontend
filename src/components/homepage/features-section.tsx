"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChartLine, CaretRight, Archive } from "@phosphor-icons/react";
import MotionWrapper from "@/components/ui/motion-wrapper";
import { ListCheck } from "lucide-react";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="container max-w-7xl mx-auto px-4 py-16 md:pb-24 md:pt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature Card 1 */}
        <MotionWrapper type="slide-fade-up" duration={0.6} delay={0.1}>
          <div className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center mb-5">
              <ListCheck size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Teste personalizate</h3>
            <p className="text-sm md:text-base text-muted-foreground flex-1">
              Creează-ți propriile teste după materii, capitole și nivel de
              dificultate pentru a adapta învățarea la nevoile tale.
            </p>
          </div>
        </MotionWrapper>

        {/* Feature Card 2 */}
        <MotionWrapper type="slide-fade-up" duration={0.6} delay={0.2}>
          <div className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center mb-5">
              <ChartLine size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analiză detaliată</h3>
            <p className="text-sm md:text-base text-muted-foreground flex-1">
              Vizualizează statistici personalizate care te ajută să identifici
              punctele forte și zonele care necesită îmbunătățire.
            </p>
          </div>
        </MotionWrapper>

        {/* Feature Card 3 */}
        <MotionWrapper type="slide-fade-up" duration={0.6} delay={0.3}>
          <div className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center mb-5">
              <Archive size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Bibliotecă de întrebări
            </h3>
            <p className="text-sm md:text-base text-muted-foreground flex-1">
              Accesează o colecție vastă de întrebări și răspunsuri verificate
              de specialiști în domeniu, actualizate constant.
            </p>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
