var cloud, renderer, scene, camera, aGeom, aMesh;
var val = 0.01;

setup();
createBox();
addLight();
render();

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
  camera.position.z = 10;
  scene = new THREE.Scene();
}

function createBox() {
  var meshMaterial = new THREE.MeshBasicMaterial({ color: 0x00bb00 });
  meshMaterial.side = THREE.DoubleSide;
  var pointsMaterial = new THREE.PointsMaterial({ color: 0xbb0000 });
  aGeom = new THREE.Geometry();
  console.log(aGeom);
  aGeom.vertices.push(new THREE.Vector3(-1, -1, -1));
  aGeom.vertices.push(new THREE.Vector3(-1, 1, -1));
  aGeom.vertices.push(new THREE.Vector3(1, 1, -1));
  aGeom.vertices.push(new THREE.Vector3(1, -1, -1));
  aGeom.vertices.push(new THREE.Vector3(-1, -1, 1));
  aGeom.vertices.push(new THREE.Vector3(-1, 1, 1));
  aGeom.vertices.push(new THREE.Vector3(1, 1, 1));
  aGeom.vertices.push(new THREE.Vector3(1, -1, 1));
  let materialIndex = 0;
  let color = new THREE.Color(0xff0000);
  aGeom.faces.push(new THREE.Face3(0, 1, 2));
  aGeom.faces.push(new THREE.Face3(0, 2, 3));
  aGeom.faces.push(new THREE.Face3(0, 4, 1));
  aGeom.faces.push(new THREE.Face3(1, 4, 5));
  aGeom.faces.push(new THREE.Face3(1, 5, 6));
  aGeom.faces.push(new THREE.Face3(4, 6, 7));
  aGeom.faces.push(new THREE.Face3(2, 3, 6));
  aGeom.faces.push(new THREE.Face3(2, 3, 7));

  let points = new THREE.Points(aGeom, pointsMaterial);
  scene.add(points);

  aGeom.computeFaceNormals();
  aGeom.computeVertexNormals();

  aMesh = new THREE.Mesh(aGeom, meshMaterial);
  scene.add(aMesh);
  //   console.log(scene.children);
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
  aMesh.geometry.vertices[0].add(new THREE.Vector3(0.01, 0, 0));
  aMesh.geometry.verticesNeedUpdate = true;
  scene.children[0].rotation.y += 0.01;
  scene.children[0].rotation.x += 0.01;
  scene.children[1].rotation.y += 0.01;
  scene.children[1].rotation.x += 0.01;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
