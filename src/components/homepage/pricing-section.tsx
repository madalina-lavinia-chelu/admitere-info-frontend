import Link from "next/link";
import { Button } from "@/components/ui/button";
import { paths } from "@/routes/paths";
import MotionWrapper from "@/components/ui/motion-wrapper";

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="container max-w-6xl mx-auto px-4 py-16 md:py-24">
      <MotionWrapper type="fade-up" duration={0.6} delay={0.1}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Planuri de preț simple și transparente
          </h2>
          <p className="md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Alege planul care se potrivește cel mai bine nevoilor tale de
            învățare
          </p>
        </div>
      </MotionWrapper>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <MotionWrapper type="slide-fade-up" duration={0.6} delay={0.2}>
          <div className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Gratuit</h3>
              <div className="text-4xl font-bold mb-2">
                0{" "}
                <span className="text-lg font-normal text-muted-foreground">
                  RON
                </span>
              </div>
              <p className="text-muted-foreground">Perfect pentru a începe</p>
            </div>
            <ul className="space-y-2 md:space-y-4 text-sm md:text-base mb-8">
              <li className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Acces la 10 întrebări pentru a testa platforma</span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Statistici de bază</span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Suport prin email</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline" asChild>
              <Link href={paths.auth.register}>Începe gratuit</Link>
            </Button>
          </div>
        </MotionWrapper>{" "}
        {/* Premium Plan */}
        <MotionWrapper type="slide-fade-up" duration={0.6} delay={0.4}>
          <div className="bg-card rounded-2xl p-8 border-2 border-primary shadow-lg hover:shadow-xl transition-all duration-300 relative ring-2 ring-blue-500/20 shadow-blue-500/25 hover:shadow-blue-500/40 hover:ring-blue-500/30">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                Limited offer
              </span>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="text-4xl font-bold mb-2">
                29{" "}
                <span className="text-lg font-normal text-muted-foreground">
                  RON/lună
                </span>
              </div>
              <p className="text-muted-foreground">Pentru învățare completă</p>
            </div>
            <ul className="space-y-2 md:space-y-4 text-sm md:text-base mb-8">
              <li className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Acces nelimitat la toate întrebările</span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Statistici detaliate și analiză avansată</span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Istoric complet al activității</span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Teste personalizate avansate</span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Suport prioritar</span>
              </li>
            </ul>
            <Button className="w-full" asChild>
              <Link href={paths.auth.register}>Începe Premium</Link>
            </Button>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
