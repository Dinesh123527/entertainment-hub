import { THEMES, useTheme } from "../../context/ThemeContext";
import "./ThemeToggle.css";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    const getIcon = (themeOption) => {
        switch (themeOption) {
            case THEMES.LIGHT:
                return "☀️";
            case THEMES.DARK:
                return "🌙";
            case THEMES.SYSTEM:
                return "💻";
            default:
                return "🌙";
        }
    };

    const getLabel = (themeOption) => {
        switch (themeOption) {
            case THEMES.LIGHT:
                return "Light";
            case THEMES.DARK:
                return "Dark";
            case THEMES.SYSTEM:
                return "System";
            default:
                return "Dark";
        }
    };

    return (
        <div className="theme-toggle">
            <div className="theme-toggle__container">
                {Object.values(THEMES).map((themeOption) => (
                    <button
                        key={themeOption}
                        className={`theme-toggle__btn ${theme === themeOption ? "active" : ""}`}
                        onClick={() => toggleTheme(themeOption)}
                        title={getLabel(themeOption)}
                        aria-label={`Switch to ${getLabel(themeOption)} mode`}
                    >
                        <span className="theme-toggle__icon">{getIcon(themeOption)}</span>
                        <span className="theme-toggle__label">{getLabel(themeOption)}</span>
                    </button>
                ))}
                <div
                    className="theme-toggle__indicator"
                    style={{
                        transform: `translateX(${Object.values(THEMES).indexOf(theme) * 100}%)`
                    }}
                />
            </div>
        </div>
    );
};

export default ThemeToggle;
