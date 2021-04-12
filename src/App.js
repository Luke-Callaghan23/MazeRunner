/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from 'react';
import './App.css';
import Options from './components/options/Options';
import MazeRunner from './components/mazeRunner/MazeRunner';
import { MAZE_STATES } from './Globals.js';

export default () => {
    const [ numRows, setNumRows ] = useState(0);
    const [ numCols, setNumCols ] = useState(0);
    
    const [ generated, setGenerated ] = useState(false);
    const [ mazeState, setMazeState ] = useState(MAZE_STATES.NOT_READY);

    return (
        <>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            
            {
                generated &&
                <MazeRunner 
                    numRows={numRows}
                    numCols={numCols}
                    mazeState={mazeState}
                    setMazeState={setMazeState}
                />
            }  
            <Options 
                setNumRows={setNumRows}
                setNumCols={setNumCols}

                generated={generated}
                setGenerated={(value) => {
                    setMazeState(MAZE_STATES.PICK_START);
                    setGenerated(value);
                }}
            />
        </>
    );
};
