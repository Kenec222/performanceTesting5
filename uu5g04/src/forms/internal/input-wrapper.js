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
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import ns from "../forms-ns.js";

import Message from './message.js';

import './input-wrapper.less';

const INITIAL_FEEDBACK = 'initial';

export const InputWrapper = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("InputWrapper"),
    classNames: {
      main: ns.css("input-wrapper"),
      cover: ns.css("input-wrapper-cover"),
      wrapper: ns.css("input-button-wrapper"),
      feedbackInitial: ns.css("input-wrapper-initial"),
      paddingRight: ns.css("input-button-wrapper-padding-right"),
      inputButton: ns.css("input-button"),
      inputButtonIcon: ns.css("input-button-icon")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    required: PropTypes.bool,
    feedback: PropTypes.string,
    message: PropTypes.any,
    buttons: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.string,
      disabled: PropTypes.bool,
      onClick: PropTypes.func,
      pressed: PropTypes.bool,
      size: PropTypes.string
    })),
    slider: PropTypes.bool,
    datetimepicker: PropTypes.bool,
    daterangepicker: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      required: false,
      feedback: 'initial',
      message: null,
      buttons: null,
      slider: false,
      datetimepicker: false,
      daterangepicker: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  shouldComponentUpdate_(newProps, newState) {
    let result = false;
    if (newProps.children != this.props.children || newProps.required != this.props.required || newProps.feedback != this.props.feedback || newProps.message != this.props.message) {
      result = true;
    }
    return result;
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getMainAttrs() {
    let mainAttrs = this.getMainAttrs();

    if (this.props.colWidth) {
      mainAttrs.className += " " + this.props.colWidth;
    }

    return mainAttrs;
  },

  _getButtons() {
    return (this.props.buttons && this.props.buttons.length > 0) ? this.props.buttons.map((button, i) => {
      let className = this.getClassName("wrapper");
      this.props.datetimepicker && i === 0 && (className = " " + this.getClassName("paddingRight"));
      return (
        <span key={i} className={className}>
          <UU5.Bricks.Button
            {...button}
            className={this.getClassName("inputButton")}
            icon={null}
          >
            <UU5.Bricks.Icon
              icon={button.icon}
              className={this.getClassName("inputButtonIcon")}
            />
          </UU5.Bricks.Button>
        </span>
      );
    }) : null;
  },

  _getFeedbackColorSchema() {
    let result;
    switch (this.props.feedback) {
      case 'warning':
        result = 'warning';
        break;
      case 'error':
        result = 'danger';
        break;
      case 'success':
        result = 'success';
        break;
    }
    return result;
  },

  _getRenderResult() {
    let result;

    let messageClass;
    if(this.props.feedback === 'initial') {
      messageClass = this.getClassName("feedbackInitial");
    }

    let message = !this.props.readonly && !this.props.disabled && this.props.message && <Message colorSchema={this._getFeedbackColorSchema()} content={this.props.message} className={messageClass} />;

    if (this.props.datetimepicker || this.props.daterangepicker) {
      let children = React.Children.toArray(this.props.children);
      let buttons = this._getButtons();
      result = <div {...this._getMainAttrs()}>
        <div className={this.getClassName("cover")}>
          {children[0]}
          {buttons && buttons[0]}
          {children.slice(1)}
          {buttons && buttons[1]}
        </div>
        {message}
      </div>;
    } else if (this.props.buttons && this.props.buttons.length > 0) {
      result = <div {...this._getMainAttrs()}>
        <div className={this.getClassName("cover")}>
          {React.Children.toArray(this.props.children)}
          {this._getButtons()}
        </div>
        {message}
      </div>;
    } else if (this.props.slider) {
      result = <div {...this._getMainAttrs()}>
        <div className={this.getClassName("cover")}>
          {React.Children.toArray(this.props.children)}
        </div>
        {message}
      </div>;
    } else {
      result = <div {...this._getMainAttrs()}>
        {React.Children.toArray(this.props.children)}
        {message}
      </div>
    }

    return result;
  },

  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render: function () {
    return this._getRenderResult();
  }
  //@@viewOn:render
});

export default InputWrapper;