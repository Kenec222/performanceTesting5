/**
 * Copyright (C) 2019 Unicorn a.s.
 * 
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 * 
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

import React from 'react';
import {shallow} from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";
import enzymeToJson from 'enzyme-to-json';
import TestTools from "../../core/test/test-tools.js";

const TagName = "UU5.Bricks.Container";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.SectionMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.LevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    noSpacing: {
      values: [true, false]
    },
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    },
    enzymeToJson: false
  }
};


describe(`${TagName}`, () => {
  TestTools.testProperties(TagName, CONFIG);
});

describe(`${TagName} contains other component`, () => {

  it(`${TagName} containt Paragraph and noSpacing is true -> should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"} header="noSpacing={true}" noSpacing>
        <UU5.Bricks.Paragraph id={"uuID02"}/>
     </UU5.Bricks.Container>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it(`${TagName} containt Paragraph and noSpacing is false -> should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"} header="noSpacing={false}" noSpacing={false}>
        <UU5.Bricks.Paragraph id={"uuID02"}/>
      </UU5.Bricks.Container>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it(`${TagName} containt Row and Columns -> should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"} header="Container - header">
        <UU5.Bricks.Row id={"uuID02"}>
          <UU5.Bricks.Column id={"uuID03"} colWidth="xs12 m4"><UU5.Bricks.Paragraph/></UU5.Bricks.Column>
          <UU5.Bricks.Column id={"uuID04"} colWidth="xs12 m4"><UU5.Bricks.Paragraph/></UU5.Bricks.Column>
          <UU5.Bricks.Column id={"uuID05"} colWidth="xs12 m4"><UU5.Bricks.Paragraph/></UU5.Bricks.Column>
          </UU5.Bricks.Row>
        </UU5.Bricks.Container>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});







