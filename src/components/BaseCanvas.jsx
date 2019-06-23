import React from "react";

import Canvas from "./Canvas";
/**
 * BaseCanvas is the viewport into the drawable canvas.
 */
class BaseCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.baseCanvasRef = React.createRef();
  }

  getBaseCanvasRef() {
    return this.baseCanvasRef.current;
  }

  componentDidMount() {
    this.baseCanvasRef.current.scroll(3840, 2160);
  }

  render() {
    return (
      <div id="base-canvas" ref={this.baseCanvasRef}>
        <Canvas getBaseCanvasRef={() => this.getBaseCanvasRef()} />
      </div>
    );
  }
}

export default BaseCanvas;
