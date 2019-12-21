var cloud, renderer, scene, camera;

setup();
createParticleSphere(360, 10);
addLight();
render();

//creates 256x1280 canvas. Sets perspective camera to z = 5 and creates the scene.
function setup() {
  const canvas = document.querySelector("#c");
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(256, 1280);
  const fov = 75;
  const aspect = 256 / 1280; // the canvas default
  const near = 0.1;
  const far = 10000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 100;
  scene = new THREE.Scene();
}

function createParticleSphere(num, distance) {
  //creating a geometry for num random vertices along a sphere.
  var sprite = new THREE.TextureLoader().load("textures/sprites/disc.png");
  var sphere = new THREE.Geometry();
  for (let i = 0; i < num; i++) {
    var vertex = new THREE.Vector3();
    var theta = i;
    vertex.x = distance * Math.sin(theta);
    vertex.z = distance * Math.cos(theta);
    vertex.y = (i / 360 - 0.5) * 100;
    sphere.vertices.push(vertex);
  }
  var starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
  cloud = new THREE.Points(sphere, starsMaterial);
  scene.add(cloud);
}

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

function createBoxes() {
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const box_geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  cube_1 = makeInstance(box_geometry, 0xffff00);
  cube_2 = makeInstance(box_geometry, 0xff00ff);
  cube_3 = makeInstance(box_geometry, 0x00ffff);
  scene.add(cube_1);
  scene.add(cube_2);
  scene.add(cube_3);
  function makeInstance(geometry, color) {
    const material = new THREE.MeshPhongMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = (Math.random() - 0.5) * 2;
    cube.position.y = (Math.random() - 0.5) * 4;
    cube.position.z = (Math.random() - 1.0) * 3;
    return cube;
  }
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
  scene.children[0].rotation.y += 0.01;
  scene.children[0].rotation.x += 0.01;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
