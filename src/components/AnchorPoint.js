import React from 'react';
import PropTypes from 'prop-types';
import styles from '../defaultStyles';

const AnchorPoint = ({ point }) => {
  const pointUppercase = point.toUpperCase();
  const styleNames = {
    dot: `dot${pointUppercase}`,
    dotInner: `dotInner${pointUppercase}`,
  };
  return (
    <span>
      <span
        data-action={point}
        style={{ ...styles.dot, ...styles[styleNames.dot] }}
      >
        <span style={{ ...styles.dotInner, ...styles[styleNames.dotInner] }} />
      </span>
    </span>
  );
};

AnchorPoint.Point = {
  NORTH: 'n',
  SOUTH: 's',
  EAST: 'e',
  WEST: 'w',
  NORTH_EAST: 'ne',
  NORTH_WEST: 'nw',
  SOUTH_EAST: 'se',
  SOUTH_WEST: 'sw',
};
Object.freeze(AnchorPoint.Point);

AnchorPoint.propTypes = {
  point: PropTypes.oneOf(Object.values(AnchorPoint.Point)),
};

export default AnchorPoint;
