import React from "react";

import Canvas from "./Canvas";
class BaseCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.baseCanvas = null;
  }

  componentDidMount() {
    console.log(this.baseCanvas);

    console.log("scrolling", this.canvas);
    window.scrollTo(0, 2160); // for some reason this is in window.
    this.baseCanvas.scroll(3840, 0);
  }

  baseCanvasRef() {
    console.log("HEY", this.baseCanvas);
    return this.baseCanvas;
  }

  render() {
    return (
      <div id="base-canvas" ref={ref => (this.baseCanvas = ref)}>
        <Canvas baseCanvasRef={this.baseCanvas} />
      </div>
    );
  }
}

export default BaseCanvas;
