/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import { DIRECTIONS } from '../../Globals.js';

class Cell {
    constructor(row, col, state) {
        this.row = row;
        this.col = col;
        this.state = state;
        this.borders = [
            true, true, 
            true, true,
        ];
    }

}

Cell.StateColorMap = {
    0: 'black',
    1: 'pink',
    2: '#99ff66',
};




const CellComponent = ({
    cellObject,
    borderWidth,
    borderHeight,
    gridClick,
}) => (
    <div
    onClick={() => gridClick(cellObject.row, cellObject.col)}
    style={{
        border: `solid grey`,
        borderWidth: `
            ${cellObject.borders[DIRECTIONS.NORTH] ? borderHeight : 0}px 
            ${cellObject.borders[DIRECTIONS.EAST ] ? borderWidth  : 0}px 
            ${cellObject.borders[DIRECTIONS.SOUTH] ? borderHeight : 0}px 
            ${cellObject.borders[DIRECTIONS.WEST ] ? borderWidth  : 0}px 
        `,
        borderRadius: "0px",
        backgroundColor: Cell.StateColorMap[cellObject.state],
    }} />
)

// export default { CellComponent, Cell }

export {
    CellComponent,
    Cell
}