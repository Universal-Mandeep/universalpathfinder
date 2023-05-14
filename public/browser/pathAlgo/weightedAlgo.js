
// import { PriorityQueue } from "../util"
import { PriorityQueue } from "../util.js"





export default function dijkstraOLD(startNode, endNode, boardGrid, algoSpeed) {
  console.log("Starting dijkstra")

  let speed = 1;
  if (algoSpeed === "fast") {
    speed = 0;
  }
  else if (algoSpeed === "medium") {
    speed = 25
  }
  else {
    speed = 100
  }
  // algoSpeed == "fast" ? speed = 5 : speed = 50;
  // algoSpeed ==
  // console.log(startNode)
  // console.log(endNode)
  // console.log(boardGrid)
  console.log(algoSpeed)
  console.log(speed)

  let distances = {};

  let cameFrom = {};
  // let cameFrom = new Set();
  let distanceTraveled = 0;

  let pq = new PriorityQueue();

  distances[startNode] = 0;

  pq.enqueue(startNode, 0);
  let visitedNodeSet = new Set()
  visitedNodeSet.add(startNode);




  // this.nodes

  const hScore = 0;
  // pQueue.enqueue(startNode, 0);


  // const intervalID = setInterval(myCallback, 2000);
  let viz = setInterval(() => {

    // while (!pq.isEmpty()) {

    if (!pq.isEmpty()) {
      // console.log(pq)
      let minNode = pq.dequeue();
      let currentNode = minNode.element;
      let currentHScore = minNode.priority

      for (let neighbor of currentNode.neighbors) {
        // cameFrom.neighbor = currentNode
        // cameFrom.add(neighbor)

        // console.log(currentNode);
        // console.log(neighbor);



        // if (neighbor === endNode) {
        if (currentNode === endNode) {
          console.log("REACHED END NODE")
          endNode.updateNodeType("end")
          // clearInterval(intervalID);
          clearInterval(viz);
          // console.log(cameFrom);
          drawPath(startNode, endNode, cameFrom, boardGrid);
          console.log("Done...");

          // break;
        }

        if (!visitedNodeSet.has(neighbor)) {
          let hScore = currentHScore + neighbor.nodeWeight;
          pq.enqueue(neighbor, hScore)
          visitedNodeSet.add(neighbor)

          cameFrom[neighbor.id] = currentNode.id;
        }

      }
      if (currentNode.nodeType !== "start") {
        // currentNode.linkedElement.dataset.animationType = "animate";
        currentNode.updateNodeType("visited")
      }


    }
  }, speed);
  // }, 0);
  // intervalID();
  console.log("after setInterval")

}

function drawPath(startNode, endNode, cameFrom, boardGrid) {
  console.log("Drawing path...")
  let currentNode = endNode;

  const pathInterval = setInterval(() => {
    if (currentNode === startNode) {
      clearInterval(pathInterval);
      return
    }



    if (currentNode != startNode) {
      if (currentNode != endNode) {
        if (endNode.nodeType !== "end") {
          // endNode.linkedElement.dataset.animationType = "instant"
          endNode.updateNodeType("end")

        }

        // currentNode.linkedElement.dataset.animationType = "animate"
        currentNode.updateNodeType("path");

      }
    }
    // console.log(currentNode.id)
    // console.log(cameFrom)
    // console.log(cameFrom["6-10"])
    // console.log(typeof cameFrom["6-10"])
    let nextNodeId = cameFrom[currentNode.id]
    // console.log(nextNodeId)
    let nextNodeIdRow = nextNodeId.split("-")[0]
    let nextNodeIdCol = nextNodeId.split("-")[1]

    currentNode = boardGrid[nextNodeIdRow][nextNodeIdCol]


  }, 25)



}



// DONE: this works fine
export function dijkstra(startNode, endNode, boardGrid) {
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
        let hScore = currentHScore + neighbor.nodeWeight;
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


function manhatonDistance(node1, node2) {
  let distance = 0;
  distance = Math.abs(node1.row - node2.row) + Math.abs(node1.col - node2.col);
  // console.log(distance)
  return distance;
}


// DONE: this works fine
export function aStar(startNode, endNode, boardGrid) {
  // console.log("A star is called")

  let pq = new PriorityQueue();
  pq.enqueue(startNode, 0);

  let cameFrom = {};
  let visitedNodeSet = new Set()
  visitedNodeSet.add(startNode);

  let visitedNodesInOrder = [];
  visitedNodesInOrder.push(startNode)


  let g_score = {};
  let f_score = {};
  for (let node_row of boardGrid) {
    for (let node of node_row) {
      g_score[node.id] = Infinity;
      f_score[node.id] = Infinity;
    }
  }
  g_score[startNode.id] = 0;
  f_score[startNode.id] = manhatonDistance(startNode, endNode);

  // console.log(g_score[startNode.id])



  while (!pq.isEmpty()) {
    let closestNode = pq.dequeue();
    let currentNode = closestNode.element;
    let currentHScore = closestNode.priority

    if (currentNode === endNode) {
      // endNode.updateNodeTypeInstant("end")
      return { visitedNodesInOrder, cameFrom }
    }

    for (let neighbor of currentNode.neighbors) {
      let temp_g_score = g_score[currentNode.id] + neighbor.nodeWeight;

      if (temp_g_score < g_score[neighbor.id]) {
        g_score[neighbor.id] = temp_g_score;
        f_score[neighbor.id] = temp_g_score + manhatonDistance(neighbor, endNode);
        cameFrom[neighbor.id] = currentNode.id;

        if (!visitedNodeSet.has(neighbor)) {
          pq.enqueue(neighbor, f_score[neighbor.id])
          visitedNodeSet.add(neighbor)
        }
      }
    }

    if (currentNode.nodeType !== "start" || currentNode.nodeType !== "end") {
      visitedNodesInOrder.push(currentNode)
    }
  }

  return { visitedNodesInOrder, cameFrom }
}


// DONE: this works fine
export function bestFirstSearch(startNode, endNode, boardGrid) {
  console.log("Best First Search is called")

  let pq = new PriorityQueue();
  pq.enqueue(startNode, 0);

  let cameFrom = {};
  let visitedNodeSet = new Set()
  let openNodeSet = new Set()
  visitedNodeSet.add(startNode);

  let visitedNodesInOrder = [];
  visitedNodesInOrder.push(startNode)


  // let g_score = {};
  let f_score = {};
  for (let node_row of boardGrid) {
    for (let node of node_row) {
      // g_score[node.id] = Infinity;
      f_score[node.id] = Infinity;
    }
  }
  // g_score[startNode.id] = 0;
  f_score[startNode.id] = manhatonDistance(startNode, endNode);

  // console.log(g_score[startNode.id])


  console.log("before while loop")
  while (!pq.isEmpty()) {
    let closestNode = pq.dequeue();
    let currentNode = closestNode.element;
    // let currentHScore = closestNode.priority

    if (currentNode === endNode) {
      // endNode.updateNodeTypeInstant("end")
      return { visitedNodesInOrder, cameFrom }
    }

    for (let neighbor of currentNode.neighbors) {
      // let temp_g_score = g_score[currentNode.id] + neighbor.nodeWeight;

      // if (temp_g_score < g_score[neighbor.id]) {
      // if (neighbor.nodeType !== "visited") {
      // if (!visitedNodeSet.has(neighbor)) {
      if (!openNodeSet.has(neighbor)) {
        // g_score[neighbor.id] = temp_g_score;
        f_score[neighbor.id] = neighbor.nodeWeight + manhatonDistance(neighbor, endNode);
        cameFrom[neighbor.id] = currentNode.id;

        // if (!visitedNodeSet.has(neighbor)) {
        pq.enqueue(neighbor, f_score[neighbor.id])
        openNodeSet.add(neighbor)
        // }
      }
    }

    if (currentNode.nodeType !== "start" || currentNode.nodeType !== "end") {
      // currentNode.updateNodeType("visited")
      visitedNodesInOrder.push(currentNode)
      // visitedNodeSet.add(neighbor)
      // openNodeSet.delete(neighbor)
    }
  }


  return { visitedNodesInOrder, cameFrom }
}


















//! keep this code... it has noice visual annimation
export function aStarOLD(startNode, endNode, boardGrid) {
  console.log("A star is called")

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

        //! cool patterns :) 
        let hScore = currentHScore + neighbor.nodeWeight + manhatonDistance(neighbor, endNode);
        // let hScore = neighbor.nodeWeight + manhatonDistance(endNode, neighbor);
        // let hScore = manhatonDistance(neighbor, endNode);


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

