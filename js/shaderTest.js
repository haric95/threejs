import { fragmentShader, vertexShader } from "./shaders/shaders.js";

window.addEventListener("load", init);
let scene;
let camera;
let renderer;
let sceneObjects = [];

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  let canvas = document.querySelector("#c");

  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);
  adjustLighting();
  addBasicCube();
  addExperimentalCube();
  animationLoop();
}

function adjustLighting() {
  let pointLight = new THREE.PointLight(0xdddddd);
  pointLight.position.set(-5, -3, 3);
  scene.add(pointLight);

  let ambientLight = new THREE.AmbientLight(0x505050);
  scene.add(ambientLight);
}

function addBasicCube() {
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshLambertMaterial();

  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = -2;
  scene.add(mesh);
  sceneObjects.push(mesh);
}

function addExperimentalCube() {
  let uniforms = {
    colorB: { type: "vec3", value: new THREE.Color(0xfff069) },
    colorA: { type: "vec3", value: new THREE.Color(0xcd1be0) }
  };

  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: fragmentShader(),
    vertexShader: vertexShader()
  });

  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = 2;
  scene.add(mesh);
  sceneObjects.push(mesh);
}

function animationLoop() {
  renderer.render(scene, camera);

  for (let object of sceneObjects) {
    object.rotation.x += 0.01;
    object.rotation.y += 0.03;
  }

  requestAnimationFrame(animationLoop);
}
