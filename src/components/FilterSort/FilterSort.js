import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import { useState } from "react";
import "./FilterSort.css";

const FilterSort = ({
    sortBy,
    setSortBy,
    yearFrom,
    setYearFrom,
    yearTo,
    setYearTo,
    minRating,
    setMinRating,
    onApply,
    type = "movie",
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const sortOptions = [
        { value: "popularity.desc", label: "Popularity (High to Low)" },
        { value: "popularity.asc", label: "Popularity (Low to High)" },
        { value: "vote_average.desc", label: "Rating (High to Low)" },
        { value: "vote_average.asc", label: "Rating (Low to High)" },
        { value: type === "movie" ? "primary_release_date.desc" : "first_air_date.desc", label: "Release Date (Newest)" },
        { value: type === "movie" ? "primary_release_date.asc" : "first_air_date.asc", label: "Release Date (Oldest)" },
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    const handleReset = () => {
        setSortBy("popularity.desc");
        setYearFrom("");
        setYearTo("");
        setMinRating(0);
        onApply();
    };

    return (
        <div className="filter-sort-container">
            {/* Toggle Button */}
            <button
                className="filter-toggle-btn"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <FilterListIcon />
                <span>Filters & Sort</span>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>

            {/* Expandable Panel */}
            <div className={`filter-panel ${isExpanded ? "expanded" : ""}`}>
                <div className="filter-row">
                    {/* Sort By */}
                    <div className="filter-group">
                        <label>
                            <SortIcon className="filter-icon" />
                            Sort By
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                onApply();
                            }}
                            className="filter-select"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Year Range */}
                    <div className="filter-group">
                        <label>Year Range</label>
                        <div className="year-range">
                            <select
                                value={yearFrom}
                                onChange={(e) => setYearFrom(e.target.value)}
                                className="filter-select year-select"
                            >
                                <option value="">From</option>
                                {years.map((year) => (
                                    <option key={`from-${year}`} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <span className="range-separator">–</span>
                            <select
                                value={yearTo}
                                onChange={(e) => setYearTo(e.target.value)}
                                className="filter-select year-select"
                            >
                                <option value="">To</option>
                                {years.map((year) => (
                                    <option key={`to-${year}`} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Min Rating */}
                    <div className="filter-group">
                        <label>Min Rating: {minRating > 0 ? minRating : "Any"}</label>
                        <input
                            type="range"
                            min="0"
                            max="9"
                            step="1"
                            value={minRating}
                            onChange={(e) => setMinRating(Number(e.target.value))}
                            className="rating-slider"
                        />
                        <div className="rating-labels">
                            <span>0</span>
                            <span>5</span>
                            <span>9+</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="filter-actions">
                    <button className="apply-btn" onClick={onApply}>
                        Apply Filters
                    </button>
                    <button className="reset-btn" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSort;
