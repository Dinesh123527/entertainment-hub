import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useMusic } from "../../context/MusicContext";
import "./SongCard.css";

const SongCard = ({ song, queue = [], index }) => {
    const { playSong, currentSong, isPlaying, togglePlay } = useMusic();

    const isCurrentSong = currentSong?.id === song.id;

    const handleClick = () => {
        if (isCurrentSong) {
            togglePlay();
        } else {
            playSong(song, queue);
        }
    };

    // Get image URL (prefer higher quality)
    const getImage = () => {
        if (song.image && song.image.length > 0) {
            return song.image[song.image.length - 1]?.url || song.image[0]?.url;
        }
        return "https://via.placeholder.com/150?text=No+Image";
    };

    // Format duration
    const formatDuration = (seconds) => {
        if (!seconds) return "";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div
            className={`song-card ${isCurrentSong ? "playing" : ""}`}
            onClick={handleClick}
        >
            <div className="song-card-image">
                <img src={getImage()} alt={song.name} />
                <div className="song-card-overlay">
                    <div className="play-button">
                        {isCurrentSong && isPlaying ? (
                            <PauseIcon />
                        ) : (
                            <PlayArrowIcon />
                        )}
                    </div>
                </div>
                {isCurrentSong && isPlaying && (
                    <div className="now-playing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
            </div>
            <div className="song-card-info">
                <h3 className="song-name" title={song.name}>
                    {song.name?.replace(/&quot;/g, '"').replace(/&amp;/g, '&')}
                </h3>
                <p className="song-artist" title={song.artists?.primary?.map(a => a.name).join(", ")}>
                    {song.artists?.primary?.map(a => a.name).join(", ") || "Unknown Artist"}
                </p>
                {song.duration && (
                    <span className="song-duration">
                        {formatDuration(parseInt(song.duration))}
                    </span>
                )}
            </div>
        </div>
    );
};

export default SongCard;
