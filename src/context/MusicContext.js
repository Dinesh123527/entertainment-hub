import { createContext, useContext, useEffect, useRef, useState } from "react";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [queue, setQueue] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        if (currentSong && currentSong.downloadUrl) {
            setIsLoading(true);
            const urls = currentSong.downloadUrl;
            const highestQuality = urls[urls.length - 1]?.url || urls[0]?.url;
            audioRef.current.src = highestQuality;
            audioRef.current.load();

            if (isPlaying) {
                audioRef.current.play().catch(console.error);
            }
        }
    }, [currentSong]);

    useEffect(() => {
        if (isPlaying && currentSong) {
            audioRef.current.play().catch(console.error);
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentSong]);

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

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("canplay", handleCanPlay);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("canplay", handleCanPlay);
        };
    }, [queue]);

    const playSong = (song, songQueue = []) => {
        setCurrentSong(song);
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
        setIsPlaying(true);
    };

    const playPrevious = () => {
        if (queue.length === 0) return;

        const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
        const prevIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
        setCurrentSong(queue[prevIndex]);
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
