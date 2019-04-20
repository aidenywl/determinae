import React from "react";

class BaseCanvas extends React.Component {
  render() {
    return <div className="base-canvas">{this.props.children}</div>;
  }
}

export default BaseCanvas;
