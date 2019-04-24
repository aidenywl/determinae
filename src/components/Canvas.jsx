import React from "react";

class Canvas extends React.Component {
  componentDidMount() {
    console.log("HEY", this.props.baseCanvasRef);
  }
  handleOnClick(e) {
    const { baseCanvasRef } = this.props;
    console.log(e.pageX);
    console.log(this.canvas.offsetTop);
    console.log(baseCanvasRef.scrollLeft);
  }

  render() {
    return (
      <div
        id="canvas"
        onClick={event => this.handleOnClick(event)}
        ref={elem => (this.canvas = elem)}
      >
        Canvas
      </div>
    );
  }
}

export default Canvas;
