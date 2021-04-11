/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import './grid-style.css';


export default (props) => (
    <div
        onClick={() => props.data.gridClick(props.data.row, props.data.col)}
        className='grid-square'
        style={{
            backgroundColor: props.data.color
        }}
    />
)