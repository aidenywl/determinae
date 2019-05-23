import React from "react";

class Sidebar extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <div className="sidebar">
        {children}
        <div className="sidebar-arrow">Sidebar Arrow</div>
      </div>
    );
  }
}

export default Sidebar;
