import React from 'react';
import { storiesOf } from '@storybook/react';
import Cropper from '../src';

storiesOf('Cropper', module)
  .add('with src only', () => <Cropper src="https://placehold.it/350x350" />)
  .add('with your mother cb', () => {
    let cropped = null;
    return (
      <div>
        <Cropper
          src="https://placehold.it/350x350"
          onCrop={(getCroppedSrc, getValues) => {
            cropped = getCroppedSrc();
            console.log(getValues());
          }}
        />
        <img src={cropped} />
      </div>
    );
  });
