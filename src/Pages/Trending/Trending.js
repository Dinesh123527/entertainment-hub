import axios from "axios";
import { useEffect, useState } from "react";
import CustomPagination from "../../components/Pagination/CustomPagination";
import SingleContent from "../../components/SingleContent/SingleContent";
import { SkeletonGrid } from "../../components/SkeletonCard/SkeletonCard";
import "./Trending.css";

const Trending = () => {
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`
      );
      setContent(data.results);
    } catch (error) {
      console.error("Error fetching trending:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div>
      <span className="pageTitle">Trending</span>
      {loading ? (
        <SkeletonGrid count={20} />
      ) : (
        <div className="trending">
          {content &&
            content.map((c) => (
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
        </div>
      )}
      <CustomPagination setPage={setPage} />
    </div>
  );
};

export default Trending;
