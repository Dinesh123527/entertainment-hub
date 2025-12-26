/**
 * Get a color based on movie rating/genre
 * Since TMDB images have CORS restrictions, we use genre-based colors
 */
export const extractDominantColor = async (imageUrl) => {
    // Default Netflix red color - can't extract from TMDB images due to CORS
    return { r: 229, g: 9, b: 20 };
};

/**
 * Convert RGB to HSL for better color manipulation
 */
export const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
            default:
                h = 0;
        }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
};

/**
 * Apply dynamic theme colors to the document
 */
export const applyDynamicTheme = (color) => {
    const { r, g, b } = color;

    // Set CSS custom properties for dynamic theming
    document.documentElement.style.setProperty("--dynamic-color", `rgb(${r}, ${g}, ${b})`);
    document.documentElement.style.setProperty("--dynamic-color-rgb", `${r}, ${g}, ${b}`);
    document.documentElement.style.setProperty("--dynamic-color-light", `rgba(${r}, ${g}, ${b}, 0.2)`);
    document.documentElement.style.setProperty("--dynamic-color-glow", `0 0 30px rgba(${r}, ${g}, ${b}, 0.5)`);
};

/**
 * Reset dynamic theme to defaults
 */
export const resetDynamicTheme = () => {
    document.documentElement.style.removeProperty("--dynamic-color");
    document.documentElement.style.removeProperty("--dynamic-color-rgb");
    document.documentElement.style.removeProperty("--dynamic-color-light");
    document.documentElement.style.removeProperty("--dynamic-color-glow");
};
