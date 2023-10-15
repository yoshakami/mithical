function formatDifficulty(difficulty, difficultyInternal) {
  if (difficultyInternal) {
    return difficulty;
  } else {
    if (difficulty % 1 > 0.6) {
      return `${Math.floor(difficulty)}+`;
    } else {
      return Math.floor(difficulty);
    }
  }
}

export { formatDifficulty };
