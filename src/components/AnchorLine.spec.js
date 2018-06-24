import React from 'react';
import { shallow } from 'enzyme';
import AnchorLine from './AnchorLine';

describe('<AnchorLine />', () => {
  test('should pass side to data-action attribute', () => {
    const wrapper = shallow(<AnchorLine side={AnchorLine.Side.NORTH} />);
    expect(wrapper.find('[data-action="n"]').length).toBe(1);
  });
});