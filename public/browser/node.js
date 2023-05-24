

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
      this.updateNodeType("checkpoint")
    }

  }

  updateNodeType(newNodeType) {
    // if (newNodeType == this.nodeType) {
    //   this.linkedElement.dataset.animationType = "instant";
    // }
    this.handleNodeAnnimation(newNodeType)
    // if (!this.isWeighted) this.handleNodeAnnimation(newNodeType)
    if (this.isWeighted) {
      // this.linkedElement.dataset.animationType = "animate";
    }

    if (newNodeType === "weighted") {
      this.makeWeighted()
      // return
    }
    else {
      this.linkedElement.classList.remove(this.nodeType)
      if (newNodeType === "start" || newNodeType === "checkpoint" || newNodeType === "end" || newNodeType === "block") this.makeUnweighted();

      if (newNodeType === "unvisited-3" || newNodeType === "unvisited-2") this.makeUnweighted()

      this.nodeType = newNodeType;
      this.linkedElement.classList.add(newNodeType);
    }
    this.linkedElement.classList.remove("unweighted-visited")
    this.linkedElement.classList.remove("unweighted-visited-2")
    this.linkedElement.classList.remove("unweighted-path")
  }

  handleNodeAnnimation(newNodeType) {
    newNodeType = newNodeType.split("-")[0]
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


}

