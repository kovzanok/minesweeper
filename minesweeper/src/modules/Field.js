export default class Field {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty;
    this.size = this.getSizeFromDifficulty();
  }

  getSizeFromDifficulty() {
    switch (this.difficulty) {
      case 'easy':
        return 10;
      case 'medium':
        return 15;
      case 'hard':
        return 25;
      default:
        return 15;
    }
  }

  renderField() {
    const field = document.createElement('div');
    field.className = `field field_${this.difficulty}`;
    field.id = 'field';
    for (let i = 0; i < this.size * this.size; i += 1) {
      const cell = Field.renderCell();
      field.append(cell);
    }
    return field;
  }

  static renderCell() {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.setAttribute('status', 'hidden');
    return cell;
  }
}
