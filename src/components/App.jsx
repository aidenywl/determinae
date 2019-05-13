import React from "react";

/** Components */
import BaseCanvas from "./BaseCanvas";
import Navbar from "./Navbar";

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Navbar />
        <BaseCanvas />
      </div>
    );
  }
}

export default App;
