import React from "react";
import { compose } from "redux";
import { connectActions } from "../reducers/configureStore";

import { onUndo, onRedo, KEY_CODE } from "../helpers";
/** Components */
import BaseCanvas from "./BaseCanvas";
import Navbar from "./Navbar";

class App extends React.Component {
  componentDidMount() {
    /** FOR UNDO REDO */
    let ctrlDown = false;
    let shiftDown = false;

    document.body.onkeydown = function(e) {
      const currentKeyCode = e.keyCode;
      if (
        currentKeyCode === KEY_CODE.CTRL ||
        currentKeyCode === KEY_CODE.MAC_COMMAND
      ) {
        ctrlDown = true;
      } else if (currentKeyCode === KEY_CODE.SHIFT) {
        shiftDown = true;
      } else if (ctrlDown && shiftDown && currentKeyCode === KEY_CODE.Z) {
        e.preventDefault();
        this.props.onRedo();
      } else if (ctrlDown && currentKeyCode === KEY_CODE.Z) {
        e.preventDefault();
        this.props.onUndo();
      }
    }.bind(this);

    document.body.onkeyup = function(e) {
      const currentKeyCode = e.keyCode;
      if (
        currentKeyCode === KEY_CODE.CTRL ||
        currentKeyCode === KEY_CODE.MAC_COMMAND
      ) {
        ctrlDown = false;
      } else if (currentKeyCode === KEY_CODE.SHIFT) {
        shiftDown = false;
      }
    };
    /** END OF UNDO REDO SEGMENT */
  }
  render() {
    return (
      <div className="app">
        <Navbar />
        <BaseCanvas />
      </div>
    );
  }
}

export default compose(connectActions({ onUndo, onRedo }))(App);
