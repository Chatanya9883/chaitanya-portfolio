import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      // Graceful fallback if WebGL fails
      return;
    }

    // 1. Deep Black Scene & Subtle Atmospheric Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x050505, 0.015);

    // 2. Perspective Camera with cinematic depth
    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      250
    );
    camera.position.set(0, 0, 34);

    // 3. Renderer configuration
    renderer.setClearColor(0x050505, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    container.appendChild(renderer.domElement);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // ========================================================
    // Subtle High-Res Radial Texture for Glowing Silver Dust
    // ========================================================
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 64;
    textureCanvas.height = 64;
    const ctx = textureCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(245, 245, 245, 1)');
      grad.addColorStop(0.2, 'rgba(192, 192, 192, 0.9)');
      grad.addColorStop(0.5, 'rgba(146, 146, 146, 0.4)');
      grad.addColorStop(0.8, 'rgba(100, 100, 100, 0.1)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const dustTexture = new THREE.CanvasTexture(textureCanvas);

    // ========================================================
    // Restrained 3D Silver Dust Field (Controlled Count)
    // ========================================================
    const dustCount = 1200;
    const dustGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(dustCount * 3);
    const colors = new Float32Array(dustCount * 3);

    interface ParticleState {
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      vx: number;
      vy: number;
      vz: number;
      phase: number;
      twinkleRate: number;
      baseR: number;
      baseG: number;
      baseB: number;
    }

    const particles: ParticleState[] = [];

    // Monochrome metallic silver palette
    const cWhite = new THREE.Color(0xf5f5f5);
    const cSilver = new THREE.Color(0xc0c0c0);
    const cMuted = new THREE.Color(0x929292);
    const cDarkSilver = new THREE.Color(0x606060);

    for (let i = 0; i < dustCount; i++) {
      const x = (Math.random() - 0.5) * 85;
      const y = (Math.random() - 0.5) * 70;
      const z = (Math.random() - 0.5) * 55 - 4;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const r = Math.random();
      const col = r > 0.65 ? cWhite : r > 0.35 ? cSilver : r > 0.1 ? cMuted : cDarkSilver;

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        vx: (Math.random() - 0.5) * 0.006,
        vy: (Math.random() - 0.5) * 0.006,
        vz: (Math.random() - 0.5) * 0.006,
        phase: Math.random() * Math.PI * 2,
        twinkleRate: Math.random() * 1.5 + 0.8,
        baseR: col.r,
        baseG: col.g,
        baseB: col.b,
      });
    }

    dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    dustGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const dustMaterial = new THREE.PointsMaterial({
      size: 1.4,
      map: dustTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
    worldGroup.add(dustPoints);

    // ========================================================
    // A Few Floating Metallic / Chrome Sculptural Elements
    // ========================================================
    const sculptureGroup = new THREE.Group();
    worldGroup.add(sculptureGroup);

    // Subtle floating chrome sphere in upper right hero quadrant
    const sphereGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      metalness: 0.95,
      roughness: 0.15,
    });
    const floatingSphere = new THREE.Mesh(sphereGeo, chromeMat);
    floatingSphere.position.set(16, 7, -10);
    sculptureGroup.add(floatingSphere);

    // Thin elegant orbital ring
    const ringGeo = new THREE.TorusGeometry(2.6, 0.03, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      metalness: 0.9,
      roughness: 0.2,
    });
    const orbitalRing = new THREE.Mesh(ringGeo, ringMat);
    orbitalRing.position.set(16, 7, -10);
    orbitalRing.rotation.x = Math.PI / 3;
    sculptureGroup.add(orbitalRing);

    // Small floating octahedron accent in background
    const octGeo = new THREE.OctahedronGeometry(0.7, 0);
    const octMesh = new THREE.Mesh(octGeo, chromeMat);
    octMesh.position.set(-18, -8, -12);
    sculptureGroup.add(octMesh);

    // Soft Studio Lighting
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x71717a, 1.2);
    dirLight2.position.set(-10, -10, -5);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0x18181b, 1.5);
    scene.add(ambientLight);

    // ========================================================
    // Mouse Interaction Physics & Scroll Dampening
    // ========================================================
    const mouse3D = new THREE.Vector3(0, 0, 0);
    const mouseVel = new THREE.Vector2(0, 0);
    let targetNormX = 0;
    let targetNormY = 0;
    let normX = 0;
    let normY = 0;
    let targetScroll = 0;
    let curScroll = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetNormX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetNormY = -(e.clientY / window.innerHeight - 0.5) * 2;

      const worldX = targetNormX * 24;
      const worldY = targetNormY * 18;

      mouseVel.x = (worldX - mouse3D.x) * 0.35;
      mouseVel.y = (worldY - mouse3D.y) * 0.35;

      mouse3D.x = worldX;
      mouse3D.y = worldY;
    };

    const handleScroll = () => {
      targetScroll = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      normX += (targetNormX - normX) * 0.05;
      normY += (targetNormY - normY) * 0.05;
      curScroll += (targetScroll - curScroll) * 0.04;
      const scrollProgress = curScroll * 0.003;

      mouseVel.multiplyScalar(0.92);

      // Dampen 3D intensity as user scrolls down into content-heavy sections
      const heroOpacityFactor = Math.max(0.2, 1 - curScroll / 1200);
      dustMaterial.opacity = 0.35 * heroOpacityFactor;

      const pos = dustGeometry.attributes.position.array as Float32Array;
      const col = dustGeometry.attributes.color.array as Float32Array;

      const radius = 14;
      const radSq = radius * radius;

      for (let i = 0; i < dustCount; i++) {
        const p = particles[i];

        // Gentle drift
        p.x += p.vx + Math.sin(time * 0.4 + p.phase) * 0.005;
        p.y += p.vy + Math.cos(time * 0.35 + p.phase) * 0.005;
        p.z += p.vz;

        // Gentle cursor wind repulsion
        const dx = p.x - mouse3D.x;
        const dy = p.y - mouse3D.y;
        const dSq = dx * dx + dy * dy;

        if (dSq < radSq && dSq > 0.01) {
          const d = Math.sqrt(dSq);
          const force = (1 - d / radius) * 0.12;
          p.vx += (dx / d) * force + mouseVel.x * force * 0.8;
          p.vy += (dy / d) * force + mouseVel.y * force * 0.8;
        }

        // Return damping
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.vz *= 0.95;

        p.vx += (p.baseX - p.x) * 0.0015;
        p.vy += (p.baseY - p.y) * 0.0015;
        p.vz += (p.baseZ - p.z) * 0.0015;

        // Bounds wrap
        if (p.x > 45) p.x = -45;
        if (p.x < -45) p.x = 45;
        if (p.y > 38) p.y = -38;
        if (p.y < -38) p.y = 38;

        pos[i * 3] = p.x;
        pos[i * 3 + 1] = p.y;
        pos[i * 3 + 2] = p.z;

        // Soft shimmer
        const twinkle = 0.8 + Math.sin(time * p.twinkleRate + p.phase) * 0.2;
        col[i * 3] = Math.min(1, p.baseR * twinkle);
        col[i * 3 + 1] = Math.min(1, p.baseG * twinkle);
        col[i * 3 + 2] = Math.min(1, p.baseB * twinkle);
      }

      dustGeometry.attributes.position.needsUpdate = true;
      dustGeometry.attributes.color.needsUpdate = true;

      // Animate floating chrome objects gently
      floatingSphere.position.y = 7 + Math.sin(time * 0.8) * 0.5;
      orbitalRing.position.y = 7 + Math.sin(time * 0.8) * 0.5;
      orbitalRing.rotation.z = time * 0.2;
      orbitalRing.rotation.y = time * 0.15;

      octMesh.rotation.x = time * 0.3;
      octMesh.rotation.y = time * 0.25;

      // Restrained Parallax
      worldGroup.rotation.y = normX * 0.04;
      worldGroup.rotation.x = -normY * 0.03;

      camera.position.y = -scrollProgress * 0.8;
      camera.lookAt(0, -scrollProgress * 0.8, 0);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      dustTexture.dispose();
      sphereGeo.dispose();
      chromeMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      octGeo.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050505]"
      aria-hidden="true"
    />
  );
}
