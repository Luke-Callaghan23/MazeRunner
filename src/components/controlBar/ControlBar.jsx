/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));
export default ({ 
    numRows, 
    numCols, 
    running, 
    runningRef, 
    setRunning, 
    runSimulation, 
    setGrid, 
    generateEmptyGrid 
}) => {
    
    const classes = useStyles();

    return (
        <>
            <div className={classes.root}>
                <Button variant='contained' 
                    color={ running ? 'secondary' : 'primary' }
                    onClick={() => {
                        setRunning(!running);
                        if (!running) {
                            runningRef.current = true;
                            runSimulation();
                        }
                    }}
                > {running ? "Stop" : "Start"} </Button>
                <Button variant='contained' color='primary'
                    onClick={() => (
                        setGrid (
                            Array.from (
                                new Array(numRows), () => Array.from (
                                    new Array(numCols),
                                    () => (Math.random() > 0.7 ? 1 : 0)
                                )
                            )
                        )
                    )}
                > Random </Button>
                <Button variant='contained' color='primary'
                    onClick={() => {
                        setGrid(generateEmptyGrid());
                    }}
                > Clear </Button>
            </div>
        </>
    )
}
