
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

export default function randomizedPrims(startNode, boardGrid, terminationCallback) {
  console.log("Randomized Prims algo called...")
  makeAllBlock(boardGrid)

  let mazeStart = startNode;
  let pathTree = [];  // node.id: string

  let visited = new Set();
  let frontier = new Set();

  frontier.add(mazeStart);

  let current = null;
  // console.log(boardGrid[10][2])

  let viz = setInterval(() => {

    // while (frontier.size) {
    if (!frontier.size) {
      clearInterval(viz);
      console.log("finished")
      terminationCallback();

      // console.log(pathTree)
      // drawPath(pathTree)
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
    // randomNode.linkedElement.classList.remove("pink")

    visited.add(randomNode);
    let isConnected = false;
    // for (let neighbor of randomNode.neighbors) {


    // let neighbors = getNeighbors(randomNode, boardGrid)
    let neighbors = []

    // const nodeRow = Number(randomNode.id.split("-")[0])
    // const nodeCol = Number(randomNode.id.split("-")[1])

    // const rows = boardGrid.length;
    // const cols = boardGrid[0].length;

    // let newNeighbors = [];
    // //top neighbor
    // if (nodeRow > 1) newNeighbors.push(boardGrid[nodeRow - 2][nodeCol])

    // // right neighbor
    // if (nodeCol < cols - 2) newNeighbors.push(boardGrid[nodeRow][nodeCol + 2])

    // // bottom neighbor
    // if (nodeRow < rows - 2) newNeighbors.push(boardGrid[nodeRow + 2][nodeCol])

    // // left neighbor
    // if (nodeCol > 1) newNeighbors.push(boardGrid[nodeRow][nodeCol - 2])

    // neighbors = [...newNeighbors]





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
      // midNode.updateNodeType("unvisited")
      midNode.updateNodeType("unvisited-animate")
    }

    pathTree.push(randomNode)
    // randomNode.updateNodeType("unvisited")
    randomNode.updateNodeType("unvisited-animate")


    // }
    // }, 10);
  }, 16.66);

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

export function randomizedKruskals(boardGrid, terminationCallback) {
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
  drawKruskalMaze2(solution2, terminationCallback)
}

function drawKruskalMaze2(edges, terminationCallback) {

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
      clearInterval(wizard);
      console.log("done path");
      terminationCallback();
      // document.querySelector(':root').style.setProperty('--board-background', '#ffffff')

      return;
    }
    currentEdge = edges[0]

    // currentSource = weightedEdges[0].source;
    // currentSource.updateNodeType("block")
    // console.log(currentEdge)


    // currentEdge.source.updateNodeType("unvisited")
    // currentEdge.mid.updateNodeType("unvisited")
    // currentEdge.target.updateNodeType("unvisited")
    currentEdge.source.updateNodeType("unvisited-animate")
    currentEdge.mid.updateNodeType("unvisited-animate")
    currentEdge.target.updateNodeType("unvisited-animate")



    // currentEdge.source.updateNodeType("block")
    // currentEdge.mid.updateNodeType("block")
    // currentEdge.target.updateNodeType("block")
    // weightedEdges.shift()
    edges.shift()
    // }, 0)
    // }, 20)
  }, 25)

  // console.log("FOR LOOP")
  // for (let edge of edges) {
  //   edge.source.updateNodeType("unvisited")
  //   edge.mid.updateNodeType("unvisited")
  //   edge.target.updateNodeType("unvisited")
  // }
  // console.log("DONE")


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


export function randomBlocks(boardGrid) {
  // console.log("in random blocks")
  let rows = boardGrid.length
  let cols = boardGrid[0].length

  let blockCount = 0;
  let maxBlockCount = (rows * cols) / 5

  while (blockCount < maxBlockCount) {
    let randomRowIndex = Math.floor(Math.random() * rows);
    let randomColIndex = Math.floor(Math.random() * cols);

    if (boardGrid[randomRowIndex][randomColIndex].nodeType !== "start"
      && boardGrid[randomRowIndex][randomColIndex].nodeType !== "end"
      && boardGrid[randomRowIndex][randomColIndex].nodeType !== "checkpoint") {
      // boardGrid[randomRowIndex][randomColIndex].updateNodeType("block")
      boardGrid[randomRowIndex][randomColIndex].updateNodeTypeInstant("block")
    }
    // boardGrid[randomRowIndex][randomColIndex].updateNodeType("unvisited-animate")

    blockCount++;
  }
}

export function randomWeights(boardGrid) {
  // console.log("in random blocks")
  let rows = boardGrid.length
  let cols = boardGrid[0].length

  let blockCount = 0;
  let maxBlockCount = (rows * cols) / 5

  while (blockCount < maxBlockCount) {
    let randomRowIndex = Math.floor(Math.random() * rows);
    let randomColIndex = Math.floor(Math.random() * cols);

    if (boardGrid[randomRowIndex][randomColIndex].nodeType !== "start"
      && boardGrid[randomRowIndex][randomColIndex].nodeType !== "end"
      && boardGrid[randomRowIndex][randomColIndex].nodeType !== "checkpoint") {
      // boardGrid[randomRowIndex][randomColIndex].updateNodeType("weighted")
      boardGrid[randomRowIndex][randomColIndex].updateNodeTypeInstant("weighted")
    }
    // boardGrid[randomRowIndex][randomColIndex].updateNodeType("unvisited-animate")

    blockCount++;
  }
}

window.setVariableInterval = function (callbackFunc, timing) {
  var variableInterval = {
    interval: timing,
    callback: callbackFunc,
    stopped: false,
    runLoop: function () {
      if (variableInterval.stopped) return;
      var result = variableInterval.callback.call(variableInterval);
      if (typeof result == 'number') {
        if (result === 0) return;
        variableInterval.interval = result;
      }
      variableInterval.loop();
    },
    stop: function () {
      this.stopped = true;
      window.clearTimeout(this.timeout);
    },
    start: function () {
      this.stopped = false;
      return this.loop();
    },
    loop: function () {
      this.timeout = window.setTimeout(this.runLoop, this.interval);
      return this;
    }
  };

  return variableInterval.start();
};

export function randomizedDfs(boardGrid, terminationCallback) {
  console.log("Randomized DFS algo called...")
  makeAllBlock(boardGrid)

  // console.log(boardGrid)
  let neighbors = updateNeighbors(boardGrid)

  // let mazeStartRow = Math.floor(((Math.random() * boardGrid.length * 2) - 1) / 2);
  // let mazeStartCol = Math.floor(((Math.random() * boardGrid[0].length * 2) - 1) / 2);
  // console.log(mazeStartRow, mazeStartCol)
  let mazeStartRow = 10
  let mazeStartCol = 10
  // console.log(neighbors)
  console.log(neighbors[`10-10`])
  // console.log(neighbors[`${mazeStartRow}-${mazeStartCol}`])

  let mazeStart = boardGrid[mazeStartRow][mazeStartCol];

  console.log(mazeStart)

  let stack = [];
  stack.push(mazeStart);
  console.log(stack)

  let visitedNodeSet = new Set()
  visitedNodeSet.add(mazeStart);

  // while (stack.length) {
  // let viz = setInterval(() => {
  let viz = setVariableInterval(() => {
    // console.log(viz.interval)

    // while (frontier.size) {
    if (!stack.length) {
      clearInterval(viz);
      console.log("finished")
      terminationCallback();
      viz.stop()

      // console.log(pathTree)
      // drawPath(pathTree)
      return;
    }

    // console.log(stack)
    let currentNode = stack[stack.length - 1]
    // console.log(currentNode)
    let neighbor;

    // if (currentNode.neighbors.length == 0) {
    if (neighbors[currentNode.id].length == 0) {
      stack.pop()
      viz.interval = 0;
      // this.interval = 10;
      // console.log("poped")
      // continue;
    }
    else {
      // this.interval = 50
      let randomNeighborIndex = Math.floor(Math.random() * (neighbors[currentNode.id].length))
      // neighbor = neighbors[currentNode.id][0];
      // neighbors[currentNode.id].shift();
      neighbor = neighbors[currentNode.id][randomNeighborIndex]
      neighbors[currentNode.id] = [...neighbors[currentNode.id].slice(0, randomNeighborIndex), ...neighbors[currentNode.id].slice(randomNeighborIndex + 1)]
      if (!visitedNodeSet.has(neighbor)) {
        viz.interval = 16.6
        visitedNodeSet.add(neighbor)
        stack.push(currentNode)
        currentNode.updateNodeTypeInstant("dfs-head")
        stack.push(neighbor)

        // console.log(currentNode)
        // console.log(neighbor)
        let midNode = connectTwoNodes(neighbor, currentNode, boardGrid);
        // console.log(midNode)
        // currentNode.updateNodeTypeInstant("unvisited-animate")
        currentNode.updateNodeType("unvisited-animate")
        midNode.updateNodeType("unvisited-animate")
        neighbor.updateNodeType("unvisited-animate")
      }

    }
  }, 16.6)





  return;








  // let neighborObj = updateNeighbors(boardGrid);
  // let neighborObj = neiObj(boardGrid);
  // let neighborNodeIds = Object.keys(neighborObj)
  // console.log(neighborObj)
  // console.log(neighborNodeIds)



  // neiObj(boardGrid)
  // console.log(boardGrid[10][10].mazeNeighbors)
  // console.log(boardGrid[15][10].mazeNeighbors)
  // console.log(mazeStart.mazeNeighbors)
  // console.log(mazeStart)

  // let solution = [];
  // let stack = [];
  // stack.push(mazeStart.id);

  // return;

  // while (stack.length) {
  //   let currentNodeId = stack[0];
  //   let currentNode = boardGrid[currentNodeId.split("-")[0]][currentNodeId.split("-")[1]]

  //   // console.log(neighborObj[currentNodeId])
  //   // console.log(typeof currentNodeId)
  //   console.log(neighborObj.currentNodeId)
  //   let randomMax = neighborObj[currentNodeId].length;
  //   if (randomMax !== 0) {

  //     let randomNeighborNode = neighborObj[currentNodeId][Math.floor(Math.random() * randomMax)];

  //     let midNode = connectTwoNodes(currentNode, randomNeighborNode, boardGrid)

  //     currentNode.linkedElement.classList.add("brown")
  //     midNode.linkedElement.classList.add("brown")
  //     randomNeighborNode.linkedElement.classList.add("brown")

  //     stack.push(randomNeighborNode)
  //   } else {
  //     stack.shift();

  //   }

  // }



}