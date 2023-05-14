import Node from "./node.js"
import bfs from "./pathAlgo/unweightedAlgo.js";
import { aStar, dijkstra, bestFirstSearch } from "./pathAlgo/weightedAlgo.js";



// console.log("From Board.js")
//TODO fix grid size... in createVisualGrid memeber function

export default class Board {
  constructor(rows, cols) {
    this.rows = rows;                   // Number of rows
    this.cols = cols;

    this.startNode = null;              //* Store Node Object
    this.endNode = null;
    this.boardGrid = [];

    this.selectedPathAlgo = null;       // String
    this.selectedMazeAlgo = null;

    this.visitedNodesInOrder = [];      // Node Objects

    //* It will be a 2D list 
    //  [ [start, end, [visitedNode for start to end]] ]
    //  [ [start, cP1, [visitedNode for start to cP1]] ]

    // for branch out as one startPoint can connect to multiple end nodes
    //  startAtId: [[endAtId, [visitedNode for that start to this end]], ... to other end id]
    //* "2-10" cP2
    //*     |
    //* "10-10" start ---- "10-15" cP1 ------- "10-30" end
    //  = {
    //    "10-10": [ ["10-15", [node Objects]], ["2-10", [node Objects]] ]
    //    "10-15": [ ["10-30", [node Objects]] ]
    // }
    //TODO Create functions to get and store the visited node for reuseability 
    //TODO Create function to call visualized function for each checkpoint accordingly


    this.cameFrom = {};

    this.checkpointList = [];               //* Store All Checkpoint Node Object
    this.boardProperties = {
      isWeighted: false,
      hasDiagonalPathMovement: false,
      hasCheckpoint: false,
      instantPath: false,

      state: "",
    }

    this.weightedNodeCount = 0;


    // this.mouseDown = false;
    this.speed = "fast";
    this.nodeDrag = {
      startNode: false,
      endNode: false,
      checkpointNode: false
    }
    this.cpoint = null;

    this.boardState = "idle"
    this.boardStatus = "pure";
    // tell's the board status... pure, dirty, modified

    this.boardStateLog = [];
    // board state log hold the last 5 board states and 0 is the current state of the board
    this.boardStatusLog = [];
    // it hold the last 5 board status and 0 is the current status


  }

  // get startNode(){
  //   return this.startNode
  // }
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

  // setBlockNode(newBlock){
  //   if(thi)
  // }  


  init() {
    // const windowWidth = window.innerWidth - 42.4;

    const nodeSize = 22;

    const windowWidth = window.innerWidth;
    const gridHeight = window.innerHeight - 48;

    console.log(window.innerWidth)
    console.log(window.gridHeight)

    let possibleColumns = Math.floor(windowWidth / nodeSize)
    // let possibleRows = Math.floor(gridHeight / 26)
    let possibleRows = Math.floor(gridHeight / nodeSize)


    this.rows = possibleRows
    this.cols = possibleColumns




    this.createNodeGrid();
    this.createVisualGrid();

    // Default start and end position
    // this.setStartNode(this.boardGrid[10][10]);
    console.log(Math.floor(possibleRows / 2), Math.floor(possibleColumns / 5))
    this.setStartNode(this.boardGrid[Math.floor(possibleRows / 2)][Math.floor(possibleColumns / 5)]);
    this.setEndNode(this.boardGrid[Math.floor(possibleRows / 2)][Math.floor(possibleColumns - (possibleColumns / 5))]);

  }

  createNodeGrid() {
    // console.log(`rows:${this.rows} cols:${this.cols}`)
    for (let row = 0; row < this.rows; row++) {
      // for (let row = 0; row < possibleRows; row++) {
      let rowList = [];
      for (let col = 0; col < this.cols; col++) {
        // for (let col = 0; col < possibleColumns; col++) {
        const newNode = new Node(row, col);
        rowList.push(newNode);
      }
      this.boardGrid.push(rowList)
    }

  }

  createVisualGrid() {
    const boardGridContainer = document.getElementById("board-grid");
    const windowWidth = window.innerWidth;
    // const gridHeight = window.innerHeight - 48;

    // // console.log(windowWidth)
    // // console.log(gridHeight)

    // console.log(window.innerWidth)
    // console.log(window.gridHeight)


    // let possibleColumns = Math.floor(windowWidth / 26)
    // let possibleRows = Math.floor(gridHeight / 26)
    let possibleColumnsWidth = 26


    // console.log(possibleColumns)
    // console.log(possibleRows)


    let divWidth = `${windowWidth / this.cols}px`;
    for (let row = 0; row < this.rows; row++) {
      // for (let row = 0; row < possibleRows; row++) {
      const newRow = document.createElement("div");
      newRow.id = `row-${row}`;
      newRow.classList.add("grid-row")

      for (let col = 0; col < this.cols; col++) {
        // for (let col = 0; col < possibleColumns; col++) {
        const newDiv = document.createElement('div');
        newDiv.id = this.boardGrid[row][col].id;
        newDiv.classList.add("node");
        newDiv.classList.add("unvisited");


        //TODO fix grid size...
        divWidth = `23px`;
        // newDiv.style.height = `${windowWidth / this.rows}px`;
        // newDiv.setAttribute("style", `width:${windowWidth / this.cols}px; height:${windowWidth / this.rows}px`);

        // newDiv.style.width = divWidth;
        // newDiv.style.height = divWidth;
        // newDiv.style.marginTop = "2px";
        // newDiv.style.marginLeft = "2px";


        //! Testing... adding testTest data set to nodes
        newDiv.dataset.animationType = "instant";



        newRow.appendChild(newDiv);
      }
      boardGridContainer.appendChild(newRow);
    }

  }


  resetBoardGrid() {
    for (let nodeRow of this.boardGrid) {
      for (let node of nodeRow) {
        if (node !== this.startNode && node !== this.endNode) {
          node.updateNodeTypeInstant("unvisited");
        }
      }
    }
    this.boardState = "idle";
    this.boardStatus = "pure";
    // this.boardProperties.instantPath = false;
  }

  resetBoardGridForMaze() {
    for (let nodeRow of this.boardGrid) {
      for (let node of nodeRow) {
        if (node !== this.startNode && node !== this.cpoint && node !== this.endNode) {
          node.updateNodeTypeInstant("unvisited");
        }
      }
    }
    // this.boardState = "idle";
    // this.boardStatus = "pure";
    // this.boardProperties.instantPath = false;
  }



  clearVisitedNodesAndUpdateBoardStatus() {
    for (let nodeRow of this.boardGrid) {
      for (let node of nodeRow) {
        // if (node !== this.startNode && node !== this.endNode && !node.linkedElement.matches(".block") && !node.linkedElement.matches(".weighted")) {
        if (node !== this.startNode && node !== this.cpoint && node !== this.endNode && !node.linkedElement.matches(".block")) {
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
        // if (node !== this.startNode && node !== this.endNode && !node.linkedElement.matches(".block") && !node.linkedElement.matches(".weighted")) {
        if (node !== this.startNode && node !== this.cpoint && node !== this.endNode && !node.linkedElement.matches(".block")) {
          node.updateNodeTypeInstant("unvisited");
        }
      }
    }
    // this.boardState = "idle";
    // this.boardStatus = "dirty";
    // this.boardProperties.instantPath = false;
  }


  updateNeighborsForPathAlgo() {
    // console.log("updating neightbors... from board")

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

    // console.log(this.startNode.neighbors)
    // console.log(this.startNode.id)
    // console.log(this.boardGrid[0][0])
    // console.log(this.boardGrid[0][1])
    // console.log(this.boardGrid[0][2])
  }

  updateNeighborsForMazeAlgo() {
    // console.log("updating neightbors... from board")

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

          // if (this.boardProperties.hasDiagonalPathMovement) {
          //   // top right
          //   if (nodeRow > 0 && nodeCol < this.cols - 1 && this.boardGrid[nodeRow - 1][nodeCol + 1].nodeType !== "block") {
          //     newNeighbors.push(this.boardGrid[nodeRow - 1][nodeCol + 1])
          //   }

          //   // bottom right
          //   if (nodeRow < this.rows - 1 && nodeCol < this.cols - 1 && this.boardGrid[nodeRow + 1][nodeCol + 1].nodeType !== "block") {
          //     newNeighbors.push(this.boardGrid[nodeRow + 1][nodeCol + 1])
          //   }

          //   // bottom left
          //   if (nodeRow < this.rows - 1 && nodeCol > 0 && this.boardGrid[nodeRow + 1][nodeCol - 1].nodeType !== "block") {
          //     newNeighbors.push(this.boardGrid[nodeRow + 1][nodeCol - 1])
          //   }

          //   // top left
          //   if (nodeRow > 0 && nodeCol > 0 && this.boardGrid[nodeRow - 1][nodeCol - 1].nodeType !== "block") {
          //     newNeighbors.push(this.boardGrid[nodeRow - 1][nodeCol - 1])
          //   }
          // }

          node.neighbors = newNeighbors;
        }
      }
    }

    // console.log(this.startNode.neighbors)
    // console.log(this.startNode.id)
    // console.log(this.boardGrid[0][0])
    // console.log(this.boardGrid[0][1])
    // console.log(this.boardGrid[0][2])
  }


  addCheckpoint() {
    console.log("Checkpoint added")
    this.setCheckpointNode(this.boardGrid[Math.floor(this.rows / 2)][Math.floor(this.cols / 2)])
    this.boardProperties.hasCheckpoint = true;
  }

  toggleCheckpoint() {
    console.log("Checkpoint Toggled")

    if (this.boardProperties.hasCheckpoint === true) {
      // remove checkpoint
      this.cpoint.updateNodeType("unvisited");
      this.cpoint = null
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


  visualizePathAlgo(visualizeType = "annimate") {
    // console.log("visualize with checkpoint")
    this.boardState = "exploringGraph";
    this.setStartNode(this.startNode)
    this.setCheckpointNode(this.cpoint)
    this.setEndNode(this.endNode)

    this.clearVisitedNodes();
    this.updateNeighborsForPathAlgo();

    // let [visitedNodesSCE, pathFromEndToStart] = this.getVisitedNodesAndPath()

    //* E -> End 
    //* C -> Checkpoint 
    //* S -> Start

    // console.log(this.boardStatus)
    // if (!this.boardProperties.instantPath) {
    if (visualizeType === "annimate") {
      let [visitedNodesSCE, pathFromEndToStart] = this.getVisitedNodesAndPath()
      this.drawVisitedNodesWithAnnimation(visitedNodesSCE, pathFromEndToStart);
      this.boardProperties.instantPath = true;

    }
    // else if (visualizeType === "instant" && this.boardStatus !== "pure") {
    else if (visualizeType === "instant" && this.boardProperties.instantPath === true) {
      let [visitedNodesSCE, pathFromEndToStart] = this.getVisitedNodesAndPath()
      this.drawInstatPathAlgo(visitedNodesSCE, pathFromEndToStart)
    }
  }


  callSelectedPathAlgo(startNode, endNode) {
    // console.log(this.selectedPathAlgo)
    let visitedNodesAndCameFrom = {}

    if (this.selectedPathAlgo === "Dijkstra") {
      visitedNodesAndCameFrom = dijkstra(startNode, endNode, this.boardGrid);
    }
    if (this.selectedPathAlgo === "A Star") {
      visitedNodesAndCameFrom = aStar(startNode, endNode, this.boardGrid);
    }
    if (this.selectedPathAlgo === "Best First Search") {
      visitedNodesAndCameFrom = bestFirstSearch(startNode, endNode, this.boardGrid);
    }
    if (this.selectedPathAlgo === "BFS") {
      visitedNodesAndCameFrom = bfs(startNode, endNode, this.boardGrid);
    }


    return visitedNodesAndCameFrom;
  }


  drawVisitedNodesWithAnnimation(visitedNodesSCE, pathFromEndToStart) {
    let iterator = 0;
    let visitedType = visitedNodesSCE[iterator][0]
    let visitedNodesInOrder = visitedNodesSCE[iterator][1]

    const algoSpeed = this.handlePathAlgoSpeed()
    let viz = setInterval(() => {
      this.setStartNode(this.startNode);
      this.setCheckpointNode(this.cpoint);
      this.setEndNode(this.endNode);

      if (!visitedNodesInOrder.length && visitedNodesSCE.length === iterator + 1) {
        clearInterval(viz);
        this.drawPathWithAnnimation(pathFromEndToStart);
        return;
      }

      if (visitedNodesInOrder.length === 0) {
        iterator++;
        visitedType = visitedNodesSCE[iterator][0]
        visitedNodesInOrder = visitedNodesSCE[iterator][1]
        // console.log(visitedNodesInOrder)
      }

      let currentNode = visitedNodesInOrder[0];
      if (currentNode.nodeType !== "start" || currentNode.nodeType !== "checkpoint" || currentNode.nodeType !== "end") {
        currentNode.updateNodeType(visitedType);
      }
      visitedNodesInOrder.shift();
    }, algoSpeed);
  }

  drawPathWithAnnimation(pathFromEndToStart) {
    this.boardState = "generatingPath";

    let pathFromEndToStartInOrder = [...pathFromEndToStart]
    // const algoSpeed = this.handlePathAlgoSpeed()

    let viz = setInterval(() => {
      this.setStartNode(this.startNode);
      this.setCheckpointNode(this.cpoint);
      this.setEndNode(this.endNode);

      if (!pathFromEndToStartInOrder.length) {
        this.boardState = "idle";
        clearInterval(viz);
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
    console.log("Drawing Instant path")
    // this.boardState = "exploringGraph";

    // this.clearVisitedNodes();
    // this.updateNeighborsForPathAlgo();
    // let [visitedNodesSCE, pathFromEndToStart] = this.getVisitedNodesAndPath()



    // let visitedNodesAndCameFrom = {};
    // let visitedNodesSCE = [];
    // let pathFromEndToStart = [];

    // if (!this.boardProperties.hasCheckpoint) {
    //   visitedNodesAndCameFrom = this.callSelectedPathAlgo(this.startNode, this.endNode);

    //   let visitedNodes = visitedNodesAndCameFrom.visitedNodesInOrder;
    //   let cameFrom = visitedNodesAndCameFrom.cameFrom;

    //   visitedNodesSCE = [["visited", visitedNodes]];

    //   let pathES = this.getPathNodesInOrder(cameFrom, this.endNode, this.startNode);
    //   pathFromEndToStart = [...pathES];
    // }
    // else {
    //   let visitedNodeSToC = [], cameFromSToC = {}, visitedNodeCToE = [], cameFromCToE = {};

    //   visitedNodesAndCameFrom = this.callSelectedPathAlgo(this.startNode, this.cpoint);
    //   visitedNodeSToC = visitedNodesAndCameFrom.visitedNodesInOrder;
    //   cameFromSToC = visitedNodesAndCameFrom.cameFrom

    //   visitedNodesAndCameFrom = this.callSelectedPathAlgo(this.cpoint, this.endNode);

    //   visitedNodeCToE = visitedNodesAndCameFrom.visitedNodesInOrder
    //   cameFromCToE = visitedNodesAndCameFrom.cameFrom

    //   visitedNodesSCE = [
    //     ["visited", [...visitedNodeSToC]],
    //     ["visited-2", [...visitedNodeCToE]]
    //   ]

    //   let pathEC = this.getPathNodesInOrder(cameFromCToE, this.endNode, this.cpoint);
    //   let pathCS = this.getPathNodesInOrder(cameFromSToC, this.cpoint, this.startNode);

    //   pathFromEndToStart = [...pathEC, ...pathCS]
    // }


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




  // drawInstatPathAlgoOLD() {
  //   this.clearVisitedNodes();
  //   this.updateNeighborsForPathAlgo();

  //   let visitedNodesAndCameFrom = {}
  //   visitedNodesAndCameFrom = aStar(this.startNode, this.endNode, this.boardGrid);

  //   this.visitedNodesInOrder = visitedNodesAndCameFrom.visitedNodesInOrder;
  //   this.cameFrom = visitedNodesAndCameFrom.cameFrom;
  //   // this.drawVisitedNodesWithAnimation()
  //   let visitedNodesInOrder = [...this.visitedNodesInOrder]

  //   this.setStartNode(this.startNode)
  //   while (visitedNodesInOrder.length) {
  //     let currentNode = visitedNodesInOrder[0];
  //     if (currentNode.nodeType !== "start" || currentNode.nodeType !== "end") {
  //       currentNode.updateNodeTypeInstant("visited");
  //     }
  //     visitedNodesInOrder.shift();
  //   }
  //   this.setStartNode(this.startNode)
  //   // drawPathWithAnimation();

  //   let cameFrom = this.cameFrom;
  //   let currentNode = this.endNode;
  //   while (currentNode !== this.startNode) {
  //     if (!(currentNode.id in cameFrom)) {
  //       console.log("No Path Exist !!")
  //       return;
  //     }

  //     if (currentNode != this.startNode && currentNode != this.endNode) {
  //       currentNode.updateNodeTypeInstant("path");
  //     }

  //     let nextNodeId = cameFrom[currentNode.id]
  //     let nextNodeIdRow = nextNodeId.split("-")[0]
  //     let nextNodeIdCol = nextNodeId.split("-")[1]

  //     currentNode = this.boardGrid[nextNodeIdRow][nextNodeIdCol]
  //   }
  // }

  setPathAlgoSpeed(newSpeed) {
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
      // return 0;
      return 10;
      return 16.66;
      return 0;
    }
    if (this.speed === "medium") {
      return 33.33;
      return 25;
    }

    return 100;
  }
}
