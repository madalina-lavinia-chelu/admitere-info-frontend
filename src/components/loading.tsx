import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <div className="flex flex-col items-center space-y-8">
        {/* Modern animated loader */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>

          {/* Animated gradient ring */}
          <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-500 border-b-blue-400 animate-spin shadow-lg"></div>

          {/* Inner pulsing dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full animate-pulse shadow-md"></div>
          </div>

          {/* Floating particles */}
          <div className="absolute -top-2 -left-2 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-75"></div>
          <div
            className="absolute -bottom-2 -right-2 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping opacity-60"
            style={{ animationDelay: "0.5s" }}></div>
          <div
            className="absolute top-0 -right-3 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-50"
            style={{ animationDelay: "1s" }}></div>
        </div>

        {/* Modern loading text with gradient */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent animate-pulse">
            Se încarcă
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium tracking-wide">
            Pregătim totul pentru tine...
          </p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}></div>
      </div>
    </div>
  );
}
