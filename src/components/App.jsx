import React from "react";

/** Components */
import BaseCanvas from "./BaseCanvas";
import Canvas from "./Canvas";

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <BaseCanvas>
          <Canvas />
        </BaseCanvas>
      </div>
    );
  }
}

export default App;
