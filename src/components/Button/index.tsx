import React from "react";
import { CellState, CellValue } from "../../types";
import "./Button.scss";

interface ButtonProps {
    row: number;
    col: number;
    state: CellState
    value: CellValue
}

const Button: React.FC<ButtonProps> = ({row, col, state, value}) => {

    const renderContent = ():React.ReactNode => {
        if(state === CellState.visible) {
            if(value === CellValue.bomb) {
                return (
                    <span role="img" aria-label="bomb">
                    💣
                    </span>
                );      
            }
        }
        else if(state === CellState.flagged) {
            // TODO: Display flag emoji
        }
    }

    return <div className={`Button ${state === CellState.visible ? "visible" : ""}`}>
        {renderContent()}
    </div>
}

export default Button;