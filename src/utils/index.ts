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
