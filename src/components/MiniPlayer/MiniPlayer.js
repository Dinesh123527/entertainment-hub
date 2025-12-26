import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useState } from "react";
import { useMusic } from "../../context/MusicContext";
import "./MiniPlayer.css";

const MiniPlayer = () => {
    const {
        currentSong,
        isPlaying,
        togglePlay,
        playNext,
        playPrevious,
        currentTime,
        duration,
        seekTo,
        volume,
        setVolume,
        isLoading,
    } = useMusic();

    const [showVolume, setShowVolume] = useState(false);
    const [prevVolume, setPrevVolume] = useState(0.7);

    if (!currentSong) return null;

    // Format time
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Get image URL
    const getImage = () => {
        if (currentSong.image && currentSong.image.length > 0) {
            return currentSong.image[1]?.url || currentSong.image[0]?.url;
        }
        return "https://via.placeholder.com/60?text=Music";
    };

    // Handle progress bar click
    const handleProgressClick = (e) => {
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        seekTo(percent * duration);
    };

    // Handle volume toggle
    const toggleMute = () => {
        if (volume > 0) {
            setPrevVolume(volume);
            setVolume(0);
        } else {
            setVolume(prevVolume);
        }
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="mini-player">
            {/* Progress Bar */}
            <div className="progress-bar-container" onClick={handleProgressClick}>
                <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="mini-player-content">
                {/* Song Info */}
                <div className="mini-player-info">
                    <div className="mini-player-image">
                        <img src={getImage()} alt={currentSong.name} />
                        {isLoading && <div className="loading-spinner"></div>}
                    </div>
                    <div className="mini-player-text">
                        <h4 className="mini-player-title">
                            {currentSong.name?.replace(/&quot;/g, '"').replace(/&amp;/g, '&')}
                        </h4>
                        <p className="mini-player-artist">
                            {currentSong.artists?.primary?.map(a => a.name).join(", ") || "Unknown"}
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="mini-player-controls">
                    <button className="control-btn" onClick={playPrevious}>
                        <SkipPreviousIcon />
                    </button>
                    <button
                        className="control-btn play-btn"
                        onClick={togglePlay}
                        disabled={isLoading}
                    >
                        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                    </button>
                    <button className="control-btn" onClick={playNext}>
                        <SkipNextIcon />
                    </button>
                </div>

                {/* Time & Volume */}
                <div className="mini-player-extras">
                    <span className="time-display">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    <div
                        className="volume-container"
                        onMouseEnter={() => setShowVolume(true)}
                        onMouseLeave={() => setShowVolume(false)}
                    >
                        <button className="control-btn volume-btn" onClick={toggleMute}>
                            {volume > 0 ? <VolumeUpIcon /> : <VolumeOffIcon />}
                        </button>
                        {showVolume && (
                            <input
                                type="range"
                                className="volume-slider"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiniPlayer;
