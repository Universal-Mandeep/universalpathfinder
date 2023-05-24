import Board from "./Board.js"
import randomizedPrims, { randomizedDfs, randomizedKruskals, randomBlocks, randomWeights } from "./mazeAlgo/randomizedAlgo.js";
// import dijkstra, { aStar } from "./pathAlgo/weightedAlgo.js";


// initialization
const board = new Board(19, 50);
board.init();





//* nav bar events
const dropdownList = document.querySelectorAll(".dropdown")
dropdownList.forEach(dropdown => {
  dropdown.addEventListener("click", e => {
    const activeDropdown = document.querySelector('[data-dropdown-active = "true"]');

    if (activeDropdown == null) {
      dropdown.dataset.dropdownActive = "true";
    }
    else if (e.target.closest(".dropdown") != activeDropdown) {
      activeDropdown.dataset.dropdownActive = "false";
      dropdown.dataset.dropdownActive = "true";
    }
    else {
      if (e.target.closest(".dropdown") == activeDropdown && e.target.closest(".dropdown-list")) {
        if (e.target.closest(".maze-algo")) {
          // dropdown.querySelector(".dropdown-label").getElementsByTagName("span")[0].innerText = e.target.innerText
          // board.selectedMazeAlgo = e.target.innerText;
          // handleMazeAlgo(e.target.innerText);
          handleMazeAlgo(e.target);
        }
        else if (e.target.closest(".path-algo")) {
          dropdown.querySelector(".dropdown-label").getElementsByTagName("span")[0].innerText = e.target.innerText
          // board.selectedPathAlgo = e.target.dataset.key;
          board.selectedPathAlgo = e.target.id;
        }
        else if (e.target.closest(".clear-board-btn")) {
          // handleClearDropdown(e.target.innerText)
          handleClearDropdown(e.target)
        }
      }
      activeDropdown.dataset.dropdownActive = "false";
    }
  })
})

function closeAllDropdown() {
  const activeDropdownList = document.querySelectorAll('[data-dropdown-active = "true"]');
  for (let activeDropdown of activeDropdownList) {
    activeDropdown.dataset.dropdownActive = "false";
  }
  closeInfoCard()
}

function closeInfoCard() {
  document.querySelector(".info-card").dataset.open = false;
}


function handleClearDropdown(clearElement) {
  if (clearElement.classList.contains("disabled")) return;

  let clearType = clearElement.innerText;
  if (clearType.toLowerCase() === "clear paths") {
    board.clearVisitedNodesAndUpdateBoardStatus()
  }
  else if (clearType.toLowerCase() === "clear blocks") {
    board.clearBlocks()
  }
  else if (clearType.toLowerCase() === "clear weights") {
    board.clearWeights()
  }
  else if (clearType.toLowerCase() === "reset board") {
    board.resetBoardGrid()
  }
}



document.querySelector(".visualize-btn").addEventListener("click", e => {
  closeAllDropdown();

  // if (board.selectedPathAlgo == null) {
  //   board.toastMsg("Select a path algorithm...")
  // }
  // else if (board.boardState != "idle") {
  //   console.log(board.boardState)
  //   board.toastMsg("Wait for previous animation to finish or skip")
  //   return
  // }

  // else {
  // let skipBtn = document.querySelector(".skip-btn")
  // skipBtn.dataset.active = "true"

  disbaleElements()

  board.visualizePathAlgo()
  // }
})

document.querySelector(".skip-btn").addEventListener("click", e => {
  board._skipAnimation = true;

  setTimeout(() => {
    let skipBtn = document.querySelector(".skip-btn")
    skipBtn.dataset.active = "false"
    board._skipAnimation = false;

    // }, 200)
  }, 100)

})



// Disable Elements
function disbaleElements() {
  const checkpointButton = document.querySelector(".checkpoint-btn");
  const diagonalButton = document.querySelector(".diagonal-btn");

  let mazeList = document.querySelector(".maze-algo").querySelectorAll(".dropdown-list-item");
  let clearList = document.querySelector(".clear-board-btn").querySelectorAll(".dropdown-list-item");
  // let disbaleList = [checkpointButton, diagonalButton]
  let disbaleList = [
    board.startNode.linkedElement, board.endNode.linkedElement,
    // board.cpoint.linkedElement? board.cpoint.linkedElement:,
    checkpointButton, diagonalButton, ...mazeList, ...clearList]
  if (board.cpoint) disbaleList.push(board.cpoint.linkedElement)
  console.log(disbaleList)


  disbaleList.forEach((element) => {
    console.log(element)
    element.classList.add("disabled")
  })
}
// disbaleElements()

// checkpoint
const checkpointButton = document.querySelector(".checkpoint-btn");
checkpointButton.addEventListener("click", e => {
  // if (checkpointButton.classList.contains("disabled")) return;
  if (board.boardState != "idle") return;

  board.toggleCheckpoint();

  // visual toggle of checkpoint btn
  if (checkpointButton.dataset.active === "false") checkpointButton.dataset.active = "true"
  else checkpointButton.dataset.active = "false"

  if (board.selectedPathAlgo != null) board.visualizePathAlgo("instant")
})

// checkpointButton.addEventListener("mouseover", e => {
//   if (board.boardState !== "idle") {
//     checkpointButton.classList.add("disabled")
//   }
// })

// checkpointButton.addEventListener("mouseleave", e => {
//   checkpointButton.classList.remove("disabled")
// })


// TODO move the working to the addDiagonalButton in Board.js
const diagonalButton = document.querySelector(".diagonal-btn");
diagonalButton.addEventListener("click", e => {
  if (board.boardState != "idle") return;

  if (board.boardProperties.hasDiagonalPathMovement) {
    board.boardProperties.hasDiagonalPathMovement = false;
    diagonalButton.dataset.active = "false";
  } else {
    board.boardProperties.hasDiagonalPathMovement = true;
    diagonalButton.dataset.active = "true";
  }

  // let diagonalState
  // if (board.boardState == "idle") board.toastMsg(`Diagonal Movement: ${diagonalButton.dataset.active == "true" ? "True" : "False"}`)

  // board.drawInstatPathAlgo()
  if (board.selectedPathAlgo != null) board.visualizePathAlgo("instant")
})

// diagonalButton.addEventListener("mouseover", e => {
//   if (board.boardState !== "idle") {
//     diagonalButton.classList.add("disabled")
//   }
// })

// diagonalButton.addEventListener("mouseleave", e => {
//   diagonalButton.classList.remove("disabled")
// })






//* speed controls 
const speedvalues = document.querySelectorAll(".speed-value");
speedvalues.forEach(speedvalue => {
  speedvalue.addEventListener("click", e => {
    if (!speedvalue.classList.contains("selected")) {
      document.querySelector(".speed-value.selected").classList.remove("selected");
      speedvalue.classList.add("selected");

      board.setPathAlgoSpeed(Number(e.target.innerText))
    }
  })
});


// helper functions
function elementToNodeObject(element) {
  const targetRow = element.id.split("-")[0];
  const targetCol = element.id.split("-")[1];
  return board.boardGrid[targetRow][targetCol];
}


// info desriptions


// info-btn
const infoBtn = document.querySelector(".info-btn");
infoBtn.addEventListener("click", e => {
  e.preventDefault()
  const infoCard = document.querySelector(".info-card");

  const sideNav = infoCard.querySelector(".side-nav")
  const descriptionContainer = infoCard.querySelector(".description-container")


  if (e.target.closest(".info-card")) {
    if (e.target.closest(".info-tab-label")) {
      if (infoCard.querySelector("[data-selected=true]") != e.target) {
        infoCard.querySelector("[data-selected=true]").dataset.selected = "false"
        e.target.dataset.selected = "true"

      } else {
        // console.log("clicked on same tab")
      }
    }
    else if (e.target.classList.contains("heading-link")) {
      document.getElementById(e.target.dataset.linkto).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
    }

  }
  else if (e.target.closest(".info-btn") && !e.target.closest(".info-card")) {
    if (infoCard.dataset.open === "true") infoCard.dataset.open = "false"
    else infoCard.dataset.open = "true"

    sideNav.innerHTML = mapInfo["details"][0]
    descriptionContainer.innerHTML = mapInfo["details"][1]
    infoCard.querySelector(".info-tab-label[data-selected=true]").dataset.selected = false
    infoCard.querySelectorAll(".info-tab-label")[0].dataset.selected = true
  }
})



let mapInfo = {
  // label-key: [side-nav, description-container]
  "details": [
    `<div class="heading-link" data-linkTo="info-HowToUse">How to use ?</div>
    <div class="heading-link" data-linkTo="info-Controls">Controls</div>
    <div class="heading-link" data-linkTo="info-Nodes">Nodes Info</div>
    `,
    `
    <div class="container" id="info-HowToUse">
      <div class="heading">How to use ?</div>
      <div class="description">
        <div><span class="text-highlight">Step 1: </span> Add Blocks/Weights on the grid (or use Maze Algorithm to generate a maze).</div>
        <div><span class="text-highlight">Step 2: </span> Select a Path Algorithm.</div>
        <div><span class="text-highlight">Step 3: </span> Adjust animation speed(Default 60fps).</div>
        <div><span class="text-highlight">Step 4: </span> Hit Visualize.</div>

          
      </div>
    </div>

    <div class="container" id="info-Controls">
      <div class="heading">Controls</div>
      <div class="description">
        <div><span>left click:</span> Add Block</div>
        <div><span>ctrl + left click:</span> Add Weight</div>
        <div><span>right click:</span> Clear Node</div>
      </div>
    </div>

    <div class="container" id="info-Nodes">
      <div class="heading">Nodes Info</div>
      <div class="description">
        
        <div class="info-node-container"><div class="info-node info-start"></div>Start Node</div>
        <div class="info-node-container"><div class="info-node info-checkpoint"></div>Checkpoint Node</div>
        <div class="info-node-container"><div class="info-node info-end"></div>End Node</div>
        <div class="info-node-container"><div class="info-node info-block"></div>Block Node</div>
        <div class="info-node-container"><div class="info-node info-weighted"></div>Weighted Node</div>
        <div class="info-node-container"><div class="info-node info-unvisited"></div>Unvisited Node(from start to checkpoint)</div>
        <div class="info-node-container"><div class="info-node info-visited"></div>Visited Node(from start to checkpoint)</div>
        <div class="info-node-container"><div class="info-node info-visited-2"></div>Visited Node(from checkpoint to end)</div>
        <div class="info-node-container"><div class="info-node info-path"></div>Path Node</div>

      </div>
    </div>
    
  `],
  "pathAlgo": [
    `<div class="heading-link" data-linkTo="info-Dijkstra">Dijkstra's Algorithm</div>
    <div class="heading-link" data-linkTo="info-Astar">A* Algorithm</div>
    <div class="heading-link" data-linkTo="info-BestFirstSearch">Best First Search Algorithm</div>
    <div class="heading-link" data-linkTo="info-BFS">Breadth First Search Algorithm</div>
    <div class="heading-link" data-linkTo="info-PathDFS">Depth First SearchAlgorithm</div>`,
    `<div class="container" id="info-Dijkstra">
      <div class="heading">Dijkstra's Algorithm</div>
      <div class="description">Dijkstra's Algorithms is an algorithm for finding the shortest paths between nodes in a weighted graph. It guarantees the shortest path.
      Specifically, Dijkstra selects the path that minimizes
      <div class="text-tab">
        <span class="text-highlight">f(n)=g(n)</span>
      </div>
      where <span class="text-highlight">n</span> is the next node on the path, <span class="text-highlight">g(n)</span> is the cost of the path from the start node to n. It takes the edge with the minimum cost and update the path only if the current cost to reach that node is lower than the previous cost.
      </div>
    </div>
    <div class="container" id="info-Astar">
      <div class="heading">A* Algorithm</div>
      <div class="description">A* is an informed search algorithm i.e. uses heuristics to guarantee the shortest path much faster than Dijkstra's Algorithm. It is a weighted algorithm. 
      Specifically, A* selects the path that minimizes
      <div class="text-tab">
        <span class="text-highlight">f(n)=g(n)+h(n)</span>
      </div>
      where <span class="text-highlight">n</span> is the next node on the path, <span class="text-highlight">g(n)</span> is the cost of the path from the start node to n, and <span class="text-highlight">h(n)</span> is a heuristic function that estimates the cost of the cheapest path from n to the goal.
      </div>
    </div>
    <div class="container" id="info-BestFirstSearch">
      <div class="heading">Best First Search Algorithm</div>
      <div class="description">Best First Search Algorithms a faster, more heuristic-heavy version of A*. It does not guarantee the shortest path but it works with weighted edges.
      Specifically, Greedy Best First Search selects the path that minimizes
      <div class="text-tab">
        <span class="text-highlight">f(n)=h(n)</span>
      </div>
      where <span class="text-highlight">n</span> is the next node on the path, <span class="text-highlight">h(n)</span> is a heuristic function that estimates the cost of the cheapest path from n to the goal.
      </div>
    </div>
    <div class="container" id="info-BFS">
      <div class="heading">Breadth First Search Algorithm</div>
      <div class="description">
        <div>Breadth First Search Algorithm is a standard traversal algorithm for tree and graph data-structures. It starts at the tree’s root or graph and searches/visits all nodes at the current depth level before moving on to the nodes at the next depth level.</div>
        <div>It does not work with weighted edges but it guarantees the shortest path.</div>
        </div>
        </div>
        <div class="container" id="info-PathDFS">
        <div class="heading">Depth First Search Algorithm</div>
        <div class="description">
        DFS Algorithms is a standard traversal algorithm for tree and graph data-structures.
        <div>The algorithm starts at the root node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking. Extra memory, usually a stack, is needed to keep track of the nodes discovered so far along a specified branch which helps in backtracking of the graph.</div>
        <div>It does not work with weighted edges and it does not guarantees the shortest path.</div>
      </div>
    </div>`
  ],
  "mazeAlgo": [
    `<div class="heading-link" data-linkTo="info-Kruskal">Randomized Kruskal's Algorithm</div>
    <div class="heading-link" data-linkTo="info-Prim">Randomized Prim's Algorithm</div>
    <div class="heading-link" data-linkTo="info-MazeDFS">Randomized DFS Algorithm</div>
    <div class="heading-link" data-linkTo="info-RandomBlock">Random Blocks</div>
    <div class="heading-link" data-linkTo="info-RandomWeight">Random Weights</div>`,
    `<div class="container" id="info-Kruskal">
      <div class="heading">Kruskal's Algorithm</div>
      <div class="description">
        <div>
          This algorithm is a randomized version of Kruskal's algorithm. Each time it create a randomized MST(Minimum Spanning Tree).
        </div>
        <div class=code-block>
          <div class="text-tab">Create a list of all walls, and create a set for each cell, each containing just that one cell.</div>
          <div class="text-tab">For each wall, in some random order:
            <div class="text-tab">If the cells divided by this wall belong to distinct sets:
              <div class="text-tab">Remove the current wall.</div>
              <div class="text-tab">Join the sets of the formerly divided cells.</div>
            </div>
          </div>
        </div>
      
      </div>
    </div>
    <div class="container" id="info-Prim">
      <div class="heading">Prim's Algorithm</div>
      <div class="description">
        <div>
          This algorithm is a randomized version of Prims's algorithm. It creates a randomized MST(Minimum Spanning Tree) of the given graph.
        </div>
        
        <div class=code-block>
          <div class="text-tab">Start with a grid full of walls.</div>
          <div class="text-tab">Pick a node, mark it as part of the maze. Add the walls of the node to the wall list(frontier).</div>
          <div class="text-tab">While there are walls in the list(frontier):
            <div class="text-tab">Pick a random wall from the list(frontier). If only one of the node that the wall divides is visited, then:
              <div class="text-tab">Make the wall a passage and mark the unvisited node as part of the maze.</div>
              <div class="text-tab">Add the neighboring walls of the node to the wall list(frontier).</div>
            </div>
            <div class="text-tab">Remove the wall from the list.</div>
          </div>
        </div>

      </div>
    </div>
    <div class="container" id="info-MazeDFS">
      <div class="heading">Randomized Depth First Search Algorithm</div>
      <div class="description">
        The depth-first search algorithm of maze generation is frequently implemented using backtracking. This can be described with a following recursive routine:
      
        <div class=code-block>
          <div class="text-tab">Given a current cell as a parameter</div>
          <div class="text-tab">Mark the current cell as visited</div>
          <div class="text-tab">While the current cell has any unvisited neighbour cells
            <div class="text-tab">Choose one of the unvisited neighbours</div>
            <div class="text-tab">Remove the wall between the current cell and the chosen cell</div>
            <div class="text-tab">Invoke the routine recursively for the chosen cell</div>
          </div>
        </div>

      </div>
    </div>
    <div class="container" id="info-RandomBlock">
      <div class="heading">Random Blocks</div>
      <div class="description">
        It fills the one fourth of the grid with block at random positions.
      </div>
    </div>
    <div class="container" id="info-RandomWeight">
      <div class="heading">Random Weights</div>
      <div class="description">
        It fills the one fourth of the grid with weights at random positions.
      </div>
    </div>`
  ],
  "features": [
    `<div class="heading-link" data-linkTo="info-Animations">Animations</div>
    <div class="heading-link" data-linkTo="info-Checkpoint">Checkpoint Node</div>
    <div class="heading-link" data-linkTo="info-Diagonal">Diagonal Movement</div>
    <div class="heading-link" data-linkTo="info-Speed">Speed Controls</div>`,

    `
    <div class="container" id="info-Animations">
      <div class="heading">Animations</div>
      <div class="description">
        This is one of the main feature of this Visualization Tool. As humans are visual learner and the human brain processes visuals around 60,000 times faster than text by quickly deciphering illustrative elements simultaneously. 
        <div>This Visualization Tool not only provide visualization for the path algorithms but also provide it for the maze algorithms</div>
      </div>
    </div>
    <div class="container" id="info-Checkpoint">
      <div class="heading">Checkpoint Node</div>
      <div class="description">
        This node act as a center point between the start node and the end node. First the algorithm has to find the checkpoint node then it start from this checkpoint to the end node
        <div>It can be easily toggled on or off from the "checkpoint" button on the nav bar.</div>
      </div>
    </div>
    <div class="container" id="info-Diagonal">
      <div class="heading">Diagonal Movement</div>
      <div class="description">
        Generally there are four neightbors of a node: top, right, bottom, left.
        <div>But, with diagonal movement "ON" it can now move to four move nodes: top-right, bottom-right, bottom-left, top-left.</div>
        <div>It can be easily toggled on or off from the "diagonal" button on the nav bar.</div>
      </div>
    </div>
    <div class="container" id="info-Speed">
      <div class="heading">Speed Controls</div>
      <div class="description">
      <div>It provides an easy access to control the FPS for the path algorithms. Currently there are three speed variations for the visualization: 10fps 40fps 60fps</div>
      <div></div>
      </div>
    </div>
    
  `
  ]
}

const infoLabels = document.querySelectorAll(".info-tab-label")
infoLabels.forEach(label => {
  label.addEventListener("click", e => {
    const infoCard = document.querySelector(".info-card");

    const sideNav = infoCard.querySelector(".side-nav")
    const descriptionContainer = infoCard.querySelector(".description-container")

    document.getElementById(sideNav.firstChild.dataset.linkto).scrollIntoView({ behavior: "instant" })
    sideNav.innerHTML = mapInfo[label.dataset.key][0]
    descriptionContainer.innerHTML = mapInfo[label.dataset.key][1]
    document.getElementById(sideNav.firstChild.dataset.linkto).scrollIntoView({ behavior: "instant" })
  })
})





//* handle board events

// let endNode = board.endNode.linkedElement;

let drawInstantPath = false;

let mouseBtn = "left"

let boardGrid = document.getElementById("board-grid");
boardGrid.addEventListener("mousedown", e => {

  closeAllDropdown()
  // closeInfoCard()

  // dont perform the mousedown on right mouse button
  e.preventDefault()
  // if (board.boardState != "idle") {
  //   board.toastMsg("Wait for previous animation to finish or skip")
  //   return;
  // }
  if (board.boardState == "generatingMaze") {
    board.toastMsg("Wait for Maze Generation to finish !")
    return false;
  }
  else if (board.boardState != "idle") {
    // console.log(board.boardState)
    board.toastMsg("Wait for previous animation to finish or skip")
    return false;
  }


  if (e.button == 0) {
    mouseBtn = "left"
  }
  if (e.button == 2) {
    // handleRightClick(e)
    mouseBtn = "right"
    // return;
  }

  const nodes = [...boardGrid.querySelectorAll(".node")]

  if (e.target.matches(".start")) {
    board.nodeDrag.startNode = true;
    board.startNode.linkedElement.classList.add("grabbing")
  }
  if (e.target.matches(".checkpoint")) {
    board.nodeDrag.checkpointNode = true;
    board.cpoint.linkedElement.classList.add("grabbing")
  }
  if (e.target.matches(".end")) {
    board.nodeDrag.endNode = true;
    board.endNode.linkedElement.classList.add("grabbing")
  }

  if (e.target.matches(".node") && !e.target.matches(".start") && !e.target.matches(".checkpoint") && !e.target.matches(".end")) {
    const nodeRow = e.target.id.split("-")[0];
    const nodeCol = e.target.id.split("-")[1];

    if (mouseBtn == "left") {
      if (e.ctrlKey == true) board.boardGrid[nodeRow][nodeCol].updateNodeType("weighted");
      else board.boardGrid[nodeRow][nodeCol].updateNodeType("block");
      board.boardStatus = "dirty"
    }
    else if (mouseBtn === "right" && board.boardGrid[nodeRow][nodeCol].nodeType === "block") board.boardGrid[nodeRow][nodeCol].updateNodeType("unvisited-2")
    // else if (mouseBtn === "right" && board.boardGrid[nodeRow][nodeCol].isWeighted) board.boardGrid[nodeRow][nodeCol].updateNodeType("unvisited-3")
    else if (mouseBtn === "right" && board.boardGrid[nodeRow][nodeCol].isWeighted) board.boardGrid[nodeRow][nodeCol].makeUnweighted()

    //    ||
  }

  for (let node of nodes) {
    node.addEventListener("mouseover", nodeMouseOverEvent, e)
  }
})

document.addEventListener("mouseup", e => {
  // boardGrid.addEventListener("mouseup", e => {

  const nodes = [...boardGrid.querySelectorAll(".node")]

  for (let node of nodes) {
    // node.removeEventListener("mouseover", nodeMouseOverEvent, e)
    node.removeEventListener("mouseover", nodeMouseOverEvent, e)
  }

  board.startNode.linkedElement.classList.remove("grabbing")
  board.endNode.linkedElement.classList.remove("grabbing")
  if (board.cpoint) {
    board.cpoint.linkedElement.classList.remove("grabbing")
  }
  board.nodeDrag.startNode = false;
  board.nodeDrag.checkpointNode = false;
  board.nodeDrag.endNode = false;
})


// function nodeMouseOverEvent(e) {
function nodeMouseOverEvent(e) {
  console.log(mouseBtn)
  if (board.boardState != "idle") return;

  const targetRow = e.target.id.split("-")[0];
  const targetCol = e.target.id.split("-")[1];
  const targetNode = board.boardGrid[targetRow][targetCol];

  if (board.nodeDrag.startNode) {
    if (targetNode.nodeType !== "end" && targetNode.nodeType !== "checkpoint") {
      board.startNode.linkedElement.classList.remove("grabbing");

      board.setStartNode(targetNode);
      targetNode.linkedElement.classList.add("grabbing");

      let ipath = false
      let li = [document.querySelector(".visited"), document.querySelector(".visited-2"), document.querySelector(".path")]
      // document.querySelector("visited")

      // console.log(li)
      if (document.querySelector(".visited") != null
        || document.querySelector(".visited-2") != null
        || document.querySelector(".path") != null) board.visualizePathAlgo("instant")

      // if (li.length > 0) board.visualizePathAlgo("instant")
      // if (li.length > 0 && board.boardState === "idle") board.visualizePathAlgo("instant")
      // if (board.boardState == "idle") board.visualizePathAlgo("instant")
    }
  }
  if (board.nodeDrag.checkpointNode) {
    if (targetNode.nodeType !== "start" && targetNode.nodeType !== "end") {
      board.cpoint.linkedElement.classList.remove("grabbing");

      board.setCheckpointNode(targetNode)
      targetNode.linkedElement.classList.add("grabbing");

      // board.visualizePathAlgo("instant")
      if (document.querySelector(".visited") != null
        || document.querySelector(".visited-2") != null
        || document.querySelector(".path") != null) board.visualizePathAlgo("instant")

    }
  }
  if (board.nodeDrag.endNode) {
    if (targetNode.nodeType !== "start" && targetNode.nodeType !== "checkpoint") {
      board.endNode.linkedElement.classList.remove("grabbing");

      // if (targetNode.nodeType === "block") {
      //   targetNode.updateNodeType("unvisited")
      // }

      board.setEndNode(targetNode);
      targetNode.linkedElement.classList.add("grabbing");

      // board.visualizePathAlgo("instant")
      if (document.querySelector(".visited") != null
        || document.querySelector(".visited-2") != null
        || document.querySelector(".path") != null) board.visualizePathAlgo("instant")

    }
  }

  if (targetNode.nodeType !== "start" && targetNode.nodeType !== "checkpoint" && targetNode.nodeType !== "end") {
    // targetNode.linkedElement.classList.add("block")
    if (mouseBtn === "left") {
      if (e.ctrlKey) targetNode.updateNodeType("weighted")
      else targetNode.updateNodeType("block")
      board.boardStatus = "dirty"
    }
    // else if (mouseBtn === "right") targetNode.updateNodeType("unvisited-animate")
    else if (mouseBtn === "right" && targetNode.nodeType === "block") targetNode.updateNodeType("unvisited-2")
    else if (mouseBtn === "right" && targetNode.isWeighted) targetNode.updateNodeType("unvisited-3")
    // else if (mouseBtn === "right" && targetNode.isWeighted) targetNode.makeUnweighted()

  }
}


const handleRightClick = (e) => {
  e.preventDefault()

  return

  const nodeInfoCard = document.querySelector(".node-info-card");

  if (nodeInfoCard.dataset.infoCardActive === "true") {
    if (document.querySelector(".info-node-border")) {
      document.querySelector(".info-node-border").classList.remove("info-node-border")
    }
    nodeInfoCard.dataset.infoCardActive = "false"
  }
  else {
    e.target.classList.add("info-node-border")
    nodeInfoCard.dataset.infoCardActive = "true"
  }

  if (e.target.matches(".node")) {
    let neighborId = ""
    for (const neighbor of elementToNodeObject(e.target).neighbors) {
      neighborId = neighborId + " #" + neighbor.id;
    }
    // TODO convert it into card object to easly use or modify values
    nodeInfoCard.innerHTML = `<div class="list">
    <div class="row1">
      <span class="id-info info">#${elementToNodeObject(e.target).id}</span>
      <span class="node-type-info info">.${elementToNodeObject(e.target).nodeType}</span>
    </div>
    <div class="row2">
      <span class="label">node-weight:</span>
      <span class="value">${elementToNodeObject(e.target).nodeWeight}</span>
    </div>
    <div class="row3">
      <div class="label">neighbors:</div>
      <div class="neighbor-value-list"></div>
    </div>
    <div class="carot"></div>
    <div class="highlighter">
      <div class="corner top-right"></div>
      <div class="corner bottom-right"></div>
      <div class="corner bottom-left"></div>
      <div class="corner top-left"></div>
    </div>
  </div>`

    const neighborValueList = nodeInfoCard.querySelector(".neighbor-value-list");
    // console.log(elementToNodeObject(e.target).neighbor)
    for (const neighbor of elementToNodeObject(e.target).neighbors) {
      const span = document.createElement("span");
      span.classList.add("neighbor-value")
      span.innerText = "#" + neighbor.id
      neighborValueList.appendChild(span)
    }

    //   nodeInfoCard.innerHTML = `<ul>
    //   <li>#${elementToNodeObject(e.target).id}       .of #${board.rows}-${board.cols}</li>
    //   <li>.${elementToNodeObject(e.target).nodeType}</li>
    //   <li>In Weight: ${elementToNodeObject(e.target).nodeWeight}</li>
    //   <li>Neighbors: ${neighborId}</li>
    // </ul>`
  }
  nodeInfoCard.style.left = getOffset(e.target).left + e.target.offsetWidth + 10 + "px";
  nodeInfoCard.style.top = getOffset(e.target).top + "px";
}


boardGrid.addEventListener("contextmenu", e => {
  e.preventDefault()
})


function getOffset(el) {
  let elem = el;
  // console.log(el);
  // let rect = elem.getBoundingClientRect();
  // for (const key in rect) {
  //   if (typeof rect[key] !== 'function') {
  //     let para = document.createElement('p');
  //     para.textContent = `${key} : ${rect[key]}`;
  //     document.body.appendChild(para);
  //   }
  // }




  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}



//* linking maze algorithms


function handleMazeAlgo(mazeAlgoElement) {
  if (mazeAlgoElement.classList.contains("disabled")) return;

  disbaleElements()
  // document.querySelectorAll(".maze-algo").querySelectorAll(".dropdown-list-item").forEach((element) => {
  //   element.classList.add("disabled")
  // })

  let mazeAlgo = mazeAlgoElement.innerText
  console.log(mazeAlgo)


  board.boardState = "generatingMaze"
  board.resetBoardGridForMaze()
  // document.querySelector(':root').style.setProperty('--board-background', '#111111')

  if (mazeAlgo.toLowerCase() === "randomized kruskals") {
    document.querySelector(':root').style.setProperty('--board-background', '#111111')
    randomizedKruskals(board.boardGrid, resetBoardAfterMazeAnimation);
  }
  if (mazeAlgo.toLowerCase() === "randomized prims") {
    document.querySelector(':root').style.setProperty('--board-background', '#111111')
    board.resetBoardGridForMaze();
    randomizedPrims(board.startNode, board.boardGrid, resetBoardAfterMazeAnimation);
  }
  if (mazeAlgo.toLowerCase() === "randomized dfs") {
    document.querySelector(':root').style.setProperty('--board-background', '#111111')
    board.resetBoardGridForMaze();
    randomizedDfs(board.boardGrid, resetBoardAfterMazeAnimation);
  }
  if (mazeAlgo.toLowerCase() === "random blocks") {
    // board.resetBoardGridForMaze();
    randomBlocks(board.boardGrid)
    resetBoardAfterMazeAnimation()
    // randomizedPrims(board.startNode, board.boardGrid, resetBoardAfterMazeAnimation);
  }
  if (mazeAlgo.toLowerCase() === "random weights") {
    // board.resetBoardGridForMaze();
    randomWeights(board.boardGrid)
    resetBoardAfterMazeAnimation()
    // randomizedPrims(board.startNode, board.boardGrid, resetBoardAfterMazeAnimation);
  }

}

function resetBoardAfterMazeAnimation() {
  board.redrawSpecialNodes();
  board.boardState = "idle"

  // console.log(disabledElements)
  document.querySelectorAll(".disabled").forEach((element) => {
    element.classList.remove("disabled")
  })


  setTimeout(() => {
    document.querySelector(':root').style.setProperty('--board-background', '#ffffff')


    for (let row of board.boardGrid) {
      for (let node of row) {
        if (node.nodeType === "block") {
          // node.updateNodeType("block")
          // node.linkedElement.dataset.animationType = "animate";
        } else if (node.nodeType === "unvisited-animate") {
          // console.log(node.nodeType)
          // node.updateNodeType("unvisited")
          //! FIX THIS 
        }

      }
    }

  }, 750)
  // 750ms: It is the animation time of the unvisited node


  // document.querySelectorAll(".unvisited-animate").forEach(node => {
  //   node.classList.remove("unvisited-animate")
  //   node.classList.add("unvisited")
  // })


}



// const kruskalMazeAlgoButton = document.getElementById("randomizedKruskals");
// kruskalMazeAlgoButton.addEventListener("click", e => {
//   // randomizedKruskals(board.boardGrid);
// })
// const primsMazeAlgoButton = document.getElementById("randomizedPrims");
// primsMazeAlgoButton.addEventListener("click", e => {
//   // board.resetBoardGridForMaze();
//   // randomizedPrims(board.startNode, board.boardGrid);
// })

// // const bfsMazeAlgoButton = document.getElementById("randomizedBfs");
// // bfsMazeAlgoButton.addEventListener("click", e => {
// //   //   randomizedBfs();
// // })

// const dfsMazeAlgoButton = document.getElementById("randomizedDfs");
// dfsMazeAlgoButton.addEventListener("click", e => {
//   // randomizedDfs(board.boardGrid);
// })

// const randomizedBlocksButton = document.getElementById("randomizedBlocks");
// randomizedBlocksButton.addEventListener("click", e => {
//   console.log("randomizedBlocksButton")
// })
// const randomizedWeightsButton = document.getElementById("randomizedWeights");
// randomizedWeightsButton.addEventListener("click", e => {
//   console.log("randomizedWeightsButton")
// })


function toastMsg(msg) {
  document.querySelector(".toast").querySelector(".msg").innerText = msg
  document.querySelector(".toast").dataset.active = "true";

  setTimeout(() => {
    document.querySelector(".toast").dataset.active = "false";
  }, 3000);
}



handleKeyboardEvents(board);

function handleKeyboardEvents(board) {
  // document.addEventListener("click", e => {
  //   const target = e.target;
  // })


  document.addEventListener("keypress", e => {
    if (e.key === "i") {
      console.log("i is pressed")
    }
  })


  // document.addEventListener("keydown", e => {
  //   if (e.key === "i") {
  //     console.log("i is pressed down...")
  //   }
  // })

  document.addEventListener("keyup", e => {
    // console.log(e)
    if (e.key === "i") {
      console.log("i is not pressed anymore")
      console.log("Start Node: ", board.startNode)
      console.log("End Node: ", board.endNode)
      console.log("Checkpoint Node: ", board.cpoint)
    }
    if (e.key === "d") {
      console.log("d is pressed")
      drawInstantPath = true;
    }
    if (e.key === "f") {
      console.log("f is pressed")
      drawInstantPath = false;
    }
    if (e.key === "s") {
      console.log(`boardStatus: ${board.boardStatus}`)
    }
    if (e.key === "p") {
      board.boardStatus = "pure"
      console.log(`boardStatus: ${board.boardStatus}`)
    }
    if (e.key === "u") {
      board.updateNeighborsForPathAlgo();
    }
    if (e.key === "q") {
      console.log("q is pressed")
      toastMsg("this is a massage")
      // if (document.querySelector(".toast").dataset.active == "true") document.querySelector(".toast").dataset.active = "false"
      // else document.querySelector(".toast").dataset.active = "true"

      // document.querySelector(".toast").dataset.active = "true"
    }
    if (e.key === "o" && e.ctrlKey) {
      console.log("o is pressed")
      if (e.ctrlKey) {
        console.log("ctrlKey is pressed")
      }
    }
    if (e.ctrlKey) {
      console.log("ctrlKey is pressed with ", e.key)
    }
  })
}




//! OLD CODE

//* OLD NAV dropdown
// const dropdownList = document.querySelectorAll(".dropdown");
// for (let dropdown of dropdownList) {
//   dropdown.addEventListener("click", e => {
//     const activeDropdown = document.querySelector('[data-dropdown-active = "true"]');
//     if (activeDropdown == null) {
//       dropdown.dataset.dropdownActive = "true";
//     }
//     else {
//       if (e.target.closest(".dropdown") == activeDropdown) {
//         if (e.target.closest(".dropdown-list") && dropdown.matches(".speed-btn")) {
//           dropdown.querySelector(".dropdown-label").innerText = `Speed: ${e.target.innerText}`
//           board.speed = e.target.innerText.toLowerCase();
//         }
//         else if (dropdown.matches(".clear-board-btn")) {
//           if (e.target.innerText === "Clear paths") {
//             board.clearVisitedNodesAndUpdateBoardStatus()
//             // board.clearVisitedNodes()
//             // board.boardProperties.instantPath = false;
//           }
//         }
//         else {
//           dropdown.querySelector(".dropdown-label").innerText = e.target.innerText
//           if (dropdown.matches(".path-algo")) {
//             // board.selectedPathAlgo = e.target.innerText;
//           }
//           else if (dropdown.matches(".maze-algo")) {
//             board.selectedMazeAlgo = e.target.innerText;
//           }
//         }
//         activeDropdown.dataset.dropdownActive = "false";
//       }
//       else {
//         activeDropdown.dataset.dropdownActive = "false";
//         dropdown.dataset.dropdownActive = "true";
//       }
//     }
//   })
// }

