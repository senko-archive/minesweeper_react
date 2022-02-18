import React from "react";
import NumberDisplay from "../NumberDisplay"

import "./App.scss"

const App: React.FC = () => {
    return (
        <div className="App">
            <div className="Header">
                <NumberDisplay value={0}></NumberDisplay>
                <div className="Face">
                    <span role="img" aria-label="face">
                        😄
                    </span>
                </div>
                <NumberDisplay value={23}></NumberDisplay>
            </div>
            <div className="Body">Body</div>
        </div>
    )
}

export default App;