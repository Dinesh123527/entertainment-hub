import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState([]);
    const [favorites, setFavorites] = useState([]);

    // Load from localStorage on mount
    useEffect(() => {
        const savedWatchlist = JSON.parse(localStorage.getItem("storyflix-watchlist")) || [];
        const savedFavorites = JSON.parse(localStorage.getItem("storyflix-favorites")) || [];
        setWatchlist(savedWatchlist);
        setFavorites(savedFavorites);
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem("storyflix-watchlist", JSON.stringify(watchlist));
    }, [watchlist]);

    useEffect(() => {
        localStorage.setItem("storyflix-favorites", JSON.stringify(favorites));
    }, [favorites]);

    const addToWatchlist = (content) => {
        setWatchlist((prev) => {
            if (!prev.find((item) => item.id === content.id)) {
                return [...prev, content];
            }
            return prev;
        });
    };

    const removeFromWatchlist = (id) => {
        setWatchlist((prev) => prev.filter((item) => item.id !== id));
    };

    const toggleWatchlist = (content) => {
        if (watchlist.find((item) => item.id === content.id)) {
            removeFromWatchlist(content.id);
        } else {
            addToWatchlist(content);
        }
    };

    const addToFavorites = (content) => {
        setFavorites((prev) => {
            if (!prev.find((item) => item.id === content.id)) {
                return [...prev, content];
            }
            return prev;
        });
    };

    const removeFromFavorites = (id) => {
        setFavorites((prev) => prev.filter((item) => item.id !== id));
    };

    const toggleFavorites = (content) => {
        if (favorites.find((item) => item.id === content.id)) {
            removeFromFavorites(content.id);
        } else {
            addToFavorites(content);
        }
    };

    const isInWatchlist = (id) => {
        return !!watchlist.find((item) => item.id === id);
    };

    const isFavorite = (id) => {
        return !!favorites.find((item) => item.id === id);
    };

    return (
        <UserContext.Provider
            value={{
                watchlist,
                favorites,
                addToWatchlist,
                removeFromWatchlist,
                toggleWatchlist,
                addToFavorites,
                removeFromFavorites,
                toggleFavorites,
                isInWatchlist,
                isFavorite,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
