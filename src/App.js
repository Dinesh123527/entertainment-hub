import { Container } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import Movies from "./Pages/Movies/Movies";
import Search from "./Pages/Search/Search";
import Series from "./Pages/Series/Series";
import Trending from "./Pages/Trending/Trending";
import Watchlist from "./Pages/Watchlist/Watchlist";
import Header from "./components/Header/Header";
import SimpleBottomNavigation from "./components/MainNav.js";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
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
              </Switch>
            </Container>
          </div>
          <SimpleBottomNavigation />
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
