import React from "react";
import { MAX_ROWS, MAX_COLS, NUMBER_OF_BOMBS } from "../constants";
import { CellState, CellValue, Cell } from "../types";

export const generateCells = (): Cell[][] => {
    let cells: Cell[][] = [];

    for(let row=0; row<MAX_ROWS; row++) {
        cells.push([]);
        for(let col=0; col<MAX_COLS; col++) {
            cells[row].push({
                value: CellValue.none,
                state: CellState.open
            })
        }

    }

    // randomly put 10 bombs
    let bombsPlaced = 0;
    while(bombsPlaced < NUMBER_OF_BOMBS) {
        const randomRow = Math.floor(Math.random() * MAX_ROWS);
        const randomColumn = Math.floor(Math.random() * MAX_COLS);

        const currentCell = cells[randomRow][randomColumn];
        if(currentCell.value !== CellValue.bomb) {
            cells[randomRow][randomColumn] = {
                ...cells[randomRow][randomColumn],
                value: CellValue.bomb
            }
        }
        bombsPlaced++;
    }

    // calculate the numbers for each cell
    for(let rowIndex=0; rowIndex < MAX_ROWS; rowIndex++){
        for(let colIndex=0; colIndex < MAX_COLS; colIndex++){
            const currentCell = cells[rowIndex][colIndex];
            if(currentCell.value === CellValue.bomb) {
                // no need to make any calculation
                continue;
            }
            
            let numberOfBoms = 0;
            const topLeftBomb = rowIndex > 0 && colIndex > 0 ? cells[rowIndex - 1][colIndex - 1] : null;
            const topBomb = rowIndex > 0 ?  cells[rowIndex - 1][colIndex] : null;
            const topRightBomb = rowIndex > 0 && colIndex < MAX_COLS -1 ? cells[rowIndex - 1][colIndex + 1] : null;
            const leftBomb = colIndex > 0 ? cells[rowIndex][colIndex - 1] : null;
            const rightBomb = colIndex < MAX_COLS -1 ? cells[rowIndex][colIndex + 1] : null;
            const bottomLeftBomb = rowIndex < MAX_ROWS -1 && colIndex > 0 ? cells[rowIndex + 1][colIndex -1] : null;
            const bottomBomb = rowIndex < MAX_ROWS -1 ? cells[rowIndex + 1][colIndex] : null;
            const bottomRightBomb = rowIndex < MAX_ROWS -1 && colIndex < MAX_COLS -1 ? cells[rowIndex + 1][colIndex + 1] : null;

            if(topLeftBomb?.value === CellValue.bomb) {
                numberOfBoms ++;
            }
            if(topBomb?.value === CellValue.bomb) {
                numberOfBoms++;
            }
            if(topRightBomb?.value === CellValue.bomb) {
                numberOfBoms++;
            }
            if(leftBomb?.value === CellValue.bomb) {
                numberOfBoms++;
            }
            if(rightBomb?.value === CellValue.bomb) {
                numberOfBoms++;
            }
            if(bottomLeftBomb?.value === CellValue.bomb) {
                numberOfBoms++;
            } 
            if(bottomBomb?.value === CellValue.bomb) {
                numberOfBoms++;
            }
            if(bottomRightBomb?.value === CellValue.bomb) {
                numberOfBoms++;
            }

            if(numberOfBoms > 0) {
                cells[rowIndex][colIndex] = {
                    ...currentCell,
                    value: numberOfBoms
                }
            }



        }
    }

    return cells;

}

export const openMultipleCells = (cells: Cell[][], rowParam:number, colParam:number): Cell[][] => {
    const currentCell = cells[rowParam][colParam];

    if(
        currentCell.state == CellState.visible ||
        currentCell.state == CellState.flagged
    ) {
        return cells;
    }


    let newCells = cells.slice(); 
    // we are assuming cell is open when this methid executed
    newCells[rowParam][colParam].state = CellState.visible;



    const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell
    } = grabAllAdjacentCells(cells, rowParam, colParam);

    if(topLeftCell?.state == CellState.open && topLeftCell.value != CellValue.bomb) {
        if(topLeftCell.value == CellValue.none) {
            newCells = openMultipleCells(newCells, rowParam-1, colParam-1)    
        }
        else {
            newCells[rowParam-1][colParam-1].state = CellState.visible;
        } 
    }

    if(topCell?.state == CellState.open && topCell.value != CellValue.bomb) {
        if(topCell.value == CellValue.none) {
            newCells = openMultipleCells(newCells, rowParam-1, colParam)    
        }
        else {
            newCells[rowParam-1][colParam].state = CellState.visible;
        } 
    }

    if(topRightCell?.state == CellState.open && topRightCell.value != CellValue.bomb) {
        if(topRightCell.value == CellValue.none) {
            newCells = openMultipleCells(newCells, rowParam-1, colParam+1)    
        }
        else {
            newCells[rowParam-1][colParam+1].state = CellState.visible;
        } 
    }

    if(leftCell?.state == CellState.open && leftCell.value != CellValue.bomb) {
        if(leftCell.value == CellValue.none) {
            newCells = openMultipleCells(newCells, rowParam, colParam-1)    
        }
        else {
            newCells[rowParam][colParam-1].state = CellState.visible;
        } 
    }

    if(rightCell?.state == CellState.open && rightCell.value != CellValue.bomb) {
        if(rightCell.value == CellValue.none) {
            newCells = openMultipleCells(newCells, rowParam, colParam+1)    
        }
        else {
            newCells[rowParam][colParam+1].state = CellState.visible;
        } 
    }

    if(bottomLeftCell?.state == CellState.open && bottomLeftCell.value != CellValue.bomb) {
        if(bottomLeftCell.value == CellValue.none) {
            newCells = openMultipleCells(newCells, rowParam+1, colParam-1)    
        }
        else {
            newCells[rowParam+1][colParam-1].state = CellState.visible;
        } 
    }

    if(bottomCell?.state == CellState.open && bottomCell.value != CellValue.bomb) {
        if(bottomCell.value == CellValue.none) {
            newCells = openMultipleCells(newCells, rowParam+1, colParam)    
        }
        else {
            newCells[rowParam+1][colParam].state = CellState.visible;
        } 
    }

    if(bottomRightCell?.state == CellState.open && bottomRightCell.value != CellValue.bomb) {
        if(bottomRightCell.value == CellValue.none) {
            newCells = openMultipleCells(newCells, rowParam+1, colParam+1)    
        }
        else {
            newCells[rowParam+1][colParam+1].state = CellState.visible;
        } 
    }

    return newCells;
}

const grabAllAdjacentCells = (cells: Cell[][], rowParam: number, colParam:number) : {
    topLeftCell: Cell | null;
    topCell: Cell | null;
    topRightCell: Cell | null;
    leftCell: Cell | null;
    rightCell: Cell | null;
    bottomLeftCell: Cell | null;
    bottomCell: Cell | null;
    bottomRightCell: Cell | null;
}=> {
    const topLeftCell = rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null;
    const topCell = rowParam > 0 ?  cells[rowParam - 1][colParam] : null;
    const topRightCell = rowParam > 0 && colParam < MAX_COLS -1 ? cells[rowParam - 1][colParam + 1] : null;
    const leftCell = colParam > 0 ? cells[rowParam][colParam - 1] : null;
    const rightCell = colParam < MAX_COLS -1 ? cells[rowParam][colParam + 1] : null;
    const bottomLeftCell = rowParam < MAX_ROWS -1 && colParam > 0 ? cells[rowParam + 1][colParam -1] : null;
    const bottomCell = rowParam < MAX_ROWS -1 ? cells[rowParam + 1][colParam] : null;
    const bottomRightCell = rowParam < MAX_ROWS -1 && colParam < MAX_COLS -1 ? cells[rowParam + 1][colParam + 1] : null;

    return {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell
    }

    
}