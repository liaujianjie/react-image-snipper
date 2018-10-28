import React from 'react';
import PropTypes from 'prop-types';
import styles from './AnchorLine.css';

enum Side {
  NORTH = 'n',
  SOUTH = 's',
  EAST = 'e',
  WEST = 'w',
}

interface AnchorLineProps {
  side: typeof AnchorLine.Side[keyof typeof AnchorLine.Side];
}

const AnchorLine: React.SFC<AnchorLineProps> & { Side: typeof Side } = ({
  side,
}) => {
  return <span data-action={side} className={styles[side]} />;
};

AnchorLine.Side = Side;
AnchorLine.propTypes = {
  side: PropTypes.oneOf(Object.values(AnchorLine.Side)).isRequired,
};

export default AnchorLine;
