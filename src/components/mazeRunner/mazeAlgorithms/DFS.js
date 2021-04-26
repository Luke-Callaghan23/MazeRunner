import { randRange, range, DIRECTIONS } from '../../../Globals';
import { Cell } from '../../gridItem/Cell';

export default class DFS {

    static Directions = [ 
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
        this.stack = [];
        this.grid[this.cur[0]][start[1]].state = Cell.STATES.CURRENT;
    }

    getFunctions() {
        const self = this;

        const tick = () => {

            console.log('DFS tick');

            const [row, col] = self.cur;
            const [endRow, endCol] = self.end;

            let chosen = null;
            let found = false;

            // List of potential directions to move in
            let potentials = [];

            DFS.Directions.forEach(([ rowOff, colOff, dir ]) => {

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
                            
                            potentials.push(potential);
                            potential.state = Cell.STATES.HOLD;
                        }
                    }
                }

            });

            // If the end was found, return true and end ticking
            if (found) return true;

            if (potentials.length > 0) {
                // Chose a random direction from the potential directions list, and splice
                //      it from the potentials list as 'chosen"
                let dir = randRange(0, potentials.length);
                [ chosen ] = potentials.splice(dir, 1);

                // Then, add the rest of the potentials to the 
                potentials.forEach(potential => self.stack.push(potential));
            }
            else {
                if (self.stack.length > 0) {
                    // If there are no valid moves next to current, pop from the 
                    //      stack to get to the last left turn not taken
                    chosen = self.stack.pop();
                }
                else {
                    // If there are no valid moves and no past moves in the stack,
                    //      there is no solution, stop ticking
                    return true;
                }
            }

            // Set the status of the current cell to passed
            self.grid[row][col].state = Cell.STATES.PASSED;

            // Finally, set the selected cell above to self.cur so that it
            //      is the next cell that will be evaluated
            self.cur = [ chosen.row, chosen.col ];
            chosen.state = Cell.STATES.CURRENT;

            return false;
        };

        const reset = () => {
            self.cur = self.start;
            self.stack = [];
        }

        const skip = () => {
            let res = false;
            while (!res) {
                res = tick();
            }
        }

        return [ tick, reset, skip ]
    }

}