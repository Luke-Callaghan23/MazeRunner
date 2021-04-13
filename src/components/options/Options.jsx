import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Box from "@material-ui/core/Box";
import { Icon, Modal } from 'semantic-ui-react'
import { Button as ModalButton } from 'semantic-ui-react'
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
    setNumRows,
    setNumCols,
    generated,
    setGenerated,
}) {
    const [buttonColor, setButtonColor] = useState('default');
    const classes = useStyles();


    // const handleChange = (event) => {
    //     setColor(event.target.checked ? 'blue' : 'default');
    // };

    const [ proxyRows, setProxyRows ] = useState('25');
    const [ proxyCols, setProxyCols ] = useState('25');

    const [ isRowsError, setIsRowsError ] = useState(false);
    const [ isColsError, setIsColsError ] = useState(false);

    const [ isModalOpen, setIsModalOpen ] = useState(false);


    const handleChange = (event) => {

        // Getting the correct setter functions for the value and the error
        //      depending on whether the edited text box was a row or
        //      a col
        const [ setValueFunc, setErrorFunc   ]  = event.target.name === 'numRows' 
            ? [ setProxyRows,   setIsRowsError ]
            : [ setProxyCols,   setIsColsError ]
        ;;

        // Getting the value both as a number and as a string
        const value = event.target.value;
        const asNum = Number(value);

        // Setting the error based on whether asNum is a valid number
        setErrorFunc((!asNum && asNum !== 0) || asNum <= 0 || parseInt(value) !== asNum)
        setValueFunc(value);
    }

    const handleGenerate = () => {
        if (buttonColor === 'blue') {

            if (generated) {
                // If there is already a maze, send a pop up modal asking for confirmation

                setIsModalOpen(true);
            }
            else {
                newMaze();
            }
        }
    }

    const newMaze = () => {
        // Set the state of generated to true
        setGenerated(true);
            
        // Small function to constrain a value on a range
        const constrain = (num, min, max) => {
            if (num < min) {
                return min;
            }
            else if (num > max) {
                return max;
            }
            return num;
        }

        // Getting the constrained rows / cols, and setting proxyRows / proxyCols
        //      and numRows / numCols
        const resRows = constrain(parseInt(proxyRows), 5, 100);
        const resCols = constrain(parseInt(proxyCols), 5, 100);
        setNumRows(resRows);
        setNumCols(resCols);
        setProxyRows(resRows);
        setProxyCols(resCols);

        setIsModalOpen(false);
    }


    useEffect(() => {
        // On numRows or numCols update, if the number of rows and cols is not
        //      in error, then set the color of the generate button to blue
        if (proxyRows && proxyCols && !isRowsError && !isColsError) {
            setButtonColor('blue')
        }
        // Otherwise, keep default red
        else {
        
            setButtonColor('default')
        }
    }, [ proxyRows, proxyCols ]);

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

                {/*    
                
                    Form for number of rows / cols
                
                */}
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
                            value={proxyRows}
                        />
                        <span className={classes.x}> X </span>
                        <TextField 
                            error={ isColsError  }
                            label="Cols" 
                            variant="outlined" 
                            name='numCols'
                            onChange={handleChange}
                            value={proxyCols}
                        />
                    </form>

                </Box>

                {/*    
                
                    Generate Maze button
                
                */}
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <StyledButton 
                        color={buttonColor}
                        onClick={handleGenerate}
                    >{
                        generated 
                        ? 'Generate New Maze'
                        : 'Generate'
                    }</StyledButton>
                </Box>


                {/*
                
                    Generate new maze modal
                
                */}
                <Modal
                    size='mini'
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false) }
                >
                    <Modal.Header>Generate new maze?</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to generate a new maze, and erase this one?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <ModalButton negative onClick={() => setIsModalOpen(false) }> No </ModalButton>
                        <ModalButton positive onClick={() => newMaze()}> Yes </ModalButton>
                    </Modal.Actions>
                </Modal>
            </div>
        </>
    );
}
