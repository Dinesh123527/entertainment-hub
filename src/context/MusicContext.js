import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const MusicContext = createContext();

const SAAVN_API = "https://www.jiosaavn.com/api.php";

export const MusicProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [queue, setQueue] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const audioRef = useRef(new Audio());

    // Fetch the actual audio URL when song changes
    useEffect(() => {
        const fetchAudioUrl = async () => {
            if (!currentSong?.downloadUrl?.[0]?.url) return;

            setIsLoading(true);
            try {
                // The downloadUrl contains the API call to get the actual audio URL
                const tokenUrl = currentSong.downloadUrl[0].url;
                const { data } = await axios.get(tokenUrl);

                if (data.auth_url) {
                    setAudioUrl(data.auth_url);
                }
            } catch (error) {
                console.error("Error fetching audio URL:", error);
                // Fallback: try to use JioTune preview if available
                if (currentSong.previewUrl) {
                    setAudioUrl(currentSong.previewUrl);
                }
            }
        };

        if (currentSong) {
            fetchAudioUrl();
        }
    }, [currentSong]);

    // Play audio when URL is ready
    useEffect(() => {
        if (audioUrl) {
            audioRef.current.src = audioUrl;
            audioRef.current.load();

            if (isPlaying) {
                audioRef.current.play().catch(console.error);
            }
        }
    }, [audioUrl]);

    useEffect(() => {
        if (isPlaying && audioUrl) {
            audioRef.current.play().catch(console.error);
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, audioUrl]);

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            setIsLoading(false);
        };

        const handleEnded = () => {
            playNext();
        };

        const handleCanPlay = () => {
            setIsLoading(false);
        };

        const handleError = (e) => {
            console.error("Audio error:", e);
            setIsLoading(false);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("canplay", handleCanPlay);
        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("canplay", handleCanPlay);
            audio.removeEventListener("error", handleError);
        };
    }, [queue]);

    const playSong = (song, songQueue = []) => {
        setCurrentSong(song);
        setAudioUrl(null); // Reset audio URL
        if (songQueue.length > 0) {
            setQueue(songQueue);
        }
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (currentSong) {
            setIsPlaying(!isPlaying);
        }
    };

    const playNext = () => {
        if (queue.length === 0) return;

        const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
        const nextIndex = (currentIndex + 1) % queue.length;
        setCurrentSong(queue[nextIndex]);
        setAudioUrl(null);
        setIsPlaying(true);
    };

    const playPrevious = () => {
        if (queue.length === 0) return;

        const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
        const prevIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
        setCurrentSong(queue[prevIndex]);
        setAudioUrl(null);
        setIsPlaying(true);
    };

    const seekTo = (time) => {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const addToQueue = (song) => {
        setQueue(prev => [...prev, song]);
    };

    const clearQueue = () => {
        setQueue([]);
    };

    return (
        <MusicContext.Provider
            value={{
                currentSong,
                queue,
                isPlaying,
                volume,
                currentTime,
                duration,
                isLoading,
                playSong,
                togglePlay,
                playNext,
                playPrevious,
                seekTo,
                setVolume,
                addToQueue,
                clearQueue,
            }}
        >
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error("useMusic must be used within a MusicProvider");
    }
    return context;
};

export default MusicContext;
