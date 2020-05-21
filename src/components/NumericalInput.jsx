import React from "react";
import PropTypes from "prop-types";

class NumericalInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  handleInputClick(e) {
    const { onClick } = this.props;
    e.preventDefault();
    e.stopPropagation();
    this.inputRef.current.focus();
    this.inputRef.current.select();

    if (!onClick) {
      return;
    }
    onClick(e);
  }
  render() {
    const {
      className,
      id,
      placeholder,
      validation,
      label,
      onKeyDown,
      onChange,
      value,
      step,
      disabled,
    } = this.props;
    return (
      <div className={`numerical ${className}`}>
        <input
          id={id}
          ref={this.inputRef}
          className="numerical__input text--subtitle"
          placeholder={placeholder}
          type="number"
          step={step}
          onChange={onChange ? (event) => onChange(event) : null}
          value={value}
          onKeyDown={onKeyDown ? (e) => onKeyDown(e) : null}
          onClick={(e) => this.handleInputClick(e)}
          disabled={disabled}
        />
        <label className="numerical__label" htmlFor={id}>
          {label}
        </label>
      </div>
    );
  }
}

NumericalInput.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.number,
  label: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  step: PropTypes.string,
};

export default NumericalInput;
