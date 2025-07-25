import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  toggleTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Helper functions for cookie management
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  // Use domain=.encodly.com for production, no domain for localhost
  const isProduction = window.location.hostname.includes('encodly.com');
  const domainPart = isProduction ? 'domain=.encodly.com;' : '';
  
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;${domainPart}SameSite=Lax`;
};

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Try cookie first, then fallback to localStorage for development
    const cookieTheme = getCookie('encodly-theme') as Theme;
    const localTheme = localStorage.getItem(storageKey) as Theme;
    return cookieTheme || localTheme || defaultTheme;
  })

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])


  const value = {
    theme,
    setTheme: (theme: Theme) => {
      // Store in both cookie (for cross-subdomain) and localStorage (for development)
      setCookie('encodly-theme', theme);
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    toggleTheme: () => {
      const actualTheme = theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme
      
      const newTheme = actualTheme === "dark" ? "light" : "dark"
      // Store in both cookie (for cross-subdomain) and localStorage (for development)
      setCookie('encodly-theme', newTheme);
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}