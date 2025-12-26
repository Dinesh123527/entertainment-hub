import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneIcon from "@mui/icons-material/Tune";
import { useState } from "react";
import "./AdvancedFilters.css";

const LANGUAGES = [
    { code: "", label: "All" },
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "te", label: "Telugu" },
    { code: "ta", label: "Tamil" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "ko", label: "Korean" },
    { code: "ja", label: "Japanese" },
    { code: "zh", label: "Chinese" },
    { code: "de", label: "German" },
    { code: "it", label: "Italian" },
    { code: "pt", label: "Portuguese" },
    { code: "ru", label: "Russian" },
    { code: "ar", label: "Arabic" },
];

// Runtime options in minutes
const RUNTIME_OPTIONS = [
    { value: 0, label: "Any" },
    { value: 60, label: "< 1hr" },
    { value: 90, label: "< 1.5hr" },
    { value: 120, label: "< 2hr" },
    { value: 150, label: "< 2.5hr" },
    { value: 180, label: "< 3hr" },
];

const AdvancedFilters = ({
    year,
    setYear,
    minRating,
    setMinRating,
    language,
    setLanguage,
    maxRuntime,
    setMaxRuntime,
    onApply,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const currentYear = new Date().getFullYear();
    // Show recent 10 years as chips + "All" option
    const recentYears = ["", ...Array.from({ length: 10 }, (_, i) => currentYear - i)];

    const handleReset = () => {
        setYear("");
        setMinRating(0);
        setLanguage("");
        if (setMaxRuntime) setMaxRuntime(0);
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
                {/* Year Filter - Chip Style */}
                <div className="filter-section">
                    <label className="filter-label">Release Year</label>
                    <div className="chip-container">
                        {recentYears.map((y) => (
                            <button
                                key={y || "all"}
                                className={`filter-chip ${year === y ? "active" : ""}`}
                                onClick={() => setYear(y)}
                            >
                                {y || "All Years"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rating Filter */}
                <div className="filter-section">
                    <label className="filter-label">
                        Min Rating: {minRating > 0 ? `${minRating}+` : "Any"}
                    </label>
                    <div className="rating-chips">
                        {[0, 5, 6, 7, 8, 9].map((rating) => (
                            <button
                                key={rating}
                                className={`rating-chip ${minRating === rating ? "active" : ""}`}
                                onClick={() => setMinRating(rating)}
                            >
                                {rating === 0 ? "Any" : `${rating}+`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Runtime Filter - NEW */}
                {setMaxRuntime && (
                    <div className="filter-section">
                        <label className="filter-label">
                            <AccessTimeIcon className="filter-icon" />
                            I have time for:
                        </label>
                        <div className="rating-chips">
                            {RUNTIME_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    className={`rating-chip runtime-chip ${maxRuntime === option.value ? "active" : ""}`}
                                    onClick={() => setMaxRuntime(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Language Filter - Chip Style */}
                <div className="filter-section">
                    <label className="filter-label">Language</label>
                    <div className="chip-container">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code || "all"}
                                className={`filter-chip ${language === lang.code ? "active" : ""}`}
                                onClick={() => setLanguage(lang.code)}
                            >
                                {lang.label}
                            </button>
                        ))}
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
