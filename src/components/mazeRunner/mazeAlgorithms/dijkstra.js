import { randRange, range, DIRECTIONS } from '../../../Globals';
import { Cell } from '../../gridItem/Cell';
import PriorityQueue from './dataStructures/PriorityQueue';
import { Graph, Vertex, Edge } from './dataStructures/Graph';

export default class Dijkstra {
    constructor(grid, start, end, graph) {
        this.graph = graph;
        this.grid  = grid;
        this.start = start;
        this.end   = end;
        this.cur   = start.mark.cordinate;
        this.Q     = new PriorityQueue();
        this.addNeighbors(this.start, 0);
        this.edgeStack = [];
        this.grid[this.cur[0]][this.cur[1]].state = Cell.STATES.CURRENT;
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

                // Finally, set the selected cell above to self.cur so that it
                //      is the next cell that will be evaluated
                self.cur = [ chosen.row, chosen.col ];
                chosen.state = Cell.STATES.CURRENT;
            }


            if (self.edgeStack.length > 0) {
                // If there are items in the edge stack, pop from the stack
                //      and exit
                chosen = self.edgeStack.shift();
                standardExit();
                return false;
            }

            if (self.Q.length() > 0) {
                let u = null;
                while (true) {
                    if (self.Q.length() > 0) {
                        const temp = self.Q.pop();
                        if (!self.graph.V[temp.data.dest].mark.discovered) {
                            u = temp;
                            break;
                        }
                    }
                    else {
                        break;
                    }
                }
                
                const distU = u.key;
                const dataU = u.data;

                const dest = self.graph.V[dataU.dest];
                const src  = self.graph.V[dataU.src ];
                
                src.mark.discovered = true;

                self.addNeighbors(dest, distU);

                debugger;

                const [ srcRow , srcCol  ] = src.mark.cordinate;
                const [ destRow, destCol ] = dest.mark.cordinate;

                const [ getter, gridGetter ] = destRow !== srcRow
                    // Case: the hop is vertical
                    ? [ (item) => item[0],
                        (offset, dir) => self.grid[srcRow + (offset * dir)][srcCol] ]
                    // Case: the hop is horizontal
                    : [ (item) => item[1],
                        (offset, dir) => self.grid[srcRow][srcCol + (offset * dir)] ]
                
                const hop = Math.abs(getter(dest.mark.cordinate) - getter(src.mark.cordinate));

                const dir = getter(dest.mark.cordinate) > getter(src.mark.cordinate)
                    ? 1
                    : -1
                ;;

                range(1, hop + 1).forEach(offset => {
                    const cell = gridGetter(offset, dir);
                    self.edgeStack.push(cell);
                    cell.state = Cell.STATES.HOLD;
                });
                
                chosen  = self.edgeStack.shift();

                const [ targetRow, targetCol ] = [ chosen.row, chosen.col ];

                if (targetRow === endRow && targetCol === endCol) { 
                    return true;
                }

                standardExit();
                return false;
            }
            else {
                return true;
            }


        };

        const reset = () => {
            self.cur = [self.start.mark.cordinate.row, self.start.mark.cordinate.col];
            self.Q = new PriorityQueue();
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
