

export default class Node {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.nodeType = "unvisited";
    this.nodeWeight = 1;
    this.neighbors = []
  }

  get id() {
    return `${this.row}-${this.col}`;
  }

  get linkedElement() {
    if (document.getElementById(this.id)) {
      return document.getElementById(this.id);
    }
    else {
      console.log(`Element with id:${this.id} does not exist`)
    }
  }

  get isWeighted() {
    return this.nodeWeight === 10;
  }

  makeWeighted() {
    if (!this.isWeighted && this.nodeType !== "block") {
      this.linkedElement.classList.add("weighted")
      this.nodeWeight = 10;
    }
  }

  makeUnweighted() {
    this.nodeWeight = 1;
    this.linkedElement.classList.remove("weighted")
    // this.linkedElement.innerHTML = "";
  }

  makeCheckpoint() {
    if (this.nodeType !== "checkpoint") {
      this.makeUnweighted()
      // this.nodeType = "checkpoint"
      this.updateNodeType("checkpoint")
    }

  }

  updateNodeType(newNodeType) {
    if (newNodeType == this.nodeType) {
      this.linkedElement.dataset.animationType = "instant";
    }
    this.handleNodeAnnimation(newNodeType)


    if (newNodeType === "weighted") {
      this.makeWeighted()
      // return
    }
    // if (newNodeType === "checkpoint"){
    //   this.makeCheckpoint()
    // }
    else {
      this.linkedElement.classList.remove(this.nodeType)
      if (newNodeType === "start" || newNodeType === "checkpoint" || newNodeType === "end" || newNodeType === "block") this.makeUnweighted();

      if (newNodeType === "unvisited-3" || newNodeType === "unvisited-2") this.makeUnweighted()

      this.nodeType = newNodeType;
      this.linkedElement.classList.add(newNodeType);
    }
  }

  handleNodeAnnimation(newNodeType) {
    newNodeType = newNodeType.split("-")[0]
    // if (newNodeType === "block" || newNodeType === "visited" || newNodeType === "path") {
    if (newNodeType === "block" || newNodeType === "weighted" || newNodeType === "visited" || newNodeType === "path") {
      this.linkedElement.dataset.animationType = "animate";
    }
    else if (newNodeType.includes("animate")) {
      this.linkedElement.dataset.animationType = "animate";
    }
    else {
      this.linkedElement.dataset.animationType = "instant";
    }
  }


  updateNodeTypeInstant(newNodeType) {
    this.linkedElement.classList.remove(this.nodeType)
    this.nodeType = newNodeType;

    this.linkedElement.dataset.animationType = "instant";
    this.linkedElement.classList.add(newNodeType);
  }


  // makeWeighted() {
  //   if (!this.isWeighted && this.nodeType !== "block") {
  //     this.linkedElement.classList.add("weighted")
  //     // const div = document.createElement("div")
  //     // div.classList.add("special-node-decoration")
  //     // div.classList.add("weighted-decoration")

  //     // this.linkedElement.appendChild(div)
  //     this.nodeWeight = 10;
  //   }
  // }

  // resolveNodeDecoration(newNodeType) {
  //   // Removing previous decoration
  //   if (this.newNodeType !== "weighted") {
  //     this.linkedElement.innerHTML = "";
  //   }

  //   // Adding new decoration
  //   if (newNodeType === "weighted") {
  //     const div = document.createElement("div")
  //     div.classList.add("special-node-decoration")
  //     div.classList.add("weighted-decoration")

  //     this.linkedElement.appendChild(div)
  //   }

  // }

  // oldupdateNodeType(newNodeType) {
  //   if (newNodeType !== "weighted") {
  //     this.linkedElement.classList.remove(this.nodeType)
  //   }
  //   this.resolveNodeDecoration(newNodeType)

  //   if (newNodeType === "block" || newNodeType === "weighted" || newNodeType === "visited" || newNodeType === "path") {
  //     this.linkedElement.dataset.animationType = "animate";
  //   }
  //   else {
  //     this.linkedElement.dataset.animationType = "instant";
  //   }

  //   if (newNodeType === "weighted") {
  //     this.makeWeighted()
  //     // this.nodeType = `${this.nodeType}-weighted`
  //   } else {
  //     this.nodeType = newNodeType;
  //   }
  //   this.linkedElement.classList.add(newNodeType);
  // }


  //! This is now done in board in updateNeighborsForPathAlgo()

  // updateNeighbors(boardGrid) {
  //   // console.log("updated neighbors")
  //   this.neighbors = [];

  //   // top neighbor
  //   if (this.row > 0 && boardGrid[this.row - 1][this.col].nodeType !== "block") {
  //     this.neighbors.push(boardGrid[this.row - 1][this.col])
  //   }

  //   // right neighbor
  //   if (this.col < COLS - 1 && boardGrid[this.row][this.col + 1].nodeType !== "block") {
  //     this.neighbors.push(boardGrid[this.row][this.col + 1])
  //   }

  //   // bottom neighbor
  //   if (this.row < ROWS - 1 && boardGrid[this.row + 1][this.col].nodeType !== "block") {
  //     this.neighbors.push(boardGrid[this.row + 1][this.col])
  //   }

  //   // left neighbor
  //   if (this.col > 0 && boardGrid[this.row][this.col - 1].nodeType !== "block") {
  //     this.neighbors.push(boardGrid[this.row][this.col - 1])
  //   }

  // }

}

