/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { CellComponent, Cell } from './../gridItem/Cell.jsx';


const map = (num, in_min, in_max, out_min, out_max) => {

    if (num > 40) {
        return 1
    }
    else {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min

    }
}


export default ({
    size,
    numRows,
    numCols,
    gridClick,
    grid
}) => (
    <div style={{
        width: `80v${size.x > size.y ? 'h' : 'w'}`, 
        height: `80v${size.x > size.y ? 'h' : 'w'}`,
        display: 'grid',
        gridTemplateColumns: `${(() => {
            let str = '';
            for (let i = 0; i < numCols; i++) {
                str += 'auto ';
            }
            return str
        })()}`
    }}> {
        grid.map((rData, row) => (
            rData.map((_, col) => (
                <CellComponent  
                    key={`${row}-${col}`}
                    rref={grid[row][col]['ref']}
                    cellObject={grid[row][col]['cell']}
                    borderWidth={map(numCols, 5, 40, 5, 1)}
                    borderHeight={map(numRows, 5, 40, 5, 1)}
                    gridClick={gridClick}
                />
            ))
        ))
    } </div>
)