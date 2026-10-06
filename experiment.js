// experiment.js - 故意实验：相机进物体内部与独立Mesh旋转对比
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x16213e);
scene.fog = new THREE.Fog(0x16213e, 8, 20);

// 讲义故意实验核心：初始相机直接设为 (0, 0, 0)
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 光源
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(3, 6, 4);
scene.add(dirLight);

// 展台底座：大圆柱体（y=-0.15，高0.3，内部正好包含 y=0）
const stage = new THREE.Mesh(
  new THREE.CylinderGeometry(2.2, 2.4, 0.3, 48),
  new THREE.MeshStandardMaterial({ color: 0x37474f })
);
stage.position.y = -0.15;
scene.add(stage);

// 展品组
const items = new THREE.Group();
const geos = [
  new THREE.BoxGeometry(0.8, 0.8, 0.8),
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.TorusGeometry(0.4, 0.16, 16, 48)
];
const colors = [0x4fc3f7, 0xffb74d, 0xef5350];

geos.forEach((geo, i) => {
  const angle = (i / geos.length) * Math.PI * 2;
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: colors[i] }));
  mesh.position.set(Math.cos(angle) * 1.4, 0.6, Math.sin(angle) * 1.4);
  items.add(mesh);
});
scene.add(items);

// 实验变量：是否使用逐个转mesh
let rotateChildren = true;

// 动画渲染循环：讲义故意实验要求——把Group换成逐个转mesh（对items.children循环加rotation）
const animate = () => {
  requestAnimationFrame(animate);
  if (rotateChildren) {
    // 逐个转子mesh：原地自转而非公转
    items.children.forEach(mesh => {
      mesh.rotation.y += 0.02;
      mesh.rotation.x += 0.01;
    });
  } else {
    // 正常 Group 整体公转
    items.rotation.y += 0.005;
  }
  controls.update();
  renderer.render(scene, camera);
};
animate();

// 视口自适应
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 交互切换函数
window.setInside = function() {
  camera.position.set(0, 0, 0);
  controls.target.set(0, 0.5, 0);
  rotateChildren = true;
  document.getElementById('btn-inside').classList.add('active');
  document.getElementById('btn-normal').classList.remove('active');
  document.getElementById('exp-desc').innerText = '当前状态：相机位置设为 (0, 0, 0)，位于底座内部穿模！展品独立原地自转。';
};

window.setNormal = function() {
  camera.position.set(4, 3, 6);
  controls.target.set(0, 0, 0);
  rotateChildren = false;
  document.getElementById('btn-normal').classList.add('active');
  document.getElementById('btn-inside').classList.remove('active');
  document.getElementById('exp-desc').innerText = '对照状态：相机恢复正常外部视角 (4, 3, 6)，展品组整体公转。';
};
