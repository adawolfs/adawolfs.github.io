
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import { DeviceOrientationControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/DeviceOrientationControls.js';
var container;

var camera, scene, renderer;

var spheres = [];
var lines = []

var mouseX = 0;
var mouseY = 0;

var totalParticles = 700;
var minSpehereDist = 600;

var controls

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', onDocumentMouseMove, false);


init();
animate();

function init() {

  container = document.getElementById('threejs-particles');

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
  camera.position.z = 3200;

  controls = new DeviceOrientationControls(camera);

  scene = new THREE.Scene();
  var geometry = new THREE.SphereBufferGeometry(2, 32, 16);
  var material = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: scene.background });

  for (var i = 0; i < totalParticles; i++) {

    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = Math.random() * 100 - 10;
    mesh.position.y = Math.random() * 100 - 10;
    mesh.position.z = Math.random() * 8000 - 4000;

    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

    scene.add(mesh);

    spheres.push(mesh);

  }

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

  mouseX = (event.clientX - windowHalfX) * 2;
  mouseY = (event.clientY - windowHalfY) * 2;

}


function animate() {

  requestAnimationFrame(animate);
  controls.update();
  render();

}

function link_speres(p1, p2) {
  var dx = p1.position.x - p2.position.x,
    dy = p1.position.y - p2.position.y,
    dz = p1.position.z - p2.position.z,
    dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  var opacity_line = 1 - (dist / (1 / 1)) / minSpehereDist;

  if (dist < minSpehereDist) {
    create_line(p1, p2, opacity_line)
  }

  function create_line(p1, p2, opacity_line) {
    var material = new THREE.LineBasicMaterial({
      color: 0xfffffff,
      opacity: opacity_line,
      transparent: true,
      linewidth: 1,
    });

    var points = [];
    points.push(new THREE.Vector3(p1.position.x, p1.position.y, p1.position.z));
    points.push(new THREE.Vector3(p2.position.x, p2.position.y, p2.position.z));

    var geometry = new THREE.BufferGeometry().setFromPoints(points);

    var line = new THREE.Line(geometry, material);
    lines.push(line);
    scene.add(line);
  }

}

function render() {

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i]
    scene.remove(line);
  }
  lines = []

  var timer = 0.00005 * Date.now();

  for (var i = 0, il = spheres.length; i < il; i++) {

    var sphere = spheres[i];

    sphere.position.x = 5000 * Math.cos(timer + i);
    sphere.position.y = 5000 * Math.sin(timer + i * 1.1);

  }
  for (var i = 0, il = spheres.length; i < il; i++) {
    var sphere = spheres[i];
    for (var j = 0 + 1; j < il; j++) {
      link_speres(sphere, spheres[j]);
    }
  }

  camera.position.x += (mouseX - camera.position.x) * .5;
  camera.position.y += (- mouseY - camera.position.y) * .5;

  camera.lookAt(scene.position);

  renderer.render(scene, camera);

}
