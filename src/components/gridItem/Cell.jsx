/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import { DIRECTIONS } from '../../Globals.js';
import './grid-style.css';
class Cell {
    constructor(row, col, state) {
        this.row = row;
        this.col = col;
        this.state = state;
        this.borders = [
            true, true, 
            true, true,
        ];
        this.flags = {};
    }
}

Cell.STATES = {
    OFF: 0,
    OLD: 2,
    CURRENT: 2,
    PASSED: 3,
    HOLD: 4,
    VERTEX: 5, 
    EDGE: 6
}

Cell.StateColorMap = {
    [Cell.STATES.OFF]: 'black',
    [Cell.STATES.OLD]: 'pink',
    [Cell.STATES.CURRENT]: '#99ff66',
    [Cell.STATES.PASSED]: '#bb0000',
    [Cell.STATES.HOLD]: 'blue',
    [Cell.STATES.VERTEX]: '#fff200',
    [Cell.STATES.EDGE]: '#ffae00'
};




const CellComponent = ({
    rref,
    cellObject,
    borderWidth,
    borderHeight,
    gridClick,
}) => (
    <div
    ref={rref}
    onClick={() => gridClick(cellObject.row, cellObject.col)}
    style={{
        border: `solid grey`,
        borderWidth: `
            ${cellObject.borders[DIRECTIONS.NORTH] ? borderHeight : 0}px 
            ${cellObject.borders[DIRECTIONS.EAST ] ? borderWidth  : 0}px 
            ${cellObject.borders[DIRECTIONS.SOUTH] ? borderHeight : 0}px 
            ${cellObject.borders[DIRECTIONS.WEST ] ? borderWidth  : 0}px 
        `,
        backgroundColor: Cell.StateColorMap[cellObject.state],
    }} />
)

// export default { CellComponent, Cell }

export {
    CellComponent,
    Cell
}