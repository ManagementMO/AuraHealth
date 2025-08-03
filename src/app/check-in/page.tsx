"use client";

import { useState, useEffect } from "react";
import Chat from "@/components/aura/Chat";
import PracticeSession from "@/components/aura/PracticeSession";

export default function Page() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch('/api/hume/token');
        if (!response.ok) {
          throw new Error('Failed to fetch access token');
        }
        const data = await response.json();
        if (!data.accessToken) {
          throw new Error('No access token received');
        }
        setAccessToken(data.accessToken);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get access token');
      } finally {
        setLoading(false);
      }
    }

    fetchToken();
  }, []);

  if (loading) {
    return (
      <div className="grow flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 font-medium">Preparing your practice session...</p>
          <p className="text-sm text-gray-500 mt-2">Loading Aura AI companion</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grow flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-semibold text-xl text-red-800 mb-2">Connection Error</p>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="grow flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <p className="text-gray-800 font-semibold">Unable to authenticate</p>
          <p className="text-gray-600 mt-2">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <PracticeSession accessToken={accessToken} />
  );
}
