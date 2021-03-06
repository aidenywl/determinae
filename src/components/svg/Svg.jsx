import React from "react";

export { default as Arrow } from "./Arrow";

class Svg extends React.Component {
  render() {
    const props = this.props;
    const { width, height, xmlns } = this.props;

    return (
      <svg style={props} xmlns={xmlns} width={width} height={height} {...props}>
        {props.children}
      </svg>
    );
  }
}

export default Svg;
