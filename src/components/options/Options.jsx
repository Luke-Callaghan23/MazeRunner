import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Box from "@material-ui/core/Box";
// Like https://github.com/brunobertolini/styled-by
const styledBy = (property, mapping) => (props) => mapping[props[property]];

const styles = {
    root: {
        background: styledBy('color', {
            default: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            blue: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        }),
        borderRadius: 15,
        border: 0,
        color: 'white',
        height: 78,
        padding: '0 70px',
        boxShadow: styledBy('color', {
            default: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            blue: '0 3px 5px 2px rgba(33, 203, 243, .3)',
        }),
        fontSize: 30,
    },
};

const StyledButton = withStyles(styles)(({ classes, color, ...other }) => (
    <Button className={classes.root} {...other} />
));
    
    
const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    x: {
        fontSize: 45,
        color: 'grey',
        margin: '0px',
    },
}));
    
    
export default function DynamicCSS({ 
    numRows,
    numCols,
    setNumRows,
    setNumCols,
    generated,
    setGenerated,
}) {
    const [color, setColor] = React.useState('default');
    const classes = useStyles();


    // const handleChange = (event) => {
    //     setColor(event.target.checked ? 'blue' : 'default');
    // };

    const [ isRowsError, setIsRowsError ] = useState(false);
    const [ isColsError, setIsColsError ] = useState(false);


    const handleChange = (event) => {

        // Getting the correct setter functions for the value and the error
        //      depending on whether the edited text box was a row or
        //      a col
        const [ setValueFunc, setErrorFunc   ]  = event.target.name === 'numRows' 
            ? [ setNumRows,   setIsRowsError ]
            : [ setNumCols,   setIsColsError ]
        ;;

        // Getting the value both as a number and as a string
        const value = event.target.value;
        const asNum = Number(value);

        // Setting the error based on whether asNum is a valid number
        setErrorFunc((!asNum && asNum !== 0) || asNum < 5 || parseInt(value) !== asNum)
        setValueFunc(value);
    }

    const handleGenerate = () => {
        setGenerated(color === 'blue')
    }


    useEffect(() => {
        if (numRows && numCols && !isRowsError && !isColsError) {
            setColor('blue')
        }
        else {
            setColor('default')
        }

    }, [ numRows, numCols ]);

    return (
        <>
            {/* <FormControlLabel
                control={
                    <Switch
                        checked={color === 'blue'}
                        onChange={handleChange}
                        color="primary"
                        value="dynamic-class-name"
                    />
                }
                label="Blue"
            /> */}
            <div style={{width: '100%'}}>

                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <form className={classes.root} style={{fontSize: 15}} noValidate autoComplete="off">
                        <TextField 
                            error={ isRowsError  }
                            label="Rows" 
                            variant="outlined" 
                            name='numRows'
                            onChange={handleChange}
                            value={numRows}
                        />
                        <span className={classes.x}> X </span>
                        <TextField 
                            error={ isColsError  }
                            label="Cols" 
                            variant="outlined" 
                            name='numCols'
                            onChange={handleChange}
                            value={numCols}
                        />
                    </form>

                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <StyledButton 
                        color={color}
                        onClick={handleGenerate}
                    >Generate</StyledButton>
                </Box>
            </div>
        </>
    );
}
