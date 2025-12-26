/* eslint-disable react-hooks/exhaustive-deps */
import YouTubeIcon from "@material-ui/icons/YouTube";
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  img_500,
  unavailable,
  unavailableLandscape,
} from "../../config/config";
import { useUser } from "../../context/UserContext";
import Carousel from "../Carousel/Carousel";
import "./ContentModal.css";

export default function ContentModal({ children, media_type, id }) {
  const [open, setOpen] = React.useState(false);
  const [content, setContent] = useState();
  const [video, setVideo] = useState();
  const { toggleWatchlist, isInWatchlist, toggleFavorites, isFavorite } = useUser();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setContent(data);
  };

  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setVideo(data.results[0]?.key);
  };

  useEffect(() => {
    fetchData();
    fetchVideo();
  }, []);

  return (
    <>
      <div
        className="media"
        style={{ cursor: "pointer" }}
        color="inherit"
        onClick={handleOpen}
      >
        {children}
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
          },
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Fade in={open}>
          {content ? (
            <div className="modal-paper">
              <button className="modal-close" onClick={handleClose}>
                ✕
              </button>
              <div className="ContentModal">
                <img
                  src={
                    content.poster_path
                      ? `${img_500}/${content.poster_path}`
                      : unavailable
                  }
                  alt={content.name || content.title}
                  className="ContentModal__portrait"
                />
                <img
                  src={
                    content.backdrop_path
                      ? `${img_500}/${content.backdrop_path}`
                      : unavailableLandscape
                  }
                  alt={content.name || content.title}
                  className="ContentModal__landscape"
                />
                <div className="ContentModal__about">
                  <span className="ContentModal__title">
                    {content.name || content.title} (
                    {(
                      content.first_air_date ||
                      content.release_date ||
                      "-----"
                    ).substring(0, 4)}
                    )
                  </span>
                  {content.tagline && (
                    <i className="tagline">{content.tagline}</i>
                  )}

                  <span className="ContentModal__description">
                    {content.overview}
                  </span>

                  <div className="ContentModal__carousel">
                    <Carousel id={id} media_type={media_type} />
                  </div>

                  <div className="ContentModal__buttons">
                    <Button
                      variant="contained"
                      startIcon={<YouTubeIcon />}
                      target="_blank"
                      href={`https://www.youtube.com/watch?v=${video}`}
                      className="modal-btn trailer-btn"
                    >
                      Watch Trailer
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={isInWatchlist(content.id) ? <CheckIcon /> : <AddIcon />}
                      className={`modal-btn ${isInWatchlist(content.id) ? "active-btn" : ""}`}
                      onClick={() => toggleWatchlist({
                        id: content.id,
                        poster_path: content.poster_path,
                        title: content.name || content.title,
                        first_air_date: content.first_air_date,
                        release_date: content.release_date,
                        media_type: media_type,
                        vote_average: content.vote_average
                      })}
                    >
                      {isInWatchlist(content.id) ? "In Watchlist" : "Watchlist"}
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={isFavorite(content.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      className={`modal-btn ${isFavorite(content.id) ? "active-btn" : ""}`}
                      onClick={() => toggleFavorites({
                        id: content.id,
                        poster_path: content.poster_path,
                        title: content.name || content.title,
                        first_air_date: content.first_air_date,
                        release_date: content.release_date,
                        media_type: media_type,
                        vote_average: content.vote_average
                      })}
                    >
                      {isFavorite(content.id) ? "Liked" : "Like"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="modal-loading">Loading...</div>
          )}
        </Fade>
      </Modal>
      <style>{`
        .modal-paper {
          width: 90%;
          max-width: 1000px;
          height: 85%;
          max-height: 700px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          color: var(--text-primary);
          box-shadow: var(--shadow-lg);
          padding: 20px;
          position: relative;
          animation: modalSlideUp 0.4s ease;
        }
        
        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: var(--bg-tertiary);
          color: var(--text-primary);
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-close:hover {
          background: var(--accent-color);
          color: white;
          transform: rotate(90deg);
        }
        
        .modal-loading {
          color: var(--text-primary);
          font-size: 18px;
          padding: 40px;
          background: var(--bg-secondary);
          border-radius: var(--border-radius-lg);
        }
        
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .ContentModal__buttons {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        .modal-btn {
          border-radius: 30px !important;
          text-transform: none !important;
          font-weight: 600 !important;
          padding: 8px 20px !important;
          transition: all 0.3s ease !important;
        }

        .trailer-btn {
          background: #e50914 !important;
          color: white !important;
        }
        
        .trailer-btn:hover {
          background: #ff1f1f !important;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(229, 9, 20, 0.4);
        }

        .active-btn {
          background: white !important;
          color: black !important;
        }
      `}</style>
    </>
  );
}
