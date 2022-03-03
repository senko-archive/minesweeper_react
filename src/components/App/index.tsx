import React, {useState, useEffect} from "react";
import NumberDisplay from "../NumberDisplay"
import Button from "../Button";
import { generateCells, openMultipleCells } from "../../utils";

import "./App.scss"
import { Cell, CellState, CellValue, Faces } from "../../types";
import { MAX_COLS, MAX_ROWS } from "../../constants";

const App: React.FC = () => {

    const [cells, setCells] = useState<Cell[][]>(generateCells());
    const [face, setFace] = useState<Faces>(Faces.smile);
    const [time, setTime] = useState<number>(0);
    const [live, setLive]    = useState<boolean>(false);
    const [bombCounter, setBombCounter] = useState<number>(10);
    const [hasLost, setHasLost] = useState<boolean>(false);
    const [hasWon, setHasWon] = useState<boolean>(false);
    
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


    useEffect(() => {
        if(hasLost) {
            setFace(Faces.lost);
            setLive(false);
        }
    }, [hasLost])

    useEffect(() => {
        setLive(false);
        setFace(Faces.won);
    }, [hasWon])

    const handleCellClick = (rowParam: number, colParam:number) => ():void => {
  
    
        let newCells = cells.slice();  
  
        // start the game
        if (!live) {
          let isBomb = newCells[rowParam][colParam].value === CellValue.bomb;
          while (isBomb) {
            newCells = generateCells();
            if (newCells[rowParam][colParam].value !== CellValue.bomb) {
              isBomb = false;
              break;
            }
          }

          setLive(true);
        }

        const currentCell = newCells[rowParam][colParam];

        if (
            [CellState.flagged, CellState.visible].includes(currentCell.state)
           ) {
            return;
        }

        if(currentCell.value == CellValue.bomb) {
            setHasLost(true);
            newCells[rowParam][colParam].red = true;
            newCells = showAllBombs();
            setCells(newCells);
        }
        else if (currentCell.value == CellValue.none) {
            newCells = openMultipleCells(newCells, rowParam, colParam);
        }
        else {
            newCells[rowParam][colParam].state = CellState.visible;
        }

        // check to see if you have won
        let safeOpenCellsExists = false;
        for (let row=0; row < MAX_ROWS; row++) {
            for(let col=0; col < MAX_COLS; col++) {
                const currentCell = newCells[row][col];

                if(currentCell.value !== CellValue.bomb && currentCell.state === CellState.open) {
                    safeOpenCellsExists = true;
                    break;
                }
            }
        }

        if(!safeOpenCellsExists) {
            newCells = newCells.map(row => row.map(cell => {
                if(cell.value === CellValue.bomb) {
                    return {
                        ...cell,
                        state: CellState.flagged
                    }
                }
                return cell;
            }))
            setHasWon(true);
        }

        setCells(newCells);
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
        setLive(false);
        setTime(0);
        setCells(generateCells());
        setHasLost(false);
        setHasWon(false);
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
                red={cell.red}
            />
            ));
    }

    const showAllBombs = (): Cell[][] => {
        const currentCells = cells.slice();
        return currentCells.map(row => row.map(cell => {
            if(cell.value === CellValue.bomb) {
                return{
                    ...cell,
                    state: CellState.visible
                };
            }

            return cell;
        }))
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