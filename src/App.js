/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import Options from './components/options/Options';
import MazeRunner from './components/mazeRunner/MazeRunner';
import { MAZE_STATES, range } from './Globals.js';
import { Cell } from './components/gridItem/Cell.jsx';
import { CssBaseline, FormControlLabel, Switch, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { ThemeProvider, createMuiTheme } from "@material-ui/core";


const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});
  
const themeObject = {
    palette: {
        primary: { main: "#053f5b" },
        secondary: { main: "#5e3c6f" },
        type: "dark"
    },
    themeName: "Blue Lagoon 2020",
};

const useDarkMode = () => {
    const [theme, setTheme] = useState(themeObject);

    const {
        palette: { type }
    } = theme;

    const toggleDarkMode = () => {
        const updatedTheme = {
            ...theme,
            palette: {
                ...theme.palette,
                type: type === "light" ? "dark" : "light"
            }
        };
        setTheme(updatedTheme);
    };
    return [theme, toggleDarkMode];
};
  

export default () => {
    const [ numRows, setNumRows ] = useState(0);
    const [ numCols, setNumCols ] = useState(0);
    
    const [ generated, setGenerated ] = useState(false);
    const [ mazeState, setMazeState ] = useState(MAZE_STATES.NOT_READY);

    const [ selectedAlgorithm, setSelectedAlgorithm ] = useState('turnLeft');

    const [ grid, setGrid ] = useState(null);
    
    const numRowsRef = useRef(numRows);
    const numColsRef = useRef(numCols);
    numRowsRef.current = numRows;
    numColsRef.current = numCols;

    const generateEmptyGrid = (numRows, numCols) => {
        let rows = [];
        for (let curRow = 0; curRow < numRows; curRow++) {
            let row = []
            for (let curCol = 0; curCol < numCols; curCol++) {
                row.push ({
                    'cell': new Cell(curRow, curCol, 0),
                    'ref':  React.createRef()
                })
            }
            rows.push(row)
        }
        return rows;
    };


    const classes = useStyles();
    const [theme, toggleDarkMode] = useDarkMode();
    // @ts-ignore
    const themeConfig = createMuiTheme(theme);

    const [size, setSize] = useState({
        x: window.innerWidth,
        y: window.innerHeight
    });
    const updateSize = () =>
        setSize({
            x: window.innerWidth,
            y: window.innerHeight
        });
    useEffect(() => (window.onresize = updateSize), []);
    
    const [ speed, setSpeed ] = useState(50);
    const speedRef = useRef(speed);

    return (
        <ThemeProvider theme={themeConfig}>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            
            <div style={{
                display:'flex', 
                justifyContent:'center',
                margin: 30
            }}>
                <Card 
                className={classes.root} 
                style={{
                    width: '90vw', 
                    height: 'fit-content',
                }}>
                    <CardContent>
                        
                        <
// @ts-ignore
                        FormControlLabel control={
                            <Switch 
                                // @ts-ignore
                                onClick={toggleDarkMode} label={`Toggle Dark Mode`} 
                            />
                        } />
                        <Typography 
                            variant="h1"
                            align="center"

                        > MAZE RUNNER </Typography>
                    </CardContent>
                </Card>
            </div>


            {
                generated &&
                <div style={{
                    display:'flex', 
                    justifyContent:'center',
                    margin: 30
                }}>
                    <Card 
                    className={classes.root} 
                    style={{
                        width: '90vw', 
                        height: 'fit-content',
                    }}>
                        <CardContent>
                            <MazeRunner 
                                selectedAlgorithm={selectedAlgorithm}
                                speedRef={speedRef}
                                size={size}
                                grid={grid}
                                numRows={numRows}
                                numCols={numCols}
                                mazeState={mazeState}
                                setMazeState={setMazeState}
                            />
                        </CardContent>
                    </Card>
                </div>
            }  
            <div style={{display:'flex', justifyContent:'center'}}>

                <Card 
                className={classes.root} 
                style={{
                    width: '90vw', 
                    height: 'fit-content',
                }}>
                    <CardContent>

                        <Options 

                            selectedAlgorithm={selectedAlgorithm}
                            setSelectedAlgorithm={setSelectedAlgorithm}

                            mazeState={mazeState}
                            speed={speed}
                            setSpeed={(speed) => {
                                speed = parseInt(speed);
                                setSpeed(speed);
                                speedRef.current = speed;
                            }}

                            setNumRows={setNumRows}
                            setNumCols={setNumCols}

                            generated={generated}
                            setGenerated={(value, proxyRows, proxyCols) => {

                                // Set the new row / col count
                                setNumRows(proxyRows);
                                setNumCols(proxyCols);
                                numRowsRef.current = proxyRows;
                                numColsRef.current = proxyCols;

                                // Generate a new grid with empty cells
                                let grid = generateEmptyGrid(proxyRows, proxyCols);
                                
                                // Setting the states of both the edge columns to be green
                                range(proxyRows).forEach(row => {
                                    grid[row][0]['cell'].state = Cell.STATES.CURRENT;
                                    grid[row][proxyCols - 1]['cell'].state = Cell.STATES.CURRENT;
                                });

                                // Setting the states of both the edge rows to be green
                                range(proxyCols).forEach(col => {
                                    grid[0][col]['cell'].state = Cell.STATES.CURRENT;
                                    grid[proxyRows - 1][col]['cell'].state = Cell.STATES.CURRENT;
                                });

                                // Setting the new grid state
                                setGrid(grid);

                                // Set the maze state to be the beginning state again
                                setMazeState(MAZE_STATES.PICK_START);
                                setGenerated(value);
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
            <CssBaseline />
        </ThemeProvider>

    );
};
