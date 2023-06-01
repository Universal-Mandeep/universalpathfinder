import Board from "./Board.js"
import randomizedPrims, { randomizedDfs, randomizedKruskals, randomBlocks, randomWeights } from "./mazeAlgo/randomizedAlgo.js";

// initialization
const board = new Board(19, 50);
board.init();


//* nav bar events
const dropdownList = document.querySelectorAll(".dropdown")
dropdownList.forEach(dropdown => {
  dropdown.addEventListener("click", e => {
    const activeDropdown = document.querySelector('[data-dropdown-active = "true"]');

    closeInfoCard()
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
          handleMazeAlgo(e.target);
        }
        else if (e.target.closest(".path-algo")) {
          dropdown.querySelector(".dropdown-label").getElementsByTagName("span")[0].innerText = e.target.innerText
          board.selectedPathAlgo = e.target.id;
        }
        else if (e.target.closest(".clear-board-btn")) {
          handleClearDropdown(e.target)
        }
      }
      activeDropdown.dataset.dropdownActive = "false";
    }
  })
})

function closeAllDropdown(notCloseInfoCard = false) {
  const activeDropdownList = document.querySelectorAll('[data-dropdown-active = "true"]');
  for (let activeDropdown of activeDropdownList) {
    activeDropdown.dataset.dropdownActive = "false";
  }
  // if (!notCloseInfoCard) closeInfoCard()
}

function closeDropdownAndInfoCard() {
  closeAllDropdown();
  closeInfoCard();
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
  closeDropdownAndInfoCard()
  disbaleElements();
  board.visualizePathAlgo()
})

function handleSkip() {
  board._skipAnimation = true;

  setTimeout(() => {
    let skipBtn = document.querySelector(".skip-btn")
    skipBtn.dataset.active = "false"
    board._skipAnimation = false;
  }, 100)
}

document.querySelector("nav").addEventListener("click", (e) => {
  // console.log(e.target)
  if (e.target.classList.contains("nav-items")) {
    // console.log("nav background")
    closeDropdownAndInfoCard();
  }
})

document.querySelector(".skip-btn").addEventListener("click", handleSkip)


function disbaleElements() {
  const checkpointButton = document.querySelector(".checkpoint-btn");
  const diagonalButton = document.querySelector(".diagonal-btn");

  let mazeList = document.querySelector(".maze-algo").querySelectorAll(".dropdown-list-item");
  let clearList = document.querySelector(".clear-board-btn").querySelectorAll(".dropdown-list-item");

  let disbaleList = [
    board.startNode.linkedElement, board.endNode.linkedElement,
    checkpointButton, diagonalButton, ...mazeList, ...clearList]
  if (board.cpoint) disbaleList.push(board.cpoint.linkedElement)


  disbaleList.forEach((element) => {
    element.classList.add("disabled")
  })
}

const checkpointButton = document.querySelector(".checkpoint-btn");
checkpointButton.addEventListener("click", e => {
  closeDropdownAndInfoCard();
  // if (checkpointButton.classList.contains("disabled")) return;
  if (board.boardState != "idle") return;

  board.toggleCheckpoint();

  // visual toggle of checkpoint btn
  if (checkpointButton.dataset.active === "false") checkpointButton.dataset.active = "true"
  else checkpointButton.dataset.active = "false"

  if (board.selectedPathAlgo != null) {
    board.visualizePathAlgo("instant")
  }
})


const diagonalButton = document.querySelector(".diagonal-btn");
diagonalButton.addEventListener("click", e => {
  closeDropdownAndInfoCard();
  if (board.boardState != "idle") return;

  if (board.boardProperties.hasDiagonalPathMovement) {
    board.boardProperties.hasDiagonalPathMovement = false;
    diagonalButton.dataset.active = "false";
  } else {
    board.boardProperties.hasDiagonalPathMovement = true;
    diagonalButton.dataset.active = "true";
  }

  if (board.selectedPathAlgo != null) board.visualizePathAlgo("instant")
})


const speedvalues = document.querySelectorAll(".speed-value");
speedvalues.forEach(speedvalue => {
  speedvalue.addEventListener("click", e => {
    closeDropdownAndInfoCard();
    if (!speedvalue.classList.contains("selected")) {
      document.querySelector(".speed-value.selected").classList.remove("selected");
      speedvalue.classList.add("selected");

      board.setPathAlgoSpeed(Number(e.target.innerText))
    }
  })
});


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
      }
    }
    else if (e.target.classList.contains("heading-link")) {
      document.getElementById(e.target.dataset.linkto).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
    }

  }
  else if (e.target.closest(".info-btn") && !e.target.closest(".info-card")) {
    if (infoCard.dataset.open === "true") infoCard.dataset.open = "false"
    else infoCard.dataset.open = "true"
    closeAllDropdown(true)

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
      <div class="heading">Randomized Kruskal's Algorithm</div>
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
      <div class="heading">Randomized Prim's Algorithm</div>
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

let mouseBtn = "left"
let boardGrid = document.getElementById("board-grid");
boardGrid.addEventListener("mousedown", e => {

  closeDropdownAndInfoCard()
  e.preventDefault()
  if (board.boardState == "generatingMaze") {
    board.toastMsg("Wait for Maze Generation to finish !")
    return false;
  }
  else if (board.boardState != "idle") {
    board.toastMsg("Wait for animation to finish or skip")
    return false;
  }


  if (e.button == 0) {
    mouseBtn = "left"
  }
  if (e.button == 2) {
    mouseBtn = "right"
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
    if (mouseBtn === "right") {

      if (board.boardGrid[nodeRow][nodeCol].nodeType === "block") board.boardGrid[nodeRow][nodeCol].updateNodeType("unvisited-2")
      else if (board.boardGrid[nodeRow][nodeCol].isWeighted) {
        if (board.boardGrid[nodeRow][nodeCol].nodeType === "visited") {
          board.boardGrid[nodeRow][nodeCol].linkedElement.classList.add("unweighted-visited")
          board.boardGrid[nodeRow][nodeCol].makeUnweighted()
        }
        else if (board.boardGrid[nodeRow][nodeCol].nodeType === "visited-2") {
          board.boardGrid[nodeRow][nodeCol].linkedElement.classList.add("unweighted-visited-2")
          board.boardGrid[nodeRow][nodeCol].makeUnweighted()
        }
        else if (board.boardGrid[nodeRow][nodeCol].nodeType === "path") {
          board.boardGrid[nodeRow][nodeCol].linkedElement.classList.add("unweighted-path")
          board.boardGrid[nodeRow][nodeCol].makeUnweighted()
        }

        else board.boardGrid[nodeRow][nodeCol].updateNodeType("unvisited-3")
      }
    }
  }

  for (let node of nodes) {
    node.addEventListener("mouseover", nodeMouseOverEvent, e)
  }
})

document.addEventListener("mouseup", e => {
  const nodes = [...boardGrid.querySelectorAll(".node")]

  for (let node of nodes) {
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


function nodeMouseOverEvent(e) {
  if (board.boardState != "idle") return;

  const targetRow = e.target.id.split("-")[0];
  const targetCol = e.target.id.split("-")[1];
  const targetNode = board.boardGrid[targetRow][targetCol];

  if (board.nodeDrag.startNode) {
    if (targetNode.nodeType !== "end" && targetNode.nodeType !== "checkpoint") {
      board.startNode.linkedElement.classList.remove("grabbing");

      board.setStartNode(targetNode);
      targetNode.linkedElement.classList.add("grabbing");

      if (document.querySelector(".visited") != null
        || document.querySelector(".visited-2") != null
        || document.querySelector(".path") != null) board.visualizePathAlgo("instant")

    }
  }
  if (board.nodeDrag.checkpointNode) {
    if (targetNode.nodeType !== "start" && targetNode.nodeType !== "end") {
      board.cpoint.linkedElement.classList.remove("grabbing");

      board.setCheckpointNode(targetNode)
      targetNode.linkedElement.classList.add("grabbing");

      if (document.querySelector(".visited") != null
        || document.querySelector(".visited-2") != null
        || document.querySelector(".path") != null) board.visualizePathAlgo("instant")

    }
  }
  if (board.nodeDrag.endNode) {
    if (targetNode.nodeType !== "start" && targetNode.nodeType !== "checkpoint") {
      board.endNode.linkedElement.classList.remove("grabbing");

      board.setEndNode(targetNode);
      targetNode.linkedElement.classList.add("grabbing");

      if (document.querySelector(".visited") != null
        || document.querySelector(".visited-2") != null
        || document.querySelector(".path") != null) board.visualizePathAlgo("instant")

    }
  }

  if (targetNode.nodeType !== "start" && targetNode.nodeType !== "checkpoint" && targetNode.nodeType !== "end") {
    if (mouseBtn === "left") {
      if (e.ctrlKey) targetNode.updateNodeType("weighted")
      else targetNode.updateNodeType("block")
      board.boardStatus = "dirty"
    }
    else if (mouseBtn === "right") {

      if (targetNode.nodeType === "block") targetNode.updateNodeType("unvisited-2")
      else if (targetNode.nodeType === "visited" && targetNode.isWeighted) {
        targetNode.linkedElement.classList.add("unweighted-visited")
        targetNode.makeUnweighted()
      }
      else if (targetNode.nodeType === "visited-2" && targetNode.isWeighted) {
        targetNode.linkedElement.classList.add("unweighted-visited-2")
        targetNode.makeUnweighted()
      }
      else if (targetNode.nodeType === "path" && targetNode.isWeighted) {
        targetNode.linkedElement.classList.add("unweighted-path")
        targetNode.makeUnweighted()
      }

      else if (targetNode.isWeighted) targetNode.updateNodeType("unvisited-3")
    }
  }
}


boardGrid.addEventListener("contextmenu", e => {
  e.preventDefault()
})


//* linking maze algorithms
function handleMazeAlgo(mazeAlgoElement) {
  if (mazeAlgoElement.classList.contains("disabled")) return;
  disbaleElements()

  let mazeAlgo = mazeAlgoElement.innerText
  board.boardState = "generatingMaze"
  board.resetBoardGridForMaze()

  if (mazeAlgo.toLowerCase() === "randomized kruskals") {
    document.querySelector(':root').style.setProperty('--board-background', '#111111')
    randomizedKruskals(board.boardGrid, resetBoardAfterMazeAnimation);
  }
  if (mazeAlgo.toLowerCase() === "randomized prims") {
    document.querySelector(':root').style.setProperty('--board-background', '#111111')
    randomizedPrims(board.startNode, board.boardGrid, resetBoardAfterMazeAnimation);
  }
  if (mazeAlgo.toLowerCase() === "randomized dfs") {
    document.querySelector(':root').style.setProperty('--board-background', '#111111')
    randomizedDfs(board.boardGrid, resetBoardAfterMazeAnimation);
  }
  if (mazeAlgo.toLowerCase() === "random blocks") {
    randomBlocks(board.boardGrid)
    resetBoardAfterMazeAnimation()
  }
  if (mazeAlgo.toLowerCase() === "random weights") {
    randomWeights(board.boardGrid)
    resetBoardAfterMazeAnimation()
  }
}

function resetBoardAfterMazeAnimation() {
  board.redrawSpecialNodes();
  board.boardState = "idle"

  document.querySelectorAll(".disabled").forEach((element) => {
    element.classList.remove("disabled")
  })

  setTimeout(() => {
    document.querySelector(':root').style.setProperty('--board-background', '#ffffff')
  }, 750)
  // 750ms: It is the animation time of the unvisited node
}

// A few key binding for quick testing...
document.addEventListener("keyup", e => {
  if (e.key === "i") {
    handleSkip()
  }
  if (e.key === "k") {
    document.querySelector(':root').style.setProperty('--board-background', '#111111')
    board.resetBoardGridForMaze()

    randomizedKruskals(board.boardGrid, resetBoardAfterMazeAnimation);
  }
  if (e.key === "v") {
    closeDropdownAndInfoCard();
    disbaleElements()
    board.visualizePathAlgo()
  }
  if (e.key === "a") {
    closeDropdownAndInfoCard();
    disbaleElements()
    board.selectedPathAlgo = "astar"
    board.visualizePathAlgo()
  }
})
