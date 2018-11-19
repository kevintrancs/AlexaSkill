import React from 'react';
import ReactDOM from 'react-dom';
import SideBarExample from './App';

import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const wrapper = shallow(<SideBarExample />);
  const pleaseWork = <a href="/settings">Settings</a>;
  expect(wrapper.contains(pleaseWork)).toEqual(true);
});
