import { range, DIRECTIONS } from '../../../Globals';
import { Cell } from '../../gridItem/Cell';
import { Graph } from './dataStructures/Graph.js';

class CellMarker {
    constructor(cordinate, discovered) {
        this.cordinate = cordinate;
        this.discovered = discovered;
    }
}

// Because maze solving algorithms don't need to ever make decisions 
//      when the cell currently being evaluated only has two walls,
//      and those walls are parallel, 
// Any given maze can be simplified to a graph of vertices at evry junction point, 
//      which connects all the junction points together
// The GraphGenerator generates a graph of junctions for a given maze.  
export default class GraphGenerator {

    constructor(grid, start, end) {
        this.grid  = grid;
        this.start = start;
        this.end   = end;
        this.cur   = start;
        this.stack = [];
        this.grid[this.cur[0]][start[1]].state = Cell.STATES.CURRENT;
        this.vertexGrid = null;
        this.Graph = new Graph();
    }

    // Function to collect all the vertices in the maze graph using a strategy
    //      where we traverse sideways through every col in every row and add 
    //      a new vertex at every junction
    // This function adds all vertices and connects the junctions between all
    //      vertices on the same row
    collectRowVertices() {

        this.vertexGrid = [];

        const [ startRow, startCol ] = this.start;
        const [ endRow,   endCol   ] = this.end;
  
        this.grid.forEach((row, rowIndex) => {
            
            const rowVertices = [];
            
            // Index of the previous vertex in the row
            let lastVert = -1;
            
            // Counter for the weight of the edge between the previous vertex in the
            //      row and the next
            let weight = 0;
            
            row.forEach((col, colIndex) => {
                
                // Getting the array of borders on the current cell, and the
                //      count of those walls
                const borders = col['cell'].borders;
                const walls   = borders.reduce((acc, item) => acc + item, 0);
                
                // Boolean indicating whether a vertex should be added on the 
                //      current cell
                let vertex = false;
                
                if (walls === 2) {
                    if ((borders[DIRECTIONS.NORTH] || borders[DIRECTIONS.SOUTH])
                    &&  (borders[DIRECTIONS.EAST]  || borders[DIRECTIONS.WEST])) {
                        // If there are two walls and they're not parallel to each other,
                        //      we need to add a vertex there
                        vertex = true;
                    }
                }   
                else {
                    // If there are 0, 1, or 3 walls around any given tile, we need to
                    //      put a vertex on that cell, regardless of where they're
                    //      positioned
                    vertex = true;
                }
                
                // Boolean to determine if the next vertex should be disconnected 
                //      from the previous pvertex
                let disconnect = borders[DIRECTIONS.EAST];
                
                if (vertex 
                || (rowIndex === startRow && colIndex === startCol)
                || (rowIndex === endRow   && colIndex === endCol  )
                ) {
                    
                    if (lastVert !== -1) {
                        // If the current vertex should be connected to the previous
                        //      one add an edge (the destination vertex) will be 
                        //      added regardless
                        lastVert = this.Graph.add_edge(lastVert, weight + 1).dest;
                        // And mark the vertex with it's row / col coords
                        this.Graph.V[lastVert].mark = new CellMarker(
                            [ rowIndex, colIndex ],
                            false
                        );
                    }
                    else {
                        // If the last vertex was disconnected from this one,
                        //      add a vertex to the graph
                        const vertex = this.Graph.add_vertex();
                        lastVert = vertex.id;
                        
                        // And mark that vertex with it's row / col coords
                        vertex.mark = new CellMarker(
                            [ rowIndex, colIndex ],
                            false
                        );
                    }
                    
                    // this.grid[rowIndex][colIndex]['cell'].state = Cell.STATES.VERTEX;

                    // Push the id of the current vertex into the row vertices array
                    //      
                    rowVertices.push(lastVert);
                    
                    // Whenever a new vertex is added, reset the weight
                    weight = -1;
                }
                else {
                    // this.grid[rowIndex][colIndex]['cell'].state = Cell.STATES.EDGE;
                    rowVertices.push(-1);
                }
                
                if (disconnect) {
                    // If there was a east or west wall, the next vertex should be
                    //      disconnected from this one
                    lastVert = -1;
                    weight = -1;
                }
                else {
                    // If there was no east or west wall, increment the weight counter
                    weight ++;
                }
                
            });

            // Push the row into the vertex grid
            this.vertexGrid.push(rowVertices);
        
        });
    }

    connectRows() {

        const rows = range(this.grid.length);
        const cols = range(this.vertexGrid[0].length);

        cols.forEach(colIndex => {

            let lastVertex = -1;
            let weight = 0;

            rows.forEach(rowIndex => {
                if (this.vertexGrid[rowIndex][colIndex] !== -1) {
                    if (lastVertex !== -1) {
                        this.Graph.add_edge(lastVertex, weight + 1, this.vertexGrid[rowIndex][colIndex]);
                    }
                    
                    lastVertex = this.grid[rowIndex][colIndex]['cell'].borders[DIRECTIONS.SOUTH]
                        ? -1
                        : this.vertexGrid[rowIndex][colIndex]
                    ;
                    weight = 0;
                }
                else {
                    // this.grid[rowIndex][colIndex]['cell'].state = Cell.STATES.EDGE;
                    weight ++;
                }
            });
        });
    }

    generateGraph() {
        this.collectRowVertices();
        this.connectRows();
        return this.Graph;
    }
}