import React from "react";
import { compose } from "redux";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { connectActions } from "../reducers/configureStore";
import { deleteOption, updateOptionName } from "../actions/options";

const OPTION_PLACEHOLDER = "OPTION";

class Option extends React.Component {
  handleInputOnChange(event) {
    this.props.updateOptionName(this.props.id, event.target.value);
  }

  render() {
    const { id, name, finalScore } = this.props;
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
              className="option__title__input"
              type="text"
              placeholder={OPTION_PLACEHOLDER}
              onChange={event => this.handleInputOnChange(event)}
              value={name}
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
