import gsap from 'gsap';
import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './style.css';

const gui = new GUI().close();
const cubeTweaks = gui.addFolder('Cube Tweaks');
const debug = {};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGL1Renderer({ canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

debug.color = '#8f0';
debug.subdivision = 2;

const geometry = new THREE.BoxGeometry(1, 1, 1, debug.subdivision, debug.subdivision, debug.subdivision);
const material = new THREE.MeshBasicMaterial({
  color: debug.color,
  wireframe: true
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

cubeTweaks
  .add(mesh.position, 'y')
  .min(-3)
  .max(3)
  .step(0.1)
  .name('Elevation');

cubeTweaks
  .add(mesh, 'visible');

cubeTweaks
  .add(material, 'wireframe');

cubeTweaks
  .addColor(debug, 'color')
  .onChange(() => {
    material.color.set(debug.color);
  });

cubeTweaks
  .add(debug, 'subdivision')
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(1, 1, 1, debug.subdivision, debug.subdivision, debug.subdivision);
  });

debug.rotateY = () => gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 });
cubeTweaks
  .add(debug, 'rotateY');

camera.position.z = 3;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('dblclick', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    canvas.requestFullscreen();
  }
});

function animate () {
  requestAnimationFrame(animate);

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();