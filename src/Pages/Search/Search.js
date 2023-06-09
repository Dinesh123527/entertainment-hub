/* eslint-disable react-hooks/exhaustive-deps */
import { React, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import "./Search.css";
import SearchIcon from "@mui/icons-material/Search";
import { Button, Tab, Tabs } from "@material-ui/core";
import axios from "axios";
import SingleContent from "../../components/SingleContent/SingleContent";
import CustomPagination from "../../components/Pagination/CustomPagination";

const Search = () => {
  const [type, setType] = useState(0);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();

  const fetchSearch = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/search/${type ? "tv" : "movie"}?api_key=${
        process.env.REACT_APP_API_KEY
      }&language=en-US&query=${searchText}&page=${page}&include_adult=false`
    );

    setContent(data.results);
    setNumOfPages(data.total_pages);
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchSearch();
  }, [type, page]);

  return (
    <div>
      <div className="search">
        <TextField
          style={{ flex: 1, backgroundColor: "white" }}
          className="searchBox"
          label="Search"
          variant="filled"
          sx={{ input: { color: "black" } }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button
          onClick={fetchSearch}
          variant="contained"
          style={{ marginLeft: 10 }}
        >
          <SearchIcon fontSize="large" />
        </Button>
      </div>
      <Tabs
        value={type}
        indicatorColor="primary"
        textColor="primary"
        style={{ paddingBottom: 5 }}
        onChange={(event, newValue) => {
          setType(newValue);
          setPage(1);
        }}
      >
        <Tab style={{ width: "50%", color: "white" }} label="Search Movies" />
        <Tab
          style={{ width: "50%", color: "white" }}
          label="Search TV Series"
        />
      </Tabs>
      <div className="trending">
        {content &&
          content.map((c) => (
            <SingleContent
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title || c.name}
              date={c.first_air_date || c.release_date}
              media_type={type ? "tv" : "movie"}
              vote_average={c.vote_average}
            />
          ))}
        {searchText &&
          !content &&
          (type ? <h2>No Series Found</h2> : <h2>No Movies Found</h2>)}
      </div>
      {numOfPages > 1 && (
        <CustomPagination setPage={setPage} numOfPages={numOfPages} />
      )}
    </div>
  );
};

export default Search;
