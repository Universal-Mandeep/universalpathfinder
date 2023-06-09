import Node from "./node.js"
import bfs, { dfs } from "./pathAlgo/unweightedAlgo.js";
import { aStar, dijkstra, bestFirstSearch } from "./pathAlgo/weightedAlgo.js";


export default class Board {
  constructor(rows, cols) {
    this.rows = rows;                   // Number of rows
    this.cols = cols;

    this.startNode = null;              //* Store Node Object
    this.endNode = null;
    this.boardGrid = [];

    this.selectedPathAlgo = null;       // String
    this.selectedMazeAlgo = null;

    this.boardProperties = {
      isWeighted: false,
      hasDiagonalPathMovement: false,
      hasCheckpoint: false,
      instantPath: false,

      state: "",
    }

    this.weightedNodeCount = 0;

    this.speed = "fast";
    this._speedChanged = false;
    this._skipAnimation = false;
    this._warningId = 0;
    this.warningQueue = [];

    this.nodeDrag = {
      startNode: false,
      endNode: false,
      checkpointNode: false
    }
    this.cpoint = null;

    this.boardState = "idle"
    this.boardStatus = "pure";

    this.boardStateLog = [];
    this.boardStatusLog = [];
  }

  setStartNode(newStart) {
    // takes node object
    if (this.startNode != null) {
      this.startNode.updateNodeType("unvisited");
    }
    this.startNode = newStart;
    this.startNode.updateNodeType("start");
  }
  setEndNode(newEnd) {
    if (this.endNode != null) {
      this.endNode.updateNodeType("unvisited");
    }
    this.endNode = newEnd;
    this.endNode.updateNodeType("end");
  }
  setCheckpointNode(newCheckpoint) {
    if (this.cpoint != null) {
      this.cpoint.updateNodeType("unvisited");
    }
    if (newCheckpoint != null) {
      // checkpoint may or may not be present at a given instance of time
      this.cpoint = newCheckpoint;
      this.cpoint.updateNodeType("checkpoint");
    }
  }

  redrawSpecialNodes() {
    this.setStartNode(this.startNode);
    this.setEndNode(this.endNode);
    if (this.boardProperties.hasCheckpoint) this.setCheckpointNode(this.cpoint)
  }

  init() {
    const nodeSize = 22;
    const windowWidth = window.innerWidth;
    const gridHeight = window.innerHeight - 48;

    let possibleColumns = Math.floor(windowWidth / nodeSize)
    // let possibleRows = Math.floor(gridHeight / 26)
    let possibleRows = Math.floor(gridHeight / nodeSize)

    this.rows = possibleRows
    this.cols = possibleColumns

    this.createNodeGrid();
    this.createVisualGrid();

    // Default start and end position
    this.setStartNode(this.boardGrid[Math.floor(possibleRows / 2)][Math.floor(possibleColumns / 5)]);
    this.setEndNode(this.boardGrid[Math.floor(possibleRows / 2)][Math.floor(possibleColumns - (possibleColumns / 5))]);

    // To avoid lazy load for the weight img
    this.boardGrid[0][0].makeWeighted()
    this.boardGrid[0][0].makeUnweighted()
  }

  createNodeGrid() {
    for (let row = 0; row < this.rows; row++) {
      let rowList = [];
      for (let col = 0; col < this.cols; col++) {
        const newNode = new Node(row, col);
        rowList.push(newNode);
      }
      this.boardGrid.push(rowList)
    }
  }

  createVisualGrid() {
    const boardGridContainer = document.getElementById("board-grid");
    const windowWidth = window.innerWidth;

    let divWidth = `${windowWidth / this.cols}px`;
    for (let row = 0; row < this.rows; row++) {
      const newRow = document.createElement("div");
      newRow.id = `row-${row}`;
      newRow.classList.add("grid-row")

      for (let col = 0; col < this.cols; col++) {
        const newDiv = document.createElement('div');
        newDiv.id = this.boardGrid[row][col].id;
        newDiv.classList.add("node");
        newDiv.classList.add("unvisited");

        divWidth = `23px`;
        newDiv.dataset.animationType = "instant";
        newRow.appendChild(newDiv);
      }
      boardGridContainer.appendChild(newRow);
    }
  }

  resetBoardGrid() {
    for (let nodeRow of this.boardGrid) {
      for (let node of nodeRow) {
        if (node !== this.startNode && node !== this.endNode && node !== this.cpoint) {
          node.updateNodeTypeInstant("unvisited");
          node.makeUnweighted()
        }
      }
    }
    this.boardState = "idle";
    this.boardStatus = "pure";
  }

  resetBoardGridForMaze() {
    for (let nodeRow of this.boardGrid) {
      for (let node of nodeRow) {
        if (node !== this.startNode && node !== this.cpoint && node !== this.endNode) {
          node.updateNodeTypeInstant("unvisited");
          node.makeUnweighted();
        }
      }
    }
  }

  clearBlocks() {
    for (let nodeRow of this.boardGrid) {
      for (let node of nodeRow) {
        if (node.nodeType === "block") {
          node.updateNodeTypeInstant("unvisited");
        }
      }
    }
  }

  clearWeights() {
    for (let nodeRow of this.boardGrid) {
      for (let node of nodeRow) {
        if (node.isWeighted) {
          node.makeUnweighted()
        }
      }
    }
  }


  clearVisitedNodesAndUpdateBoardStatus() {
    for (let nodeRow of this.boardGrid) {
      for (let node of nodeRow) {
        if (node.nodeType == "visited" || node.nodeType == "visited-2" || node.nodeType == "path") {
          node.updateNodeTypeInstant("unvisited");
        }
      }
    }
    this.boardState = "idle";
    this.boardStatus = "dirty";
    this.boardProperties.instantPath = false;
  }

  clearVisitedNodes() {
    for (let nodeRow of this.boardGrid) {
      for (let node of nodeRow) {
        if (node !== this.startNode && node !== this.cpoint && node !== this.endNode && !node.linkedElement.matches(".block")) {
          // node.updateNodeTypeInstant("unvisited");
          node.updateNodeType("unvisited");

        }
      }
    }
  }


  updateNeighborsForPathAlgo() {
    for (let nodeRow of this.boardGrid) {
      for (let node of nodeRow) {
        if (node.nodeType !== "block") {
          const nodeRow = Number(node.id.split("-")[0])
          const nodeCol = Number(node.id.split("-")[1])

          let newNeighbors = [];
          //top neighbor
          if (nodeRow > 0 && this.boardGrid[nodeRow - 1][nodeCol].nodeType !== "block") {
            newNeighbors.push(this.boardGrid[nodeRow - 1][nodeCol])
          }

          // right neighbor
          if (nodeCol < this.cols - 1 && this.boardGrid[nodeRow][nodeCol + 1].nodeType !== "block") {
            newNeighbors.push(this.boardGrid[nodeRow][nodeCol + 1])
          }

          // bottom neighbor
          if (nodeRow < this.rows - 1 && this.boardGrid[nodeRow + 1][nodeCol].nodeType !== "block") {
            newNeighbors.push(this.boardGrid[nodeRow + 1][nodeCol])
          }

          // left neighbor
          if (nodeCol > 0 && this.boardGrid[nodeRow][nodeCol - 1].nodeType !== "block") {
            newNeighbors.push(this.boardGrid[nodeRow][nodeCol - 1])
          }

          if (this.boardProperties.hasDiagonalPathMovement) {
            // top right
            if (nodeRow > 0 && nodeCol < this.cols - 1 && this.boardGrid[nodeRow - 1][nodeCol + 1].nodeType !== "block") {
              newNeighbors.push(this.boardGrid[nodeRow - 1][nodeCol + 1])
            }

            // bottom right
            if (nodeRow < this.rows - 1 && nodeCol < this.cols - 1 && this.boardGrid[nodeRow + 1][nodeCol + 1].nodeType !== "block") {
              newNeighbors.push(this.boardGrid[nodeRow + 1][nodeCol + 1])
            }

            // bottom left
            if (nodeRow < this.rows - 1 && nodeCol > 0 && this.boardGrid[nodeRow + 1][nodeCol - 1].nodeType !== "block") {
              newNeighbors.push(this.boardGrid[nodeRow + 1][nodeCol - 1])
            }

            // top left
            if (nodeRow > 0 && nodeCol > 0 && this.boardGrid[nodeRow - 1][nodeCol - 1].nodeType !== "block") {
              newNeighbors.push(this.boardGrid[nodeRow - 1][nodeCol - 1])
            }
          }

          node.neighbors = newNeighbors;
        }
      }
    }
  }

  updateNeighborsForMazeAlgo() {
    for (let nodeRow of this.boardGrid) {
      for (let node of nodeRow) {
        if (node.nodeType !== "block") {
          const nodeRow = Number(node.id.split("-")[0])
          const nodeCol = Number(node.id.split("-")[1])

          let newNeighbors = [];
          //top neighbor
          if (nodeRow > 1 && this.boardGrid[nodeRow - 2][nodeCol].nodeType !== "block") {
            newNeighbors.push(this.boardGrid[nodeRow - 2][nodeCol])
          }

          // right neighbor
          if (nodeCol < this.cols - 2 && this.boardGrid[nodeRow][nodeCol + 2].nodeType !== "block") {
            newNeighbors.push(this.boardGrid[nodeRow][nodeCol + 2])
          }

          // bottom neighbor
          if (nodeRow < this.rows - 2 && this.boardGrid[nodeRow + 2][nodeCol].nodeType !== "block") {
            newNeighbors.push(this.boardGrid[nodeRow + 2][nodeCol])
          }

          // left neighbor
          if (nodeCol > 1 && this.boardGrid[nodeRow][nodeCol - 2].nodeType !== "block") {
            newNeighbors.push(this.boardGrid[nodeRow][nodeCol - 2])
          }

          node.neighbors = newNeighbors;
        }
      }
    }
  }


  addCheckpoint() {
    this.setCheckpointNode(this.boardGrid[Math.floor(this.rows / 2)][Math.floor(this.cols / 2)])
    this.boardProperties.hasCheckpoint = true;
  }

  toggleCheckpoint() {
    if (this.boardProperties.hasCheckpoint === true) {
      // remove checkpoint
      this.cpoint.updateNodeType("unvisited");
      this.cpoint = null;
      this.boardProperties.hasCheckpoint = false;
    }
    else {
      // add checkpoint
      this.setCheckpointNode(this.boardGrid[Math.floor(this.rows / 2)][Math.floor(this.cols / 2)])
      this.boardProperties.hasCheckpoint = true;
    }
  }


  addDiagonalMovement() {
  }

  handleWarning() {
    if (this.selectedPathAlgo == null) {
      this.toastMsg("Select a path algorithm...")
      this.removeDisable()
      return false;
    }
    else if (this.boardState == "generatingMaze") {
      this.toastMsg("Wait for Maze Generation to finish !")
      return false;
    }
    else if (this.boardState != "idle") {
      this.toastMsg("Wait for animation to finish or skip")
      return false;
    }
    return true;
  }


  visualizePathAlgo(visualizeType = "annimate") {
    if (!this.handleWarning()) return;


    this.boardState = "exploringGraph";
    this.setStartNode(this.startNode)
    this.setCheckpointNode(this.cpoint)
    this.setEndNode(this.endNode)

    this.clearVisitedNodes();
    this.updateNeighborsForPathAlgo();

    //* S -> Start
    //* C -> Checkpoint 
    //* E -> End 

    if (visualizeType === "annimate") {
      let skipBtn = document.querySelector(".skip-btn")
      skipBtn.dataset.active = "true"
      let [visitedNodesSCE, pathFromEndToStart] = this.getVisitedNodesAndPath()
      this.drawVisitedNodesWithAnnimation(visitedNodesSCE, pathFromEndToStart);
      this.boardProperties.instantPath = true;

    }
    else if (visualizeType === "instant" && this.boardProperties.instantPath === true) {
      let [visitedNodesSCE, pathFromEndToStart] = this.getVisitedNodesAndPath()
      this.drawInstatPathAlgo(visitedNodesSCE, pathFromEndToStart)
    }

    else this.releaseBoard()
  }


  callSelectedPathAlgo(startNode, endNode) {
    let visitedNodesAndCameFrom = {}

    if (this.selectedPathAlgo === "dijkstra") {
      visitedNodesAndCameFrom = dijkstra(startNode, endNode, this.boardGrid);
    }
    if (this.selectedPathAlgo === "astar") {
      visitedNodesAndCameFrom = aStar(startNode, endNode, this.boardGrid);
    }
    if (this.selectedPathAlgo === "bestFirstSearch") {
      visitedNodesAndCameFrom = bestFirstSearch(startNode, endNode, this.boardGrid);
    }
    if (this.selectedPathAlgo === "bfs") {
      visitedNodesAndCameFrom = bfs(startNode, endNode, this.boardGrid);
    }

    if (this.selectedPathAlgo === "dfs") {
      visitedNodesAndCameFrom = dfs(startNode, endNode, this.boardGrid);
    }

    return visitedNodesAndCameFrom;
  }


  drawVisitedNodesWithAnnimation(visitedNodesSCE, pathFromEndToStart) {
    let iterator = 0;
    let visitedType = visitedNodesSCE[iterator][0]
    let visitedNodesInOrder = visitedNodesSCE[iterator][1]

    const algoSpeed = this.handlePathAlgoSpeed()
    let viz = setVariableInterval(() => {
      this.setStartNode(this.startNode);
      this.setCheckpointNode(this.cpoint);
      this.setEndNode(this.endNode);

      if (this._speedChanged) {
        const algoSpeed = this.handlePathAlgoSpeed()
        viz.interval = algoSpeed;
        this._speedChanged = false
      }

      if (this._skipAnimation) {
        viz.stop()
        let [_visitedNodesSCE, _pathFromEndToStart] = this.getVisitedNodesAndPath()
        this.drawInstatPathAlgo(_visitedNodesSCE, _pathFromEndToStart)

        this.releaseBoard()
        return
      }

      if (!visitedNodesInOrder.length && visitedNodesSCE.length === iterator + 1) {
        clearInterval(viz);
        viz.stop()
        this.drawPathWithAnnimation(pathFromEndToStart);
        return;
      }

      if (visitedNodesInOrder.length === 0) {
        iterator++;
        visitedType = visitedNodesSCE[iterator][0]
        visitedNodesInOrder = visitedNodesSCE[iterator][1]
      }

      let currentNode = visitedNodesInOrder[0];
      if (currentNode.nodeType !== "start" || currentNode.nodeType !== "checkpoint" || currentNode.nodeType !== "end") {
        currentNode.updateNodeType(visitedType);
      }
      visitedNodesInOrder.shift();
    }, algoSpeed);
  }

  toastMsg(msg) {
    this._warningId++;
    const newToast = document.createElement("div");

    newToast.classList.add(`toast-${this._warningId}`)
    newToast.classList.add("toast")
    newToast.dataset.active = "true"

    const msgSpan = document.createElement("span");

    msgSpan.innerText = `! ${msg}`
    msgSpan.classList.add("msg");
    newToast.appendChild(msgSpan)

    let toastContainer = document.querySelector(".toast-container")
    toastContainer.appendChild(newToast)

    this.warningQueue.push(this._warningId);

    setTimeout(() => {
      let t = this.warningQueue[0]
      let wId = `.toast-${t}`
      let tc = document.querySelector(wId)
      tc.remove()
      this.warningQueue.shift()
    }, 3000);
  }

  drawPathWithAnnimation(pathFromEndToStart) {
    this.boardState = "generatingPath";

    if (!pathFromEndToStart.length) {
      this.toastMsg("No Path Exist")
      this.releaseBoard()
      return
    }

    let pathFromEndToStartInOrder = [...pathFromEndToStart]

    let viz = setVariableInterval(() => {
      this.setStartNode(this.startNode);
      this.setCheckpointNode(this.cpoint);
      this.setEndNode(this.endNode);


      if (this._skipAnimation) {
        viz.stop()
        // On skip... draw remaining path instantanously
        let [_visitedNodesSCE, _pathFromEndToStart] = this.getVisitedNodesAndPath()
        this.drawInstantPath(pathFromEndToStart);
        this.releaseBoard()
        return
      }


      if (!pathFromEndToStartInOrder.length) {
        clearInterval(viz);
        viz.stop()
        this.releaseBoard()
        return;
      }

      let currentNode = pathFromEndToStartInOrder[0];
      if (currentNode.nodeType !== "start" || currentNode.nodeType !== "checkpoint" || currentNode.nodeType !== "end") {
        currentNode.updateNodeType("path");
      }
      pathFromEndToStartInOrder.shift();
    }, 40);
  }

  getPathNodesInOrder(cameFrom, tempEndNode, tempStartNode) {
    let currentNode = tempEndNode
    let path = [];

    if (!(currentNode.id in cameFrom)) {
      console.log("No Path Exist !!")
      // this.toastMsg(`No Path Exist: From ${tempStartNode.id} to ${tempEndNode.id}`)
      return path;
    }

    while (currentNode !== tempStartNode) {
      if (currentNode != this.startNode && currentNode != this.cpoint && currentNode != this.endNode) {
        path.push(currentNode);
      }

      let nextNodeId = cameFrom[currentNode.id]
      let nextNodeIdRow = nextNodeId.split("-")[0]
      let nextNodeIdCol = nextNodeId.split("-")[1]

      currentNode = this.boardGrid[nextNodeIdRow][nextNodeIdCol]
    }

    return path;
  }


  getVisitedNodesAndPath() {
    let visitedNodesAndCameFrom = {};
    let visitedNodesSCE = [];
    let pathFromEndToStart = [];

    if (!this.boardProperties.hasCheckpoint) {
      visitedNodesAndCameFrom = this.callSelectedPathAlgo(this.startNode, this.endNode);

      let visitedNodes = visitedNodesAndCameFrom.visitedNodesInOrder;
      let cameFrom = visitedNodesAndCameFrom.cameFrom;

      visitedNodesSCE = [["visited", visitedNodes]];

      let pathES = this.getPathNodesInOrder(cameFrom, this.endNode, this.startNode);
      pathFromEndToStart = [...pathES];
    }
    else {
      let visitedNodeSToC = [], cameFromSToC = {}, visitedNodeCToE = [], cameFromCToE = {};

      visitedNodesAndCameFrom = this.callSelectedPathAlgo(this.startNode, this.cpoint);
      visitedNodeSToC = visitedNodesAndCameFrom.visitedNodesInOrder;
      cameFromSToC = visitedNodesAndCameFrom.cameFrom
      this.updateNeighborsForPathAlgo()

      visitedNodesAndCameFrom = this.callSelectedPathAlgo(this.cpoint, this.endNode);

      visitedNodeCToE = visitedNodesAndCameFrom.visitedNodesInOrder
      cameFromCToE = visitedNodesAndCameFrom.cameFrom

      visitedNodesSCE = [
        ["visited", [...visitedNodeSToC]],
        ["visited-2", [...visitedNodeCToE]]
      ]

      let pathEC = this.getPathNodesInOrder(cameFromCToE, this.endNode, this.cpoint);
      let pathCS = this.getPathNodesInOrder(cameFromSToC, this.cpoint, this.startNode);

      pathFromEndToStart = [...pathEC, ...pathCS]
    }

    return [visitedNodesSCE, pathFromEndToStart]
  }


  drawInstatPathAlgo(visitedNodesSCE, pathFromEndToStart) {
    let iterator = 0;
    let visitedType = visitedNodesSCE[iterator][0]
    let visitedNodesInOrder = visitedNodesSCE[iterator][1]

    while (visitedNodesInOrder.length) {
      this.setStartNode(this.startNode);
      this.setCheckpointNode(this.cpoint);
      this.setEndNode(this.endNode);

      let currentNode = visitedNodesInOrder[0];
      if (currentNode.nodeType !== "start" || currentNode.nodeType !== "checkpoint" || currentNode.nodeType !== "end") {
        currentNode.updateNodeTypeInstant(visitedType);
      }
      visitedNodesInOrder.shift();

      if (visitedNodesInOrder.length === 0 && visitedNodesSCE.length > iterator + 1) {
        iterator++;
        visitedType = visitedNodesSCE[iterator][0]
        visitedNodesInOrder = visitedNodesSCE[iterator][1]
      }
    }

    this.drawInstantPath(pathFromEndToStart);
    this.releaseBoard()
  }

  drawInstantPath(pathFromEndToStart) {
    this.boardState = "generatingPath";
    let pathFromEndToStartInOrder = [...pathFromEndToStart]

    while (pathFromEndToStartInOrder.length) {
      this.setStartNode(this.startNode);
      this.setCheckpointNode(this.cpoint);
      this.setEndNode(this.endNode);

      let currentNode = pathFromEndToStartInOrder[0];
      if (currentNode.nodeType !== "start" || currentNode.nodeType !== "checkpoint" || currentNode.nodeType !== "end") {
        currentNode.updateNodeTypeInstant("path");
      }
      pathFromEndToStartInOrder.shift();
    }
  }

  setPathAlgoSpeed(newSpeed) {
    this._speedChanged = true
    if (newSpeed === 60) {
      this.speed = "fast";
      return;
    }
    if (newSpeed === 40) {
      this.speed = "medium";
      return;
    }

    this.speed = "slow";
  }

  handlePathAlgoSpeed() {
    if (this.speed === "fast") {
      return 0;
    }
    if (this.speed === "medium") {
      return 33.33;
    }

    return 100;
  }

  removeDisable() {
    let disabledElements = document.querySelectorAll(".disabled");
    disabledElements.forEach((element) => {
      element.classList.remove("disabled")
    })
  }

  releaseBoard() {
    this.boardState = "idle";
    this._skipAnimation = false;
    let skipBtn = document.querySelector(".skip-btn")
    if (skipBtn) skipBtn.dataset.active = "false"
    this.removeDisable()
  }
}
