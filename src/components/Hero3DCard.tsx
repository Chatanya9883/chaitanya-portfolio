import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export default function Hero3DCard() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const width = mount.clientWidth || 440;
    const height = mount.clientHeight || 440;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Root sculpture group
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // Cinematic Silver & Chrome Lights
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc0c0c0, 2.8);
    rimLight.position.set(-7, -5, -4);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xe4e4e7, 1.8, 20);
    fillLight.position.set(0, 5, 4);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0x27272a, 1.2);
    scene.add(ambientLight);

    // Core Chrome Sphere
    const sphereGeo = new THREE.SphereGeometry(1.65, 64, 64);
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      metalness: 0.98,
      roughness: 0.12,
    });
    const coreSphere = new THREE.Mesh(sphereGeo, chromeMaterial);
    sculptureGroup.add(coreSphere);

    // Brushed Silver Torus Rings (Multi-axis kinetic gimbal)
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      metalness: 0.94,
      roughness: 0.16,
    });
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xa1a1aa,
      metalness: 0.92,
      roughness: 0.22,
    });

    const ring1Geo = new THREE.TorusGeometry(2.5, 0.038, 16, 96);
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    ring1.rotation.x = Math.PI / 3.2;
    ring1.rotation.y = Math.PI / 6;
    sculptureGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.85, 0.032, 16, 96);
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    sculptureGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(3.18, 0.024, 16, 96);
    const ring3 = new THREE.Mesh(ring3Geo, ringMat1);
    ring3.rotation.y = Math.PI / 2.6;
    sculptureGroup.add(ring3);

    // Floating Metallic Satellites & Geometric Fragments
    const satellites: THREE.Mesh[] = [];
    const satelliteGeo = new THREE.IcosahedronGeometry(0.18, 1);
    const satelliteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.96,
      roughness: 0.1,
    });

    const satOrbitRadii = [2.2, 2.7, 3.1, 3.4];
    const satAngles = [0.4, 1.8, 3.4, 5.1];

    for (let i = 0; i < 4; i++) {
      const sat = new THREE.Mesh(satelliteGeo, satelliteMat);
      sculptureGroup.add(sat);
      satellites.push(sat);
    }

    // Sparse Floating Silver Dust in local space
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const rad = 2.0 + Math.random() * 2.2;
      particlePositions[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = rad * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xd4d4d8,
      size: 0.035,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    sculptureGroup.add(dustParticles);

    // Mouse Tracking & Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.45;
      mouseY = y * 0.45;
    };

    const handleMouseEnter = () => setIsInteracting(true);
    const handleMouseLeave = () => {
      setIsInteracting(false);
      mouseX = 0;
      mouseY = 0;
    };

    mount.addEventListener('mousemove', handleMouseMove);
    mount.addEventListener('mouseenter', handleMouseEnter);
    mount.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Autonomous gentle kinetic rotation
      coreSphere.rotation.y = elapsedTime * 0.22;
      coreSphere.rotation.x = Math.sin(elapsedTime * 0.3) * 0.12;

      ring1.rotation.z = elapsedTime * 0.35;
      ring1.rotation.y = Math.PI / 6 + Math.sin(elapsedTime * 0.2) * 0.15;

      ring2.rotation.x = -Math.PI / 4 + elapsedTime * 0.28;
      ring2.rotation.y = Math.cos(elapsedTime * 0.25) * 0.2;

      ring3.rotation.y = Math.PI / 2.6 + elapsedTime * 0.18;
      ring3.rotation.z = Math.sin(elapsedTime * 0.35) * 0.25;

      // Orbiting satellites
      satellites.forEach((sat, idx) => {
        const radius = satOrbitRadii[idx];
        const baseAngle = satAngles[idx] + elapsedTime * (0.3 + idx * 0.12);
        sat.position.x = Math.cos(baseAngle) * radius;
        sat.position.y = Math.sin(baseAngle * 1.2) * (radius * 0.45);
        sat.position.z = Math.sin(baseAngle) * radius;
        sat.rotation.x += 0.02;
        sat.rotation.y += 0.03;
      });

      // Slowly rotate dust cloud
      dustParticles.rotation.y = elapsedTime * 0.08;
      dustParticles.rotation.x = elapsedTime * 0.04;

      // Mouse-responsive damping
      targetRotationY += (mouseX - targetRotationY) * 0.06;
      targetRotationX += (mouseY - targetRotationX) * 0.06;

      sculptureGroup.rotation.y = targetRotationY;
      sculptureGroup.rotation.x = -targetRotationX;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('mousemove', handleMouseMove);
      mount.removeEventListener('mouseenter', handleMouseEnter);
      mount.removeEventListener('mouseleave', handleMouseLeave);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeo.dispose();
      chromeMaterial.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      ring3Geo.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      satelliteGeo.dispose();
      satelliteMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[460px] mx-auto group">
      {/* Sharp Rectangular Outer Frame with Fine Metallic Silver Border */}
      <div className="relative w-full h-full bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden shadow-2xl flex items-center justify-center">
        
        {/* Subtle Corner Brackets for High-End Engineering Aesthetic */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#C0C0C0] pointer-events-none z-20" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#C0C0C0] pointer-events-none z-20" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#C0C0C0] pointer-events-none z-20" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#C0C0C0] pointer-events-none z-20" />

        {/* Ambient Silver Backlight Glow */}
        <div className="absolute inset-0 bg-radial from-white/[0.04] via-transparent to-transparent pointer-events-none" />

        {/* Top Metallic Label */}
        <div className="absolute top-4 left-5 right-5 flex items-center justify-between pointer-events-none z-20">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C0C0C0] animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-[#929292] uppercase">
              KINETIC CHROME SCULPTURE
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-600">
            {isInteracting ? 'ACTIVE / INTERACTING' : 'THREE.JS / 60 FPS'}
          </span>
        </div>

        {/* Interactive WebGL 3D Canvas Mount */}
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
          aria-label="Interactive 3D Chrome Sculpture"
          role="img"
        />

        {/* Bottom Metadata Bar */}
        <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between pointer-events-none z-20 text-[10px] font-mono text-[#929292] border-t border-white/[0.06] pt-2">
          <span>ORBITAL AXIS: METALLIC CHROME</span>
          <span className="text-zinc-500">HOVER TO ROTATE</span>
        </div>
      </div>
    </div>
  );
}
