import React from "react";
import { compose } from "redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

import { connectActions } from "../reducers/configureStore";
import { connectAllOptions } from "../reducers/optionReducer";
import { createOption, deleteOption } from "../actions/options";

class OptionBar extends React.Component {
  _renderOptions() {
    const { options } = this.props;
    return options.map(option => {
      return <div className="option-bar__item">Factor</div>;
    });
  }
  render() {
    return (
      <div className="option-bar">
        <button className="option-bar__add-btn">
          <FontAwesomeIcon icon={faPlus} />
        </button>
        {this._renderOptions()}
      </div>
    );
  }
}

export default compose(
  connectActions({}),
  connectAllOptions("options")
)(OptionBar);
