import { range } from '../../../Globals';
import { Cell } from '../../gridItem/Cell';
import PriorityQueue from './dataStructures/PriorityQueue';

export default class Dijkstra {

    static Name = 'dijkstra';

    constructor(grid, start, end, graph) {
        this.graph = graph;
        this.grid  = grid;
        this.start = start;
        this.end   = end;
        this.cur   = start.mark.cordinate;
        this.Q     = new PriorityQueue();
        this.addNeighbors(this.start, 0);
        this.edgeStack = [];
        this.grid[this.cur[0]][this.cur[1]].state = Cell.STATES.DIJKSTRA;
        this.holding = [];
        this.passed = [];
    }

    addNeighbors(source, distSource) {
        source.OUT.forEach(edge => {
            this.Q.push(edge, distSource + edge.weight);
        });
    }


    getFunctions() {
        const self = this;

        const tick = () => {
            
            console.log('dijkstra tick');

            const [row, col] = self.cur;
            const [endRow, endCol] = self.end;
            
            let chosen = null;
            
            // Function that is used in the standard exit of a tick
            const standardExit = () => {
                // Set the status of the current cell to passed
                self.grid[row][col].state = Cell.STATES.PASSED;
                self.passed.push([row, col]);

                // Finally, set the selected cell above to self.cur so that it
                //      is the next cell that will be evaluated
                self.cur = [ chosen.row, chosen.col ];
                chosen.state = Cell.STATES.CURRENT;

                // Remove the passed item from the holding array, if it is in there
                const holdingIndex = self.holding.findIndex(([ row, col ]) => row === chosen.row && col === chosen.col);
                if (holdingIndex !== -1) {
                    self.holding.splice(holdingIndex, 1);
                }
            }


            if (self.edgeStack.length > 0) {
                // If there are items in the edge stack, pop from the stack
                //      and exit
                chosen = self.edgeStack.shift();
                standardExit();
                return self;
            }

            if (self.Q.length() > 0) {

                // Getting the next undiscovered edge from self.Q
                let u = null;
                while (true) {
                    if (self.Q.length() > 0) {
                        // Pop from the queue
                        const temp = self.Q.pop();
                        if (!self.graph.V[temp.data.dest].mark.discovered) {
                            // If the destination on the popped edge is undiscovered,
                            //      set u to temp, and break
                            u = temp;
                            break;
                        }
                    }
                    else {
                        // If the queue is empty, there are no more vertices, return true
                        return null;
                    }
                }

                // Current distance to popped edge, and the edge itself
                const distU = u.key;
                const dataU = u.data;

                // Destination vertex and source vertex
                const dest = self.graph.V[dataU.dest];
                const src  = self.graph.V[dataU.src ];
                
                // Mark the source as discovered, and add all it's neighbors
                src.mark.discovered = true;
                self.addNeighbors(dest, distU);

                const [ srcRow , srcCol  ] = src.mark.cordinate;
                const destRow  = dest.mark.cordinate[0];

                const [ getter, gridGetter ] = destRow !== srcRow
                    // Case: the hop is vertical
                    ? [ (item) => item[0],
                        (offset, dir) => self.grid[srcRow + (offset * dir)][srcCol] ]
                    // Case: the hop is horizontal
                    : [ (item) => item[1],
                        (offset, dir) => self.grid[srcRow][srcCol + (offset * dir)] ]
                
                // Absolute distance between the source / destination of the targeted edge
                const hop = Math.abs(getter(dest.mark.cordinate) - getter(src.mark.cordinate));

                // Direction (negative or positive) of the hop
                const dir = getter(dest.mark.cordinate) > getter(src.mark.cordinate)
                    ? 1
                    : -1
                ;;

                // Add the neighbors cells in the targeted edge to the edgeStack
                //      and set their states to HOLD (so they're blue)
                range(1, hop + 1).forEach(offset => {
                    const cell = gridGetter(offset, dir);
                    self.edgeStack.push(cell);
                    cell.state = Cell.STATES.HOLD;
                    self.holding.push([cell.row, cell.col]);
                });
                
                // Next step is the first item in the edgeStack
                chosen  = self.edgeStack.shift();

                // Check if the chosen tile is the target, and return true if it is
                const [ targetRow, targetCol ] = [ chosen.row, chosen.col ];
                if (targetRow === endRow && targetCol === endCol) { 
                    return null;
                }

                // Exit
                standardExit();
                return self;
            }
            else {
                return null;
            }


        };

        const reset = () => {
            self.cur = [self.start.mark.cordinate.row, self.start.mark.cordinate.col];
            self.Q = new PriorityQueue();
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
        //     if (current !== Dijkstra.Name) {
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
