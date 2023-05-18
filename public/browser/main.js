// import my from "/node.js"
// import "./node.js"
import Board from "./Board.js"
import randomizedPrims, { randomizedDfs, randomizedKruskals } from "./mazeAlgo/randomizedAlgo.js";
import dijkstra, { aStar } from "./pathAlgo/weightedAlgo.js";


// import aStar from "./pathAlgo/weightedAlgo.js";


// initialization
const board = new Board(19, 50);
board.init();

// board.boardGrid[9][10].updateNodeType("start")
// board.setStartNode(board.boardGrid[9][10])

// console.log(board.boardGrid)

// board.boardGrid[9][40].updateNodeType("end")
// board.setEndNode(board.boardGrid[9][40])
// board.setEndNode(board.boardGrid[11][40])



//* updated main.js

function closeAllDropdown() {
  const activeDropdownList = document.querySelectorAll('[data-dropdown-active = "true"]');
  // console.log(activeDropdownList)
  for (let activeDropdown of activeDropdownList) {
    activeDropdown.dataset.dropdownActive = "false";
  }
}


//* nav bar events



// const pathAlgoDropdown = document.querySelector(".path-algo")
// pathAlgoDropdown.addEventListener("click", e => {
//   const activeDropdown = document.querySelector('[data-dropdown-active = "true"]');
//   if (activeDropdown == null) {
//     pathAlgoDropdown.dataset.dropdownActive = "true";
//   }
//   else if (e.target.closest(".dropdown") != activeDropdown) {
//     activeDropdown.dataset.dropdownActive = "false";
//     pathAlgoDropdown.dataset.dropdownActive = "true";
//   }
//   else {
//     if (e.target.closest(".dropdown") == activeDropdown && e.target.closest(".dropdown-list")) {
//       pathAlgoDropdown.querySelector(".dropdown-label").getElementsByTagName("span")[0].innerText = e.target.innerText
//       board.selectedPathAlgo = e.target.innerText;
//     }
//     activeDropdown.dataset.dropdownActive = "false";
//   }
// })


// const mazeAlgoDropdown = document.querySelector(".maze-algo")
// mazeAlgoDropdown.addEventListener("click", e => {
//   const activeDropdown = document.querySelector('[data-dropdown-active = "true"]');

//   if (activeDropdown == null) {
//     mazeAlgoDropdown.dataset.dropdownActive = "true";
//   }
//   else if (e.target.closest(".dropdown") != activeDropdown) {
//     activeDropdown.dataset.dropdownActive = "false";
//     mazeAlgoDropdown.dataset.dropdownActive = "true";
//   }
//   else {
//     if (e.target.closest(".dropdown") == activeDropdown && e.target.closest(".dropdown-list")) {
//       mazeAlgoDropdown.querySelector(".dropdown-label").getElementsByTagName("span")[0].innerText = e.target.innerText
//       board.selectedMazeAlgo = e.target.innerText;
//     }
//     activeDropdown.dataset.dropdownActive = "false";
//   }
// })



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
          dropdown.querySelector(".dropdown-label").getElementsByTagName("span")[0].innerText = e.target.innerText
          board.selectedMazeAlgo = e.target.innerText;
          handleMazeAlgo(e.target.innerText);
        }
        else if (e.target.closest(".path-algo")) {
          dropdown.querySelector(".dropdown-label").getElementsByTagName("span")[0].innerText = e.target.innerText
          board.selectedPathAlgo = e.target.innerText;
        }
        else if (e.target.closest(".clear-board-btn")) {
          handleClearDropdown(e.target.innerText)
        }
      }
      activeDropdown.dataset.dropdownActive = "false";
    }
  })
})


function handleClearDropdown(clearType) {
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
  board.visualizePathAlgo()
})


//* nav btn integrations

// checkpoint DONE
const checkpointButton = document.querySelector(".checkpoint-btn");
checkpointButton.addEventListener("click", e => {
  board.toggleCheckpoint();

  // visual toggle of checkpoint btn
  if (checkpointButton.dataset.active === "false") checkpointButton.dataset.active = "true"
  else checkpointButton.dataset.active = "false"

  board.visualizePathAlgo("instant")
})


// TODO move the working to the addDiagonalButton in Board.js
const diagonalButton = document.querySelector(".diagonal-btn");
diagonalButton.addEventListener("click", e => {
  if (board.boardProperties.hasDiagonalPathMovement) {
    board.boardProperties.hasDiagonalPathMovement = false;
    diagonalButton.dataset.active = "false";
  } else {
    board.boardProperties.hasDiagonalPathMovement = true;
    diagonalButton.dataset.active = "true";
  }
  // console.log(`boardProperties: `, board.boardProperties)
  // console.log(`Diagonal: ${board.boardProperties.hasDiagonalPathMovement}`)

  // board.drawInstatPathAlgo()
  board.visualizePathAlgo("instant")
})



// helper functions
function elementToNodeObject(element) {
  const targetRow = element.id.split("-")[0];
  const targetCol = element.id.split("-")[1];
  return board.boardGrid[targetRow][targetCol];
}




//* speed controls DONE
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





//* handle board events

// let startNode = board.startNode.linkedElement;
// let endNode = board.endNode.linkedElement;

let drawInstantPath = false;


let boardGrid = document.getElementById("board-grid");
boardGrid.addEventListener("mousedown", e => {
  // dont perform the mousedown on right mouse button
  e.preventDefault()

  if (e.button == 2) {
    handleRightClick(e)
    return;
  }

  const nodes = [...boardGrid.querySelectorAll(".node")]

  if (e.target.matches(".start")) {
    board.nodeDrag.startNode = true;
    board.startNode.linkedElement.classList.add("grabbing")
  }
  if (e.target.matches(".checkpoint")) {
    board.nodeDrag.checkpointNode = true;
    // console.log(board.cpoint.linkedElement)
    board.cpoint.linkedElement.classList.add("grabbing")
    // console.log(board.cpoint.linkedElement)
  }
  if (e.target.matches(".end")) {
    board.nodeDrag.endNode = true;
    board.endNode.linkedElement.classList.add("grabbing")
  }

  if (e.target.matches(".node") && !e.target.matches(".start") && !e.target.matches(".checkpoint") && !e.target.matches(".end")) {
    const nodeRow = e.target.id.split("-")[0];
    const nodeCol = e.target.id.split("-")[1];
    if (e.ctrlKey == true) {
      board.boardGrid[nodeRow][nodeCol].updateNodeType("weighted");
    } else {
      board.boardGrid[nodeRow][nodeCol].updateNodeType("block");
      board.boardStatus = "dirty"
    }
  }

  for (let node of nodes) {
    node.addEventListener("mouseover", nodeMouseOverEvent, e)
  }
  // console.log(board.cpoint)
})

document.addEventListener("mouseup", e => {
  // boardGrid.addEventListener("mouseup", e => {

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
  const targetRow = e.target.id.split("-")[0];
  const targetCol = e.target.id.split("-")[1];
  const targetNode = board.boardGrid[targetRow][targetCol];

  if (board.nodeDrag.startNode) {
    if (targetNode.nodeType !== "end") {
      board.startNode.linkedElement.classList.remove("grabbing");

      // if (targetNode.nodeType === "block") {
      //   targetNode.updateNodeType("unvisited")
      // }

      board.setStartNode(targetNode);
      targetNode.linkedElement.classList.add("grabbing");

      board.visualizePathAlgo("instant")
      // if (drawInstantPath) {
      //   console.log("draw Instant path")
      //   // board.drawInstatPathAlgo()
      //   board.visualizePathAlgo()
      // }
    }
  }
  if (board.nodeDrag.checkpointNode) {
    if (targetNode.nodeType !== "start" && targetNode.nodeType !== "end") {
      board.cpoint.linkedElement.classList.remove("grabbing");

      // if (targetNode.nodeType === "block") {
      //   targetNode.updateNodeType("unvisited")
      // }

      // board.setStartNode(targetNode);
      // targetNode.makeCheckpoint()
      // board.cpoint = targetNode;
      board.setCheckpointNode(targetNode)
      targetNode.linkedElement.classList.add("grabbing");

      board.visualizePathAlgo("instant")

      // if (drawInstantPath) {
      //   console.log("draw Instant path")
      //   board.drawInstatPathAlgo()
      // }
    }
  }
  if (board.nodeDrag.endNode) {
    if (targetNode.nodeType !== "start") {
      board.endNode.linkedElement.classList.remove("grabbing");

      // if (targetNode.nodeType === "block") {
      //   targetNode.updateNodeType("unvisited")
      // }

      board.setEndNode(targetNode);
      targetNode.linkedElement.classList.add("grabbing");

      board.visualizePathAlgo("instant")
      // if (drawInstantPath) {
      //   console.log("draw Instant path")
      //   board.drawInstatPathAlgo()
      // }
    }
  }

  if (targetNode.nodeType !== "start" && targetNode.nodeType !== "checkpoint" && targetNode.nodeType !== "end") {
    // targetNode.linkedElement.classList.add("block")
    if (e.ctrlKey) {
      targetNode.updateNodeType("weighted")
    } else {
      targetNode.updateNodeType("block")
    }
    board.boardStatus = "dirty"
  }
}


const handleRightClick = (e) => {
  e.preventDefault()

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
// boardGrid.addEventListener("contextmenu", e => {
//   e.preventDefault()

//   const nodeInfoCard = document.querySelector(".node-info-card");
//   // console.log(nodeInfoCard)
//   // console.log(nodeInfoCard.offset)
//   // console.log(nodeInfoCard.offsetLeft, nodeInfoCard.offsetTop)
//   // console.log()

//   if (nodeInfoCard.dataset.infoCardActive === "true") {
//     if (document.querySelector(".info-node-border")) {
//       // console.log(document.querySelector(".info-node-border"))
//       document.querySelector(".info-node-border").classList.remove("info-node-border")

//     }

//     nodeInfoCard.dataset.infoCardActive = "false"
//   }
//   else {
//     e.target.classList.add("info-node-border")
//     nodeInfoCard.dataset.infoCardActive = "true"
//   }
//   // TODO Turn this to held down... while the right click is being pressed

//   if (e.target.matches(".node")) {
//     // console.log(e.target.offsetLeft)
//     // console.log(nodeInfoCard.offsetWidth)

//     // console.log(getOffset(e.target).left)
//   }
//   // console.log(e)
//   // nodeInfoCard.style.left = `${e.clientX + 2}px`
//   // nodeInfoCard.style.top = `${e.clientY + 2}px`

//   nodeInfoCard.style.left = getOffset(e.target).left + e.target.offsetWidth + 2 + "px";
//   nodeInfoCard.style.top = getOffset(e.target).top + "px";


//   // console.log(getOffset(nodeInfoCard))
// })


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


function handleMazeAlgo(mazeAlgo) {
  console.log(mazeAlgo)
  board.resetBoardGridForMaze()
  document.querySelector(':root').style.setProperty('--board-background', '#111111')

  if (mazeAlgo.toLowerCase() === "randomized kruskals") {
    randomizedKruskals(board.boardGrid, resetBoardColor);
  }
  if (mazeAlgo.toLowerCase() === "randomized prims") {
    board.resetBoardGridForMaze();
    randomizedPrims(board.startNode, board.boardGrid, resetBoardColor);

  }
}

function resetBoardColor() {
  board.redrawSpecialNodes();
  setTimeout(() => {
    document.querySelector(':root').style.setProperty('--board-background', '#ffffff')
  }, 750)
  // 750ms: It is the animation time of the unvisited node
}



const kruskalMazeAlgoButton = document.getElementById("randomizedKruskals");
kruskalMazeAlgoButton.addEventListener("click", e => {
  // randomizedKruskals(board.boardGrid);
})
const primsMazeAlgoButton = document.getElementById("randomizedPrims");
primsMazeAlgoButton.addEventListener("click", e => {
  // board.resetBoardGridForMaze();
  // randomizedPrims(board.startNode, board.boardGrid);
})

const bfsMazeAlgoButton = document.getElementById("randomizedBfs");
bfsMazeAlgoButton.addEventListener("click", e => {
  //   randomizedBfs();
})

const dfsMazeAlgoButton = document.getElementById("randomizedDfs");
dfsMazeAlgoButton.addEventListener("click", e => {
  // randomizedDfs(board.boardGrid);
})

const randomizedBlocksButton = document.getElementById("randomizedBlocks");
randomizedBlocksButton.addEventListener("click", e => {
  console.log("randomizedBlocksButton")
})
const randomizedWeightsButton = document.getElementById("randomizedWeights");
randomizedWeightsButton.addEventListener("click", e => {
  console.log("randomizedWeightsButton")
})




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

