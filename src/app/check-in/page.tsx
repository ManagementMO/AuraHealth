"use client";

import { useState, useEffect } from "react";
import Chat from "@/components/aura/Chat";

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
      <div className="grow flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grow flex flex-col items-center justify-center">
        <div className="text-center text-red-600">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="grow flex flex-col items-center justify-center">
        <div className="text-center text-red-600">
          <p>Unable to get access token</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="grow flex flex-col">
      <Chat accessToken={accessToken} />
      </div>
    </div>
    
  );
}
