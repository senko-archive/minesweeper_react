import React, {useState, useEffect} from "react";
import NumberDisplay from "../NumberDisplay"
import Button from "../Button";
import { generateCells } from "../../utils";

import "./App.scss"
import { Cell, CellValue, Faces } from "../../types";

const App: React.FC = () => {

    const [cells, setCells] = useState<Cell[][]>(generateCells());
    const [face, setFace] = useState<Faces>(Faces.smile);
    const [time, setTime] = useState<number>(0);
    const [live, setLive]    = useState<boolean>(false);
    
    useEffect(() => {
        const handleMouseDown = ():void => {
            setFace(Faces.oh);
        };

        const handleMouseUp = ():void => {
            setFace(Faces.smile); 
        }

        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        }
    }, []);



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

    const handleCellClick = (rowParam: number, colParam:number) => ():void => {
        console.log(rowParam, colParam);
    }  

    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => 
            row.map((cell, colIndex) => 
            <Button 
                key={`${rowIndex} - ${colIndex}`}
                row={rowIndex}
                col={colIndex}
                state={cell.state}
                value={cell.value}
                onClick={handleCellClick}
            />
            ));
    }

    return (
        <div className="App">
            <div className="Header">
                <NumberDisplay value={0}></NumberDisplay>
                <div className="Face">
                    <span role="img" aria-label="face">
                        {face}
                    </span>
                </div>
                <NumberDisplay value={time}></NumberDisplay>
            </div>
            <div className="Body">{renderCells()}</div>
        </div>
    )
}

export default App;