var renderer, scene, camera;

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

class tessy {
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
    this.unitvertices4d[12] = [1, -1, 1, 1, 1];
    this.unitvertices4d[13] = [1, 1, -1, 1, 1];
    this.unitvertices4d[14] = [1, 1, 1, -1, 1];
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
}

//creates 256x1280 canvas. Sets perspective camera to z = 5 and creates the scene.
function setup() {
  const canvas = document.querySelector("#c");
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(1920, 1080);
  const fov = 75;
  const aspect = 1920 / 1080; // the canvas default
  const near = 0.1;
  const far = 10000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 100;
  scene = new THREE.Scene();
}

function testing() {
  var testeract = new tessy(30);
  testeract.stereo_project(4);
  var hypercube_geometry = new THREE.Geometry();
  for (let corner of testeract.vertices3d) {
    let x = corner[0];
    let y = corner[1];
    let z = corner[2];

    hypercube_geometry.vertices.push(new THREE.Vector3(x, y, z));
  }
  let hypercube_material = new THREE.PointsMaterial({ color: 0xeeeeee });
  let points = new THREE.Points(hypercube_geometry, hypercube_material);
  scene.add(points);
  console.log(scene.children);
}

setup();
testing();
addLight();
render();

function createStarField(size) {
  //This will add a starfield to the background of a scene
  var starsGeometry = new THREE.Geometry();

  for (var i = 0; i < 1000; i++) {
    let theta = THREE.Math.randFloatSpread(-3.14159, 3.14159);
    let phi = THREE.Math.randFloatSpread(-3.14159, 3.14159);
    let r = size + THREE.Math.randFloatSpread(-size / 10, size / 10);
    var star = new THREE.Vector3();
    star.x = r * Math.sin(theta) * Math.cos(phi);
    star.y = r * Math.sin(theta) * Math.sin(phi);
    star.z = r * Math.cos(phi);
    starsGeometry.vertices.push(star);
  }

  var starsMaterial = new THREE.PointsMaterial({ color: 0xeeeeee });
  var starField = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starField);
}

function addLight() {
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
}

function render(time) {
  time *= 0.001; // convert time to seconds
  scene.children[0].rotation.z += 0.01;
  scene.children[0].rotation.x += 0.01;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
