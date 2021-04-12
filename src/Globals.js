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

export { DIRECTIONS, MAZE_STATES, range };