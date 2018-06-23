import React from 'react';
import { storiesOf } from '@storybook/react';
import Cropper from '../src';
import './assets/sample.jpg';

storiesOf('Cropper', module)
  .add('with bundled image', () => <Cropper src="/stories/assets/sample.jpg" />)
  .add('with CDN image', () => <Cropper src="https://placehold.it/350x150" />);

storiesOf('img', module)
  .add('with bundled image', () => <img src="/stories/assets/sample.jpg" />)
  .add('with CDN image', () => <img src="https://placehold.it/350x150" />);
