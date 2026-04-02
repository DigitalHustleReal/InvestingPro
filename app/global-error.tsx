'use client';

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to Sentry
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
          <p className="text-gray-500 mb-8">
            We apologize for the inconvenience. A critical error has occurred. Our team has been notified.
          </p>
          <div className="flex flex-col gap-3">
              <Button onClick={() => reset()} className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                Try again
              </Button>
              <button onClick={() => window.location.href = '/'} className="text-sm text-gray-600 hover:text-gray-600">
                  Go to Homepage
              </button>
          </div>
          {error.digest && (
              <p className="mt-6 text-[10px] text-gray-300 font-mono">Reference: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
