// import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
// import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';
// import { OrbitControls } from "@/node_modules/three/examples/jsm/controls/OrbitControls";

// Create a scene
let scene = new THREE.Scene();

// Create a camera
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Create a renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("terrain").appendChild(renderer.domElement);

const loader = new THREE.TextureLoader()
const texture = loader.load('/static/img/texture.png')
const height = loader.load('/static/img/image.jpg')

const material = new THREE.MeshStandardMaterial({
    color: 'red',
    map: texture,
    displacementMap: height,
})


// Create a terrain
let geometry = new THREE.PlaneGeometry(5, 5, 64, 64);

// var material = new THREE.MeshBasicMaterial({
//   color: 0xffff00,
//   wireframe: true,
// });




let terrain = new THREE.Mesh(geometry, material);
scene.add(terrain);

// Create orbit controls
let controls = new OrbitControls(camera, renderer.domElement);

// Render the scene
function render() {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}
render();
