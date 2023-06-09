import React from "react";
import { img_300, unavailable } from "../../config/config";
import "./SingleContent.css";
import Badge from "@mui/material/Badge";
import ContentModal from "../ContentModal/ContentModal";

const SingleContent = ({
  id,
  poster,
  title,
  date,
  media_type,
  vote_average,
}) => {
  return (
    <ContentModal media_type={media_type} id={id}>
      <Badge
        badgeContent={vote_average}
        color={vote_average > 6 ? "primary" : "warning"}
      />
      <img
        className="poster"
        src={poster ? `${img_300}/${poster}` : unavailable}
        alt={title}
      ></img>
      <b className="title">{title}</b>
      <span className="subTitle">
        <span>{media_type === "tv" ? "TV Series" : "Movie"}</span>
        <span className="subTitle">{date}</span>
      </span>
    </ContentModal>
  );
};

export default SingleContent;
