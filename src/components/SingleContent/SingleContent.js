import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Badge from "@mui/material/Badge";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { img_300, unavailable } from "../../config/config";
import { useUser } from "../../context/UserContext";
import ContentModal from "../ContentModal/ContentModal";
import "./SingleContent.css";

const SingleContent = ({
  id,
  poster,
  title,
  date,
  media_type,
  vote_average,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [details, setDetails] = useState(null);
  const [tiltStyle, setTiltStyle] = useState({});
  const hoverTimeoutRef = useRef(null);
  const cardRef = useRef(null);
  const { toggleWatchlist, isInWatchlist } = useUser();
  const inWatchlist = isInWatchlist(id);

  // 3D Parallax Tilt Effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (max 15 degrees)
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    // Calculate shine position
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
      "--shine-x": `${shineX}%`,
      "--shine-y": `${shineY}%`,
    });
  };

  const handleMouseLeaveCard = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    });
    clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
  };

  // Fetch trailer and details on hover
  const fetchDetails = useCallback(async () => {
    if (!id) return;

    try {
      const mediaType = media_type || "movie";

      // Fetch videos
      const videosRes = await axios.get(
        `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );

      const trailerVideo = videosRes.data.results?.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );

      if (trailerVideo) {
        setTrailer(trailerVideo.key);
      }

      // Fetch details for genres
      const detailsRes = await axios.get(
        `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );

      setDetails(detailsRes.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }, [id, media_type]);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
      if (!details) {
        fetchDetails();
      }
    }, 500);
  };

  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    toggleWatchlist({
      id,
      title,
      poster_path: poster,
      media_type: media_type || "movie",
      vote_average,
      release_date: date,
    });
  };

  return (
    <div
      className={`single-content ${isHovered ? "expanded" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeaveCard}
      ref={cardRef}
    >
      <ContentModal media_type={media_type} id={id}>
        <div className="content-card" style={tiltStyle}>
          {/* Shine Effect Overlay */}
          <div className="card-shine" />

          {/* Rating Badge */}
          <Badge
            badgeContent={vote_average?.toFixed(1)}
            color={vote_average > 6 ? "primary" : "warning"}
          />

          {/* Poster */}
          <img
            className="poster"
            src={poster ? `${img_300}/${poster}` : unavailable}
            alt={title}
          />

          {/* Basic Info (always visible) */}
          <b className="title">{title}</b>
          <span className="subTitle">
            <span className="media-type-badge">
              {media_type === "tv" ? "TV" : "Movie"}
            </span>
            <span>{date?.split("-")[0]}</span>
          </span>

          {/* Hover Preview */}
          {isHovered && (
            <div className="hover-preview">
              {/* Mini Trailer */}
              {trailer && (
                <div className="preview-trailer">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailer}`}
                    title="Preview"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="preview-actions">
                <button className="preview-btn play-btn">
                  <PlayArrowIcon />
                </button>
                <button
                  className={`preview-btn add-btn ${inWatchlist ? "in-list" : ""}`}
                  onClick={handleWatchlistClick}
                >
                  {inWatchlist ? <CheckIcon /> : <AddIcon />}
                </button>
              </div>

              {/* Genres */}
              {details?.genres && (
                <div className="preview-genres">
                  {details.genres.slice(0, 3).map((g) => (
                    <span key={g.id} className="genre-tag">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              {details?.overview && (
                <p className="preview-overview">
                  {details.overview.length > 100
                    ? `${details.overview.substring(0, 100)}...`
                    : details.overview}
                </p>
              )}
            </div>
          )}
        </div>
      </ContentModal>
    </div>
  );
};

export default SingleContent;
