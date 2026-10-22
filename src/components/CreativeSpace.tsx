import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { DESIGN_CASE_STUDIES, DesignCaseStudy } from '../data/portfolioData';
import { Sparkles, Maximize2, ChevronLeft, ChevronRight, RotateCcw, X, ArrowUpRight, Layers } from 'lucide-react';
import SectionReveal3D from './SectionReveal3D';
import CreativeVisual from './CreativeVisual';

export default function CreativeSpace() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // We feature 5 key artworks in the 3D studio
  const studioArtworks = DESIGN_CASE_STUDIES.slice(0, 5);
  const currentArtwork = studioArtworks[selectedIndex] || studioArtworks[0];

  // Canvas texture generator for artworks in Three.js
  const createArtworkTexture = (study: DesignCaseStudy) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 680;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Deep graphite background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, 512, 680);

    // Grid lines
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1;
    for (let x = 30; x < 512; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 680);
      ctx.stroke();
    }
    for (let y = 30; y < 680; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Outer silver border
    ctx.strokeStyle = '#a1a1aa';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 472, 640);

    // Inner subtle border
    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 1;
    ctx.strokeRect(32, 32, 448, 616);

    // Category banner
    ctx.fillStyle = '#18181b';
    ctx.fillRect(40, 50, 432, 36);
    ctx.fillStyle = '#d4d4d8';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`${study.category.toUpperCase()} · ${study.year}`, 52, 74);

    // Ambient radial glow
    const grad = ctx.createRadialGradient(256, 300, 20, 256, 300, 180);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(40, 100, 432, 400);

    // Central geometric graphic
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(256, 300, 110, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#71717a';
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(256, 300, 75, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Crosshairs
    ctx.strokeStyle = '#d4d4d8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(130, 300);
    ctx.lineTo(382, 300);
    ctx.moveTo(256, 174);
    ctx.lineTo(256, 426);
    ctx.stroke();

    // Title typography
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 28px sans-serif';
    ctx.textAlign = 'center';
    const words = study.title.split(' ');
    if (words.length > 2) {
      ctx.fillText(words.slice(0, 2).join(' '), 256, 490);
      ctx.fillText(words.slice(2).join(' '), 256, 524);
    } else {
      ctx.fillText(study.title, 256, 505);
    }

    // Client / context label
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '13px monospace';
    ctx.fillText(study.clientOrContext, 256, 560);

    // Curated mark
    ctx.fillStyle = '#71717a';
    ctx.font = '11px monospace';
    ctx.fillText('DESIGNED BY CHAITANYA JAIN · SATI', 256, 610);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060606);
    scene.fog = new THREE.FogExp2(0x060606, 0.045);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 7.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // Studio Ambient & Key Spotlights
    const ambientLight = new THREE.AmbientLight(0x222222, 1.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 4.5, 20, Math.PI / 4, 0.4, 1.2);
    spotLight.position.set(0, 6, 6);
    scene.add(spotLight);

    const rimLight = new THREE.DirectionalLight(0xa1a1aa, 2.0);
    rimLight.position.set(-6, -2, -3);
    scene.add(rimLight);

    // Studio Floor Grid in dark graphite
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.2;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(26, 26, 0x3f3f46, 0x18181b);
    gridHelper.position.y = -2.19;
    scene.add(gridHelper);

    // Gallery Root Carousel Group
    const galleryGroup = new THREE.Group();
    scene.add(galleryGroup);

    // Metallic Framed Artworks arranged in a circular arc
    const frameMeshes: THREE.Group[] = [];
    const radius = 4.8;
    const count = studioArtworks.length;
    const angleStep = (Math.PI * 2) / count;

    studioArtworks.forEach((study, i) => {
      const frameGroup = new THREE.Group();
      const angle = i * angleStep;

      frameGroup.position.x = Math.sin(angle) * radius;
      frameGroup.position.z = Math.cos(angle) * radius;
      frameGroup.rotation.y = angle + Math.PI;

      // Chrome Frame Border
      const frameThickness = 0.08;
      const frameWidth = 2.4;
      const frameHeight = 3.2;

      const outerMat = new THREE.MeshStandardMaterial({
        color: 0xd4d4d8,
        metalness: 0.95,
        roughness: 0.15,
      });

      // Outer metallic bevel
      const outerGeo = new THREE.BoxGeometry(frameWidth, frameHeight, frameThickness);
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      frameGroup.add(outerMesh);

      // Artwork Canvas Texture Face
      const artMat = new THREE.MeshStandardMaterial({
        map: createArtworkTexture(study),
        roughness: 0.35,
        metalness: 0.1,
      });
      const artGeo = new THREE.PlaneGeometry(frameWidth - 0.22, frameHeight - 0.22);
      const artMesh = new THREE.Mesh(artGeo, artMat);
      artMesh.position.z = frameThickness / 2 + 0.005;
      frameGroup.add(artMesh);

      // Subtle underglow light for each artwork
      const frameLight = new THREE.PointLight(0xffffff, 0.8, 4);
      frameLight.position.set(0, -1.8, 0.5);
      frameGroup.add(frameLight);

      frameGroup.userData = { index: i, study };
      galleryGroup.add(frameGroup);
      frameMeshes.push(frameGroup);
    });

    // Sparse Floating Silver Dust in Studio Space
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 12;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 5 + 0.5;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xe4e4e7,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Drag / Orbit interaction
    let isUserInteracting = false;
    let previousMouseX = 0;
    let targetGalleryRotation = 0;
    let currentGalleryRotation = 0;

    const onPointerDown = (e: PointerEvent) => {
      isUserInteracting = true;
      setIsDragging(true);
      previousMouseX = e.clientX;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isUserInteracting) return;
      const deltaX = e.clientX - previousMouseX;
      previousMouseX = e.clientX;
      targetGalleryRotation += deltaX * 0.008;
    };

    const onPointerUp = () => {
      if (!isUserInteracting) return;
      isUserInteracting = false;
      setIsDragging(false);

      // Snap to closest artwork
      const normalizedRot = ((-targetGalleryRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      let closestIdx = Math.round(normalizedRot / angleStep) % count;
      if (closestIdx < 0) closestIdx += count;
      setSelectedIndex(closestIdx);
      targetGalleryRotation = -closestIdx * angleStep;
    };

    mount.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Raycasting to click artwork directly in 3D
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      if (isDragging) return;
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(galleryGroup.children, true);

      if (intersects.length > 0) {
        let hitObject: THREE.Object3D | null = intersects[0].object;
        while (hitObject && hitObject.parent && hitObject.parent !== galleryGroup) {
          hitObject = hitObject.parent;
        }
        if (hitObject && hitObject.userData && typeof hitObject.userData.index === 'number') {
          const clickedIdx = hitObject.userData.index;
          setSelectedIndex(clickedIdx);
          targetGalleryRotation = -clickedIdx * angleStep;
        }
      }
    };

    mount.addEventListener('click', onClick);

    // Animation loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth gallery rotation damping
      currentGalleryRotation += (targetGalleryRotation - currentGalleryRotation) * 0.08;
      galleryGroup.rotation.y = currentGalleryRotation;

      // Gentle floating levitation on artworks
      frameMeshes.forEach((mesh, idx) => {
        mesh.position.y = Math.sin(time * 1.5 + idx * 1.2) * 0.08;
      });

      // Subtle dust drift
      dust.rotation.y = time * 0.02;

      renderer.render(scene, camera);
    };

    animate();

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
      mount.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('click', onClick);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % studioArtworks.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + studioArtworks.length) % studioArtworks.length);
  };

  return (
    <section id="creative-space" className="py-28 relative border-t border-white/[0.08] bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <SectionReveal3D className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[#C0C0C0] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F5F5F5]" />
              <span>SIGNATURE FEATURE · 3D EXHIBITION ENVIRONMENT</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-[#F5F5F5]">
              THE CREATIVE SPACE
            </h2>
            <p className="text-sm md:text-base text-[#929292] max-w-2xl font-normal leading-relaxed">
              Explore selected design projects as floating framed artworks in an interactive three-dimensional studio. Drag to orbit the gallery space, focus on individual pieces, or inspect complete case studies.
            </p>
          </div>

          {/* Quick HUD Navigation Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handlePrev}
              className="p-3 bg-[#0a0a0a] border border-white/10 hover:border-white/30 text-[#929292] hover:text-white transition-all cursor-pointer"
              aria-label="Previous Artwork in 3D Gallery"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-4 py-2.5 bg-[#0e0e0e] border border-white/10 text-xs font-mono text-[#C0C0C0]">
              {selectedIndex + 1} / {studioArtworks.length}
            </span>

            <button
              onClick={handleNext}
              className="p-3 bg-[#0a0a0a] border border-white/10 hover:border-white/30 text-[#929292] hover:text-white transition-all cursor-pointer"
              aria-label="Next Artwork in 3D Gallery"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </SectionReveal3D>

        {/* 3D Studio Canvas Container */}
        <SectionReveal3D delay={0.1}>
          <div className="relative w-full h-[520px] md:h-[620px] bg-[#060606] border border-white/15 overflow-hidden shadow-2xl group">
            
            {/* Corner Precision Marks */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#C0C0C0] pointer-events-none z-20" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#C0C0C0] pointer-events-none z-20" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#C0C0C0] pointer-events-none z-20" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#C0C0C0] pointer-events-none z-20" />

            {/* Top Studio HUD */}
            <div className="absolute top-4 left-5 right-5 flex items-center justify-between pointer-events-none z-20">
              <div className="flex items-center gap-2.5 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#C0C0C0] tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#C0C0C0] animate-pulse" />
                <span>3D STUDIO · ORBITAL GALLERY</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#929292]">
                <span>DRAG TO ROTATE · CLICK ARTWORK TO INSPECT</span>
              </div>
            </div>

            {/* WebGL Mount for Three.js */}
            <div
              ref={mountRef}
              className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
              aria-label="Interactive 3D Art Gallery Room"
              role="img"
            />

            {/* Bottom Overlay: Focused Artwork Data Card */}
            <div className="absolute bottom-6 left-6 right-6 md:left-8 md:right-auto md:max-w-md bg-[#0a0a0a]/95 backdrop-blur-md border border-white/20 p-5 md:p-6 z-20 shadow-2xl space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#C0C0C0] px-2 py-0.5 bg-[#141414] border border-white/10">
                  {currentArtwork.category}
                </span>
                <span className="text-[10px] font-mono text-[#929292]">
                  {currentArtwork.year}
                </span>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-bold font-display text-[#F5F5F5]">
                  {currentArtwork.title}
                </h3>
                <p className="text-xs text-[#929292] line-clamp-2 mt-1">
                  {currentArtwork.brief}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5F5F5] hover:bg-[#C0C0C0] text-black text-xs font-mono font-semibold transition-all cursor-pointer"
                >
                  <span>INSPECT CASE STUDY</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <div className="text-[10px] font-mono text-zinc-500">
                  {currentArtwork.clientOrContext}
                </div>
              </div>
            </div>
          </div>
        </SectionReveal3D>
      </div>

      {/* Case Study Modal from 3D Gallery */}
      {isModalOpen && currentArtwork && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-md overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-4xl bg-[#0c0c0c] border border-white/20 shadow-2xl my-auto z-10 overflow-hidden text-[#F5F5F5]">
            <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between bg-[#101010]">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-[#C0C0C0]">
                  {currentArtwork.category} · {currentArtwork.year}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold font-display text-white">
                  {currentArtwork.title}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 text-[#929292] hover:text-white border border-white/10 hover:border-white/30 transition-all cursor-pointer bg-[#0a0a0a]"
                aria-label="Close Case Study"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="border border-white/10 bg-black overflow-hidden relative shadow-inner">
                <CreativeVisual
                  type={currentArtwork.svgVisualType}
                  title={currentArtwork.title}
                  isLightbox={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10 text-sm">
                <div>
                  <h4 className="text-xs font-mono uppercase text-[#C0C0C0] mb-2">Project Brief</h4>
                  <p className="text-xs sm:text-sm text-[#929292] leading-relaxed">{currentArtwork.brief}</p>
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase text-[#C0C0C0] mb-2">Client / Context</h4>
                  <p className="text-xs sm:text-sm text-white font-medium">{currentArtwork.clientOrContext}</p>
                  <h4 className="text-xs font-mono uppercase text-[#C0C0C0] mt-4 mb-2">Deliverables</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentArtwork.deliverables.map((item, i) => (
                      <span key={i} className="px-2.5 py-1 bg-[#141414] border border-white/10 text-xs font-mono text-white">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 border-t border-white/10 bg-[#101010] flex items-center justify-between">
              <span className="text-xs font-mono text-[#929292]">
                INSPECTED VIA 3D CREATIVE SPACE
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 bg-[#F5F5F5] hover:bg-[#C0C0C0] text-black text-xs font-mono font-semibold transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
