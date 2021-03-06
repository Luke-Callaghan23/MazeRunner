/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import { Cell } from './../gridItem/Cell.jsx';


import Button from '@material-ui/core/Button';
import { Box } from "@material-ui/core";
import { MAZE_STATES } from "Globals.js";

export default ({ 
    maze,
    mazeState,
    setMazeState,
    grid,
    tick,
    resetFunction,
    skipFunction,
    running, 
    runningRef, 
    setRunning, 
}) => (
    <Box
        display="flex"
        justifyContent="space-around"
        alignItems="center"
    >
        <Button variant='contained' 
            color={ 'primary' }
            disabled={!(mazeState === MAZE_STATES.RUNNING || mazeState === MAZE_STATES.GENERATING) || !running}

            onClick={()=>{

                // Reseting states for all cells in the grid
                grid.forEach(row => {
                    row.forEach(col => {
                        col = col['cell'];
                        col.state = Cell.STATES.OFF;
                        col.borders = [ true, true, true, true ];
                    })
                });

                // Setting states of the start and end to current
                const [ startRow, startCol ] = maze.start;
                const [ endRow  , endCol   ] = maze.end;  
                grid[startRow][startCol]['cell'].state = Cell.STATES.CURRENT;
                grid[endRow  ][endCol  ]['cell'].state = Cell.STATES.CURRENT;

                // Reset internal class data
                resetFunction.current();

                // Set running to false and re render
                setRunning(false);
            }}
            style={{
                width: '30%',
                height: '50px'
            }}
        > Reset </Button>
        <Button variant='contained' 
            color={running ? 'secondary' : 'primary'}
            onClick={() => {
                setRunning(!running);
                if (!running) {
                    runningRef.current = true;
                    tick();
                }
            }}
            style={{
                width: '30%',
                height: '50px'
            }}
        > {running ? "Stop" : "Start"} </Button>
        <Button variant='contained' color='primary'
            disabled={!(mazeState === MAZE_STATES.RUNNING || mazeState === MAZE_STATES.GENERATING) || !running}
            onClick={()=>{
                skipFunction.current();
                setMazeState(mazeState + 1);
                setRunning(false);
            }}
            style={{
                width: '30%',
                height: '50px'
            }}
        > Skip </Button>
    </Box>
);
