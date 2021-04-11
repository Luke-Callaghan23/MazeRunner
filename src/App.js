/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useState } from 'react';
import './App.css';
import Options from './components/options/Options';
import MazeRunner from './components/mazeRunner/MazeRunner';

export default () => {
    const [ numRows, setNumRows ] = useState('');
    const [ numCols, setNumCols ] = useState('');
    
    const [ generated, setGenerated ] = useState(false);


    useEffect(() => {
        console.log(numRows, numCols);
    })

    return (
        <>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            
            {
                generated &&
                <MazeRunner 
                    numRows={numRows}
                    numCols={numCols}
                />
            }  
            <Options 
                numRows={numRows}
                numCols={numCols}
                setNumRows={setNumRows}
                setNumCols={setNumCols}

                generated={generated}
                setGenerated={setGenerated}

            />
        </>
    );
};
