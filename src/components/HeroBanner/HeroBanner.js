import InfoIcon from "@mui/icons-material/Info";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import axios from "axios";
import { useEffect, useState } from "react";
import { img_original, unavailable_landscape } from "../../config/config";
import ContentModal from "../ContentModal/ContentModal";
import "./HeroBanner.css";

const HeroBanner = ({ content }) => {
    const [featured, setFeatured] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);

    // Pick a random featured item from top 5
    useEffect(() => {
        if (content && content.length > 0) {
            const topContent = content.slice(0, 5);
            const randomIndex = Math.floor(Math.random() * topContent.length);
            setFeatured(topContent[randomIndex]);
        }
    }, [content]);

    // Fetch trailer for featured content
    useEffect(() => {
        const fetchTrailer = async () => {
            if (!featured) return;

            try {
                const mediaType = featured.media_type || "movie";
                const { data } = await axios.get(
                    `https://api.themoviedb.org/3/${mediaType}/${featured.id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
                );

                const trailerVideo = data.results?.find(
                    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
                );

                if (trailerVideo) {
                    setTrailer(trailerVideo.key);
                }
            } catch (error) {
                console.error("Error fetching trailer:", error);
            }
        };

        fetchTrailer();
    }, [featured]);

    if (!featured) return null;

    const backdropUrl = featured.backdrop_path
        ? `${img_original}${featured.backdrop_path}`
        : unavailable_landscape;

    const title = featured.title || featured.name;
    const overview = featured.overview?.length > 200
        ? `${featured.overview.substring(0, 200)}...`
        : featured.overview;

    return (
        <div className="hero-banner">
            {/* Background Image */}
            <div
                className="hero-backdrop"
                style={{ backgroundImage: `url(${backdropUrl})` }}
            />

            {/* Gradient Overlay */}
            <div className="hero-overlay" />

            {/* Trailer Video (if playing) */}
            {showTrailer && trailer && (
                <div className="hero-trailer">
                    <iframe
                        src={`https://www.youtube.com/embed/${trailer}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailer}`}
                        title="Trailer"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    />
                </div>
            )}

            {/* Content */}
            <div className="hero-content">
                <h1 className="hero-title">{title}</h1>

                <div className="hero-meta">
                    <span className="hero-rating">
                        ⭐ {featured.vote_average?.toFixed(1)}
                    </span>
                    <span className="hero-year">
                        {(featured.release_date || featured.first_air_date)?.split("-")[0]}
                    </span>
                    <span className="hero-type">
                        {featured.media_type === "tv" ? "TV Series" : "Movie"}
                    </span>
                </div>

                <p className="hero-overview">{overview}</p>

                <div className="hero-buttons">
                    {trailer && (
                        <button
                            className="hero-btn hero-btn-primary"
                            onClick={() => setShowTrailer(!showTrailer)}
                        >
                            <PlayArrowIcon />
                            {showTrailer ? "Stop" : "Play Trailer"}
                        </button>
                    )}

                    <ContentModal
                        media_type={featured.media_type || "movie"}
                        id={featured.id}
                    >
                        <button className="hero-btn hero-btn-secondary">
                            <InfoIcon />
                            More Info
                        </button>
                    </ContentModal>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;
