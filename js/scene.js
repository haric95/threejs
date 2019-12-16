import { tesseract } from "./imports/tesseract.js";

var renderer, scene, camera;
var tessy;
var tessyGeometry, tessyMesh;
var helper;

function addLight() {
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-10, -10, -10);
  scene.add(light);
  const light2 = new THREE.PointLight(0x888888, 1, 100);
  light2.position.set(50, 50, 50);
  scene.add(light2);
}

//creates 1920x1080 canvas. Sets perspective camera to z = 5 and creates the scene.
function sceneSetup() {
  const canvas = document.querySelector("#c");
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(1920, 1080);
  renderer.setClearColor(0x222222, 1);
  const fov = 75;
  const aspect = 1920 / 1080; // the canvas default
  const near = 0.1;
  const far = 10000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 50;
  scene = new THREE.Scene();
}

function createTesseract() {
  // Creating the tesseract object
  tessy = new tesseract(30);
  tessy.stereo_project(3);

  tessyGeometry = new THREE.Geometry();
  for (let vertex of tessy.vertices3d) {
    let x = vertex[0];
    let y = vertex[1];
    let z = vertex[2];
    tessyGeometry.vertices.push(new THREE.Vector3(x, y, z));
  }
  let meshMaterial = new THREE.MeshToonMaterial({
    color: 0x00ff00,
    wireframe: true
  });
  meshMaterial.side = THREE.DoubleSide;
  tessyMesh = new THREE.Mesh(tessyGeometry, meshMaterial);
  for (let face of tessy.tessFaces) {
    tessyMesh.geometry.faces.push(new THREE.Face3(face[0], face[1], face[2]));
  }
  tessyMesh.geometry.computeFaceNormals();
  scene.add(tessyMesh);
}

function render() {
  tessy.rotate(0.005, 2, 3);
  // tessy.rotate(0.00, 1, 3);
  tessy.rotate(0.02, 0, 2);
  tessy.stereo_project(3);
  for (let [i, vertex] of tessy.vertices3d.entries()) {
    let newVertex = new THREE.Vector3(vertex[0], vertex[1], vertex[2]);
    let updateVector = newVertex.sub(tessyMesh.geometry.vertices[i]);
    tessyMesh.geometry.vertices[i].add(updateVector);
  }
  tessyMesh.geometry.verticesNeedUpdate = true;
  tessyMesh.geometry.computeFaceNormals();
  // tessyMesh.geometry.computeVertexNormals();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

sceneSetup();
createTesseract();
addLight();
render();
