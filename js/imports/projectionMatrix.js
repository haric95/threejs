export class orthoMatrix {
  constructor() {
    this.values = math.matrix([
      [1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0]
    ]);
  }
}

export class stereoMatrix {
  constructor(k) {
    this.values = math.matrix([
      [k, 0, 0, 0, 0],
      [0, k, 0, 0, 0],
      [0, 0, k, 0, 0]
    ]);
  }
}
