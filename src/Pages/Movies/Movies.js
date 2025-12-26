/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import FilterSort from "../../components/FilterSort/FilterSort";
import Genres from "../../components/Genres";
import CustomPagination from "../../components/Pagination/CustomPagination";
import SingleContent from "../../components/SingleContent/SingleContent";
import { SkeletonGrid } from "../../components/SkeletonCard/SkeletonCard";
import useGenre from "../../hooks/useGenre";

const Movies = () => {
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const genreforURL = useGenre(selectedGenres);

  // Filter & Sort states
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [minRating, setMinRating] = useState(0);

  const fetchMovies = async () => {
    setLoading(true);
    const startTime = Date.now();
    const MIN_LOADING_TIME = 800;

    try {
      // Build API URL with filters
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=${sortBy}&include_adult=false&include_video=false&page=${page}&with_genres=${genreforURL}`;

      // Add year range filters
      if (yearFrom) {
        url += `&primary_release_date.gte=${yearFrom}-01-01`;
      }
      if (yearTo) {
        url += `&primary_release_date.lte=${yearTo}-12-31`;
      }

      // Add rating filter
      if (minRating > 0) {
        url += `&vote_average.gte=${minRating}`;
      }

      const { data } = await axios.get(url);
      setContent(data.results);
      setNumOfPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching movies:", error);
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

  const handleApplyFilters = () => {
    setPage(1);
    fetchMovies();
  };

  useEffect(() => {
    fetchMovies();
  }, [page, genreforURL]);

  return (
    <div>
      <span className="pageTitle">Discover Movies</span>
      <Genres
        type="movie"
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        genres={genres}
        setGenres={setGenres}
        setPage={setPage}
      />
      <FilterSort
        sortBy={sortBy}
        setSortBy={setSortBy}
        yearFrom={yearFrom}
        setYearFrom={setYearFrom}
        yearTo={yearTo}
        setYearTo={setYearTo}
        minRating={minRating}
        setMinRating={setMinRating}
        onApply={handleApplyFilters}
        type="movie"
      />
      {loading ? (
        <SkeletonGrid count={20} />
      ) : (
        <div className="trending">
          {content &&
            content.map((c) => (
              <SingleContent
                key={c.id}
                id={c.id}
                poster={c.poster_path}
                title={c.title || c.name}
                date={c.first_air_date || c.release_date}
                media_type="movie"
                vote_average={c.vote_average}
              />
            ))}
        </div>
      )}
      {numOfPages > 1 && !loading && (
        <CustomPagination setPage={setPage} numOfPages={numOfPages} />
      )}
    </div>
  );
};

export default Movies;
