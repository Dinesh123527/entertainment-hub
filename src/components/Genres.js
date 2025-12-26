/* eslint-disable react-hooks/exhaustive-deps */
import { Chip } from "@material-ui/core";
import axios from "axios";
import { useEffect } from "react";

const Genres = ({
  selectedGenres,
  setSelectedGenres,
  genres,
  setGenres,
  type,
  setPage,
}) => {
  const handleAdd = (genre) => {
    setSelectedGenres([...selectedGenres, genre]);
    setGenres(genres.filter((g) => g.id !== genre.id));
    setPage(1);
  };

  const handleRemove = (genre) => {
    setSelectedGenres(
      selectedGenres.filter((selected) => selected.id !== genre.id)
    );
    setGenres([...genres, genre]);
    setPage(1);
  };

  const fetchGenres = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/genre/${type}/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setGenres(data.genres);
  };

  useEffect(() => {
    fetchGenres();

    return () => {
      setGenres({});
    };
  }, []);

  const chipBaseStyle = {
    margin: "4px",
    fontFamily: "var(--font-primary)",
    fontWeight: 500,
    fontSize: "12px",
    borderRadius: "20px",
    transition: "all 0.3s ease",
  };

  const selectedChipStyle = {
    ...chipBaseStyle,
    background: "linear-gradient(135deg, #e50914 0%, #ff6b6b 100%)",
    color: "white",
    border: "none",
  };

  const unselectedChipStyle = {
    ...chipBaseStyle,
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
  };

  return (
    <div className="genres-container">
      {selectedGenres.map((genre) => (
        <Chip
          style={selectedChipStyle}
          label={genre.name}
          key={genre.id}
          clickable
          size="small"
          onDelete={() => handleRemove(genre)}
        />
      ))}
      {genres.map((genre) => (
        <Chip
          style={unselectedChipStyle}
          label={genre.name}
          key={genre.id}
          clickable
          size="small"
          onClick={() => handleAdd(genre)}
        />
      ))}
      <style>{`
        .genres-container {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          padding: 16px 0;
          animation: fadeIn 0.5s ease;
        }
        
        .genres-container .MuiChip-root:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
        
        .genres-container .MuiChip-deleteIcon {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .genres-container .MuiChip-deleteIcon:hover {
          color: white;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Genres;
