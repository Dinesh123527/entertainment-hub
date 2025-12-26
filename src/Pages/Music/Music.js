/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Tab, Tabs } from "@material-ui/core";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useEffect, useState } from "react";
import { SkeletonGrid } from "../../components/SkeletonCard/SkeletonCard";
import SongCard from "../../components/SongCard/SongCard";
import "./Music.css";

const SAAVN_API = "https://saavn.me/api";

const LANGUAGES = [
    { code: "telugu", label: "Telugu" },
    { code: "hindi", label: "Hindi" },
    { code: "english", label: "English" },
    { code: "tamil", label: "Tamil" },
    { code: "kannada", label: "Kannada" },
    { code: "malayalam", label: "Malayalam" },
    { code: "punjabi", label: "Punjabi" },
];

const Music = () => {
    const [searchText, setSearchText] = useState("");
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState("telugu");
    const [trendingSongs, setTrendingSongs] = useState([]);

    useEffect(() => {
        fetchTrendingSongs();
    }, [selectedLanguage]);

    const fetchTrendingSongs = async () => {
        setLoading(true);
        const startTime = Date.now();
        const MIN_LOADING_TIME = 800;

        try {
            // Search for popular songs in selected language
            const { data } = await axios.get(
                `${SAAVN_API}/search/songs?query=top ${selectedLanguage} songs&limit=20`
            );

            if (data.success && data.data?.results) {
                setTrendingSongs(data.data.results);
            }
        } catch (error) {
            console.error("Error fetching trending songs:", error);
        } finally {
            const elapsed = Date.now() - startTime;
            const remaining = MIN_LOADING_TIME - elapsed;
            if (remaining > 0) {
                setTimeout(() => setLoading(false), remaining);
            } else {
                setLoading(false);
            }
        }
    };

    const searchSongs = async () => {
        if (!searchText.trim()) return;

        setLoading(true);
        setHasSearched(true);
        const startTime = Date.now();
        const MIN_LOADING_TIME = 800;

        try {
            const { data } = await axios.get(
                `${SAAVN_API}/search/songs?query=${encodeURIComponent(searchText)}&limit=30`
            );

            if (data.success && data.data?.results) {
                setSongs(data.data.results);
            } else {
                setSongs([]);
            }
        } catch (error) {
            console.error("Error searching songs:", error);
            setSongs([]);
        } finally {
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
            searchSongs();
        }
    };

    const displaySongs = hasSearched ? songs : trendingSongs;

    return (
        <div className="music-page">
            {/* Header */}
            <div className="music-header">
                <h1 className="music-title">
                    <MusicNoteIcon className="title-icon" />
                    Music Player
                </h1>
                <p className="music-subtitle">
                    Stream Telugu, Hindi, English & more songs
                </p>
            </div>

            {/* Search Bar */}
            <div className="music-search-container">
                <div className="music-search-wrapper">
                    <TextField
                        fullWidth
                        className="music-searchBox"
                        label="Search for songs, artists, albums..."
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
                        onClick={searchSongs}
                        variant="contained"
                        className="music-search-button"
                        disabled={!searchText.trim() || loading}
                    >
                        <SearchIcon fontSize="large" />
                    </Button>
                </div>
            </div>

            <div className="language-tabs-container">
                <Tabs
                    value={activeTab}
                    onChange={(e, val) => {
                        setActiveTab(val);
                        setSelectedLanguage(LANGUAGES[val].code);
                        setHasSearched(false);
                        setSearchText("");
                    }}
                    variant="scrollable"
                    scrollButtons="auto"
                    className="language-tabs"
                >
                    {LANGUAGES.map((lang) => (
                        <Tab
                            key={lang.code}
                            label={lang.label}
                            className="language-tab"
                        />
                    ))}
                </Tabs>
            </div>

            <div className="music-results">
                {!hasSearched && (
                    <h2 className="section-title">
                        🔥 Trending {LANGUAGES[activeTab].label} Songs
                    </h2>
                )}
                {hasSearched && songs.length > 0 && (
                    <h2 className="section-title">
                        Search Results for "{searchText}"
                    </h2>
                )}

                {loading ? (
                    <SkeletonGrid count={12} />
                ) : displaySongs.length > 0 ? (
                    <div className="songs-grid">
                        {displaySongs.map((song, index) => (
                            <SongCard
                                key={song.id}
                                song={song}
                                queue={displaySongs}
                                index={index}
                            />
                        ))}
                    </div>
                ) : hasSearched ? (
                    <div className="no-results">
                        <MusicNoteIcon className="no-results-icon" />
                        <h2>No Songs Found</h2>
                        <p>Try searching with different keywords</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Music;
