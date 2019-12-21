export function joinQuad([i1, i2, i3, i4]) {
  // Vertices should be passed in clockwise or anti-clockwise
  // ie. (-1,-1) -> (1,-1) -> (1,1) -> (-1,1)
  // not (-1,-1) -> (1,-1) -> (-1,1) -> (1,1)
  return [
    [i1, i2, i3],
    [i1, i3, i4]
  ];
}

export function joinCube([i1, i2, i3, i4, i5, i6, i7, i8]) {
  let facesIndex = [
    [i1, i2, i3, i4],
    [i5, i6, i7, i8],
    [i1, i2, i6, i5],
    [i2, i3, i7, i6],
    [i4, i3, i7, i8],
    [i1, i4, i5, i8]
  ];

  let faces = [];
  for (let faceIndex of facesIndex) {
    faces.push(joinQuad(faceIndex));
  }
  return faces;
}

function joinOuterCube([i1, i2, i3, i4, i5, i6, i7, i8]) {
  let facesIndex = [
    [i1, i2, i6, i5],
    [i2, i3, i7, i6],
    [i4, i3, i7, i8],
    [i1, i4, i5, i8]
  ];
  let faces = [];
  for (let faceIndex of facesIndex) {
    faces.push(joinQuad(faceIndex));
  }
  return faces;
}

export function joinTesseract(
  i0,
  i1,
  i2,
  i3,
  i4,
  i5,
  i6,
  i7,
  i8,
  i9,
  i10,
  i11,
  i12,
  i13,
  i14,
  i15
) {
  let cubesIndex = [
    [i0, i1, i2, i3, i4, i5, i6, i7],
    [i8, i9, i10, i11, i12, i13, i14, i15],
    [i0, i1, i2, i3, i8, i9, i10, i11],
    [i4, i5, i6, i7, i12, i13, i14, i15],
    [i4, i7, i3, i0, i12, i15, i11, i8],
    [i4, i5, i1, i0, i12, i13, i9, i8],
    [i5, i6, i2, i1, i13, i14, i10, i9],
    [i7, i6, i2, i3, i15, i14, i10, i11]
  ];
  let cubes = [];
  for (let i = 0; i < 2; i++) {
    cubes.push(joinCube(cubesIndex[i]));
  }
  for (let i = 2; i < 8; i++) {
    cubes.push(joinOuterCube(cubesIndex[i]));
  }
  return cubes;
}
