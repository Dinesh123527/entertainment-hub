import { Container } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import Movies from "./Pages/Movies/Movies";
import Music from "./Pages/Music/Music";
import Search from "./Pages/Search/Search";
import Series from "./Pages/Series/Series";
import Trending from "./Pages/Trending/Trending";
import Watchlist from "./Pages/Watchlist/Watchlist";
import Header from "./components/Header/Header";
import SimpleBottomNavigation from "./components/MainNav.js";
import MiniPlayer from "./components/MiniPlayer/MiniPlayer";
import { MusicProvider } from "./context/MusicContext";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <MusicProvider>
          <BrowserRouter>
            <Header />
            <div className="app">
              <Container>
                <Switch>
                  <Route path="/" component={Trending} exact />
                  <Route path="/movies" component={Movies} />
                  <Route path="/series" component={Series} />
                  <Route path="/search" component={Search} />
                  <Route path="/watchlist" component={Watchlist} />
                  <Route path="/music" component={Music} />
                </Switch>
              </Container>
            </div>
            <MiniPlayer />
            <SimpleBottomNavigation />
          </BrowserRouter>
        </MusicProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
