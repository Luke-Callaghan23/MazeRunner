/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green, blue, pink, red, orange } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Grid } from 'semantic-ui-react';

// function to get colored radio buttons, depending on an input color value
const radioGet = (color) => withStyles({
    root: {
        color: color[400],
        '&$checked': {
            color: color[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

// Getting the colored radio buttons
const [ GreenRadio, BlueRadio, PinkRadio, RedRadio, OrangeRadio ] = [
    radioGet(green),
    radioGet(blue),
    radioGet(pink),
    radioGet(red),
    radioGet(orange),
]


export default ({
    selectedAlgorithm,
    setSelectedAlgorithm
}) => {
    const handleChange = (event) => {
        if (event.target.value !== selectedAlgorithm) {
            setSelectedAlgorithm(event.target.value);
        }
    };

    return (
        <div style={{
            marginLeft:'23%',
        }}>

            <Grid 
                container
                direction="row"
                justify="space-around"
                alignItems="center"
            >
                <FormControl component="fieldset">
                    <RadioGroup row aria-label="position" name="position" defaultValue="top">
                        {/* Turn Left  */}
                        <FormControlLabel 
                            style={{
                                marginRight: 100,
                                color: green[400]
                            }}
                            value="end" 
                            control={
                                <GreenRadio
                                    checked={selectedAlgorithm === 'turnLeft'}
                                    onChange={handleChange}
                                    value="turnLeft"
                                    name="radio-button-demo"
                                    inputProps={{ 'aria-label': 'A' }}
                                />
                            } 
                            label="Turn Left" 
                        />
                        
                        {/* BFS  */}
                        <FormControlLabel 
                            style={{
                                marginRight: 100,
                                color: blue[400]
                            }}
                            value="end" 
                            control={
                                <BlueRadio
                                    checked={selectedAlgorithm === 'BFS'}
                                    onChange={handleChange}
                                    value="BFS"
                                    name="radio-button-demo"
                                    inputProps={{ 'aria-label': 'B' }}
                                />
                            } 
                            label="BFS" 
                        />
                        
                        {/* DFS  */}
                        <FormControlLabel 
                            style={{
                                marginRight: 100,
                                color: pink[400]
                            }}
                            value="end" 
                            control={
                                <PinkRadio
                                    checked={selectedAlgorithm === 'DFS'}
                                    onChange={handleChange}
                                    value="DFS"
                                    name="radio-button-demo"
                                    inputProps={{ 'aria-label': 'C' }}
                                />
                            } 
                            label="DFS" 
                        />
                        
                        {/* Dijkstra  */}
                        <FormControlLabel 
                            style={{
                                marginRight: 100,
                                color: red[400]
                            }}
                            value="end" 
                            control={
                                <RedRadio
                                    checked={selectedAlgorithm === 'dijkstra'}
                                    onChange={handleChange}
                                    value="dijkstra"
                                    name="radio-button-demo"
                                    inputProps={{ 'aria-label': 'D' }}
                                />
                            } 
                            label="Dijkstra" 
                        />
                        
                        {/* A*  */}
                        <FormControlLabel 
                            style={{
                                marginRight: 100,
                                color: orange[400]
                            }}
                            value="end" 
                            control={
                                <OrangeRadio
                                    checked={selectedAlgorithm === 'AStar'}
                                    onChange={handleChange}
                                    value="AStar"
                                    name="radio-button-demo"
                                    inputProps={{ 'aria-label': 'E' }}
                                />
                            }
                            label="A*" 
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
        </div>
    );
}
