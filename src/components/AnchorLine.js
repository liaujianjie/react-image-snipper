import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles.css';

const AnchorLine = ({ side }) => {
  const sideUppercase = side.toUpperCase();
  const styleName = `line${sideUppercase}`;
  return (
    <span
      data-action={side}
      className={[styles.line, styles[styleName]].join(' ')}
    />
  );
};

AnchorLine.Side = {
  NORTH: 'n',
  SOUTH: 's',
  EAST: 'e',
  WEST: 'w',
};
Object.freeze(AnchorLine.Side);

AnchorLine.propTypes = {
  side: PropTypes.oneOf(Object.values(AnchorLine.Side)),
};

export default AnchorLine;
