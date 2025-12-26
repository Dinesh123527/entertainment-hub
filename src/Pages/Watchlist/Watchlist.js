import { Tab, Tabs } from "@material-ui/core";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { useState } from "react";
import SingleContent from "../../components/SingleContent/SingleContent";
import { useUser } from "../../context/UserContext";
import "./Watchlist.css";

const Watchlist = () => {
    const { watchlist, favorites } = useUser();
    const [type, setType] = useState(0);

    return (
        <div>
            <span className="pageTitle">My Library</span>

            <Tabs
                value={type}
                indicatorColor="primary"
                textColor="primary"
                onChange={(event, newValue) => {
                    setType(newValue);
                    window.scroll(0, 0);
                }}
                style={{ paddingBottom: 5 }}
                centered
            >
                <Tab
                    style={{ width: "50%", color: "white" }}
                    icon={<PlaylistAddCheckIcon />}
                    label={`Watchlist (${watchlist.length})`}
                />
                <Tab
                    style={{ width: "50%", color: "white" }}
                    icon={<FavoriteIcon />}
                    label={`Favorites (${favorites.length})`}
                />
            </Tabs>

            <div className="trending">
                {type === 0 && watchlist.length > 0 &&
                    watchlist.map((c) => (
                        <SingleContent
                            key={c.id}
                            id={c.id}
                            poster={c.poster_path}
                            title={c.title || c.name}
                            date={c.first_air_date || c.release_date}
                            media_type={c.media_type}
                            vote_average={c.vote_average}
                        />
                    ))}

                {type === 0 && watchlist.length === 0 && (
                    <div className="empty-state">
                        <h2>Your watchlist is empty</h2>
                        <p>Add movies and TV shows to list them here</p>
                    </div>
                )}

                {type === 1 && favorites.length > 0 &&
                    favorites.map((c) => (
                        <SingleContent
                            key={c.id}
                            id={c.id}
                            poster={c.poster_path}
                            title={c.title || c.name}
                            date={c.first_air_date || c.release_date}
                            media_type={c.media_type}
                            vote_average={c.vote_average}
                        />
                    ))}

                {type === 1 && favorites.length === 0 && (
                    <div className="empty-state">
                        <h2>No favorites yet</h2>
                        <p>Mark content as favorite to see them here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Watchlist;
