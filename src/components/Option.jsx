import React from "react";
import { compose } from "redux";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { connectActions } from "../reducers/configureStore";
import { deleteOption, updateOptionName } from "../actions/options";
import { calculateWordDimensions } from "../helpers";

const OPTION_PLACEHOLDER = "OPTION";

class Option extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DEFAULT_INPUT_WIDTH: 0,
      currentInputWidth: 0
    };

    this.titleInputRef = React.createRef();
  }

  componentDidMount() {
    // Sizing the input box to the placeholder.
    let fontSize = parseFloat(
      window
        .getComputedStyle(this.titleInputRef.current, null)
        .getPropertyValue("font-size")
    );

    let inputPlaceholderWidth = (OPTION_PLACEHOLDER.length - 2) * fontSize; // 2 is used to fit the input snugly based on observation.
    this.setState({
      currentInputWidth: inputPlaceholderWidth,
      DEFAULT_INPUT_WIDTH: inputPlaceholderWidth
    });
  }

  handleInputOnChange(event) {
    this.props.updateOptionName(this.props.id, event.target.value);
  }

  calculateInputWidth(name) {
    let dimensions = calculateWordDimensions(name, [
      "option__title__input",
      "text__header"
    ]);
    let textWidth = dimensions.width + 10;

    if (dimensions.width === 0) {
      return this.state.DEFAULT_INPUT_WIDTH;
    } else {
      return textWidth;
    }
  }

  render() {
    const { id, name, finalScore } = this.props;
    const newInputWidth = this.calculateInputWidth(name);
    const inputStyles = {
      width: newInputWidth
    };
    return (
      <div className="option">
        <div className="option">
          <button
            className="option__delete"
            onClick={() => this.props.deleteOption(id)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div className="option__title">
            <input
              ref={this.titleInputRef}
              className="option__title__input text__header"
              type="text"
              placeholder={OPTION_PLACEHOLDER}
              onChange={event => this.handleInputOnChange(event)}
              value={name}
              style={inputStyles}
            />
          </div>
          <hr />
          <div className="option__score">{finalScore}</div>
        </div>
      </div>
    );
  }
}

Option.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  finalScore: PropTypes.number.isRequired
};

export default compose(connectActions({ deleteOption, updateOptionName }))(
  Option
);
