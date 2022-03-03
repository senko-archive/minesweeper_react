import React, {useState, useEffect} from "react";
import NumberDisplay from "../NumberDisplay"
import Button from "../Button";
import { generateCells } from "../../utils";

import "./App.scss"
import { Cell, CellState, CellValue, Faces } from "../../types";

const App: React.FC = () => {

    const [cells, setCells] = useState<Cell[][]>(generateCells());
    const [face, setFace] = useState<Faces>(Faces.smile);
    const [time, setTime] = useState<number>(0);
    const [live, setLive]    = useState<boolean>(false);
    const [bombCounter, setBombCounter] = useState<number>(10);
    
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

    useEffect(() => {
        if(live && time < 999) {
            const timer = setInterval(() => {
                setTime(time+1)
            }, 1000);
    
            return () => {
                clearInterval(timer);
            }
        }

    }, [live, time])



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
        // start the game
        if(!live) {
            setLive(true); 
        }
    }  

    const handleCellContext = (rowParam: number, colParam:number) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>):void => {
        e.preventDefault();
        
        if(!live){
            return;
        }

        const currentCells = cells.slice();
        const currentCell = cells[rowParam][colParam];

        if (currentCell.state == CellState.visible) {
            // do nothing
            return;
        }
        else if (currentCell.state == CellState.open) {
            currentCells[rowParam][colParam].state = CellState.flagged;
            setCells(currentCells);
            setBombCounter(bombCounter -1);
        }
        else if (currentCell.state == CellState.flagged) {
            currentCells[rowParam][colParam].state = CellState.open;
            setCells(currentCells);
            setBombCounter(bombCounter +1);

        }
    }

    const handleFaceClick = ():void => {
        if(live) {
            setLive(false);
            setTime(0);
            setCells(generateCells());
        }
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
                onContext={handleCellContext}
            />
            ));
    }

    return (
        <div className="App">
            <div className="Header">
                <NumberDisplay value={bombCounter}></NumberDisplay>
                <div className="Face" onClick={handleFaceClick}>
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