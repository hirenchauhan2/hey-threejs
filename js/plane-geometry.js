import * as THREE from 'three';
import * as dat from 'dat.gui';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function runPlaneGeometry() {
  // setup dat gui
  const gui = new dat.GUI();
  const world = {
    plane: {
      width: 400,
      height: 400,
      widthSegments: 50,
      heightSegments: 50,
    },
  };
  gui.add(world.plane, 'width', 1, 600).onChange(createPlane);
  gui.add(world.plane, 'height', 1, 600).onChange(createPlane);
  gui.add(world.plane, 'widthSegments', 1, 100).onChange(createPlane);
  gui.add(world.plane, 'heightSegments', 1, 100).onChange(createPlane);

  // setup renderer
  const canvas = document.querySelector('#app');
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setPixelRatio(devicePixelRatio);

  renderer.setSize(window.innerWidth, window.innerHeight);

  const raycaster = new THREE.Raycaster();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 50;

  const orbitControls = new OrbitControls(camera, canvas);

  const mouse = {
    x: undefined,
    y: undefined,
  };

  const planeGeometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );
  const planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: true,
    vertexColors: true,
  });
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(planeMesh);

  createPlane();

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 1, 1);
  scene.add(light);
  const backLight = new THREE.DirectionalLight(0xffffff, 1);
  backLight.position.set(0, 0, -1);
  scene.add(backLight);

  function createPlane() {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(
      world.plane.width,
      world.plane.height,
      world.plane.widthSegments,
      world.plane.heightSegments
    );

    // vertices position randomization
    const { array } = planeMesh.geometry.attributes.position;
    const randomValues = [];
    for (let index = 0; index < array.length; index++) {
      const x = array[index];
      const y = array[index + 1];
      const z = array[index + 2];

      if (index % 3 === 0) {
        array[index] = x + (Math.random() - 0.5) * 3;
        array[index + 1] = y + (Math.random() - 0.5) * 3;
        array[index + 2] = z + (Math.random() - 0.5) * 3;
      }
      randomValues.push(Math.random() * Math.PI * 2);
    }

    planeMesh.geometry.attributes.position.randomValues = randomValues;
    planeMesh.geometry.attributes.position.originalPosition =
      planeMesh.geometry.attributes.position.array;

    const colors = [];
    for (
      let index = 0;
      index < planeMesh.geometry.attributes.position.count;
      index++
    ) {
      colors.push(0, 0.19, 0.4);
    }

    planeMesh.geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(colors), 3)
    );
  }
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    raycaster.setFromCamera(mouse, camera);
    frame += 0.01;
    const { array, originalPosition, randomValues } =
      planeMesh.geometry.attributes.position;

    for (let index = 0; index < array.length; index += 3) {
      // x
      array[index] =
        originalPosition[index] + Math.cos(frame + randomValues[index]) * 0.01;
      // y
      array[index + 1] =
        originalPosition[index + 1] +
        Math.sin(frame + randomValues[index + 1] + 1) * 0.01;
    }

    planeMesh.geometry.attributes.position.needsUpdate = true;

    const intersects = raycaster.intersectObject(planeMesh);

    if (intersects.length > 0) {
      const firstIntersection = intersects[0];
      const { color } = firstIntersection.object.geometry.attributes;

      // vertices 1
      color.setX(firstIntersection.face.a, 0.1);
      color.setY(firstIntersection.face.a, 0.5);
      color.setZ(firstIntersection.face.a, 1);

      // vertices 2
      color.setX(firstIntersection.face.b, 0.1);
      color.setY(firstIntersection.face.b, 0.5);
      color.setZ(firstIntersection.face.b, 1);

      // vertices 3
      color.setX(firstIntersection.face.c, 0.1);
      color.setY(firstIntersection.face.c, 0.5);
      color.setZ(firstIntersection.face.c, 1);

      color.needsUpdate = true;

      const initialColor = {
        r: 0,
        g: 0.19,
        b: 0.4,
      };
      const hoverColor = {
        r: 0.1,
        g: 0.5,
        b: 1,
      };

      gsap.to(hoverColor, {
        r: initialColor.r,
        g: initialColor.g,
        b: initialColor.b,
        onUpdate: () => {
          // vertices 1
          color.setX(firstIntersection.face.a, hoverColor.r);
          color.setY(firstIntersection.face.a, hoverColor.g);
          color.setZ(firstIntersection.face.a, hoverColor.b);

          // vertices 2
          color.setX(firstIntersection.face.b, hoverColor.r);
          color.setY(firstIntersection.face.b, hoverColor.g);
          color.setZ(firstIntersection.face.b, hoverColor.b);

          // vertices 3
          color.setX(firstIntersection.face.c, hoverColor.r);
          color.setY(firstIntersection.face.c, hoverColor.g);
          color.setZ(firstIntersection.face.c, hoverColor.b);

          color.needsUpdate = true;
        },
      });
    }
  }
  function addTextToPage() {
    const heroContainer = document.createElement('div');

    heroContainer.classList.add(
      'absolute',
      'text-center',
      'text-white',
      // 'bg-blue-300',
      'left-1/2',
      'top-1/2',
      '-translate-x-1/2',
      '-translate-y-1/2'
    );

    heroContainer.innerHTML = `
    <h1 class="text-6xl">Hello Three.js</h1>
    <p class="text-lg mt-2">Three.js is an awesome 3D JavaScript library!</p>
    <a href="https://threejs.org/" target="_blank" rel="noopener noreferrer" class="inline-block border px-4 py-2 text-sm mt-4 rounded-lg hover:bg-white hover:text-gray-800">Get Started</a>
  `;

    document.body.prepend(heroContainer);
  }

  animate();

  addEventListener('mousemove', (event) => {
    // normalized coordinates
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
  });

  addTextToPage();
}
