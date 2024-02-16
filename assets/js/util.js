function formatDifficulty(difficulty, difficultyInternal, includeZero = false) {
  if (difficultyInternal) {
    if (includeZero) {
      return difficulty.toFixed(1);
    } else {
      return difficulty;
    }
  } else {
    if (difficulty % 1 > 0.6) {
      return Math.floor(difficulty) + "+";
    } else {
      return Math.floor(difficulty);
    }
  }
}

export { formatDifficulty };
