const DIRECTIONS = {
    NORTH: 0,
    EAST:  1,
    SOUTH: 2,
    WEST:  3,
};

const MAZE_STATES = {
    NOT_READY:  -1,
    PICK_START: 0,
    PICK_END:   1,
    GENERATING: 2,
    RUNNING:    3, 
    FINISHED:   4,
};

const range = (start, end=null) => {
    if (end === null) {
        end   = start;
        start = 0;
    }
    const arr = []
    for (let loop = start; loop < end; loop++) {
        arr.push(loop);
    }
    return arr;
}

const randRange = (min, max) => { 
    return Math.random() * (max - min) + min;
} 


// Small function to add a 'shaking' animation to an element, when an invalid
//      action occurs
const shake = (element) => {
    element.classList.add('anim-wobble');
    element.style.backgroundColor = 'red';

    
    setTimeout(() => {
        element.style.backgroundColor = 'black';
        element.classList.remove('anim-wobble');
    }, 2000);
}

export { DIRECTIONS, MAZE_STATES, range, shake, randRange };