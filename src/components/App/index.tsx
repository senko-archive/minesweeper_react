import React, {useState} from "react";
import NumberDisplay from "../NumberDisplay"
import Button from "../Button";
import { generateCells } from "../../utils";

import "./App.scss"
import { CellValue } from "../../types";

const App: React.FC = () => {

    const [cells, setCells] = useState(generateCells());

    const checkcells = ():number => {
        let bombcount = 0;
        cells.forEach((row, rowindex) => {
            row.forEach((cell, colindex) => {
                if(cells[rowindex][colindex].value === CellValue.bomb) {
                    bombcount++;
                }
            })
        });
        return bombcount;

    }

    const renderCells = (): React.ReactNode => {
        let bc = checkcells();
        console.log("bomb count;",bc);
        return cells.map((row, rowIndex) => 
            row.map((cell, colIndex) => <Button key={`${rowIndex} - ${colIndex}`}/>));
    }

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
            <div className="Body">{renderCells()}</div>
        </div>
    )
}

export default App;