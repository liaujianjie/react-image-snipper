import React from "react";
import PropTypes from "prop-types";
import styles from "./AnchorPoint.css";

const AnchorPoint = ({ point }) => {
  return (
    <span data-action={point} className={styles[point]}>
      <span className={styles.inner} />
    </span>
  );
};

AnchorPoint.Point = Object.freeze({
  NORTH: "n",
  SOUTH: "s",
  EAST: "e",
  WEST: "w",
  NORTH_EAST: "ne",
  NORTH_WEST: "nw",
  SOUTH_EAST: "se",
  SOUTH_WEST: "sw"
});

AnchorPoint.propTypes = {
  point: PropTypes.oneOf(Object.values(AnchorPoint.Point))
};

export default AnchorPoint;
