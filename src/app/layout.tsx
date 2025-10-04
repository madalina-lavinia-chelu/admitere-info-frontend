import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ReduxProvider from "@/redux/redux-provider";
import { AppFirstLogic } from "@/auth/app-first-logic";

const geistSans = Rethink_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grile Admitere",
  description: "Rezolvă grilele de admitere gratuit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.className} antialiased`}
        suppressHydrationWarning={true}>
        <ReduxProvider>
          <AppFirstLogic>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange>
              {children}
              <Toaster
                toastOptions={{
                  className: `${geistSans.className}`,
                }}
              />
            </ThemeProvider>
          </AppFirstLogic>
        </ReduxProvider>
      </body>
    </html>
  );
}
