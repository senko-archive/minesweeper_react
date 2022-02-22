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

    return cells;

}
