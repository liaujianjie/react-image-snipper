import React from 'react';
import PropTypes from 'prop-types';
import * as styles from './AnchorPoint.css';
import Action, { ActionValue } from '../utils/Action';

type Props = {
  point: ActionValue;
};

const AnchorPoint: React.SFC<Props> & { Point: typeof Action } = ({
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
