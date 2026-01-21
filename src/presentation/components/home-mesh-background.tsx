 "use client";
 
 import type React from "react";
 import { useEffect, useRef } from "react";
 import * as THREE from "three";
 
 interface HomeMeshBackgroundProps {
   readonly className?: string;
 }
 
 interface MeshScene {
   readonly scene: THREE.Scene;
   readonly camera: THREE.PerspectiveCamera;
   readonly renderer: THREE.WebGLRenderer;
   readonly geometry: THREE.PlaneGeometry;
   readonly plane: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
   readonly wireframe: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
   readonly basePositions: Float32Array;
 }
 
const PLANE_WIDTH: number = 30;
const PLANE_HEIGHT: number = 20;
const PLANE_SEGMENTS_X: number = 120;
const PLANE_SEGMENTS_Y: number = 80;
const WAVE_AMPLITUDE: number = 0.6;
const WAVE_FREQUENCY_X: number = 0.25;
const WAVE_FREQUENCY_Y: number = 0.35;
const WAVE_SPEED: number = 0.5;
const MAX_DEVICE_PIXEL_RATIO: number = 2;
 
function createMeshScene(options: {
  readonly container: HTMLDivElement;
  readonly width: number;
  readonly height: number;
}): MeshScene {
  const scene: THREE.Scene = new THREE.Scene();
  scene.fog = new THREE.Fog(new THREE.Color("#0b1c48"), 5, 15);
  
  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    35,
    options.width / options.height,
    0.1,
    100,
  );
  camera.position.set(0, 4, 12);
  camera.lookAt(0, 0, 0);
  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DEVICE_PIXEL_RATIO));
  renderer.setSize(options.width, options.height);
  renderer.setClearColor(0x000000, 0);
  options.container.appendChild(renderer.domElement);
  const geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(
    PLANE_WIDTH,
    PLANE_HEIGHT,
    PLANE_SEGMENTS_X,
    PLANE_SEGMENTS_Y,
  );
  geometry.rotateX(-Math.PI / 2.05);
  const planeMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#102a63"),
    transparent: true,
    opacity: 0.2,
    roughness: 0.3,
    metalness: 0.3,
    emissive: new THREE.Color("#0b1c48"),
    emissiveIntensity: 0.4,
    side: THREE.DoubleSide,
  });
  const wireframeMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#64d5ff"),
    transparent: true,
    opacity: 0.3,
    wireframe: true,
  });
  const plane: THREE.Mesh<
    THREE.PlaneGeometry,
    THREE.MeshStandardMaterial
  > = new THREE.Mesh(geometry, planeMaterial);
  const wireframe: THREE.Mesh<
    THREE.PlaneGeometry,
    THREE.MeshBasicMaterial
  > = new THREE.Mesh(geometry, wireframeMaterial);
  scene.add(plane);
  scene.add(wireframe);
  const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(
    0x5fb6ff,
    1.5,
  );
  directionalLight.position.set(5, 5, 5);
  
  const pointLight: THREE.PointLight = new THREE.PointLight(0x5fffd6, 3, 25);
  pointLight.position.set(-2, 4, 3);
  
  const secondPointLight: THREE.PointLight = new THREE.PointLight(0x2c6bed, 2, 20);
  secondPointLight.position.set(4, -2, 4);
  
  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(pointLight);
  scene.add(secondPointLight);
   const positionAttribute: THREE.BufferAttribute = geometry.getAttribute(
     "position",
   ) as THREE.BufferAttribute;
   const basePositions: Float32Array = new Float32Array(positionAttribute.array);
   return {
     scene,
     camera,
     renderer,
     geometry,
     plane,
     wireframe,
     basePositions,
   };
 }
 
 function updateMeshWave(options: {
   readonly geometry: THREE.PlaneGeometry;
   readonly basePositions: Float32Array;
   readonly time: number;
 }): void {
   const positionAttribute: THREE.BufferAttribute = options.geometry.getAttribute(
     "position",
   ) as THREE.BufferAttribute;
   const positions: Float32Array = positionAttribute.array as Float32Array;
   const count: number = positionAttribute.count;
   for (let i: number = 0; i < count; i += 1) {
     const index: number = i * 3;
     const baseX: number = options.basePositions[index];
     const baseY: number = options.basePositions[index + 1];
    const waveX: number = Math.sin(
      (baseX + options.time * WAVE_SPEED) * WAVE_FREQUENCY_X,
    );
    const waveY: number = Math.cos(
      (baseY + options.time * WAVE_SPEED * 0.8) * WAVE_FREQUENCY_Y,
    );
    const secondaryWave: number = Math.sin(
      (baseX + baseY + options.time * WAVE_SPEED * 1.2) * 0.2,
    );
    positions[index + 2] = options.basePositions[index + 2] +
      (waveX + waveY + secondaryWave * 0.5) * WAVE_AMPLITUDE;
   }
   positionAttribute.needsUpdate = true;
   options.geometry.computeVertexNormals();
 }
 
 function updateRendererSize(options: {
   readonly renderer: THREE.WebGLRenderer;
   readonly camera: THREE.PerspectiveCamera;
   readonly width: number;
   readonly height: number;
 }): void {
   options.renderer.setSize(options.width, options.height);
   options.camera.aspect = options.width / options.height;
   options.camera.updateProjectionMatrix();
 }
 
 /**
  * Renders the animated 3D mesh background for the home hero.
  */
 export function HomeMeshBackground(
   props: HomeMeshBackgroundProps,
 ): React.JSX.Element {
   const containerRef = useRef<HTMLDivElement | null>(null);
   useEffect(() => {
     const container: HTMLDivElement | null = containerRef.current;
     if (!container) {
       return;
     }
     const width: number = container.clientWidth;
     const height: number = container.clientHeight;
     const meshScene: MeshScene = createMeshScene({
       container,
       width,
       height,
     });
     const clock: THREE.Clock = new THREE.Clock();
     let animationFrameId: number = 0;
     const handleResize = (): void => {
       const nextWidth: number = container.clientWidth;
       const nextHeight: number = container.clientHeight;
       updateRendererSize({
         renderer: meshScene.renderer,
         camera: meshScene.camera,
         width: nextWidth,
         height: nextHeight,
       });
     };
     const animate = (): void => {
       animationFrameId = window.requestAnimationFrame(animate);
       const time: number = clock.getElapsedTime();
       updateMeshWave({
         geometry: meshScene.geometry,
         basePositions: meshScene.basePositions,
         time,
       });
       meshScene.renderer.render(meshScene.scene, meshScene.camera);
     };
     window.addEventListener("resize", handleResize);
     animate();
     return () => {
       window.removeEventListener("resize", handleResize);
       window.cancelAnimationFrame(animationFrameId);
       meshScene.geometry.dispose();
       meshScene.plane.material.dispose();
       meshScene.wireframe.material.dispose();
       meshScene.renderer.dispose();
       if (meshScene.renderer.domElement.parentElement === container) {
         container.removeChild(meshScene.renderer.domElement);
       }
     };
   }, []);
   return (
     <div
       ref={containerRef}
       className={props.className}
       aria-hidden="true"
     />
   );
 }
