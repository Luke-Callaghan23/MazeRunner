

// Vertex on a graph
class Vertex {
    constructor (id) {
        this.id   = id      // index into this graphs vertices array
        this.IN   = []      // list of edges going into this vertex
        this.OUT  = []      // list of edges leaving this vertex
        this.mark = null    // some marker used by graph algorithms (could be 'color' or 'visited' or 'distance', etc.)
    }

    equals (other) {
        return this.id === other.id
    }
}

// Edge that connects two vertices on a graph
class Edge {
    constructor (src, dest, weight) {
        this.src     = src;      // id of the source vertex
        this.dest    = dest;     // id of the destination vertex
        this.weight  = weight;   // cost of the edge
    }


    equals (other) {
        return (
            this.weight === other.weight && 
            this.dest   === other.dest   && 
            this.src    === other.src    
        )
    }
    
}

// Graph class
class Graph {
    constructor () {
        this.V = [];        // list of all vertices
        this.E = [];        // list of all edges
    }

    // Clears all marks on all vertices
    clear_marks () {
        this.set_marks(null);
    }

    // Sets all marks on all vertices to a specified value
    set_marks(mark) {
        this.V.forEach(v => {
            v.mark = mark;
        });
    }

    // Adds a vertex to the grapg
    // If the vertex already exist, nothing changes
    // id: number = id of the vertex
    add_vertex (id=this.V.length) {
        const vert = this.V[id];

        if (!vert) {
            this.V[id] = new Vertex(id);
        }

        return this.V[id];
    }

    // Adds an edge from source vertex to destination vertex,
    //      if the destination or source vertex does not yet exist,
    //      it is creates
    // src   : number = id of the souce vertex
    // weight: number = weight of the edge being added
    // dest  : number = id of the destination vertex
    add_edge (src, weight=1, dest=this.V.length) {

        // Creating a new esge, and appending it to this Graph's list
        //      of edges
        const E = new Edge(src, dest, weight);
        this.E.push(E);
        
        // Creating the source vertex if it does not already exist
        this.add_vertex(src);
        const S = this.V[src]

        // Creating the destination vertex if it does not already exist
        this.add_vertex(dest);
        const D = this.V[dest]

        // Adding the new edge to the OUT list of the source
        //      vertex, and the IN list of the destination vertex
        S.OUT.push(E)
        D.IN.push(E)

        // Return the edge
        return E;
    }
}

export { Graph, Edge, Vertex };