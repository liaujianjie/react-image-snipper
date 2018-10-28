import React from 'react';
import PropTypes from 'prop-types';
import styles from './AnchorLine.css';

const Side = Object.freeze({
  NORTH: 'n' as 'n',
  SOUTH: 's' as 'n',
  EAST: 'e' as 'e',
  WEST: 'w' as 'w',
});

const AnchorLine: React.SFC<Props> & { Side: typeof Side } = ({ side }) => {
  return <span data-action={side} className={styles[side]} />;
};

AnchorLine.Side = Side;

type Props = {
  side: typeof AnchorLine.Side[keyof typeof AnchorLine.Side];
};

AnchorLine.propTypes = {
  side: PropTypes.oneOf(Object.values(AnchorLine.Side)).isRequired,
};

export default AnchorLine;
