import React from 'react';
import { shallow } from 'enzyme';
import AnchorLine from './AnchorLine';

describe('<AnchorLine />', () => {
  test('should pass side to data-action attribute', () => {
    const side = AnchorLine.Side.NORTH;
    const wrapper = shallow(<AnchorLine side={side} />);
    expect(wrapper.find(`[data-action="${side}"]`)).toHaveLength(1);
  });
});
