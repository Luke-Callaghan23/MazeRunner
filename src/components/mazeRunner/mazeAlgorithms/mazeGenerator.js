import { randRange, range, DIRECTIONS } from '../../../Globals';
import { Cell } from '../../gridItem/Cell';

export default class MazeGenerator {
    constructor(grid, start, end) {
        this.grid  = grid;
        this.end   = end;
        this.cur   = start;
        this.stack = [];
        this.grid[this.cur[0]][start[1]].state = Cell.STATES.CURRENT;
    }

    tick() {
        const self = this;

        return () => {

            console.log('maze generator tick');

            // Small function to collect all the valid (unvisited) neighbors of the
            //      the current cell
            const collectNegihbors = ([row, col]) => {
                
                const selected = [];

                // NORTH
                if (row > 0) {
                    const select = self.grid[row - 1][col];
                    selected.push([ select, DIRECTIONS.NORTH ]);
                }

                // EAST
                if (col < self.grid[0].length - 1) {
                    const select = self.grid[row][col + 1];
                    selected.push([ select, DIRECTIONS.EAST ]);
                }

                // SOUTH
                if (row < self.grid.length - 1) {
                    const select = self.grid[row + 1][col];
                    selected.push([ select, DIRECTIONS.SOUTH ]);
                }

                // WEST
                if (col > 0) {
                    const select = self.grid[row][col - 1];
                    selected.push([ select, DIRECTIONS.WEST ]);
                }

                return selected.filter(([ select, dir ]) => 
                    select.state === Cell.STATES.HOLD || 
                    select.state === Cell.STATES.OFF
                );
            };

            // Getting the list of valid neighbors of the current cell
            const validNeighbors = collectNegihbors(self.cur);

            const [row, col] = self.cur;

            let chosen;
            if (validNeighbors.length !== 0) {
                // Getting a randomly chosen target, and removing it from the 
                //      neighbors array

                const index = randRange(0, validNeighbors.length);
                const [ ch ] = validNeighbors.splice(index, 1);
                
                chosen = ch[0];
                chosen.state = Cell.STATES.HOLD;

                // Put all valid neighbors on hold
                validNeighbors.forEach(([ neighbor, _ ]) => {
                    neighbor.state = Cell.STATES.HOLD;
                    self.stack.push(neighbor);
                });

                MazeGenerator.removeWalls(row, col, ch[1], self.grid);

            }
            else {
                while (true) {
                    chosen = self.stack.pop();
                    if (chosen.state === Cell.STATES.HOLD) {
                        // Only accept the popped value if it has a state of HOLD,
                        //      otherwise, keep popping off
                        break;
                    }
                    if (self.stack.length === 0) {
                        // If the stack is empty, set chosen to null, and break
                        chosen = null;
                        break;
                    }
                }
                if (chosen === null) {
                    // If chosen === null, the stack is empty, meaning all 
                    //      cells have been filled
                    return true;
                }

                const chosenRow = chosen.row;
                const chosenCol = chosen.col;

                MazeGenerator.selectAndRemoveWall(chosenRow, chosenCol, chosen, self.grid);

            }

            // Set the status of the current cell to passed
            self.grid[row][col].state = Cell.STATES.PASSED;

            // Finally, set the selected cell above to self.cur so that it
            //      is the next cell that will be evaluated
            self.cur = [ chosen.row, chosen.col ];
            chosen.state = Cell.STATES.CURRENT;

            return false;
        }
    }

    static selectAndRemoveWall (chosenRow, chosenCol, chosen, grid) {
        const dirs = MazeGenerator.getDirection (
            chosenRow, 
            chosenCol, 
            chosen, 
            grid
        );

        
        const connectDir = parseInt(randRange(0, dirs.length));
        MazeGenerator.removeWalls(chosen.row, chosen.col, dirs[connectDir], grid);
    
    }

    static getDirection (chosenRow, chosenCol, chosen, grid) {
        const dirs = [];
        

        // NORTH
        if (chosenRow > 0 
        && chosen.borders[DIRECTIONS.NORTH] 
        && grid[chosenRow - 1][chosenCol].state === Cell.STATES.PASSED) {
            dirs.push(DIRECTIONS.NORTH);
        }
        // EAST
        if (chosenCol < grid[0].length - 1
        && chosen.borders[DIRECTIONS.EAST] 
        && grid[chosenRow][chosenCol + 1].state === Cell.STATES.PASSED) {
            dirs.push(DIRECTIONS.EAST);
        }
        // SOUTH
        if (chosenRow < grid.length - 1 
        && chosen.borders[DIRECTIONS.SOUTH] 
        && grid[chosenRow + 1][chosenCol].state === Cell.STATES.PASSED) {
            dirs.push(DIRECTIONS.SOUTH);
        }
        // WEST
        if (chosenCol > 0 
        && chosen.borders[DIRECTIONS.WEST] 
        && grid[chosenRow][chosenCol - 1].state === Cell.STATES.PASSED) {
            dirs.push(DIRECTIONS.WEST);
        }

        return dirs;
    }

    static removeWalls (numRow, numCol, direction, grid) {
        // Removing walls, depending on the direction of the chosen neighbor
        switch (direction) {
            case DIRECTIONS.NORTH: {
                grid[numRow][numCol].borders[DIRECTIONS.NORTH] = false;
                grid[numRow - 1][numCol].borders[DIRECTIONS.SOUTH] = false;
                break;
            }
            case DIRECTIONS.EAST: {
                grid[numRow][numCol].borders[DIRECTIONS.EAST] = false;
                grid[numRow][numCol + 1].borders[DIRECTIONS.WEST] = false;
                break;
            }
            case DIRECTIONS.SOUTH: {
                grid[numRow][numCol].borders[DIRECTIONS.SOUTH] = false;
                grid[numRow + 1][numCol].borders[DIRECTIONS.NORTH] = false;
                break;
            }
            case DIRECTIONS.WEST: {
                grid[numRow][numCol].borders[DIRECTIONS.WEST] = false;
                grid[numRow][numCol - 1].borders[DIRECTIONS.EAST] = false;
                break;
            }
            default:
        }
    }


}