import React from "react";
import { compose } from "redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { connectActions } from "../reducers/configureStore";
import { connectAllOptions } from "../reducers/optionReducer";
import { createOption, deleteOption } from "../actions/options";
import Option from "./Option";
import { connectFinalOptionScores } from "../reducers/optionScoreSelector";

class OptionBar extends React.PureComponent {
  _renderOptions() {
    const { options, finalOptionScores } = this.props;
    return options.map((option) => {
      const { id, name } = option;

      return (
        <Option
          key={id}
          id={id}
          name={name}
          finalScore={finalOptionScores[id]}
        />
      );
    });
  }
  render() {
    return (
      <div className="option-bar">
        <button
          className="option-bar__add-btn"
          onClick={() => this.props.createOption()}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <div className="option-bar__items">{this._renderOptions()}</div>
      </div>
    );
  }
}

export default compose(
  connectActions({ createOption, deleteOption }),
  connectAllOptions("options"),
  connectFinalOptionScores("finalOptionScores")
)(OptionBar);
