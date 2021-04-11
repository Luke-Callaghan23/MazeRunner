/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import GridItem from './../gridItem/GridItem.jsx';


export default (props) => (
    <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${props.numCols}, 49px)`
    }}> {
        props.grid.map((rData, row) => (
            rData.map((_, col) => (
                <GridItem  
                    key={`${row}-${col}`}
                    
                    data={{
                        row:       row,
                        col:       col,
                        gridClick: props.gridClick,
                        color:     props.grid[row][col] ? "pink" : "black"
                    }} 
                />
            ))
        ))
    } </div>
)