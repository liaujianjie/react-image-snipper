import React from 'react';
import PropTypes from 'prop-types';
import styles from './AnchorLine.css';

const AnchorLine = ({ side }) => {
  return <span data-action={side} className={styles[side]} />;
};

AnchorLine.Side = Object.freeze({
  NORTH: 'n',
  SOUTH: 's',
  EAST: 'e',
  WEST: 'w',
});

AnchorLine.propTypes = {
  side: PropTypes.oneOf(Object.values(AnchorLine.Side)),
};

export default AnchorLine;
