
function connectTwoNodes(neighbor, current, boardGrid) {

  let neighborRow = parseInt(neighbor.id.split("-")[0])
  let neighborCol = parseInt(neighbor.id.split("-")[1])

  let currentRow = parseInt(current.id.split("-")[0])
  let currentCol = parseInt(current.id.split("-")[1])

  let rowChange = (neighborRow - currentRow) / 2
  let colChange = (neighborCol - currentCol) / 2

  let mid_spot_row = currentRow + parseInt(rowChange)
  let mid_spot_col = currentCol + parseInt(colChange)

  return boardGrid[mid_spot_row][mid_spot_col];
}

function getRandomItem(set) {
  let items = Array.from(set);
  return items[Math.floor(Math.random() * items.length)];
}


function getNeighbors(node, boardGrid) {
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

  return newNeighbors;
}

export default function randomizedPrims(startNode, boardGrid, terminationCallback) {
  makeAllBlock(boardGrid)

  let mazeStart = startNode;
  let pathTree = [];  // node.id: string

  let visited = new Set();
  let frontier = new Set();

  frontier.add(mazeStart);

  let viz = setInterval(() => {
    if (!frontier.size) {
      clearInterval(viz);
      terminationCallback();

      return;
    }

    let randomNode = getRandomItem(frontier);

    frontier.delete(randomNode);
    randomNode.linkedElement.classList.remove("frontier")

    visited.add(randomNode);
    let isConnected = false;
    let neighbors = []

    neighbors = getNeighbors(randomNode, boardGrid)
    let connections = []
    for (let neighbor of neighbors) {
      if (!(visited.has(neighbor))) {
        frontier.add(neighbor);
        neighbor.linkedElement.classList.add("frontier")
      }
      else {
        connections.push(neighbor)
      }
    }
    let randomConnection = connections[Math.floor(Math.random() * connections.length)]

    if (randomConnection) {
      let midNode = connectTwoNodes(randomConnection, randomNode, boardGrid);
      pathTree.push(midNode)
      midNode.updateNodeType("unvisited-animate")
    }

    pathTree.push(randomNode)
    randomNode.updateNodeType("unvisited-animate")

  }, 16.66);
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

  let solution = [];

  let weightedEdges = []
  let edgeIdCount = 0
  let randomWeightMax = 10;

  const rows = boardGrid.length;
  const cols = boardGrid[0].length;
  for (let row of boardGrid) {
    for (let node of row) {
      const nodeRow = Number(node.id.split("-")[0])
      const nodeCol = Number(node.id.split("-")[1])

      if (nodeRow % 2 === 0 && nodeCol % 2 === 0) {
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
  //sort the edges by weight
  weightedEdges = weightedEdges.sort((a, b) => (a.weight > b.weight) ? 1 : -1);

  //iterate through the edges and add to solution or discard
  for (let edge of weightedEdges) {
    let x = edge.source.id,
      y = edge.target.id;
    if (x != y) {
      if (find(x) != find(y)) {
        union(x, y);
        solution.push(edge);
      }
    }
  }

  makeAllBlock(boardGrid)
  drawKruskalMaze(solution, terminationCallback)
}

function drawKruskalMaze(edges, terminationCallback) {
  let currentEdge = edges[0]

  const wizard = setInterval(() => {
    if (!edges.length) {
      clearInterval(wizard);
      terminationCallback();
      return;
    }
    currentEdge = edges[0]

    currentEdge.source.updateNodeType("unvisited-animate")
    currentEdge.mid.updateNodeType("unvisited-animate")
    currentEdge.target.updateNodeType("unvisited-animate")
    edges.shift()
  }, 25)
}


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
  return nei
}


export function randomBlocks(boardGrid) {
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
      boardGrid[randomRowIndex][randomColIndex].updateNodeTypeInstant("block")
    }

    blockCount++;
  }
}

export function randomWeights(boardGrid) {
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
      boardGrid[randomRowIndex][randomColIndex].updateNodeType("weighted")
    }

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
  makeAllBlock(boardGrid)

  let neighbors = updateNeighbors(boardGrid)
  let mazeStartRow = 10
  let mazeStartCol = 10

  let mazeStart = boardGrid[mazeStartRow][mazeStartCol];

  let stack = [];
  stack.push(mazeStart);

  let visitedNodeSet = new Set()
  visitedNodeSet.add(mazeStart);

  let viz = setVariableInterval(() => {
    if (!stack.length) {
      clearInterval(viz);
      terminationCallback();
      viz.stop()
      return;
    }

    let currentNode = stack[stack.length - 1]
    let neighbor;

    if (neighbors[currentNode.id].length == 0) {
      stack.pop()
      viz.interval = 0;
    }
    else {
      let randomNeighborIndex = Math.floor(Math.random() * (neighbors[currentNode.id].length))
      neighbor = neighbors[currentNode.id][randomNeighborIndex]
      neighbors[currentNode.id] = [...neighbors[currentNode.id].slice(0, randomNeighborIndex), ...neighbors[currentNode.id].slice(randomNeighborIndex + 1)]
      if (!visitedNodeSet.has(neighbor)) {
        viz.interval = 16.6
        visitedNodeSet.add(neighbor)
        stack.push(currentNode)
        currentNode.updateNodeTypeInstant("dfs-head")
        stack.push(neighbor)

        let midNode = connectTwoNodes(neighbor, currentNode, boardGrid);
        currentNode.updateNodeType("unvisited-animate")
        midNode.updateNodeType("unvisited-animate")
        neighbor.updateNodeType("unvisited-animate")
      }

    }
  }, 16.6)
}