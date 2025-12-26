import ThemeSelector from "../ThemeSelector/ThemeSelector";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header__content">
        <span onClick={() => window.scroll(0, 0)} className="header__logo">
          <span className="header__logo-icon">🎬</span>
          <span className="header__logo-text">Story Flix</span>
          <span className="header__logo-icon">📽️</span>
        </span>
        <ThemeSelector />
      </div>
    </header>
  );
};

export default Header;

