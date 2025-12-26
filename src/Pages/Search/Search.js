/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Tab, Tabs } from "@material-ui/core";
import MovieIcon from "@mui/icons-material/Movie";
import SearchIcon from "@mui/icons-material/Search";
import TvIcon from "@mui/icons-material/Tv";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useEffect, useState } from "react";
import AdvancedFilters from "../../components/AdvancedFilters/AdvancedFilters";
import CustomPagination from "../../components/Pagination/CustomPagination";
import SingleContent from "../../components/SingleContent/SingleContent";
import { SkeletonGrid } from "../../components/SkeletonCard/SkeletonCard";
import "./Search.css";

const Search = () => {
  const [type, setType] = useState(0);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Advanced filter states
  const [year, setYear] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [language, setLanguage] = useState("");

  const fetchSearch = async () => {
    if (!searchText.trim()) return;

    setLoading(true);
    setHasSearched(true);
    const startTime = Date.now();
    const MIN_LOADING_TIME = 800;

    try {
      // Build URL with filters
      let url = `https://api.themoviedb.org/3/search/${type ? "tv" : "movie"}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${searchText}&page=${page}&include_adult=false`;

      const { data } = await axios.get(url);

      // Apply client-side filtering for year, rating, and language
      // (TMDb search API has limited filter support, so we filter results)
      let filteredResults = data.results;

      if (year) {
        filteredResults = filteredResults.filter((item) => {
          const dateField = type ? item.first_air_date : item.release_date;
          return dateField && dateField.startsWith(year);
        });
      }

      if (minRating > 0) {
        filteredResults = filteredResults.filter(
          (item) => item.vote_average >= minRating
        );
      }

      if (language) {
        filteredResults = filteredResults.filter(
          (item) => item.original_language === language
        );
      }

      setContent(filteredResults);
      setNumOfPages(data.total_pages);
      // Show actual API total when no filters, otherwise show filtered count
      const hasFilters = year || minRating > 0 || language;
      setTotalResults(hasFilters ? filteredResults.length : data.total_results);
    } catch (error) {
      console.error("Search error:", error);
      setContent([]);
    } finally {
      // Ensure minimum loading time for skeleton visibility
      const elapsed = Date.now() - startTime;
      const remaining = MIN_LOADING_TIME - elapsed;
      if (remaining > 0) {
        setTimeout(() => setLoading(false), remaining);
      } else {
        setLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchSearch();
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchSearch();
  };

  useEffect(() => {
    window.scroll(0, 0);
    if (hasSearched && searchText.trim()) {
      fetchSearch();
    }
  }, [type, page]);

  return (
    <div className="search-page">
      {/* Enhanced Search Header */}
      <div className="search-header">
        <h1 className="search-title">
          <SearchIcon className="title-icon" />
          Discover Your Next Favorite
        </h1>
        <p className="search-subtitle">
          Search thousands of movies and TV series
        </p>
      </div>

      {/* Enhanced Search Bar */}
      <div className="search-container">
        <div className="search-bar-wrapper">
          <TextField
            fullWidth
            className="searchBox"
            label="Search for movies or TV series..."
            variant="filled"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <SearchIcon className="search-input-icon" />
              ),
            }}
          />
          <Button
            onClick={fetchSearch}
            variant="contained"
            className="search-button"
            disabled={!searchText.trim() || loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <SearchIcon fontSize="large" />
            )}
          </Button>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="search-tabs-container">
        <Tabs
          value={type}
          indicatorColor="primary"
          textColor="primary"
          onChange={(event, newValue) => {
            setType(newValue);
            setPage(1);
          }}
          className="search-tabs"
        >
          <Tab
            icon={<MovieIcon />}
            label="Movies"
            className="search-tab"
          />
          <Tab
            icon={<TvIcon />}
            label="TV Series"
            className="search-tab"
          />
        </Tabs>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        year={year}
        setYear={setYear}
        minRating={minRating}
        setMinRating={setMinRating}
        language={language}
        setLanguage={setLanguage}
        onApply={handleApplyFilters}
      />

      {/* Results Section */}
      <div className="search-results">
        {loading ? (
          <SkeletonGrid count={20} />
        ) : !hasSearched ? (
          <div className="empty-state">
            <SearchIcon className="empty-icon" />
            <h2>Start Your Search</h2>
            <p>Enter a movie or TV series name to begin exploring</p>
          </div>
        ) : content && content.length > 0 ? (
          <>
            <div className="results-header">
              <h3>
                Found {totalResults.toLocaleString()} {type ? "TV Series" : "Movies"}
              </h3>
            </div>
            <div className="trending results-grid">
              {content.map((c) => (
                <SingleContent
                  key={c.id}
                  id={c.id}
                  poster={c.poster_path}
                  title={c.title || c.name}
                  date={c.first_air_date || c.release_date}
                  media_type={type ? "tv" : "movie"}
                  vote_average={c.vote_average}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="no-results">
            {type ? <TvIcon className="no-results-icon" /> : <MovieIcon className="no-results-icon" />}
            <h2>No {type ? "TV Series" : "Movies"} Found</h2>
            <p>Try searching with different keywords or adjust your filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {numOfPages > 1 && !loading && hasSearched && content.length > 0 && (
        <CustomPagination
          setPage={setPage}
          numOfPages={Math.min(numOfPages, 500)}
          page={page}
        />
      )}
    </div>
  );
};

export default Search;
