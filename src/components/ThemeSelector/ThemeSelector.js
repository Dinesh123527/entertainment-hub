import { COLOR_THEMES, MODES, THEME_INFO, useTheme } from "../../context/ThemeContext";
import "./ThemeSelector.css";

const ThemeSelector = () => {
    const { mode, colorTheme, toggleMode, setTheme } = useTheme();

    const getModeIcon = (modeOption) => {
        switch (modeOption) {
            case MODES.LIGHT: return "☀️";
            case MODES.DARK: return "🌙";
            case MODES.SYSTEM: return "💻";
            default: return "🌙";
        }
    };

    const getModeLabel = (modeOption) => {
        switch (modeOption) {
            case MODES.LIGHT: return "Light";
            case MODES.DARK: return "Dark";
            case MODES.SYSTEM: return "Auto";
            default: return "Dark";
        }
    };

    return (
        <div className="theme-selector">
            {/* Brightness Mode Toggle */}
            <div className="theme-selector__mode">
                <span className="theme-selector__label">Mode</span>
                <div className="mode-toggle">
                    {Object.values(MODES).map((modeOption) => (
                        <button
                            key={modeOption}
                            className={`mode-btn ${mode === modeOption ? "active" : ""}`}
                            onClick={() => toggleMode(modeOption)}
                            title={getModeLabel(modeOption)}
                        >
                            <span className="mode-icon">{getModeIcon(modeOption)}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Theme Selector */}
            <div className="theme-selector__colors">
                <span className="theme-selector__label">Theme</span>
                <div className="color-options">
                    {Object.values(COLOR_THEMES).map((themeKey) => {
                        const info = THEME_INFO[themeKey];
                        return (
                            <button
                                key={themeKey}
                                className={`color-btn ${colorTheme === themeKey ? "active" : ""}`}
                                onClick={() => setTheme(themeKey)}
                                title={info.name}
                                style={{ "--theme-color": info.color }}
                            >
                                <span className="color-swatch"></span>
                                <span className="color-emoji">{info.emoji}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ThemeSelector;
