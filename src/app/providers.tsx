"use client";

import { MantineProvider, createTheme } from "@mantine/core";
import { SessionProvider, useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, createContext, useContext } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useUpdateUserTheme, useUserTheme } from "@/data/use-auth";

// Create a context for color scheme management
type ColorScheme = "light" | "dark" | "auto";

type ColorSchemeContextType = {
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => Promise<void>;
};

export const ColorSchemeContext = createContext<ColorSchemeContextType>({
  colorScheme: "light",
  setColorScheme: async () => {},
});

// Custom hook to use color scheme
export const useColorScheme = () => useContext(ColorSchemeContext);

// Create theme
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

// The inner provider that handles theme logic
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Use localStorage as the primary storage mechanism
  const [storedColorScheme, setStoredColorScheme] =
    useLocalStorage<ColorScheme>("zyntax-color-scheme", "light");

  // State to track initialization
  const [isInitialized, setIsInitialized] = useState(false);

  // React Query hooks for theme operations
  const themeQuery = useUserTheme({
    enabled: isAuthenticated,
  });

  const themeMutation = useUpdateUserTheme();

  // Handle theme query success
  useEffect(() => {
    if (themeQuery.isSuccess && themeQuery.data) {
      // Only update if different from current value
      if (themeQuery.data.colorScheme !== storedColorScheme) {
        setStoredColorScheme(themeQuery.data.colorScheme as ColorScheme);
      }
      if (!isInitialized) setIsInitialized(true);
    }
  }, [themeQuery.isSuccess, themeQuery.data, storedColorScheme, isInitialized]);

  // Handle theme query error
  useEffect(() => {
    if (themeQuery.isError && !isInitialized) {
      setIsInitialized(true);
    }
  }, [themeQuery.isError, isInitialized]);

  // Keep a local state for immediate UI updates
  const [currentColorScheme, setCurrentColorScheme] = useState<
    "light" | "dark"
  >(
    storedColorScheme === "auto"
      ? window?.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : storedColorScheme === "dark"
        ? "dark"
        : "light"
  );

  // Listen for system preference changes if using "auto"
  useEffect(() => {
    if (storedColorScheme === "auto" && typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentColorScheme(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [storedColorScheme]);

  // Update current theme whenever stored preference changes
  useEffect(() => {
    if (storedColorScheme === "auto" && typeof window !== "undefined") {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setCurrentColorScheme(isDarkMode ? "dark" : "light");
    } else {
      setCurrentColorScheme(storedColorScheme === "dark" ? "dark" : "light");
    }
  }, [storedColorScheme]);

  // Sync with server when local preference changes and user is authenticated
  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      themeMutation.mutate(storedColorScheme);
    }
  }, [isAuthenticated, storedColorScheme, isInitialized]);

  // Initialize for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated && !isInitialized) {
      setIsInitialized(true);
    }
  }, [isAuthenticated, isInitialized]);

  // Function to save color scheme preference
  const setColorScheme = async (newColorScheme: ColorScheme) => {
    // Always update localStorage first (main source of truth)
    setStoredColorScheme(newColorScheme);

    // Update current color scheme for immediate UI response
    if (newColorScheme === "auto" && typeof window !== "undefined") {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setCurrentColorScheme(isDarkMode ? "dark" : "light");
    } else {
      setCurrentColorScheme(newColorScheme === "dark" ? "dark" : "light");
    }

    // Server sync happens through the useEffect
  };

  // Only render children once we've initialized the color scheme
  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <ColorSchemeContext.Provider
      value={{ colorScheme: storedColorScheme, setColorScheme }}
    >
      <MantineProvider theme={theme} forceColorScheme={currentColorScheme}>
        {children}
      </MantineProvider>
    </ColorSchemeContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
