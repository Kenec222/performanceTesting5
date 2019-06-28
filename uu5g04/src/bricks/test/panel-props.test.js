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
import { shallow, mount } from "enzyme";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import enzymeToJson from 'enzyme-to-json';
import TestTools from "../../core/test/test-tools.js";
import createReactClass from "create-react-class";

const MyPanelHandler = createReactClass({

  getInitialState: () => {
    return {
      isCalled: false
    };
  },

  onClickAlert(event) {
    alert("You just clicked on the Panel");
    this.setState({isCalled: true})
  },

  render() {
    return (
      <UU5.Bricks.Panel
        id={"uuID"}
        onClick={this.onClickAlert}>
        onClick
      </UU5.Bricks.Panel>
    );
  }
});


const TagName = "UU5.Bricks.Panel";

const MOUNT_CONTENT_VALUES = {
  onFirstRender: "onFirstRender",
  onFirstExpand: "onFirstExpand",
  onEachExpand: "onEachExpand"
};

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.SectionMixin",
    "UU5.Common.LevelMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    expanded: {
      values: [true, false]
    },
    alwaysExpanded: {
      values: [true, false]
    },
    iconExpanded: {
      values: ["uu5-plus"]
    },
    iconCollapsed: {
      values: ["uu5-minus"]
    },
    //onClick
    disableHeaderClick: {
      values: [true, false]
    },
    size: {
      values: ["s", "m", "l", "xl"]
    },
    mountContent: {
      values: [
        MOUNT_CONTENT_VALUES.onEachExpand,
        MOUNT_CONTENT_VALUES.onFirstExpand,
        MOUNT_CONTENT_VALUES.onFirstRender
      ]
    }
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    },
    enzymeToJson: true
  }
};


describe(`${TagName}`, () => {
  TestTools.testProperties(TagName, CONFIG);
});


describe(`${TagName} props.Function`, () => {

  it(`${TagName} -  onClick() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MyPanelHandler/>
    );
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate('click');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('You just clicked on the Panel');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("You just clicked on the Panel");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it(`${TagName} -  mountContent default ( mount on first render, never unmount )`, () => {
    jest.useFakeTimers();

    const log = jest.fn();
    const mountLog = jest.fn();
    const unmountLog = jest.fn();
    const Log = createReactClass({
      componentDidMount() {
        mountLog();
      },
      componentWillUnmount() {
        unmountLog();
      },
      render: function() {
        log();
        return "Logged";
      }
    });
    const wrapper = mount(
      <UU5.Bricks.Panel>
        <Log />
      </UU5.Bricks.Panel>
    );

    // in first render strategy content of panel is rendered before first open of panel
    expect(log).toBeCalled();
    expect(log).toBeCalledTimes(1);
    expect(mountLog).toBeCalled();
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();
    expect(wrapper.instance().isExpanded()).toBeFalsy();

    // open panel
    wrapper.instance().expand();
    jest.runAllTimers();
    expect(wrapper.instance().isExpanded()).toBeTruthy();
    expect(log).toBeCalledTimes(2);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // close panel - components will be rerendered
    wrapper.instance().collapse();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(3);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // open panel again - components will be rerendered but without mounting of the component
    wrapper.instance().toggle();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(4);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    wrapper.unmount();

    // check correct using of unmount
    expect(unmountLog).toBeCalled();
    expect(unmountLog).toBeCalledTimes(1);
  });

  it(`${TagName} - mountContent: ${MOUNT_CONTENT_VALUES.onFirstRender} ( mounted before expand, never unmount )`, () => {
    jest.useFakeTimers();

    const log = jest.fn();
    const mountLog = jest.fn();
    const unmountLog = jest.fn();
    const Log = createReactClass({
      componentDidMount() {
        mountLog();
      },
      componentWillUnmount() {
        unmountLog();
      },
      render: function() {
        log();
        return "Logged";
      }
    });
    const wrapper = mount(
      <UU5.Bricks.Panel mountContent={MOUNT_CONTENT_VALUES.onFirstRender}>
        <Log />
      </UU5.Bricks.Panel>
    );

    // in first open strategy content of panel is not rendered before first open of panel
    expect(log).toBeCalled();
    expect(log).toBeCalledTimes(1);
    expect(mountLog).toBeCalled();
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();
    expect(wrapper.instance().isExpanded()).toBeFalsy();

    // open panel
    wrapper.instance().expand();
    jest.runAllTimers();
    expect(wrapper.instance().isExpanded()).toBeTruthy();
    expect(log).toBeCalledTimes(2);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // close panel - components will be rerendered
    wrapper.instance().collapse();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(3);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // open panel again - components will be rerendered but without mounting of the component
    wrapper.instance().toggle();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(4);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    wrapper.unmount();

    // check correct using of unmount
    expect(unmountLog).toBeCalled();
    expect(unmountLog).toBeCalledTimes(1);
  });

  it(`${TagName} -  mountContent: ${MOUNT_CONTENT_VALUES.onFirstExpand} ( mount on first expand, never unmount )`, () => {
    jest.useFakeTimers();

    const log = jest.fn();
    const mountLog = jest.fn();
    const unmountLog = jest.fn();
    const Log = createReactClass({
      componentDidMount() {
        mountLog();
      },
      componentWillUnmount() {
        unmountLog();
      },
      render: function() {
        log();
        return "Logged";
      }
    });
    const wrapper = mount(
      <UU5.Bricks.Panel mountContent={MOUNT_CONTENT_VALUES.onFirstExpand}>
        <Log />
      </UU5.Bricks.Panel>
    );

    // in first open strategy content of panel is not rendered before first open of panel
    expect(log).not.toBeCalled();
    expect(mountLog).not.toBeCalled();
    expect(unmountLog).not.toBeCalled();
    expect(wrapper.instance().isExpanded()).toBeFalsy();

    // open panel
    wrapper.instance().expand();
    jest.runAllTimers();
    expect(wrapper.instance().isExpanded()).toBeTruthy();
    expect(log).toBeCalled();
    expect(log).toBeCalledTimes(1);
    expect(mountLog).toBeCalled();
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // close panel - components will be rerendered
    wrapper.instance().collapse();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(2);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // open panel again - components will be rerendered but without mounting of the component
    wrapper.instance().toggle();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(3);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    wrapper.unmount();

    // check correct using of unmount
    expect(unmountLog).toBeCalled();
    expect(unmountLog).toBeCalledTimes(1);
  });

  it(`${TagName} -  unmountCollapsedBody: ${MOUNT_CONTENT_VALUES.onEachExpand} ( mount on each expand, unmount on each collapse )`, () => {
    jest.useFakeTimers();

    const log = jest.fn();
    const mountLog = jest.fn();
    const unmountLog = jest.fn();
    const Log = createReactClass({
      componentDidMount() {
        mountLog();
      },
      componentWillUnmount() {
        unmountLog();
      },
      render: function() {
        log();
        return "Logged";
      }
    });
    const wrapper = mount(
      <UU5.Bricks.Panel mountContent={MOUNT_CONTENT_VALUES.onEachExpand}>
        <Log />
      </UU5.Bricks.Panel>
    );

    // in first open strategy content of panel is not rendered before first open of panel
    expect(log).not.toBeCalled();
    expect(mountLog).not.toBeCalled();
    expect(unmountLog).not.toBeCalled();
    expect(wrapper.instance().isExpanded()).toBeFalsy();

    // open panel
    wrapper.instance().expand();
    jest.runAllTimers();
    expect(wrapper.instance().isExpanded()).toBeTruthy();
    expect(log).toBeCalled();
    expect(log).toBeCalledTimes(1);
    expect(mountLog).toBeCalled();
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // close panel - components will be rerendered
    wrapper.instance().collapse();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(1); // component does not rerender but it is unmounted
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).toBeCalled();
    expect(unmountLog).toBeCalledTimes(1);

    // open panel again - components will be rerendered but without mounting of the component
    wrapper.instance().toggle();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(2);
    expect(mountLog).toBeCalledTimes(2);
    expect(unmountLog).toBeCalledTimes(1);

    // unmount again
    wrapper.instance().toggle();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(2); // component does not rerender but it is unmounted
    expect(mountLog).toBeCalledTimes(2);
    expect(unmountLog).toBeCalledTimes(2);

    wrapper.unmount();

    // check correct using of unmount - component is already unmounted
    expect(unmountLog).toBeCalledTimes(2);
  });
});