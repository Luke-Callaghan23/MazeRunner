/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useRef, useEffect } from "react";

import Grid from '../grid/Grid.jsx';
import { Cell } from '../gridItem/Cell.jsx';
import ControlBar from '../controlBar/ControlBar';
import { Box } from "@material-ui/core";
import { MAZE_STATES, range } from './../../Globals.js';


const generateEmptyGrid = (numRows, numCols) => {
    let rows = [];
    for (let curRow = 0; curRow < numRows; curRow++) {
        let row = []
        for (let curCol = 0; curCol < numCols; curCol++) {
            row.push (
                new Cell(curRow, curCol, 0)
            )
        }
        rows.push(row)
    }
    return rows;
};


export default ({
    numRows,
    numCols,
    mazeState,
    setMazeState
}) => {
    const [ grid, setGrid ] = useState(null);
    const [running, setRunning] = useState(false);

    const runningRef = useRef(running);
    runningRef.current = running;

    const numRowsRef = useRef(numRows);
    const numColsRef = useRef(numCols);
    numRowsRef.current = numRows;
    numColsRef.current = numCols;

    useEffect(() => {
        setGrid(() => {

            
            let grid = generateEmptyGrid(numRows, numCols);
            console.log(numRows, numCols);
            console.log(grid.length, grid[0].length);
    
            console.log(grid)
            range(numRows).forEach(row => {
                grid[row][0].state = 2;
                console.log(row, numRows);
                grid[row][numCols - 1].state = 2;
            });
            range(numCols).forEach(col => {
                grid[0][col].state = 2;
                grid[numRows - 1][col].state = 2;
            });
    
            return grid;
        })
        numRowsRef.current = numRows;
        numColsRef.current = numCols;
    }, [ numRows, numCols ]);    

    
    useEffect(() => {
        switch (mazeState) {
            case MAZE_STATES.PICK_START: {
                break;
            }
            case MAZE_STATES.PICK_END: {
                break;
            }
            case MAZE_STATES.RUNNING: {
                break;
            }
            case MAZE_STATES.FINISHED: {
                break;
            }
            default:
        }
    }, [ mazeState ]);


    return (
    grid !== null && 
    <>
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <div style={{
                width: '45%',
                margin: '10px'
            }}>
                <ControlBar 
                    numRowsRef={numRowsRef} 
                    numColsRef={numColsRef} 
                    running={running} 
                    runningRef={runningRef} 
                    setRunning={setRunning} 
                    setGrid={setGrid} 
                    generateEmptyGrid={generateEmptyGrid}  
                />

            </div>
        </Box>
        
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <div style={{
                border: `5px solid grey`, 
                padding: 0,
                width: 'fit-content', 
                height: 'fit-content', 
            }}> 
                <Grid 
                    numRows={numRows}
                    numCols={numCols}
                    grid={grid}
                    gridClick={(rowNum, colNum) => {
                        setGrid(old => {
                            let grid = old.map(curRow => (
                                curRow.map(curCol => (
                                    new Cell (
                                        curCol.row, 
                                        curCol.col, 
                                        curCol.state
                                    )
                                ))
                            ));
                            grid[rowNum][colNum].state = grid[rowNum][colNum].state === 1 ? 0 : 1;
                            return grid;
                        });
                    }}
                />
            </div>

        </Box>
    </>)
}
