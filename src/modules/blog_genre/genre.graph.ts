import { BlogGenreTypes } from "./models/genre.types";
import * as fs from "fs"
import * as path from "path"
import { PriorityQueue } from "./genre.priorityQueue";
// import {Genre}



class WeightGraphNode {
    vertex: string;
    weight: number;

    constructor(vertex: string, weight: number) {
        this.vertex = vertex;
        this.weight = weight;
    }
}



class GraphJsonParser {

    public parseGraphJson() {
        const rawGraph: string = fs.readFileSync(path.resolve("./src/modules/blog_genre/graph.json"), "utf-8");
        return JSON.parse(rawGraph);
    }


    public async updateGraphJson(vertex1: string, vertex2: string) {
        const rawGraph: string = await fs.promises.readFile(path.resolve("./src/modules/blog_genre/graph.json"), "utf-8");
        const parsedGraph: {[key: string]: string[]} = JSON.parse(rawGraph);
        let isJsonUpToDate: boolean = true;

        if (!parsedGraph[vertex1].includes(vertex2)) {
            isJsonUpToDate = false;
            parsedGraph[vertex1].push(vertex2);
        }

        if (!parsedGraph[vertex2].includes(vertex1)) {
            isJsonUpToDate = false;
            parsedGraph[vertex1].push(vertex1);
        }

        if (!isJsonUpToDate) {
            await fs.promises.writeFile(path.resolve("./src/modules/blog_genre/graph.json"), JSON.stringify(parsedGraph));
        }
    }
}







export class GenreRelatedGraph {
    private readonly collection: Map<string, WeightGraphNode[]>;
    private readonly priorityQueue: PriorityQueue = new PriorityQueue();
    private readonly graphParser: GraphJsonParser;

    constructor() {
        this.graphParser = new GraphJsonParser();
        const graphInitValues: {[key: string]: WeightGraphNode[]} = this.graphParser.parseGraphJson()
        const iterableGraphValues: [string, WeightGraphNode[]][] = Object.entries(graphInitValues)
        this.collection = new Map<string, WeightGraphNode[]>(iterableGraphValues);
    }


    
    public addVertex(key: BlogGenreTypes) {
        this.collection.set(key, new Array<WeightGraphNode>());
    }


    public hasVertex(key: BlogGenreTypes) {
        return this.collection.has(key);
    }

    
    public async addEdge(vertex1: BlogGenreTypes, vertex2: BlogGenreTypes, weight: number) {
        let set1: WeightGraphNode[] = this.collection.get(vertex1);
        let set2: WeightGraphNode[] = this.collection.get(vertex2);
        if (!set1.length) {
            throw new Error("invalid vertex");
        }

        if (!set2.length) {
            throw new Error("invalid vertex");
        }
        
        const graphNode1: WeightGraphNode = new WeightGraphNode(vertex2, 1);
        const graphNode2: WeightGraphNode = new WeightGraphNode(vertex1, 1);
        set1.push(graphNode1);
        set2.push(graphNode2);
        await this.graphParser.updateGraphJson(vertex1, vertex2);
    }


    private bfsTraverse(startVertex: string, deepth: number = 1) {
        const visisted: Map<string, boolean> = new Map();
        const queue: string[] = [];
        queue.push(startVertex);
        visisted.set(startVertex, true);
        const levelRelatedVertices: string[] = [];

        while (queue.length > 0) {
            const vertex = queue.shift();
            levelRelatedVertices.push(vertex);            

            for (let neighbor of this.collection.get(vertex)) {
                if (!visisted.get(neighbor)) {
                    visisted.set(neighbor, true);
                    queue.push(neighbor);
                }
            }
        }
        return levelRelatedVertices;
    }


    public getRelatedVertices(genre: string) {
        return this.bfsTraverse(genre);
    }
}


