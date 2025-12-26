import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneIcon from "@mui/icons-material/Tune";
import { useState } from "react";
import "./AdvancedFilters.css";

const LANGUAGES = [
    { code: "", label: "Any Language" },
    { code: "en", label: "English" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "it", label: "Italian" },
    { code: "pt", label: "Portuguese" },
    { code: "hi", label: "Hindi" },
    { code: "ja", label: "Japanese" },
    { code: "ko", label: "Korean" },
    { code: "zh", label: "Chinese" },
    { code: "ru", label: "Russian" },
    { code: "ar", label: "Arabic" },
];

const AdvancedFilters = ({
    year,
    setYear,
    minRating,
    setMinRating,
    language,
    setLanguage,
    onApply,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const currentYear = new Date().getFullYear();
    const years = ["", ...Array.from({ length: 100 }, (_, i) => currentYear - i)];

    const handleReset = () => {
        setYear("");
        setMinRating(0);
        setLanguage("");
    };

    return (
        <div className="advanced-filters-container">
            <button
                className="advanced-toggle-btn"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <TuneIcon />
                <span>Advanced Filters</span>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>

            <div className={`advanced-panel ${isExpanded ? "expanded" : ""}`}>
                <div className="advanced-row">
                    {/* Year Filter */}
                    <div className="advanced-group">
                        <label>Release Year</label>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="advanced-select"
                        >
                            <option value="">Any Year</option>
                            {years.slice(1).map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Rating Filter */}
                    <div className="advanced-group">
                        <label>Min Rating: {minRating > 0 ? `${minRating}+` : "Any"}</label>
                        <input
                            type="range"
                            min="0"
                            max="9"
                            step="1"
                            value={minRating}
                            onChange={(e) => setMinRating(Number(e.target.value))}
                            className="advanced-slider"
                        />
                        <div className="slider-labels">
                            <span>0</span>
                            <span>5</span>
                            <span>9+</span>
                        </div>
                    </div>

                    {/* Language Filter */}
                    <div className="advanced-group">
                        <label>Language</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="advanced-select"
                        >
                            {LANGUAGES.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="advanced-actions">
                    <button className="advanced-apply-btn" onClick={onApply}>
                        Apply Filters
                    </button>
                    <button className="advanced-reset-btn" onClick={handleReset}>
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvancedFilters;
