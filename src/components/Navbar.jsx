import React from "react";

import SystemTwoLogo from "../assets/logo.png";

class Navbar extends React.Component {
  render() {
    return (
      <div className="navbar">
        <img src={SystemTwoLogo} className="navbar-logo" alt="logo" />
        <h1 className="navbar-title text--title">Determinae</h1>
      </div>
    );
  }
}

export default Navbar;
