import { rotationMatrix2d } from "./rotationMatrix.js";
import { orthoMatrix, stereoMatrix } from "./projectionMatrix.js";
import { joinTesseract } from "./joinFace.js";

export class tesseract {
  constructor(size) {
    this.size = size;
    this.vertices3d = [];
    this.unitvertices4d = [];
    this.vertices4d = [];
    this.tessEdges = [];
    this.tessFaces = [];

    // Create unit vertices
    this.unitvertices4d[0] = [-1, -1, -1, -1, 1];
    this.unitvertices4d[1] = [1, -1, -1, -1, 1];
    this.unitvertices4d[2] = [1, 1, -1, -1, 1];
    this.unitvertices4d[3] = [-1, 1, -1, -1, 1];
    this.unitvertices4d[4] = [-1, -1, 1, -1, 1];
    this.unitvertices4d[5] = [1, -1, 1, -1, 1];
    this.unitvertices4d[6] = [1, 1, 1, -1, 1];
    this.unitvertices4d[7] = [-1, 1, 1, -1, 1];
    this.unitvertices4d[8] = [-1, -1, -1, 1, 1];
    this.unitvertices4d[9] = [1, -1, -1, 1, 1];
    this.unitvertices4d[10] = [1, 1, -1, 1, 1];
    this.unitvertices4d[11] = [-1, 1, -1, 1, 1];
    this.unitvertices4d[12] = [-1, -1, 1, 1, 1];
    this.unitvertices4d[13] = [1, -1, 1, 1, 1];
    this.unitvertices4d[14] = [1, 1, 1, 1, 1];
    this.unitvertices4d[15] = [-1, 1, 1, 1, 1];

    let someCubes = joinTesseract(
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15
    );
    console.log(someCubes);

    for (let cube of someCubes) {
      for (let quad of cube) {
        for (let tri of quad) {
          this.tessFaces.push(tri);
        }
      }
    }

    let edge = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.tessEdges[edge] = [i * 4 + j, i * 4 + ((j + 1) % 4)];
        edge++;
      }
    }
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 4; j++) {
        this.tessEdges[edge] = [i * 8 + j, i * 8 + j + 4];
        edge++;
      }
    }
    for (let i = 0; i < 8; i++) {
      this.tessEdges[edge] = [i, i + 8];
      edge++;
    }

    // this.tessFaces[0] = [0, 1, 2];
    // this.tessFaces[1] = [0, 2, 3];
    // this.tessFaces[2] = [4, 5, 6];
    // this.tessFaces[3] = [4, 6, 7];
    // this.tessFaces[4] = [0, 3, 7];
    // this.tessFaces[5] = [0, 4, 7];
    // this.tessFaces[6] = [1, 2, 5];
    // this.tessFaces[7] = [2, 5, 6];
    // this.tessFaces[8] = [2, 3, 7];
    // this.tessFaces[9] = [2, 6, 7];
    // this.tessFaces[10] = [0, 1, 4];
    // this.tessFaces[11] = [1, 4, 5];
    // this.tessFaces[12] = [8, 9, 10];
    // this.tessFaces[13] = [8, 10, 11];
    // this.tessFaces[14] = [12, 13, 14];
    // this.tessFaces[15] = [12, 14, 15];
    // this.tessFaces[16] = [8, 11, 15];
    // this.tessFaces[17] = [8, 12, 15];
    // this.tessFaces[18] = [9, 10, 13];
    // this.tessFaces[19] = [10, 13, 14];
    // this.tessFaces[20] = [10, 11, 15];
    // this.tessFaces[21] = [10, 14, 15];
    // this.tessFaces[22] = [8, 9, 12];
    // this.tessFaces[23] = [9, 12, 13];
    // this.tessFaces[24] = [0, 4, 12];
    // this.tessFaces[25] = [0, 8, 12];
    // this.tessFaces[26] = [4, 7, 12];
    // this.tessFaces[27] = [7, 12, 15];
    // this.tessFaces[28] = [3, 7, 11];
    // this.tessFaces[29] = [7, 11, 15];
    // this.tessFaces[28] = [0, 8, 11];
    // this.tessFaces[29] = [0, 11, 15];
    // Map them to the right size
    for (let corner of this.unitvertices4d) {
      this.vertices4d.push(corner.map(x => x * this.size));
    }
  }

  // Projections to use map function??
  // Stereographic projecton to 3d
  stereo_project(K) {
    this.vertices3d = [];
    for (let corner of this.vertices4d) {
      let k = 1 / (K - corner[3] / this.size);
      let a_stereo_matrix = new stereoMatrix(k);
      let projected = math.multiply(a_stereo_matrix.values, corner);
      this.vertices3d.push(projected.toArray());
    }
  }

  // Orthographic projection to 3d
  ortho_project() {
    this.vertices3d = [];
    for (let corner of this.vertices4d) {
      let an_ortho_matrix = new orthoMatrix();
      let projected = math.multiply(an_ortho_matrix.values, corner);
      this.vertices3d.push(projected.toArray());
    }
  }

  rotate(rate, axis1, axis2) {
    let my_matrix = new rotationMatrix2d(rate, axis1, axis2);
    for (let i = 0; i < this.vertices4d.length; i++) {
      let temp = math.multiply(my_matrix.values, this.vertices4d[i]);
      this.vertices4d[i] = temp.toArray();
    }
  }
}
