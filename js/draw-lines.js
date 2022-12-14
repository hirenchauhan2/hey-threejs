import * as THREE from 'three';

export function drawLines() {
  // setup renderer
  const canvas = document.querySelector('#app');
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setPixelRatio(devicePixelRatio);

  renderer.setSize(window.innerWidth, window.innerHeight);

  // create camera
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    500
  );

  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);

  const scene = new THREE.Scene();

  // create a blue LineBasicMaterial
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

  // add geometry with vertices
  const points = [];
  points.push(new THREE.Vector3(-10, 0, 0));
  points.push(new THREE.Vector3(0, 10, 0));
  points.push(new THREE.Vector3(10, 0, 0));
  // bonus the triangle
  points.push(new THREE.Vector3(-10, 0, 0));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const line = new THREE.Line(geometry, material);

  scene.add(line);

  renderer.render(scene, camera);
}
