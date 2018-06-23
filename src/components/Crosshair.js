import React from 'react';
import styles from '../defaultStyles';

const Crosshair = () => {
  return (
    <span data-action="move" style={{ ...styles.dot, ...styles.dotCenter }}>
      <span
        style={{
          ...styles.dotInner,
          ...styles.dotInnerCenterVertical,
        }}
      />
      <span
        style={{
          ...styles.dotInner,
          ...styles.dotInnerCenterHorizontal,
        }}
      />
    </span>
  );
};

export default Crosshair;
