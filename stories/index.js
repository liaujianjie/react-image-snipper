import React from 'react';
import { storiesOf } from '@storybook/react';
import Cropper from '../src';

storiesOf('Cropper', module)
  .add('without any props', () => <Cropper />)
  .add('with cross-origin image source', () => (
    <Cropper src="https://placehold.it/350x350" />
  ))
  .add('with same-origin image source', () => <Cropper src="/testimage.jpg" />)
  .add('with controlled rect', () => (
    <Cropper
      src="/testimage.jpg"
      rect={{ x: 20, y: 30, width: 40, height: 50 }}
    />
  ))
  .add('with onCropChange handler', () => {
    class StatefulExample extends React.Component {
      state = {
        cropped: null,
        rect: null,
      };

      render() {
        return (
          <div>
            <Cropper
              src="/testimage.jpg"
              onCropChange={({ getRectValues }) => {
                this.setState({ rect: getRectValues() });
              }}
            />
            {JSON.stringify(this.state.rect)}
          </div>
        );
      }
    }

    return <StatefulExample />;
  })
  .add('with onCropEnd handler', () => {
    class StatefulExample extends React.Component {
      state = {
        cropped: null,
        rect: null,
      };

      render() {
        return (
          <div>
            <Cropper
              src="/testimage.jpg"
              onCropEnd={({ getDataUrl, getRectValues }) => {
                this.setState({ cropped: getDataUrl(), rect: getRectValues() });
              }}
            />
            Cropped image:
            <img src={this.state.cropped} />
          </div>
        );
      }
    }

    return <StatefulExample />;
  });
