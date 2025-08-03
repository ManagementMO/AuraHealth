'use client';

import { createContext, useEffect, useState, ReactNode } from "react";

type ChildElement = ReactNode;

const HumeContext = createContext<HumeState>({
  apiKey: null,
  isLoading: true,
  error: null,
});

type HumeState = {
  apiKey: string | null;
  isLoading: boolean;
  error: string | null;
};

type HumeProps = {
  children: ChildElement;
};

function Hume({ children }: HumeProps) {
  const [hume, setHume] = useState<HumeState>({
    apiKey: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchApiKeyInner = async () => {
      try {
        console.log("Fetching Hume API key from server...");
        
        const response = await fetch('/api/hume/api-key');
        if (!response.ok) {
          throw new Error(`Failed to fetch API key: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.apiKey) {
          throw new Error('No API key received from server');
        }
        
        console.log('✅ Hume API key loaded successfully');
        setHume({
          apiKey: data.apiKey,
          isLoading: false,
          error: null,
        });
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ Failed to load Hume API key:', errorMessage);
        setHume({
          apiKey: null,
          isLoading: false,
          error: errorMessage,
        });
      }
    };

    fetchApiKeyInner();
  }, []);

  return <HumeContext.Provider value={hume}>{children}</HumeContext.Provider>;
}

export { Hume, HumeContext }; 