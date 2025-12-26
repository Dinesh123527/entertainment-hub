import MovieIcon from "@mui/icons-material/Movie";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import SearchIcon from "@mui/icons-material/Search";
import TvIcon from "@mui/icons-material/Tv";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./MainNav.css";

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const history = useHistory();


  useEffect(() => {
    // Set initial value based on current path
    const path = window.location.pathname;
    if (path === "/") setValue(0);
    else if (path === "/movies") setValue(1);
    else if (path === "/series") setValue(2);
    else if (path === "/search") setValue(3);
    else if (path === "/watchlist") setValue(4);
  }, []);

  const handleNavigation = (newValue, path) => {
    setValue(newValue);
    history.push(path);
  };

  const navItems = [
    { label: "Trending", icon: <WhatshotIcon />, path: "/" },
    { label: "Movies", icon: <MovieIcon />, path: "/movies" },
    { label: "TV Series", icon: <TvIcon />, path: "/series" },
    { label: "Search", icon: <SearchIcon />, path: "/search" },
    { label: "Library", icon: <PlaylistAddCheckIcon />, path: "/watchlist" },
  ];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__container">
        {navItems.map((item, index) => (
          <button
            key={item.label}
            className={`bottom-nav__item ${value === index ? "active" : ""}`}
            onClick={() => handleNavigation(index, item.path)}
          >
            <span className="bottom-nav__icon">{item.icon}</span>
            <span className="bottom-nav__label">{item.label}</span>
          </button>
        ))}
        <div
          className="bottom-nav__indicator"
          style={{
            transform: `translateX(${value * 100}%)`,
            width: `${100 / navItems.length}%`
          }}
        />
      </div>
    </nav>
  );
}
