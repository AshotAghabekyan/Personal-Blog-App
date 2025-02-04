import { BlogGenreTypes } from "./models/genre.types";


class HeapNode {
    priority: number;
    value: string

    constructor(value: string) {
        this.value = value;
        this.priority = 1;
    }
}


class Heap {
    private arr: HeapNode[] = new Array();

    private heapify(startIndex: number) {
        const i: number = startIndex;
        const leftIndex: number = (2 * i) + 1;
        const rightIndex: number = (2 * i) + 2;
        let largest: number = i;
        const arrLength = this.arr.length;

        if (leftIndex < arrLength && this.arr[leftIndex].priority > this.arr[i].priority) {
            largest = leftIndex;
        }

        if (rightIndex < arrLength && this.arr[rightIndex].priority > this.arr[i].priority) {
            largest = rightIndex;
        }

        if (i != largest) {
            [this.arr[i], this.arr[largest]] = [this.arr[largest], this.arr[i]];
            this.heapify(largest);
        }
    }


    private getParent(i: number) {
        return Math.floor((i - 1) / 2);
    }


    private increasePriority(index: number, by: number = 1) {
        if (index > this.arr.length) {
            throw new Error("invalid index");
        }

        this.arr[index].priority += by

        while (index != 0) {
            const parentIndex: number = this.getParent(index);
            const parentNode: HeapNode = this.arr[parentIndex];
            const currNode: HeapNode = this.arr[index];

            if (currNode.priority > parentNode.priority) {
                [this.arr[index], this.arr[parentIndex]] = [this.arr[parentIndex], this.arr[index]];
                index = parentIndex;
            }
            else {
                break;
            }
        }
    }


    private findNodeIndex(value: string) {
        const nodeIndex: number = this.arr.findIndex((node: HeapNode) => node.value == value);
        return nodeIndex;
    }



    public insert(value: string) {
        const existNodeIndex: number = this.findNodeIndex(value);
        if (existNodeIndex != -1) {
            return this.increasePriority(existNodeIndex);
        }

        const heapNode: HeapNode = new HeapNode(value)
        this.arr.push(heapNode);
        let i = this.arr.length -1;

        while (i != 0) {
            const parentIndex: number = this.getParent(i);
            const parentNode: HeapNode = this.arr[parentIndex];
            const currNode: HeapNode = this.arr[i];

            if (currNode.priority > parentNode.priority) {
                [this.arr[i], this.arr[parentIndex]] = [this.arr[parentIndex], this.arr[i]];
                i = parentIndex;
            }
            else {
                break;
            }
        }
    }


    private delete(key: number) {
        if (this.arr.length == 0) {
            throw new Error("heap is empty");
        }

        const root: HeapNode = this.arr[0];
        this.arr[0] = this.arr[this.arr.length - 1];
        this.arr.pop();
        this.heapify(0);
        return root;
    }


    public extractMax() {
        return this.delete(0).value;
    }


    public isEmpty() {
        return this.arr.length == 0;
    }
}





export class PriorityQueue {
    private heap: Heap;

    constructor() {
        this.heap = new Heap();
    }


    public enqueue(genre: string) {
        const key: BlogGenreTypes = BlogGenreTypes[genre];
        return this.heap.insert(genre);
    }


    public dequeue() {
        const heapMax: string = this.heap.extractMax();
        return BlogGenreTypes[heapMax];
    }

    public isEmpty() {
        return this.heap.isEmpty();
    }
}





// const heap = new Heap();
// heap.insert('news');
// heap.insert('history');
// heap.insert('music');
// heap.insert('news');
// heap.insert('news');
// heap.insert('history');

// while (!heap.isEmpty()){
//     const genre = heap.extractMax();
//     console.log(genre);
// }