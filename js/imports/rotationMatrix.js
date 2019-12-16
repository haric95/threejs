export class rotationMatrix2d {
  constructor(rate, axis0, axis1) {
    let preMatrix = [];
    for (let i = 0; i < 5; i++) {
      let row = [0, 0, 0, 0, 0];
      row[i] = 1;
      preMatrix.push(row);
    }
    let positions = [
      [axis0, axis0],
      [axis0, axis1],
      [axis1, axis0],
      [axis1, axis1]
    ];
    let functions = [
      Math.cos(rate),
      -Math.sin(rate),
      Math.sin(rate),
      Math.cos(rate)
    ];
    for (let i = 0; i < positions.length; i++) {
      preMatrix[positions[i][0]][positions[i][1]] = functions[i];
    }
    this.values = math.matrix(preMatrix);
  }
}
