/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useCallback, useRef } from "react";

import Grid from './../grid/Grid.jsx';
import ControlBar from './../controlBar/ControlBar';

import produce from "immer";

const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0]
];

const numRows = 25;
const numCols = 25;

const generateEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
};


export default () => {

    
    const [ grid, setGrid ] = useState(() => {
        return generateEmptyGrid();
    });


    const [running, setRunning] = useState(false);
    
    const runningRef = useRef(running);
    runningRef.current = running;
    
    

    const runSimulation = useCallback(() => {
        if (!runningRef.current) {
            return;
        }
        
        setGrid(g => {
            return produce(g, gridCopy => {
                for (let row = 0; row < numRows; row++) {
                    for (let col = 0; col < numCols; col++) {
                        let neighbors = 0;
                        operations.forEach(([x, y]) => {
                            const newI = row + x;
                            const newK = col + y;
                            if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                                neighbors += g[newI][newK];
                            }
                        });
                        
                        if (neighbors < 2 || neighbors > 3) {
                            gridCopy[row][col] = 0;
                        } else if (g[row][col] === 0 && neighbors === 3) {
                            gridCopy[row][col] = 1;
                        }
                    }
                }
            });
        });
        
        setTimeout(runSimulation, 100);
    }, []);

    return (<>
        <ControlBar 
            numRows={numRows} 
            numCols={numCols} 
            running={running} 
            runningRef={runningRef} 
            setRunning={setRunning} 
            runSimulation={runSimulation} 
            setGrid={setGrid} 
            generateEmptyGrid={generateEmptyGrid}  
        />
        
        <Grid 
            numRows={numRows}
            numCols={numCols}
            grid={grid}
            gridClick={(row, col) => {
                setGrid(old => {
                    let grid = old.map(row => (
                        row.map(col => (
                            col
                        ))
                    ));
                    grid[row][col] = grid[row][col] ? 0 : 1;
                    return grid
                });
            }}
        />
    </>)
}