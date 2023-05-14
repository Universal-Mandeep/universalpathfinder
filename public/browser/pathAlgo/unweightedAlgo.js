import { PriorityQueue } from "../util.js"





// DONE: this works fine
export default function bfs(startNode, endNode, boardGrid) {
  let pq = new PriorityQueue();
  pq.enqueue(startNode, 0);

  let cameFrom = {};
  let visitedNodeSet = new Set()
  visitedNodeSet.add(startNode);

  let visitedNodesInOrder = [];
  visitedNodesInOrder.push(startNode)

  while (!pq.isEmpty()) {
    let closestNode = pq.dequeue();
    let currentNode = closestNode.element;
    let currentHScore = closestNode.priority

    if (currentNode === endNode) {
      // endNode.updateNodeTypeInstant("end")
      return { visitedNodesInOrder, cameFrom }
    }

    for (let neighbor of currentNode.neighbors) {
      if (!visitedNodeSet.has(neighbor)) {
        // let hScore = currentHScore + neighbor.nodeWeight;
        let hScore = currentHScore;
        pq.enqueue(neighbor, hScore)
        visitedNodeSet.add(neighbor)

        cameFrom[neighbor.id] = currentNode.id;
      }
    }
    if (currentNode.nodeType !== "start" || currentNode.nodeType !== "end") {
      visitedNodesInOrder.push(currentNode)
    }
  }

  return { visitedNodesInOrder, cameFrom }
}