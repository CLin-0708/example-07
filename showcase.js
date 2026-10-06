// showcase.js - Three.js 旋转展示台实现
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x16213e);
scene.fog = new THREE.Fog(0x16213e, 8, 20); // 雾效：远处渐隐，烘托氛围

// 相机配置
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(4, 3, 6);

// 渲染器配置
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 轨道控制器
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 光源配置：环境光 + 方向光双光源
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(3, 6, 4);
scene.add(dirLight);

// 展台底座：大圆柱体
const stage = new THREE.Mesh(
  new THREE.CylinderGeometry(2.2, 2.4, 0.3, 48),
  new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.5, metalness: 0.2 })
);
stage.position.y = -0.15;
scene.add(stage);

// 展品组：3个不同几何体摆一圈
const items = new THREE.Group(); // 组：整体旋转
const geos = [
  new THREE.BoxGeometry(0.8, 0.8, 0.8),
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.TorusGeometry(0.4, 0.16, 16, 48)
];
const colors = [0x4fc3f7, 0xffb74d, 0xef5350];

geos.forEach((geo, i) => {
  const angle = (i / geos.length) * Math.PI * 2;
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.3, metalness: 0.1 })
  );
  mesh.position.set(Math.cos(angle) * 1.4, 0.6, Math.sin(angle) * 1.4);
  items.add(mesh);
});
scene.add(items);

// 动画渲染循环：展品组缓转，控制器阻尼更新
const animate = () => {
  requestAnimationFrame(animate);
  items.rotation.y += 0.005;
  controls.update();
  renderer.render(scene, camera);
};
animate();

// 视口自适应 resize 监听
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
