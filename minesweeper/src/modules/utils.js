export function convertTextToId(text) {
  return text.toLowerCase().split(' ').join('-');
}

export function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

export function getDifficultyFromFieldClass(fieldClassName) {
  if (fieldClassName.includes('easy')) return 'easy';
  if (fieldClassName.includes('medium')) return 'medium';
  return 'hard';
}

export function getTimeAndMoves() {
  const time = document.getElementById('time').textContent;
  const moves = document.getElementById('moves').textContent;
  return [time, moves];
}
