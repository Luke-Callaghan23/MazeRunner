/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lone-blocks */
/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useRef, useEffect, useCallback } from "react";

import Grid from '../grid/Grid.jsx';
import { Cell } from '../gridItem/Cell.jsx';
import ControlBar from '../controlBar/ControlBar';
import { Box, Typography } from "@material-ui/core";
import { MAZE_STATES, range, shake } from './../../Globals.js';
import './../gridItem/grid-style.css'
import MazeGenerator from './mazeAlgorithms/mazeGenerator.js';
import TurnLeft from "./mazeAlgorithms/turnLeft.js";
import BFS from "./mazeAlgorithms/BFS.js";
import DFS from "./mazeAlgorithms/DFS.js";
import Dijkstra from "./mazeAlgorithms/dijkstra";
import AStar from "./mazeAlgorithms/A*";
import GraphGenerator from "./mazeAlgorithms/graphGenerator.js";

export default ({
    speedRef,
    size,
    classes,
    grid, 
    setGrid,
    numRows,
    numCols,
    numRowsRef,
    numColsRef,
    mazeState,
    setMazeState
}) => {
    const [running, setRunning] = useState(false);
    const runningRef = useRef(running);
    runningRef.current = running;    
    const mazeStateRef = useRef(mazeState);
    mazeStateRef.current = mazeState;
    
    // Hacky way to re render without actually changing anything
    const reRender = useState(true)[1];

    const tickFunction = useRef(null);
    const resetFunction = useRef(null);
    const skipFunction = useRef(null);
    const tick = useCallback(() => {
        if (!runningRef.current) {
            return;
        }

        // If there is a current tick function, call it
        const finished = tickFunction.current &&
        tickFunction.current();

        if (finished) {
            // If the ticking is finished, set running to false,
            //      and incremenet the maze state
            setRunning(false);
            setMazeState(mazeState => mazeState + 1);
        }
        else {
            // Call a re render
            reRender(render => !render);
        }
    }, []);
    
    
    // tick();
    useEffect(() => {
        if (running) {
            setTimeout(tick, (100 - speedRef.current));
        }
    });

    const [ maze, setMaze ] = useState({
        start: [ -1, -1 ],
        end:   [ -1, -1 ]
    });

    const [ validEnd, setValidEnd ] = useState([]);

    // Effect hook to update the maze state reference when the maze state
    //      updates
    useEffect(() => {
        mazeStateRef.current = mazeState;

        switch (mazeState) {
            case MAZE_STATES.GENERATING: {
                [ tickFunction.current, resetFunction.current, skipFunction.current ] = new MazeGenerator (
                    grid.map(row => (
                        row.map(col => (
                            col['cell']
                        )
                    ))),
                    maze['start'],
                    maze['end']
                ).getFunctions()
                break;
            }
            case MAZE_STATES.RUNNING: {

                const f = grid.map(row => 
                    row.map(col => 
                        col['cell']
                    )
                );

                // Turn the start and end green
                const [ startRow, startCol ] = maze.start;
                const [ endRow  , endCol   ] = maze.end;
                
                // Remove a random wall from the end cell
                const end = grid[endRow][endCol]['cell'];
                MazeGenerator.selectAndRemoveWall(endRow, endCol, end, f);
                
                // Turn everything black
                grid.forEach(row => {
                    row.forEach(col => {
                        col['cell'].state = Cell.STATES.OFF;
                    })
                });
                
                // Set the start and end to gree
                grid[startRow][startCol]['cell'].state = Cell.STATES.CURRENT;
                grid[endRow  ][endCol  ]['cell'].state = Cell.STATES.CURRENT;

                const graph = new GraphGenerator(grid, maze.start, maze.end).generateGraph();

                const start = graph.V.find(vertex => vertex.mark.cordinate[0] === startRow && vertex.mark.cordinate[1] === startCol);

                [ tickFunction.current, resetFunction.current, skipFunction.current ] = new AStar (
                    grid.map(row => (
                        row.map(col => (
                            col['cell']
                        )
                    ))),
                    start,
                    maze['end'],
                    graph
                ).getFunctions()

                
                // Re render the new colors and reset the tick function
                reRender(render => !render);

                break;
            }
            case MAZE_STATES.FINISHED: {
                break;
            }
            default:
        }

    }, [ mazeState ]);

    // Getting the prompt to be displayed, based on the state of the maze
    const promptMap = {
        [MAZE_STATES.PICK_START]: 'Please choose the starting position of your maze . . .',
        [MAZE_STATES.PICK_END]:   'Please choose the ending position of your maze . . .',
        [MAZE_STATES.GENERATING]: 'Maze is being generated . . .',
        [MAZE_STATES.RUNNING]:    'Maze is being solved . . . ',
        [MAZE_STATES.FINISHED]:   'Finished!'
    }
    const prompt = promptMap[mazeState];

    const gridClick = (rowNum, colNum) => {
        switch (mazeStateRef.current) {
            case MAZE_STATES.PICK_START: {
                const element = grid[rowNum][colNum]['ref'].current;
                if (rowNum === 0 || colNum === 0 || rowNum === numRows - 1 || colNum === numCols - 1) {
                    // If a valid start spot was chosen
                    
                    // Add a spining animation
                    element.classList.add('anim-success');

                    // Array of all the valid end points for the maze
                    const ends = [];
                    
                    // Block for getting end points of the maze
                    {
                        // Adding the valid end points of the maze
                        // For any given side of the maze chosen for the start,
                        //      the only valid end points are tiles on the other
                        //      side of the grid
                        if (rowNum === 0) {
                            // SOUTH
                            range(numCols).forEach(col => {
                                ends.push([numRows - 1, col]);
                            });
                        } 
                        if (colNum === 0) {
                            // EAST
                            range(numRows).forEach(row => {
                                ends.push([row, numCols - 1]);
                            });
                        }
                        if (rowNum === numRows - 1) {
                            // NORTH
                            range(numCols).forEach(col => {
                                ends.push([0, col]);
                            });
                        }
                        if (colNum === numCols - 1) {
                            // WEST
                            range(numRows).forEach(row => {
                                ends.push([row, 0])
                            });
                        }
                    }
                    
                    // Block to set the corrent states for all the cells
                    {
    
                        // Clearing all other rows / cols of their state == 2 (green)
                        range(numRows).forEach(row => {
                            grid[row][0]['cell'].state = Cell.STATES.OFF;
                            grid[row][numCols - 1]['cell'].state = Cell.STATES.OFF;
                        });
                        range(numCols).forEach(col => {
                            grid[0][col]['cell'].state = Cell.STATES.OFF;
                            grid[numRows - 1][col]['cell'].state = Cell.STATES.OFF;
                        });
    
                        // Setting the valid end points to state == 2
                        ends.forEach(([ row, col ]) => {
                            grid[row][col]['cell'].state = Cell.STATES.CURRENT;
                        });
                        grid[rowNum][colNum]['cell'].state = Cell.STATES.CURRENT;
                    }

                    // Setting the starting point of the maze
                    setMaze(maze => ({
                        ...maze,
                        'start': [ rowNum, colNum ]
                    }));

                    // Setting valid end points array
                    setValidEnd(ends);
                    setMazeState(MAZE_STATES.PICK_END);
                }
                else {
                    // Shake the element if an invalid start spot was chosen
                    shake(element);
                }

                break;
            }
            case MAZE_STATES.PICK_END: {
                const element = grid[rowNum][colNum]['ref'].current;
                
                if (validEnd.find(([row, col]) => row === rowNum && col === colNum)) {
                    
                    // Set the end point of the maze
                    setMaze(maze => ({
                        ...maze,
                        end: [ rowNum, colNum ]
                    }));

                    // Set the states of all the non-end points to be 0
                    validEnd.forEach(([ row, col ]) => {
                        grid[row][col]['cell'].state = Cell.STATES.OFF;
                    });

                    // Make the end green and spinning
                    element.classList.add('anim-success')
                    grid[rowNum][colNum]['cell'].state = Cell.STATES.CURRENT;

                    // Now, start generating the maze
                    setMazeState(MAZE_STATES.GENERATING);
                }
                else {
                    shake(element);
                }

                break;
            }
            default:
        }
    };

    return (
    grid !== null && 
    <>
    
        <Typography 
            component="h2"
            align="center"
            style={{
                fontSize: 35,
                marginBottom: 7,
                color: 'grey'
            }}
        > {prompt} </Typography>
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <div style={{
                width: '45%',
                margin: 11
            }}>
                <ControlBar 
                    grid={grid}
                    maze={maze}
                    mazeState={mazeState}
                    setMazeState={setMazeState}
                    resetFunction={resetFunction}
                    skipFunction={skipFunction}
                    tick={tick}
                    running={running} 
                    runningRef={runningRef} 
                    setRunning={setRunning} 
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
                    size={size}
                    numRows={numRows}
                    numCols={numCols}
                    grid={grid}
                    gridClick={gridClick}
                />
            </div>

        </Box>
    </>)
}
