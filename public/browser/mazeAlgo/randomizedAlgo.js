
function connectTwoNodes(neighbor, current, boardGrid) {

  let neighborRow = parseInt(neighbor.id.split("-")[0])
  let neighborCol = parseInt(neighbor.id.split("-")[1])

  let currentRow = parseInt(current.id.split("-")[0])
  let currentCol = parseInt(current.id.split("-")[1])

  let rowChange = (neighborRow - currentRow) / 2
  let colChange = (neighborCol - currentCol) / 2

  let mid_spot_row = currentRow + parseInt(rowChange)
  let mid_spot_col = currentCol + parseInt(colChange)

  // boardGrid[mid_spot_row][mid_spot_col].updateNodeType("block")
  // neighbor.updateNodeType("block");
  // current.updateNodeType("block");

  return boardGrid[mid_spot_row][mid_spot_col];

}

function getRandomItem(set) {
  let items = Array.from(set);
  return items[Math.floor(Math.random() * items.length)];
}

function getNeighbors(node, boardGrid) {
  // let nodeRow = parseInt(node.id.split("-")[0])
  // let nodeCol = parseInt(node.id.split("-")[1])

  // let row = boardGrid.length

  const nodeRow = Number(node.id.split("-")[0])
  const nodeCol = Number(node.id.split("-")[1])

  const rows = boardGrid.length;
  const cols = boardGrid[0].length;

  let newNeighbors = [];
  //top neighbor
  if (nodeRow > 1) newNeighbors.push(boardGrid[nodeRow - 2][nodeCol])

  // right neighbor
  if (nodeCol < cols - 2) newNeighbors.push(boardGrid[nodeRow][nodeCol + 2])

  // bottom neighbor
  if (nodeRow < rows - 2) newNeighbors.push(boardGrid[nodeRow + 2][nodeCol])

  // left neighbor
  if (nodeCol > 1) newNeighbors.push(boardGrid[nodeRow][nodeCol - 2])

  //top neighbor
  // if (nodeRow > 1 && boardGrid[nodeRow - 2][nodeCol].nodeType !== "block") {
  //   newNeighbors.push(boardGrid[nodeRow - 2][nodeCol])
  // }

  // // right neighbor
  // if (nodeCol < cols - 2 && boardGrid[nodeRow][nodeCol + 2].nodeType !== "block") {
  //   newNeighbors.push(boardGrid[nodeRow][nodeCol + 2])
  // }

  // // bottom neighbor
  // if (nodeRow < rows - 2 && boardGrid[nodeRow + 2][nodeCol].nodeType !== "block") {
  //   newNeighbors.push(boardGrid[nodeRow + 2][nodeCol])
  // }

  // // left neighbor
  // if (nodeCol > 1 && boardGrid[nodeRow][nodeCol - 2].nodeType !== "block") {
  //   newNeighbors.push(boardGrid[nodeRow][nodeCol - 2])
  // }


  return newNeighbors;
}

export default function randomizedPrims(startNode, boardGrid) {
  console.log("Randomized Prims algo called...")
  makeAllBlock(boardGrid)
  let mazeStart = startNode;
  let pathTree = [];  // node.id: string

  let visited = new Set();
  let frontier = new Set();

  frontier.add(mazeStart);

  let current = null;
  console.log(boardGrid[10][2])

  let viz = setInterval(() => {

    // while (frontier.size) {
    if (!frontier.size) {
      clearInterval(viz);
      console.log("finished")
      console.log(pathTree)
      drawPath(pathTree)
      return;
    }


    let randomIndex = Math.floor(Math.random * frontier.size);
    // let randomNode = frontier[randomIndex];
    let randomNode = getRandomItem(frontier);

    // console.log(frontier)
    // console.log(visited)
    // console.log(randomIndex)
    // console.log(randomNode)
    // randomNode.updateNodeType("block")

    frontier.delete(randomNode);
    randomNode.linkedElement.classList.remove("frontier")
    randomNode.linkedElement.classList.remove("pink")

    // console.log(frontier.has(boardGrid[10][10]))
    visited.add(randomNode);
    let isConnected = false;
    // for (let neighbor of randomNode.neighbors) {


    // let neighbors = getNeighbors(randomNode, boardGrid)
    let neighbors = []
    const nodeRow = Number(randomNode.id.split("-")[0])
    const nodeCol = Number(randomNode.id.split("-")[1])

    const rows = boardGrid.length;
    const cols = boardGrid[0].length;

    let newNeighbors = [];
    //top neighbor
    if (nodeRow > 1) newNeighbors.push(boardGrid[nodeRow - 2][nodeCol])

    // right neighbor
    if (nodeCol < cols - 2) newNeighbors.push(boardGrid[nodeRow][nodeCol + 2])

    // bottom neighbor
    if (nodeRow < rows - 2) newNeighbors.push(boardGrid[nodeRow + 2][nodeCol])

    // left neighbor
    if (nodeCol > 1) newNeighbors.push(boardGrid[nodeRow][nodeCol - 2])

    neighbors = [...newNeighbors]





    // neighbors = randomNode.neighbors
    neighbors = getNeighbors(randomNode, boardGrid)
    let connections = []
    for (let neighbor of neighbors) {
      // if (!(neighbor in visited)) {
      if (!(visited.has(neighbor))) {
        frontier.add(neighbor);
        neighbor.linkedElement.classList.add("frontier")
      }
      else {
        connections.push(neighbor)
        // if (!isConnected) {
        // connectTwoNodes(neighbor, current);
        // randomNode.updateNodeType("block")
        // connectTwoNodes(neighbor, randomNode, boardGrid);
        // isConnected = true;
        // }
      }
    }
    let randomConnection = connections[Math.floor(Math.random() * connections.length)]

    if (randomConnection) {
      let midNode = connectTwoNodes(randomConnection, randomNode, boardGrid);
      pathTree.push(midNode)
    }

    pathTree.push(randomNode)

    // }
  }, 10);

}

function drawPath(pathTree) {
  let currentNode = pathTree[0]
  const wizard = setInterval(() => {
    if (!pathTree.length) {
      clearInterval(wizard)
      console.log("done path")
      return;
    }
    currentNode = pathTree[0];
    // currentNode.updateNodeType("block")
    currentNode.updateNodeType("unvisited")
    pathTree.shift()
  }, 15)
}




function makeAllBlock(boardGrid) {
  for (let row of boardGrid) {
    for (let node of row) {
      if (node.nodeType !== "start" || node.nodeType !== "end")
        node.updateNodeTypeInstant("block")
    }
  }
}

export function randomizedKruskals(boardGrid) {
  console.log("Randomized Kruskals algo called...")

  const clusters = {};
  const ranks = {};



  const find = (u) => {
    if (clusters[u] != u) {
      clusters[u] = find(clusters[u]);
    }
    return clusters[u];
  }

  const union = (x, y) => {
    x = find(x, x);
    y = find(y, y);

    if (ranks[x] > ranks[y]) {
      clusters[y] = x;
    } else {
      clusters[x] = y;
    }
    if (ranks[x] == ranks[y]) {
      ranks[y]++;
    }
  }


  for (let row of boardGrid) {
    for (let node of row) {
      clusters[node.id] = node.id;
      ranks[node.id] = 0;
    }
  }

  let solution = new Set();
  let solution2 = [];

  //add random weight to each edge
  // let edge = {
  //   "source": node,
  //   "target": node,
  //   "mid": node,
  //   "weight": 1
  // }

  let weightedEdges = []
  let edgeIdCount = 0
  let randomWeightMax = 10;
  // let weightedEdges = graph.edges.map((e) => {
  //   e.weight = getRandomInt(1, 5);
  //   return e;
  // });

  console.log(Math.floor(Math.random() * randomWeightMax))

  const rows = boardGrid.length;
  const cols = boardGrid[0].length;
  for (let row of boardGrid) {
    for (let node of row) {
      const nodeRow = Number(node.id.split("-")[0])
      const nodeCol = Number(node.id.split("-")[1])

      if (nodeRow % 2 === 0 && nodeCol % 2 === 0) {
        // console.log("even")
        // top neighbor
        if (nodeRow > 1) {
          weightedEdges.push({
            "id": edgeIdCount,
            "source": node,
            "target": boardGrid[nodeRow - 2][nodeCol],
            "mid": boardGrid[nodeRow - 1][nodeCol],
            "weight": Math.floor(Math.random() * randomWeightMax)
          })
          edgeIdCount++;
        }

        // right neighbor
        if (nodeCol < cols - 2) {
          weightedEdges.push({
            "id": edgeIdCount,
            "source": node,
            "target": boardGrid[nodeRow][nodeCol + 2],
            "mid": boardGrid[nodeRow][nodeCol + 1],
            "weight": Math.floor(Math.random() * randomWeightMax)
          })
          edgeIdCount++;
        }

        // bottom neighbor
        if (nodeRow < rows - 2) {
          weightedEdges.push({
            "id": edgeIdCount,
            "source": node,
            "target": boardGrid[nodeRow + 2][nodeCol],
            "mid": boardGrid[nodeRow + 1][nodeCol],
            "weight": Math.floor(Math.random() * randomWeightMax)
          })
          edgeIdCount++;
        }

        // left neighbor
        if (nodeCol > 1) {
          weightedEdges.push({
            "id": edgeIdCount,
            "source": node,
            "target": boardGrid[nodeRow][nodeCol - 2],
            "mid": boardGrid[nodeRow][nodeCol - 1],
            "weight": Math.floor(Math.random() * randomWeightMax)
          })
          edgeIdCount++;
        }
      }
    }
  }
  // console.log(weightedEdges)


  //sort the edges by weight
  weightedEdges = weightedEdges.sort((a, b) => (a.weight > b.weight) ? 1 : -1);

  //iterate through the edges and add to solution or discard
  for (let edge of weightedEdges) {
    let x = edge.source.id,
      y = edge.target.id;
    if (x != y) {
      if (find(x) != find(y)) {
        union(x, y);
        solution.add(edge.id);
        // solution2.add(edge);
        solution2.push(edge);
      }
    }
    // Array.from(graph.nodes).forEach(n => {
    //   clusters[n.id] = n.id;
    //   ranks[n.id] = 0;
    // })
  }
  // console.log(solution)

  makeAllBlock(boardGrid)
  // drawKruskalMaze(weightedEdges, solution)
  drawKruskalMaze2(solution2)
}

function drawKruskalMaze2(edges) {

  // let currentEdge = weightedEdges[0]
  // console.log(weightedEdges)
  // console.log(edgeIds)
  console.log(edges.length)
  console.log(edges)
  // console.log(edges.size)
  // let currentEdge = weightedEdges.find(edge => edge.id === edgeIds[0])
  let currentEdge = edges[0]
  console.log(edges[0])
  // let currentSource = weightedEdges[0].source
  // let currentMid = weightedEdges.source
  const wizard = setInterval(() => {
    if (!edges.length) {
      clearInterval(wizard)
      console.log("done path")
      return;
    }
    currentEdge = edges[0]

    // currentSource = weightedEdges[0].source;
    // currentSource.updateNodeType("block")
    // console.log(currentEdge)
    currentEdge.source.updateNodeType("unvisited")
    currentEdge.mid.updateNodeType("unvisited")
    currentEdge.target.updateNodeType("unvisited")
    // currentEdge.source.updateNodeType("block")
    // currentEdge.mid.updateNodeType("block")
    // currentEdge.target.updateNodeType("block")
    // weightedEdges.shift()
    edges.shift()
  }, 25)

}

function drawKruskalMaze(weightedEdges, edgeIds) {
  // let currentEdge = weightedEdges[0]
  console.log(weightedEdges)
  console.log(edgeIds)
  let currentEdge = weightedEdges.find(edge => edge.id === edgeIds[0])
  // let currentSource = weightedEdges[0].source
  // let currentMid = weightedEdges.source
  const wizard = setInterval(() => {
    if (!weightedEdges.length) {
      clearInterval(wizard)
      console.log("done path")
      return;
    }
    currentEdge = weightedEdges.find(edge => edge.id === edgeIds[0])

    // currentSource = weightedEdges[0].source;
    // currentSource.updateNodeType("block")
    console.log(currentEdge)
    currentEdge.source.updateNodeType("unvisited")
    currentEdge.mid.updateNodeType("unvisited")
    currentEdge.target.updateNodeType("unvisited")
    // currentEdge.source.updateNodeType("block")
    // currentEdge.mid.updateNodeType("block")
    // currentEdge.target.updateNodeType("block")
    // weightedEdges.shift()
    edgeIds.shift()
  }, 1000)

}





// export function randomizedBfs() {
//   console.log("Randomized BFS algo called...")
// }


function updateNeighbors(boardGrid) {
  let nei = {}
  const rows = boardGrid.length;
  const cols = boardGrid[0].length;

  for (let row of boardGrid) {
    for (let node of row) {
      const nodeRow = Number(node.id.split("-")[0])
      const nodeCol = Number(node.id.split("-")[1])
      if (nodeRow % 2 === 0 && nodeCol % 2 === 0) {

        let newNeighbors = [];
        //top neighbor
        if (nodeRow > 1) newNeighbors.push(boardGrid[nodeRow - 2][nodeCol])

        // right neighbor
        if (nodeCol < cols - 2) newNeighbors.push(boardGrid[nodeRow][nodeCol + 2])

        // bottom neighbor
        if (nodeRow < rows - 2) newNeighbors.push(boardGrid[nodeRow + 2][nodeCol])

        // left neighbor
        if (nodeCol > 1) newNeighbors.push(boardGrid[nodeRow][nodeCol - 2])

        // nei.node = newNeighbors
        nei[node.id] = newNeighbors
      }
    }
  }
  // console.log(nei)
  return nei
}



function neiObj(boardGrid) {
  let nei = {}
  const rows = boardGrid.length;
  const cols = boardGrid[0].length;

  for (let row of boardGrid) {
    for (let node of row) {
      const nodeRow = Number(node.id.split("-")[0])
      const nodeCol = Number(node.id.split("-")[1])
      if (nodeRow % 2 === 0 && nodeCol % 2 === 0) {
        node.mazeNeighbors = []

        // let neighborObject = {
        // id: node.id,
        //   nodeObj: node,
        //   neighbors: []
        // }
        // let newNeighbors = [];

        //top neighbor
        if (nodeRow > 1) node.mazeNeighbors.push(boardGrid[nodeRow - 2][nodeCol])

        // right neighbor
        if (nodeCol < cols - 2) node.mazeNeighbors.push(boardGrid[nodeRow][nodeCol + 2])

        // bottom neighbor
        if (nodeRow < rows - 2) node.mazeNeighbors.push(boardGrid[nodeRow + 2][nodeCol])

        // left neighbor
        if (nodeCol > 1) node.mazeNeighbors.push(boardGrid[nodeRow][nodeCol - 2])

        // nei.node = newNeighbors
        // nei[node.id] = newNeighbors
        // nei[node.id] = neighborObject

      }
    }
  }

  console.log(boardGrid[10][10])
  // console.log(nei)
  // return nei
}


export function randomizedDfs(boardGrid) {
  console.log("Randomized DFS algo called...")
  // console.log(boardGrid)

  let mazeStartRow = Math.floor(Math.random() * boardGrid.length);
  let mazeStartCol = Math.floor(Math.random() * boardGrid[0].length);

  let mazeStart = boardGrid[mazeStartRow][mazeStartCol];

  // let neighborObj = updateNeighbors(boardGrid);
  // let neighborObj = neiObj(boardGrid);
  // let neighborNodeIds = Object.keys(neighborObj)
  // console.log(neighborObj)
  // console.log(neighborNodeIds)
  neiObj(boardGrid)
  console.log(boardGrid[10][10].mazeNeighbors)
  console.log(boardGrid[15][10].mazeNeighbors)
  console.log(mazeStart.mazeNeighbors)
  console.log(mazeStart)

  let solution = [];
  let stack = [];
  stack.push(mazeStart.id);

  return;

  while (stack.length) {
    let currentNodeId = stack[0];
    let currentNode = boardGrid[currentNodeId.split("-")[0]][currentNodeId.split("-")[1]]

    // console.log(neighborObj[currentNodeId])
    // console.log(typeof currentNodeId)
    console.log(neighborObj.currentNodeId)
    let randomMax = neighborObj[currentNodeId].length;
    if (randomMax !== 0) {

      let randomNeighborNode = neighborObj[currentNodeId][Math.floor(Math.random() * randomMax)];

      let midNode = connectTwoNodes(currentNode, randomNeighborNode, boardGrid)

      currentNode.linkedElement.classList.add("brown")
      midNode.linkedElement.classList.add("brown")
      randomNeighborNode.linkedElement.classList.add("brown")

      stack.push(randomNeighborNode)
    } else {
      stack.shift();

    }

  }



}