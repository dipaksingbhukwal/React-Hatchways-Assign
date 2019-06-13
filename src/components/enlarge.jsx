import React from "react";

const Enlarge = ({ showScore, onClick }) => {
  let classes = "fa fa";
  classes += showScore ? "-minus" : "-plus";

  return (
    <i
      onClick={onClick}
      style={{ cursor: "pointer" }}
      className={classes}
      aria-hidden="true"
    />
  );
};

export default Enlarge;
