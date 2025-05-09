"use client";

import { MantineProvider, createTheme } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

// Create a context for color scheme management
type ColorSchemeContextType = {
  colorScheme: "light" | "dark" | "auto";
  setColorScheme: (colorScheme: "light" | "dark" | "auto") => Promise<void>;
};

export const ColorSchemeContext = createContext<ColorSchemeContextType>({
  colorScheme: "light",
  setColorScheme: async () => {},
});

// Custom hook to use color scheme
export const useColorScheme = () => useContext(ColorSchemeContext);

const theme = createTheme({
  primaryColor: "blue",
  fontFamily: "Inter, sans-serif",
  colors: {
    blue: [
      "#e3f0ff",
      "#bdd9ff",
      "#8fc2ff",
      "#61aaff",
      "#3a94ff",
      "#1e84ff",
      "#0e76f0",
      "#0069dd",
      "#005cc1",
      "#004fa5",
    ],
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [colorScheme, setColorSchemeState] = useState<
    "light" | "dark" | "auto"
  >("light");
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to save color scheme preference
  const setColorScheme = async (newColorScheme: "light" | "dark" | "auto") => {
    setColorSchemeState(newColorScheme);

    // If user is authenticated, save preference to database
    try {
      await axios.post("/api/user/theme", { colorScheme: newColorScheme });
    } catch (error) {
      // For unauthenticated users, just save in localStorage
      localStorage.setItem("colorScheme", newColorScheme);
    }
  };

  // Initialize color scheme on mount
  useEffect(() => {
    const fetchColorScheme = async () => {
      try {
        // Try to get color scheme from the server (for authenticated users)
        const response = await axios.get("/api/user/theme");
        if (response.data?.success && response.data?.data?.colorScheme) {
          setColorSchemeState(response.data.data.colorScheme);
        }
      } catch (error) {
        // If API call fails (unauthenticated), check localStorage
        const storedScheme = localStorage.getItem("colorScheme");
        if (storedScheme && ["light", "dark", "auto"].includes(storedScheme)) {
          setColorSchemeState(storedScheme as "light" | "dark" | "auto");
        }
      } finally {
        setIsInitialized(true);
      }
    };

    fetchColorScheme();
  }, []);

  // Only render children once we've initialized the color scheme
  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme} defaultColorScheme={colorScheme}>
            {children}
          </MantineProvider>
        </QueryClientProvider>
      </SessionProvider>
    </ColorSchemeContext.Provider>
  );
}
