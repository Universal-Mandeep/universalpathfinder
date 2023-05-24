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

export function dfs(startNode, endNode, boardGrid) {
  console.log("DFS called unweighted")

  return iterativedfs(startNode, endNode, boardGrid);

































  let visited = []
  for (let row of boardGrid) {
    visited.push([])
    for (let col of row) {
      visited[visited.length - 1].push(false)
    }
  }
  console.log(visited)
  console.log(visited[0])
  console.log(visited[0][0])


  // let pq = new PriorityQueue();
  let st = []
  let cameFrom = {};

  st.push(startNode);
  visited[startNode.row][startNode.col] = true

  // let visitedNodeSet = new Set()
  // visitedNodeSet.add(startNode);

  let visitedNodesInOrder = [];
  visitedNodesInOrder.push(startNode)

  console.log(startNode)
  console.log(startNode.neighbors)
  let i = 0;
  let returnFlag = false
  reDFS(startNode, parent = null, visited, visitedNodesInOrder, cameFrom, 0, returnFlag)
  console.log(cameFrom)

  // while (st.length) {
  //   let currentNode = st[st.length - 1];
  //   // let currentNode = st[st.length];
  //   st.pop();




  //   // for (let neighbor of currentNode.neighbors) {
  //   //   if (!visited[neighbor.row][neighbor.col]) {
  //   //     cameFrom[neighbor.id] = currentNode.id;
  //   //     // st.push(neighbor);

  //   //     // visited[neighbor.row][neighbor.col] = true;
  //   //   }
  //   // }
  //   // if (currentNode.nodeType !== "start" || currentNode.nodeType !== "end") {
  //   //   visitedNodesInOrder.push(currentNode)
  //   // }

  // }


  return { visitedNodesInOrder, cameFrom }
}


function reDFS(currentNode, parentNode = null, visited, visitedNodesInOrder, cameFrom, i = null, returnFlag) {
  // st.push(neighbor);
  console.log(i, currentNode.nodeType)


  visited[currentNode.row][currentNode.col] = true;
  // if(currentNode.nodeType !== "start" || parentNode != null){
  if (parentNode != null) {
    cameFrom[currentNode.id] = parentNode.id;
  }
  // if (currentNode.nodeType == "end") {
  //   console.log("FOUND END");
  //   return;
  //   return { visitedNodesInOrder, cameFrom }
  // }

  if (currentNode.nodeType !== "start" || currentNode.nodeType !== "end") {
    visitedNodesInOrder.push(currentNode)
  }
  for (let neighbor of currentNode.neighbors) {
    if (!visited[neighbor.row][neighbor.col]) {
      if (neighbor.nodeType === "end") {
        cameFrom[neighbor.id] = currentNode.id;
        visited[neighbor.row][neighbor.col] = true;
        returnFlag = true;
        console.log("FOUND END");
        // break;
        return

      }
      if (!returnFlag) reDFS(neighbor, currentNode, visited, visitedNodesInOrder, cameFrom, i + 1, returnFlag)
    }
  }

  return;
  // console.log(visited[currentNode.row][currentNode.col])
}




function iterativedfs(startNode, endNode, boardGrid) {
  console.log("iterate")

  // let pq = new PriorityQueue();
  let stack = []
  let cameFrom = {};

  stack.push(startNode);

  let visitedNodeSet = new Set()
  visitedNodeSet.add(startNode);

  let visitedNodesInOrder = [];
  visitedNodesInOrder.push(startNode)


  while (stack.length) {
    // let currentNode = stack.pop();
    let currentNode = stack[stack.length - 1]
    // console.log(currentNode)
    let neighbor;

    // if (neighbor === endNode) {
    if (currentNode === endNode) {
      console.log("FOUND END NODE")
      // console.log(visitedNodesInOrder)
      // console.log(cameFrom)
      // console.log(cameFrom[endNode.id])
      break;
      // return { visitedNodesInOrder, cameFrom }
    }
    if (currentNode.neighbors.length == 0) {
      stack.pop()
      continue;
    }

    // if (currentNode.neighbors.length > 0) {
    else {
      // neighbor = currentNode.neighbors[0]
      // neighbor = currentNode.neighbors.pop();
      neighbor = currentNode.neighbors[0];
      currentNode.neighbors.shift();

      if (!visitedNodeSet.has(neighbor)) {
        cameFrom[neighbor.id] = currentNode.id;
        // visitedNodeSet.add(currentNode)
        visitedNodeSet.add(neighbor)


        stack.push(currentNode)
        stack.push(neighbor)

        if (currentNode.nodeType !== "start" || currentNode.nodeType !== "end") {
          // visitedNodesInOrder.push(currentNode)
          visitedNodesInOrder.push(neighbor)
        }
      }



    }



  }
  // console.log([...visitedNodesInOrder])

  return { visitedNodesInOrder, cameFrom }
}