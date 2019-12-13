var renderer, scene, camera;
var tessy;
var hypercube_geometry, hypercube_material;

// createParticleSphere(360, 10);
class ortho_matrix {
  constructor() {
    this.values = math.matrix([
      [1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0]
    ]);
  }
}

class stereo_matrix {
  constructor(k) {
    this.values = math.matrix([
      [k, 0, 0, 0, 0],
      [0, k, 0, 0, 0],
      [0, 0, k, 0, 0]
    ]);
  }
}

class zw_rotatation_matrix {
  constructor(rate) {
    this.values = math.matrix([
      [1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, Math.cos(rate), -Math.sin(rate), 0],
      [0, 0, Math.sin(rate), Math.cos(rate), 0],
      [0, 0, 0, 0, 0]
    ]);
  }
}

class xz_rotatation_matrix {
  constructor(rate) {
    this.values = math.matrix([
      [Math.cos(rate), 0, -Math.sin(rate), 0, 0],
      [0, 1, 0, 0, 0],
      [Math.sin(rate), 0, Math.cos(rate), 0, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1]
    ]);
  }
}

class tesseract {
  constructor(size) {
    this.size = size;
    this.vertices3d = [];
    this.unitvertices4d = [];
    this.vertices4d = [];

    // Create unit vertices
    this.unitvertices4d[0] = [-1, -1, -1, -1, 1];
    this.unitvertices4d[1] = [1, -1, -1, -1, 1];
    this.unitvertices4d[2] = [-1, 1, -1, -1, 1];
    this.unitvertices4d[3] = [-1, -1, 1, -1, 1];
    this.unitvertices4d[4] = [-1, -1, -1, 1, 1];
    this.unitvertices4d[5] = [1, 1, -1, -1, 1];
    this.unitvertices4d[6] = [1, -1, 1, -1, 1];
    this.unitvertices4d[7] = [1, -1, -1, 1, 1];
    this.unitvertices4d[8] = [-1, 1, 1, -1, 1];
    this.unitvertices4d[9] = [-1, 1, -1, 1, 1];
    this.unitvertices4d[10] = [-1, -1, 1, 1, 1];
    this.unitvertices4d[11] = [1, 1, 1, -1, 1];
    this.unitvertices4d[12] = [1, 1, -1, 1, 1];
    this.unitvertices4d[13] = [1, -1, 1, 1, 1];
    this.unitvertices4d[14] = [-1, 1, 1, 1, 1];
    this.unitvertices4d[15] = [1, 1, 1, 1, 1];

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
      let a_stereo_matrix = new stereo_matrix(k);
      let projected = math.multiply(a_stereo_matrix.values, corner);
      this.vertices3d.push(projected.toArray());
    }
  }

  // Orthographic projection to 3d
  ortho_project() {
    this.vertices3d = [];
    for (let corner of this.vertices4d) {
      let an_ortho_matrix = new ortho_matrix();
      let projected = math.multiply(an_ortho_matrix.values, corner);
      this.vertices3d.push(projected.toArray());
    }
  }

  rotate_zw(rate) {
    let my_matrix = new zw_rotatation_matrix(0.02);
    for (let i = 0; i < this.vertices4d.length; i++) {
      let temp = math.multiply(my_matrix.values, this.vertices4d[i]);
      this.vertices4d[i] = temp.toArray();
    }
  }

  rotate_xz(rate) {
    let my_matrix = new xz_rotatation_matrix(0.02);
    for (let i = 0; i < this.vertices4d.length; i++) {
      let temp = math.multiply(my_matrix.values, this.vertices4d[i]);
      this.vertices4d[i] = temp.toArray();
    }
  }
}

//creates 1920x1080 canvas. Sets perspective camera to z = 5 and creates the scene.
function setup() {
  const canvas = document.querySelector("#c");
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(1920, 1080);
  const fov = 75;
  const aspect = 1920 / 1080; // the canvas default
  const near = 0.1;
  const far = 10000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 50;
  scene = new THREE.Scene();
}

function testing() {
  tessy = new tesseract(30);
  tessy.rotate_zw(0.1);
  tessy.stereo_project(4);
  hypercube_geometry = new THREE.Geometry();
  for (let corner of tessy.vertices3d) {
    let x = corner[0];
    let y = corner[1];
    let z = corner[2];

    hypercube_geometry.vertices.push(new THREE.Vector3(x, y, z));
  }
  let points = new THREE.Points(hypercube_geometry, hypercube_material);
  scene.add(points);
}

setup();
testing();
addLight();
render();

function addLight() {
  const color = 0xffff00;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(10, 10, 10);
  scene.add(light);
}

function render(time) {
  time *= 0.001; // convert time to seconds
  scene.children[0].rotation.z += 0.01;
  scene.children[0].rotation.x += 0.01;
  tessy.rotate_xz(0.002);
  tessy.rotate_zw(0.02);
  tessy.stereo_project(4);
  scene.remove(scene.children[0]);
  var hypercube_geometry = new THREE.Geometry();
  for (let corner of tessy.vertices3d) {
    let x = corner[0];
    let y = corner[1];
    let z = corner[2];

    hypercube_geometry.vertices.push(new THREE.Vector3(x, y, z));
  }
  let hypercube_material = new THREE.PointsMaterial({ color: 0xeeeeee });
  let points = new THREE.Points(hypercube_geometry, hypercube_material);
  scene.add(points);

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
