import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// Brightness modes
export const MODES = {
    LIGHT: "light",
    DARK: "dark",
    SYSTEM: "system",
};

// Color themes
export const COLOR_THEMES = {
    NETFLIX: "netflix",
    OCEAN: "ocean",
    PURPLE: "purple",
    FOREST: "forest",
    SUNSET: "sunset",
};

// Theme metadata for UI
export const THEME_INFO = {
    netflix: { name: "Netflix", emoji: "🎬", color: "#e50914" },
    ocean: { name: "Ocean", emoji: "🌊", color: "#00d4ff" },
    purple: { name: "Purple", emoji: "🍇", color: "#9b59b6" },
    forest: { name: "Forest", emoji: "🌲", color: "#2ecc71" },
    sunset: { name: "Sunset", emoji: "🌅", color: "#ff6348" },
};

export const ThemeProvider = ({ children }) => {
    const getInitialMode = () => {
        const savedMode = localStorage.getItem("storyflix-mode");
        if (savedMode && Object.values(MODES).includes(savedMode)) {
            return savedMode;
        }
        return MODES.SYSTEM;
    };

    const getInitialColorTheme = () => {
        const savedTheme = localStorage.getItem("storyflix-color-theme");
        if (savedTheme && Object.values(COLOR_THEMES).includes(savedTheme)) {
            return savedTheme;
        }
        return COLOR_THEMES.NETFLIX;
    };

    const [mode, setMode] = useState(getInitialMode);
    const [colorTheme, setColorTheme] = useState(getInitialColorTheme);
    const [resolvedMode, setResolvedMode] = useState(MODES.DARK);

    // Detect system preference
    const getSystemMode = () => {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
            return MODES.LIGHT;
        }
        return MODES.DARK;
    };

    useEffect(() => {
        const updateResolvedMode = () => {
            if (mode === MODES.SYSTEM) {
                setResolvedMode(getSystemMode());
            } else {
                setResolvedMode(mode);
            }
        };

        updateResolvedMode();

        const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
        const handleChange = () => {
            if (mode === MODES.SYSTEM) {
                setResolvedMode(getSystemMode());
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [mode]);

    useEffect(() => {
        // Set both mode and color theme as data attributes
        document.documentElement.setAttribute("data-mode", resolvedMode);
        document.documentElement.setAttribute("data-color-theme", colorTheme);
        localStorage.setItem("storyflix-mode", mode);
        localStorage.setItem("storyflix-color-theme", colorTheme);
    }, [mode, colorTheme, resolvedMode]);

    const toggleMode = (newMode) => {
        if (Object.values(MODES).includes(newMode)) {
            setMode(newMode);
        }
    };

    const setTheme = (newTheme) => {
        if (Object.values(COLOR_THEMES).includes(newTheme)) {
            setColorTheme(newTheme);
        }
    };

    const cycleColorTheme = () => {
        const themes = Object.values(COLOR_THEMES);
        const currentIndex = themes.indexOf(colorTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setColorTheme(themes[nextIndex]);
    };

    return (
        <ThemeContext.Provider
            value={{
                mode,
                colorTheme,
                resolvedMode,
                toggleMode,
                setTheme,
                cycleColorTheme,
                isDark: resolvedMode === MODES.DARK,
                isLight: resolvedMode === MODES.LIGHT,
                isSystem: mode === MODES.SYSTEM,
                themeInfo: THEME_INFO[colorTheme],
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export default ThemeContext;

