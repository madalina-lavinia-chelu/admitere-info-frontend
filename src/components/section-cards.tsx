"use client";

import Link from "next/link";
import { paths } from "@/routes/paths";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ListChecks,
  UsersThree,
  ChatCircleText,
  UserCircle,
  ChartLineUp,
  Stack,
  CreditCard,
  Info,
  Calculator,
  Atom,
  Tree,
} from "@phosphor-icons/react";
import { PERMISSIONS } from "@/utils/permissions.utils";
import { useAppSelector } from "@/redux/store";

export function SectionCards() {
  const user = useAppSelector((state) => state.auth.user as any);
  const isAdmin = user?.role_info?.name === PERMISSIONS.ADMIN;
  const adminSections = [
    {
      title: "Grile",
      description:
        "Gestionează întrebările și răspunsurile pentru testele platformei",
      icon: <ListChecks className="h-12 w-12" />,
      path: paths.dashboard.question.list,
      color: "from-blue-500 to-blue-600",
      buttonText: "Administrare grile",
    },
    {
      title: "Atribute",
      description:
        "Administrează sursele și capitolele pentru organizarea conținutului",
      icon: <Tree className="h-12 w-12" />,
      path: paths.dashboard.attributes,
      color: "from-green-500 to-green-600",
      buttonText: "Administrare atribute",
    },
    {
      title: "Utilizatori",
      description:
        "Gestionează conturile și permisiunile utilizatorilor înregistrați",
      icon: <UsersThree className="h-12 w-12" />,
      path: paths.dashboard.user.list,
      color: "from-blue-500 to-indigo-500",
      buttonText: "Administrare utilizatori",
    },
    {
      title: "Feedback",
      description:
        "Vizualizează feedback-ul și sugestiile primite de la utilizatori",
      icon: <ChatCircleText className="h-12 w-12" />,
      path: paths.dashboard.feedback.list,
      color: "from-blue-400 to-blue-600",
      buttonText: "Vezi feedback",
    },
    {
      title: "Profil",
      description:
        "Actualizează informațiile personale și setările contului tău",
      icon: <UserCircle className="h-12 w-12" />,
      path: paths.dashboard.profile,
      color: "from-indigo-500 to-blue-600",
      buttonText: "Accesează profil",
    },
  ];
  const disciplineSections = [
    {
      title: "Informatică",
      description:
        "Accesează testele de informatică și evaluează-ți cunoștințele în programare, algoritmi și structuri de date",
      icon: <Info className="h-16 w-16" />,
      path: `${paths.dashboard.question.answer}?chapter=info`,
      color: "from-blue-500 to-blue-600",
      buttonText: "Rezolvă grile informatică",
    },
    {
      title: "Matematică",
      description:
        "Practică exercițiile de matematică și îmbunătățește-ți abilitățile în analiză, algebră și geometrie",
      icon: <Calculator className="h-16 w-16" />,
      path: `${paths.dashboard.question.answer}?chapter=matematica`,
      color: "from-green-500 to-green-600",
      buttonText: "Rezolvă grile matematică",
    },
    {
      title: "Fizică",
      description:
        "Explorează conceptele de fizică și rezolvă probleme din mecanică, termodinamică și electromagnetism",
      icon: <Atom className="h-16 w-16" />,
      path: `${paths.dashboard.question.answer}?chapter=fizica`,
      color: "from-purple-500 to-purple-600",
      buttonText: "Rezolvă grile fizică",
    },
  ];

  const memberSections = [
    {
      title: "Statistici",
      description:
        "Vizualizează progresul tău și domeniile care necesită îmbunătățiri",
      icon: <ChartLineUp className="h-12 w-12" />,
      path: paths.dashboard.stats,
      color: "from-blue-400 to-indigo-500",
      buttonText: "Vezi statistici",
    },
    {
      title: "Abonament",
      description:
        "Gestionează abonamentul tău și accesul la conținutul premium",
      icon: <CreditCard className="h-12 w-12" />,
      path: paths.dashboard.subscription,
      color: "from-indigo-500 to-blue-600",
      buttonText: "Vezi abonament",
    },
    {
      title: "Istoric",
      description:
        "Vizualizează sesiunile de practică anterioare și rezultatele obținute",
      icon: <Stack className="h-12 w-12" />,
      path: paths.dashboard.history,
      color: "from-blue-500 to-indigo-600",
      buttonText: "Vezi istoricul",
    },
    {
      title: "Feedback",
      description:
        "Oferă feedback și raportează probleme pentru îmbunătățirea platformei",
      icon: <ChatCircleText className="h-12 w-12" />,
      path: paths.dashboard.feedback.report,
      color: "from-blue-400 to-blue-600",
      buttonText: "Trimite feedback",
    },
    {
      title: "Profil",
      description:
        "Actualizează informațiile personale și setările contului tău",
      icon: <UserCircle className="h-12 w-12" />,
      path: paths.dashboard.profile,
      color: "from-indigo-400 to-blue-500",
      buttonText: "Accesează profil",
    },
  ]; // Render admin sections in original layout
  if (isAdmin) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {adminSections.map((section, index) => (
          <div key={index} className="group relative">
            {/* Background gradient that follows cursor on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-2xl blur opacity-0 group-hover:opacity-10 transition-all duration-500 group-hover:duration-200"></div>

            <Card className="relative h-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm group-hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
              {/* Subtle top accent line */}
              <div
                className={`h-0.5 w-full bg-gradient-to-r ${section.color} opacity-60`}></div>

              <CardContent className="p-4 sm:p-5 lg:p-6">
                {/* Icon with modern styling */}
                <div className="mb-3 sm:mb-4 lg:mb-6">
                  <div className="inline-flex p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl bg-blue-50 dark:bg-blue-950/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-all duration-300">
                    <div className="text-blue-600 dark:text-blue-400 [&>svg]:w-8 [&>svg]:h-8 sm:[&>svg]:w-10 sm:[&>svg]:h-10 lg:[&>svg]:w-12 lg:[&>svg]:h-12">
                      {section.icon}
                    </div>
                  </div>
                </div>
                {/* Content */}
                <div className="space-y-2 sm:space-y-2.5 lg:space-y-3 mb-4 sm:mb-5 lg:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {section.description}
                  </p>
                </div>
                {/* Modern CTA Button */}
                <Button
                  asChild
                  size="sm"
                  className="w-full rounded-lg h-8 sm:h-9 lg:h-10 font-medium shadow-sm hover:shadow-md transition-all duration-300 text-sm">
                  <Link
                    href={section.path}
                    className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <span className="truncate">{section.buttonText}</span>
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }
  // Render member layout with hierarchical structure
  return (
    <div className="space-y-12 px-4 lg:px-6">
      {/* Main Section - Discipline Cards */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl tracking-tight font-bold text-gray-900 dark:text-gray-100 mb">
            Discipline
          </h2>
          <p className="text-gray-600 dark:text-gray-400 tracking-tight">
            Alege disciplina pentru care dorești să exersezi
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:gap-8 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
          {disciplineSections.map((section, index) => (
            <div key={index} className="group relative">
              {/* Enhanced background gradient for main cards */}
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${section.color} rounded-2xl blur opacity-0 group-hover:opacity-15 transition-all duration-500 group-hover:duration-200`}></div>

              <Card className="relative h-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg group-hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                {/* Enhanced top accent line */}
                <div
                  className={`h-1 w-full bg-gradient-to-r ${section.color}`}></div>{" "}
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  {" "}
                  {/* Larger icon container */}
                  <div className="mb-4 sm:mb-5 lg:mb-6">
                    <div
                      className={`inline-flex p-3 lg:p-4 rounded-xl bg-gradient-to-br ${section.color
                        .replace("from-", "from-")
                        .replace(
                          "to-",
                          "to-"
                        )}/10 group-hover:scale-105 transition-all duration-300`}>
                      <div className="text-gray-700 dark:text-gray-300 [&>svg]:w-12 [&>svg]:h-12 lg:[&>svg]:w-14 lg:[&>svg]:h-14">
                        {section.icon}
                      </div>
                    </div>
                  </div>
                  {/* Enhanced content */}
                  <div className="space-y-2 lg:space-y-3 mb-4 sm:mb-5 lg:mb-6">
                    <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {section.title}
                    </h3>
                    <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                  {/* Enhanced CTA Button */}
                  <Button
                    asChild
                    size="default"
                    className={`w-full rounded-xl h-10 lg:h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm lg:text-base bg-gradient-to-r ${section.color} hover:scale-[1.02] text-white border-0`}>
                    <Link
                      href={section.path}
                      className="flex items-center justify-center gap-2">
                      <span className="truncate">{section.buttonText}</span>
                      <svg
                        className="w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-300 group-hover:translate-x-1 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Section - Other Features */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl tracking-tight font-semibold text-gray-900 dark:text-gray-100">
            Alte funcționalități
          </h2>
          <p className="text-gray-600 dark:text-gray-400 tracking-tight">
            Gestionează-ți contul și vizualizează progresul
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {memberSections.map((section, index) => (
            <div key={index} className="group relative">
              {/* Background gradient that follows cursor on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-2xl blur opacity-0 group-hover:opacity-10 transition-all duration-500 group-hover:duration-200"></div>

              <Card className="relative h-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm group-hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                {/* Subtle top accent line */}
                <div
                  className={`h-0.5 w-full bg-gradient-to-r ${section.color} opacity-60`}></div>

                <CardContent className="p-4 sm:p-5">
                  {/* Icon with modern styling */}
                  <div className="mb-3 sm:mb-4">
                    <div className="inline-flex p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-blue-50 dark:bg-blue-950/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-all duration-300">
                      <div className="text-blue-600 dark:text-blue-400 [&>svg]:w-8 [&>svg]:h-8 sm:[&>svg]:w-10 sm:[&>svg]:h-10">
                        {section.icon}
                      </div>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-5">
                    <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                      {section.description}
                    </p>
                  </div>
                  {/* Modern CTA Button */}
                  <Button
                    asChild
                    size="sm"
                    className="w-full rounded-lg h-9 font-medium shadow-sm hover:shadow-md transition-all duration-300 text-sm">
                    <Link
                      href={section.path}
                      className="flex items-center justify-center gap-1.5 sm:gap-2">
                      <span className="truncate">{section.buttonText}</span>
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
