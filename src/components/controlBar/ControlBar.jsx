/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import { Cell } from './../gridItem/Cell.jsx';


import Button from '@material-ui/core/Button';
import { Box } from "@material-ui/core";

export default ({ 
    numRowsRef, 
    numColsRef, 
    tick,
    running, 
    runningRef, 
    setRunning, 
}) => {
    
    // const classes = useStyles();

    const runSimulation = useCallback(() => {
        if (!runningRef.current) {
            return;
        }
       
        // setGrid();

        // setGrid(g => {
        //     const newGrid = [];
        //     for (let row = 0; row < numRowsRef.current; row++) {
        //         const newRow = [];
        //         for (let col = 0; col < numColsRef.current; col++) {
        //             let neighbors = 0;
        //             operations.forEach(([x, y]) => {
        //                 const newI = row + x;
        //                 const newK = col + y;
        //                 if (newI >= 0 && newI < numRowsRef.current && newK >= 0 && newK < numColsRef.current) {
        //                     neighbors += g[newI][newK].state;
        //                 }
        //             });

        //             const cell = new Cell(row, col, g[row][col].state);
                    
        //             if (neighbors < 2 || neighbors > 3) {
        //                 cell.state = 0;
        //             } else if (g[row][col].state === 0 && neighbors === 3) {
        //                 cell.state = 1;
        //             }

        //             newRow.push(cell);
        //         }
        //         newGrid.push(newRow);
        //     }
        //     return newGrid;
        // });
        
        setTimeout(runSimulation, 100);
    }, []);


    return (
        <Box
            display="flex"
            justifyContent="space-around"
            alignItems="center"
        >
            <Button variant='contained' 
                color={ 'primary' }
                onClick={()=>{}}
                style={{
                    width: '30%',
                    height: '50px'
                }}
            > Prev </Button>
            <Button variant='contained' 
                color={running ? 'secondary' : 'primary'}
                onClick={() => {
                    setRunning(!running);
                    if (!running) {
                        runningRef.current = true;
                        // runSimulation();
                        tick();
                    }
                }}
                style={{
                    width: '30%',
                    height: '50px'
                }}
            > {running ? "Stop" : "Start"} </Button>
            <Button variant='contained' color='primary'
                onClick={()=>{}}
                style={{
                    width: '30%',
                    height: '50px'
                }}
            > Next </Button>
        </Box>
    )
}
