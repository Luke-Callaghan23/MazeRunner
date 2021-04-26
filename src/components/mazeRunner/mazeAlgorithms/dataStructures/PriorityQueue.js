class Element {
    constructor (key, data) {
        this.key   = key;
        this.data  = data;
        this.valid = true;
    }
}

export default class PriorityQueue {
    constructor (Q=null) {
        if (Q === null) {
            this.Q = [];
        }
        else {
            this.Q = Q.map(([ data, key ]) => new Element(key, data));
        }
    }

    length () {
        return this.Q.length;
    }

    push (data, weight) {
        const element = new Element(weight, data);

        let added = false;

        for (let index = 0; index < this.Q.length; index++) {
            if (this.Q[index].key > element.key) {
                this.Q.splice(index, 0, element);
                added = true;
                break;
            }
        }

        if (!added) {
            this.Q.push(element)
        }

    }

    pop () {
        while (true) {
            if (this.Q.length > 0) {
                const pop = this.Q.shift();
                if (pop.valid) {
                    return pop;
                }
            }
            else {
                return null;
            }
        }
    }


    relax (data, newKey) {

        let add = true;

        for (let index = 0; index < this.Q.length; index++) {
            const oldElement = this.Q[index];
            if (oldElement.data === data) {
                if (oldElement.key < newKey) {
                    add = false;
                    break;
                }
                oldElement.valid = false;
                break;
            }
        }

        if (add) {
            this.push(data, newKey);
        }
    }
}