import React from 'react';
import PropTypes from 'prop-types';
import * as styles from './AnchorPoint.css';
import Action from '../utils/Action';

interface AnchorPointProps {
  point: Action;
}

const AnchorPoint: React.SFC<AnchorPointProps> & { Point: typeof Action } = ({
  point,
}) => {
  return (
    <span data-action={point} className={styles[point]}>
      <span className={styles.inner} />
    </span>
  );
};

AnchorPoint.Point = Action;
AnchorPoint.propTypes = {
  point: PropTypes.oneOf(Object.values(Action)).isRequired,
};

export default AnchorPoint;
