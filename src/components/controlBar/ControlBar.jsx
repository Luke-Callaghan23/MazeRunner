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
