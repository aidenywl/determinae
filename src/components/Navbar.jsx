import React from "react";

import SystemTwoLogo from "../assets/logo.png";

class Navbar extends React.Component {
  render() {
    return (
      <div className="navbar">
        {/* <img src={SystemTwoLogo} className="navbar-logo" alt="logo" /> */}
        <div className="navbar__text">
          <h1 className="navbar-title text--title">Determinae</h1>
          <h5 className="navbar-subtitle">
            Rational Decision Making with Decision Matrixes
          </h5>
        </div>
      </div>
    );
  }
}

export default Navbar;
