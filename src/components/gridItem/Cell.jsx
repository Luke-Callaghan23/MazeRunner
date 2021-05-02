/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import { DIRECTIONS } from '../../Globals.js';
import './grid-style.css';
import { green, blue, pink, red, orange } from '@material-ui/core/colors';

class Cell {
    constructor(row, col, state, borders=null) {
        this.row = row;
        this.col = col;
        this.state = state;
        this.borders = borders || [
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
    EDGE: 6,
    TURNLEFT: 7,
    BFS: 8,
    DFS: 9,
    DIJKSTRA: 10,
    ASTAR: 11,
}

Cell.StateColorMap = {
    [Cell.STATES.OFF]: 'black',
    [Cell.STATES.OLD]: 'pink',
    [Cell.STATES.CURRENT]: '#99ff66',
    [Cell.STATES.PASSED]: '#bb0000',
    [Cell.STATES.HOLD]: 'blue',
    [Cell.STATES.VERTEX]: '#fff200',
    [Cell.STATES.EDGE]: '#ffae00',
    [Cell.STATES.TURNLEFT]: green[400],
    [Cell.STATES.BFS]: blue[400],
    [Cell.STATES.DFS]: pink[400],
    [Cell.STATES.DIJKSTRA]: red[400],
    [Cell.STATES.ASTAR]: orange[400],
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