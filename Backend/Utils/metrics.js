class PDAMetrics {
  constructor() {
    this.startTime = performance.now();
    this.totalTransitions = 0;
    this.maxStackDepth = 0;
  }

  updateStackDepth(stack) {
    if (stack.length > this.maxStackDepth) {
      this.maxStackDepth = stack.length;
    }
  }

  incrementTransition() {
    this.totalTransitions += 1;
  }

  finalize() {
    const endTime = Date.now();
    return {
      totalTransitions: this.totalTransitions,
      maxStackDepth: this.maxStackDepth,
      timeTakenMs: endTime - this.startTime,
    };
  }
}

module.exports = PDAMetrics;
