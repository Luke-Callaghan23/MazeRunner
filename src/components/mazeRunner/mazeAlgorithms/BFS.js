import { randRange, range, DIRECTIONS } from '../../../Globals';
import { Cell } from '../../gridItem/Cell';

export default class BFS {

    static Name = 'BFS';

    static DirectionOrder = [ 
        [ 0, -1, DIRECTIONS.WEST  ], 
        [ -1, 0, DIRECTIONS.NORTH ], 
        [ 0,  1, DIRECTIONS.EAST  ], 
        [  1, 0, DIRECTIONS.SOUTH ],
    ];

    constructor(grid, start, end) {
        this.grid  = grid;
        this.start = start;
        this.end   = end;
        this.cur   = start;
        this.Q = [];
        this.grid[this.cur[0]][start[1]].state = Cell.STATES.BFS;
        this.holding = [];
        this.passed = [];
    }

    getFunctions() {
        const self = this;

        const tick = () => {

            console.log('BFS tick');

            const [row, col] = self.cur;
            const [endRow, endCol] = self.end;

            let chosen = null;
            let found = false;
            
            // If the end was found, return true and end ticking
            if (found) return null;

            if (self.Q.length > 0) {
                // If there are no valid moves next to current, pop from the 
                //      stack to get to the last left turn not taken
                chosen = self.Q.splice(0, 1)[0];
            }
            
            console.log(self.Q);            

            BFS.DirectionOrder.forEach(([ rowOff, colOff, dir ]) => {

                // First check if the current direction has a border
                if (!self.grid[row][col].borders[dir]) {

                    // Then, check if that move is in bounds
                    if (row + rowOff >= 0 && row + rowOff <= self.grid.length &&
                        col + colOff >= 0 && col + colOff <= self.grid[0].length) {
                            
                        // If the move is in bounds and doesn't have a border,
                        //      check if it's the end tile
                        if (row + rowOff === endRow && col + colOff === endCol) {
                            // If it is, set found to true
                            found = true;
                            return;
                        }
                        
                        // If the move is not the end tile, check if the move is has a valid
                        //      state
                        const potential = self.grid[row + rowOff][col + colOff];
                        if (potential.state === Cell.STATES.HOLD || potential.state === Cell.STATES.OFF) {
                            
                            if (chosen === null) {
                                // If it's a valid move, set chosen to potential
                                chosen = potential;
                            }
                            else {
                                // If it's a valid move, and it's not the first
                                //      valid tile, push the cell to the stack
                                //      and set its state to HOLD
                                self.Q.push(potential);
                                potential.state = Cell.STATES.HOLD;
                                self.holding.push([row + rowOff, col + colOff]);
                            }
                        }
                    }
                }

            })

            if (found) return null;

            if (chosen === null) {
                return self;
            }

            // Set the status of the current cell to passed
            self.grid[row][col].state = Cell.STATES.PASSED;
            self.passed.push([row, col]);

            // Remove the passed item from the holding array, if it is in there
            const holdingIndex = self.holding.findIndex(([ row, col ]) => row === chosen.row && col === chosen.col);
            if (holdingIndex !== -1) {
                self.holding.splice(holdingIndex, 1);
            }

            // Finally, set the selected cell above to self.cur so that it
            //      is the next cell that will be evaluated
            self.cur = [ chosen.row, chosen.col ];
            chosen.state = Cell.STATES.CURRENT;

            return self;
        };

        const reset = () => {
            self.cur = self.start;
            self.Q = [];
            self.passed = [];
            self.holding = [];
        }

        // const skip = () => {
        //     // let res = false;
        //     // while (!res) {
        //     //     res = tick();
        //     // }
        // }

        // const switched = (current) => {
        //     if (current !== BFS.Name) {
        //         // Case: switching to the current this algorithm
    
        //         // Turn all holding and all passed to HOLD and PASSED
        //         self.holding.forEach(item => item.state = Cell.STATES.HOLD);
        //         self.passed.forEach(item => item.state = Cell.STATES.PASSED);
        //     }
        //     else {
        //         // Case: switching away from this algorithm
    
        //         // Turn off everything in self.holding and self.passed
        //         self.holding.forEach(item => item.state = Cell.STATES.OFF);
        //         self.passed.forEach(item => item.state = Cell.STATES.OFF);
        //     }
        // }

        return [
            tick,
            reset,
            // skip,
            // switched
        ]
    }

}