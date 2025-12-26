/**
 * Extract dominant color from an image using canvas
 * Returns the most prominent color from the image
 */
export const extractDominantColor = (imageUrl) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";

        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                // Use smaller size for performance
                const size = 50;
                canvas.width = size;
                canvas.height = size;

                ctx.drawImage(img, 0, 0, size, size);

                const imageData = ctx.getImageData(0, 0, size, size).data;

                // Color counting with binning for better results
                const colorMap = {};

                for (let i = 0; i < imageData.length; i += 4) {
                    const r = Math.round(imageData[i] / 10) * 10;
                    const g = Math.round(imageData[i + 1] / 10) * 10;
                    const b = Math.round(imageData[i + 2] / 10) * 10;
                    const a = imageData[i + 3];

                    // Skip transparent and near-black/white pixels
                    if (a < 128) continue;
                    if (r + g + b < 30) continue; // Too dark
                    if (r + g + b > 720) continue; // Too bright

                    // Create a saturation check - prefer vibrant colors
                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    const saturation = max === 0 ? 0 : (max - min) / max;

                    // Skip low saturation colors (grays)
                    if (saturation < 0.2) continue;

                    const key = `${r},${g},${b}`;
                    colorMap[key] = (colorMap[key] || 0) + 1;
                }

                // Find most common vibrant color
                let maxCount = 0;
                let dominantColor = { r: 229, g: 9, b: 20 }; // Default Netflix red

                for (const key in colorMap) {
                    if (colorMap[key] > maxCount) {
                        maxCount = colorMap[key];
                        const [r, g, b] = key.split(",").map(Number);
                        dominantColor = { r, g, b };
                    }
                }

                resolve(dominantColor);
            } catch (error) {
                // Fallback to default color
                resolve({ r: 229, g: 9, b: 20 });
            }
        };

        img.onerror = () => {
            resolve({ r: 229, g: 9, b: 20 }); // Fallback
        };

        img.src = imageUrl;
    });
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
