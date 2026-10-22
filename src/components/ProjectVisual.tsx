interface ProjectVisualProps {
  id: string;
  category: string;
  accentColor: string;
  isLarge?: boolean;
}

export default function ProjectVisual({ id, category, accentColor, isLarge = false }: ProjectVisualProps) {
  const heightClass = isLarge ? 'h-64 sm:h-80' : 'h-48';

  return (
    <div
      className={`relative w-full ${heightClass} bg-black border-b border-zinc-850 overflow-hidden flex items-center justify-center group-hover:scale-[1.01] transition-transform duration-300`}
    >
      {/* Background subtle grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Render bespoke visual per project ID in Silver & Black */}
      {id === 'neurovision-studio' && (
        <svg viewBox="0 0 600 320" className="w-full h-full p-4" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ambient silver blur circle */}
          <circle cx="300" cy="160" r="110" fill="#ffffff" fillOpacity="0.04" filter="blur(30px)" />
          
          {/* Target object bounding boxes in metallic silver */}
          <rect x="70" y="50" width="160" height="200" stroke="#e4e4e7" strokeWidth="1.5" strokeDasharray="4 2" rx="4" />
          <text x="76" y="70" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="600">PERSON :: 0.984</text>
          
          <rect x="360" y="80" width="180" height="170" stroke="#a1a1aa" strokeWidth="1.5" rx="4" />
          <text x="368" y="100" fill="#d4d4d8" fontSize="11" fontFamily="monospace" fontWeight="600">DEVICE :: 0.961</text>
          
          {/* Neural Activation Nodes */}
          <g opacity="0.85">
            <line x1="240" y1="90" x2="310" y2="130" stroke="#71717a" strokeWidth="1.2" />
            <line x1="240" y1="160" x2="310" y2="130" stroke="#71717a" strokeWidth="1.2" />
            <line x1="240" y1="230" x2="310" y2="190" stroke="#71717a" strokeWidth="1.2" />
            <line x1="310" y1="130" x2="370" y2="160" stroke="#d4d4d8" strokeWidth="1.5" />
            <line x1="310" y1="190" x2="370" y2="160" stroke="#d4d4d8" strokeWidth="1.5" />
            
            <circle cx="240" cy="90" r="6" fill="#18181b" stroke="#a1a1aa" strokeWidth="2" />
            <circle cx="240" cy="160" r="6" fill="#18181b" stroke="#a1a1aa" strokeWidth="2" />
            <circle cx="240" cy="230" r="6" fill="#18181b" stroke="#a1a1aa" strokeWidth="2" />
            
            <circle cx="310" cy="130" r="8" fill="#27272a" stroke="#e4e4e7" strokeWidth="2" />
            <circle cx="310" cy="190" r="8" fill="#27272a" stroke="#e4e4e7" strokeWidth="2" />
            
            <circle cx="370" cy="160" r="10" fill="#3f3f46" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* Telemetry banner */}
          <rect x="20" y="270" width="560" height="34" rx="6" fill="#09090b" stroke="#27272a" />
          <text x="36" y="292" fill="#a1a1aa" fontSize="11" fontFamily="monospace">GRAD-CAM HEATMAP ACTIVATION: CONV_LAYER_4</text>
          <text x="460" y="292" fill="#ffffff" fontSize="11" fontFamily="monospace">60.2 FPS · 8ms</text>
        </svg>
      )}

      {id === 'pulsegrid-platform' && (
        <svg viewBox="0 0 600 320" className="w-full h-full p-4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="450" cy="120" r="100" fill="#ffffff" fillOpacity="0.04" filter="blur(25px)" />
          
          {/* Header bar */}
          <rect x="40" y="30" width="520" height="36" rx="6" fill="#09090b" stroke="#27272a" />
          <circle cx="60" cy="48" r="4" fill="#71717a" />
          <circle cx="75" cy="48" r="4" fill="#a1a1aa" />
          <circle cx="90" cy="48" r="4" fill="#ffffff" />
          <text x="120" y="52" fill="#a1a1aa" fontSize="11" fontFamily="monospace">service-mesh.cluster.prod/telemetry</text>

          {/* Waveform / Telemetry Graph Line in Bright Silver */}
          <path
            d="M 50 160 L 110 160 L 130 110 L 150 190 L 180 140 L 220 140 L 240 90 L 260 210 L 290 150 L 340 150 L 360 80 L 380 200 L 420 140 L 480 140 L 510 120 L 550 140"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Metric cards */}
          <rect x="50" y="210" width="150" height="65" rx="8" fill="#09090b" stroke="#27272a" />
          <text x="64" y="234" fill="#71717a" fontSize="10" fontFamily="monospace">THROUGHPUT</text>
          <text x="64" y="258" fill="#ffffff" fontSize="16" fontFamily="monospace" fontWeight="700">152,400 evt/s</text>

          <rect x="220" y="210" width="150" height="65" rx="8" fill="#09090b" stroke="#27272a" />
          <text x="234" y="234" fill="#71717a" fontSize="10" fontFamily="monospace">P99 LATENCY</text>
          <text x="234" y="258" fill="#e4e4e7" fontSize="16" fontFamily="monospace" fontWeight="700">1.82 ms</text>

          <rect x="390" y="210" width="160" height="65" rx="8" fill="#09090b" stroke="#27272a" />
          <text x="404" y="234" fill="#71717a" fontSize="10" fontFamily="monospace">PACKET LOSS</text>
          <text x="404" y="258" fill="#ffffff" fontSize="16" fontFamily="monospace" fontWeight="700">0.0001 %</text>
        </svg>
      )}

      {id === 'omnisynthetix' && (
        <svg viewBox="0 0 400 220" className="w-full h-full p-4" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Orchestrator Center Node */}
          <circle cx="200" cy="110" r="30" fill="#18181b" stroke="#e4e4e7" strokeWidth="2" />
          <text x="200" y="114" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="700" textAnchor="middle">ORCHESTRATOR</text>

          {/* Connected Tool Nodes */}
          <line x1="200" y1="80" x2="110" y2="45" stroke="#71717a" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="200" y1="80" x2="290" y2="45" stroke="#71717a" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="200" y1="140" x2="110" y2="175" stroke="#71717a" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="200" y1="140" x2="290" y2="175" stroke="#71717a" strokeWidth="1.5" strokeDasharray="3 3" />

          <rect x="50" y="30" width="110" height="30" rx="6" fill="#09090b" stroke="#3f3f46" />
          <text x="105" y="49" fill="#e4e4e7" fontSize="9" fontFamily="monospace" textAnchor="middle">Vector Memory</text>

          <rect x="240" y="30" width="110" height="30" rx="6" fill="#09090b" stroke="#3f3f46" />
          <text x="295" y="49" fill="#e4e4e7" fontSize="9" fontFamily="monospace" textAnchor="middle">Python REPL</text>

          <rect x="50" y="160" width="110" height="30" rx="6" fill="#09090b" stroke="#3f3f46" />
          <text x="105" y="179" fill="#e4e4e7" fontSize="9" fontFamily="monospace" textAnchor="middle">REST Tool Dispatch</text>

          <rect x="240" y="160" width="110" height="30" rx="6" fill="#09090b" stroke="#3f3f46" />
          <text x="295" y="179" fill="#e4e4e7" fontSize="9" fontFamily="monospace" textAnchor="middle">Schema Synthesizer</text>
        </svg>
      )}

      {id === 'kinesis-slam' && (
        <svg viewBox="0 0 400 220" className="w-full h-full p-4" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Radar / LiDAR scan circles in silver */}
          <circle cx="200" cy="110" r="90" stroke="#71717a" strokeWidth="0.8" strokeOpacity="0.3" />
          <circle cx="200" cy="110" r="60" stroke="#a1a1aa" strokeWidth="0.8" strokeOpacity="0.4" />
          <circle cx="200" cy="110" r="30" stroke="#e4e4e7" strokeWidth="0.8" strokeOpacity="0.6" />
          
          {/* Robot chassis position */}
          <circle cx="200" cy="110" r="7" fill="#27272a" stroke="#ffffff" strokeWidth="2" />
          <line x1="200" y1="110" x2="225" y2="85" stroke="#ffffff" strokeWidth="2" />

          {/* Point cloud obstacles */}
          <circle cx="140" cy="80" r="3" fill="#ffffff" />
          <circle cx="150" cy="72" r="3" fill="#d4d4d8" />
          <circle cx="165" cy="65" r="3" fill="#ffffff" />
          <circle cx="260" cy="150" r="3" fill="#d4d4d8" />
          <circle cx="270" cy="155" r="3" fill="#ffffff" />
          <circle cx="250" cy="60" r="3" fill="#e4e4e7" />

          {/* Coordinate overlay */}
          <text x="20" y="25" fill="#e4e4e7" fontSize="10" fontFamily="monospace">PARTICLE SLAM: N=500</text>
          <text x="20" y="40" fill="#a1a1aa" fontSize="9" fontFamily="monospace">POSE: [x: 4.12, y: -2.31, θ: 42.1°]</text>
        </svg>
      )}

      {id === 'zenith-design-studio' && (
        <svg viewBox="0 0 400 220" className="w-full h-full p-4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="20" width="320" height="180" fill="#000000" stroke="#71717a" strokeWidth="1" />
          <line x1="40" y1="80" x2="360" y2="80" stroke="#27272a" strokeWidth="0.5" />
          <line x1="200" y1="20" x2="200" y2="200" stroke="#27272a" strokeWidth="0.5" />

          <text x="55" y="65" fill="#ffffff" fontSize="32" fontFamily="sans-serif" fontWeight="900" letterSpacing="-1">Z E N I T H</text>
          
          <path d="M 60 160 C 120 100, 180 180, 240 120 S 320 170, 340 110" stroke="#e4e4e7" strokeWidth="2.5" fill="none" />
          <circle cx="240" cy="120" r="5" fill="#ffffff" />
          <circle cx="180" cy="180" r="4" fill="#a1a1aa" />
          
          <rect x="215" y="95" width="130" height="24" fill="#27272a" stroke="#52525b" />
          <text x="225" y="111" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="600">GENERATIVE VECTOR SPEC</text>
        </svg>
      )}

      {id === 'echostream-audio' && (
        <svg viewBox="0 0 400 220" className="w-full h-full p-4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(40, 40)">
            {[30, 45, 75, 90, 120, 110, 85, 95, 130, 100, 70, 80, 60, 40, 25, 20].map((h, i) => (
              <rect
                key={i}
                x={i * 20}
                y={130 - h}
                width="14"
                height={h}
                rx="2"
                fill="#ffffff"
                fillOpacity={0.4 + (i % 3) * 0.25}
              />
            ))}
            <line x1="0" y1="130" x2="320" y2="130" stroke="#3f3f46" strokeWidth="1" />
          </g>
          <text x="40" y="25" fill="#e4e4e7" fontSize="10" fontFamily="monospace">WASM FFT SPECTRUM · 48,000 Hz</text>
        </svg>
      )}

      {/* Fallback pattern */}
      {!['neurovision-studio', 'pulsegrid-platform', 'omnisynthetix', 'kinesis-slam', 'zenith-design-studio', 'echostream-audio'].includes(id) && (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
            {category}
          </div>
          <span className="text-xs font-mono text-zinc-400">Interactive Project Workspace</span>
        </div>
      )}
    </div>
  );
}
