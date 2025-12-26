import Badge from "@mui/material/Badge";
import { useRef, useState } from "react";
import { img_300, unavailable } from "../../config/config";
import ContentModal from "../ContentModal/ContentModal";
import "./SingleContent.css";

const SingleContent = ({
  id,
  poster,
  title,
  date,
  media_type,
  vote_average,
}) => {
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef(null);

  // 3D Parallax Tilt Effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (max 12 degrees)
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    // Calculate shine position
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
      "--shine-x": `${shineX}%`,
      "--shine-y": `${shineY}%`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    });
  };

  return (
    <div
      className="single-content"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
    >
      <ContentModal media_type={media_type} id={id}>
        <div className="content-card" style={tiltStyle}>
          {/* Shine Effect Overlay */}
          <div className="card-shine" />

          {/* Rating Badge */}
          <Badge
            badgeContent={vote_average?.toFixed(1)}
            color={vote_average > 6 ? "primary" : "warning"}
          />

          {/* Poster */}
          <img
            className="poster"
            src={poster ? `${img_300}/${poster}` : unavailable}
            alt={title}
          />

          {/* Basic Info */}
          <b className="title">{title}</b>
          <span className="subTitle">
            <span className="media-type-badge">
              {media_type === "tv" ? "TV" : "Movie"}
            </span>
            <span>{date?.split("-")[0]}</span>
          </span>
        </div>
      </ContentModal>
    </div>
  );
};

export default SingleContent;
