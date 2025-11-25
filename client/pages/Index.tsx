import { useState, useRef, useEffect } from "react";
import { 
  Zap, 
  MessageSquare, 
  CheckCircle, 
  Shield, 
  Send, 
  Gauge, 
  Network, 
  Key, 
  Database, 
  Wifi,
  Settings,
  ChevronRight
} from "lucide-react";

export default function Index() {
  const menuItems = [
    { id: "sentinel", label: "SentinelOne", icon: Shield, color: "text-purple-500" },
    { id: "crowdstrike", label: "CrowdStrike", icon: Shield, color: "text-blue-500" },
    { id: "checkpoint", label: "CheckPoint", icon: Shield, color: "text-red-500" },
    { id: "paloalto", label: "Palo Alto", icon: Shield, color: "text-orange-500" },
    { id: "fortinet", label: "Fortinet", icon: Shield, color: "text-yellow-500" },
    { id: "proofpoint", label: "Proofpoint", icon: Shield, color: "text-pink-500" },
    { id: "azure", label: "Azure", icon: Shield, color: "text-cyan-500" },
    { id: "okta", label: "Okta", icon: Shield, color: "text-green-500" },
    { id: "aws", label: "AWS", icon: Shield, color: "text-orange-400" },
    { id: "gcp", label: "GCP", icon: Shield, color: "text-blue-400" },
    { id: "trendmicro", label: "TrendMicro", icon: Shield, color: "text-red-400" },
    { id: "other", label: "Other Sources", icon: Shield, color: "text-slate-400" },
  ];

  // Refs to measure sidebar items and container
  const menuContainerRef = useRef<HTMLElement | null>(null);
  const menuItemRefs = useRef<Record<string, HTMLElement | null>>({});

  // State to store computed line coordinates
  const [lines, setLines] = useState<Array<{ d: string; color: string }>>([]);

  // small node position in SVG coords
  const smallNode = { x: 100, y: 300 };

  // No pivot: lines will connect directly to the small node edge
  const smallNodeEdgeOffset = 18; // how far from center the path endpoint should be (radius approx)

  useEffect(() => {
    function computeLines() {
      const container = menuContainerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();

      const newLines: typeof lines = [];
      // Use a warm red / orange palette similar to the reference
      const strokeColors = [
        "#ef4444",
        "#f97316",
        "#f97316",
        "#ef4444",
        "#f97316",
        "#ef4444",
        "#f97316",
        "#ef4444",
        "#f97316",
        "#ef4444",
        "#f97316",
        "#ef4444",
      ];

      menuItems.forEach((item, idx) => {
        const el = menuItemRefs.current[item.id];
        if (!el) return;
        const r = el.getBoundingClientRect();

        // Measure the icon inside the button for ending point
        const iconEl = el.querySelector('svg');

        const svg = document.querySelector('svg');
        if (!svg) return;
        const svgRect = svg.getBoundingClientRect();

        let x1: number;
        let y1: number;
        if (iconEl) {
          const ir = (iconEl as SVGElement).getBoundingClientRect();
          // Use icon right edge so path visibly touches the icon (menu item)
          x1 = ir.right - svgRect.left; // icon right edge x in svg coords
          y1 = ir.top + (ir.height / 2) - svgRect.top; // icon center y in svg coords
        } else {
          // fallback to button right edge
          x1 = r.right - svgRect.left;
          y1 = (r.top + r.bottom) / 2 - svgRect.top;
        }

    // Endpoint is on the small node rim (left side), so paths touch the small circle directly
    const x2 = smallNode.x - smallNodeEdgeOffset;
    const y2 = smallNode.y;

    // Create a quadratic Bezier path that fans towards the small node rim.
    // Control point is placed left of both endpoints so curves arc left.
    const distance = Math.abs(x2 - x1);
    const leftMost = Math.min(x1, x2);
    const midX = leftMost - Math.max(60, distance * 0.6);
    const midIndex = (menuItems.length - 1) / 2;
    const verticalSpread = 20;
    const controlY = y1 + (idx - midIndex) * verticalSpread;
    const d = `M ${x1.toFixed(2)} ${y1.toFixed(2)} Q ${midX.toFixed(2)} ${controlY.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`;

        newLines.push({ d, color: strokeColors[idx % strokeColors.length] });
      });

      setLines(newLines);
    }

    computeLines();
    window.addEventListener('resize', computeLines);
    window.addEventListener('scroll', computeLines, true);
    const ro = new ResizeObserver(computeLines);
    if (menuContainerRef.current) ro.observe(menuContainerRef.current);

    return () => {
      window.removeEventListener('resize', computeLines);
      window.removeEventListener('scroll', computeLines, true);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex flex-col h-screen">
        {/* Top Stats Bar */}
        <div className="border-b border-slate-800 bg-slate-950/30 backdrop-blur-sm px-3 py-2">
          <div className="grid grid-cols-7 gap-2 max-w-full">
            {/* Stat 1 */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider leading-tight">Threat Signal Volume</span>
              <span className="text-xl font-bold text-cyan-400 leading-tight">338</span>
              <span className="text-xs text-slate-600 leading-tight">Vertical Threats</span>
              <span className="text-base font-bold text-slate-300 leading-tight">295</span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider leading-tight">Non-Malicious Detections</span>
              <span className="text-xl font-bold text-green-400 leading-tight">7</span>
              <span className="text-xs text-slate-600 leading-tight">MTTI</span>
              <span className="text-base font-bold text-slate-300 leading-tight">4.9s</span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider leading-tight">Escalation</span>
              <span className="text-xl font-bold text-red-400 leading-tight">0</span>
              <span className="text-xs text-slate-600 leading-tight">MTTE</span>
              <span className="text-base font-bold text-slate-300 leading-tight">19.2min</span>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider leading-tight">MTTI</span>
              <span className="text-xl font-bold text-yellow-400 leading-tight">19.2min</span>
            </div>

            {/* Stat 5 */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider leading-tight">MTTR</span>
              <span className="text-xl font-bold text-purple-400 leading-tight">14.18min</span>
            </div>

            {/* Stat 6 */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider leading-tight">Cost Saved</span>
              <span className="text-xl font-bold text-blue-400 leading-tight">$7,325</span>
            </div>

            {/* Stat 7 */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider leading-tight">FTE Saved</span>
              <span className="text-xl font-bold text-pink-400 leading-tight">0.61</span>
            </div>
          </div>
        </div>

        {/* Content Below Top Bar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="bg-slate-950/50 backdrop-blur-sm p-6 flex flex-col">
            <nav className="space-y-2 flex-1" ref={(el) => (menuContainerRef.current = el)}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    ref={(el) => (menuItemRefs.current[item.id] = el)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 text-slate-400 hover:text-white hover:bg-slate-800/30 text-sm`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${item.color}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-800">
              <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all text-sm">
                <Settings className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">Settings</span>
              </button>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="flex-1 p-8 relative overflow-hidden">
            {/* SVG Network Visualization */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 600">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="brainGradient">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#1e40af" />
                  <stop offset="100%" stopColor="#0c1221" />
                </radialGradient>
              </defs>

              {/* Connection Lines from Sidebar Menu Items to Small 533 Node (generated) */}
              {lines.map((ln, i) => (
                <path
                  key={i}
                  d={ln.d}
                  stroke={ln.color}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={0.78}
                  filter="url(#glow)"
                />
              ))}

              {/* (Removed pivot) curves now end directly on the small circle rim */}

              {/* Connection Line from Small 533 to Big Central 533 - start from small node right edge */}
              <line x1="130" y1="300" x2="640" y2="300" stroke="#3b82f6" strokeWidth="2" opacity="0.6" filter="url(#glow)" />

              {/* Connection Lines */}
              <line x1="100" y1="300" x2="500" y2="250" stroke="#1e40af" strokeWidth="1" opacity="0.4" />
              <line x1="100" y1="300" x2="500" y2="350" stroke="#7c3aed" strokeWidth="1" opacity="0.4" />
              <line x1="100" y1="300" x2="450" y2="200" stroke="#ec4899" strokeWidth="1" opacity="0.3" />
              
              <line x1="500" y1="250" x2="700" y2="300" stroke="#06b6d4" strokeWidth="1" opacity="0.5" filter="url(#glow)" />
              <line x1="500" y1="350" x2="700" y2="300" stroke="#10b981" strokeWidth="1" opacity="0.5" filter="url(#glow)" />
              
              <line x1="700" y1="300" x2="900" y2="200" stroke="#3b82f6" strokeWidth="1" opacity="0.4" />
              <line x1="700" y1="300" x2="900" y2="350" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />
              <line x1="700" y1="300" x2="950" y2="450" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />

              <line x1="300" y1="500" x2="700" y2="300" stroke="#ef4444" strokeWidth="1" opacity="0.3" />
              <line x1="1000" y1="100" x2="700" y2="300" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />

              {/* Left Node - Brain Image */}
              <image x="70" y="270" width="30" height="30" href="/public/assets/brain.png" />

              {/* Central Brain */}
              <image x="640" y="240" width="120" height="120" href="/assets/brain.png" />

              {/* Top Right Node */}
              <circle cx="900" cy="200" r="25" fill="#10b981" opacity="0.7" filter="url(#glow)" />
              <circle cx="900" cy="200" r="20" fill="none" stroke="#34d399" strokeWidth="2" opacity="0.6" />
              <text x="900" y="205" textAnchor="middle" fontSize="14" fill="#6ee7b7" fontWeight="bold"></text>

              {/* Middle Right Node */}
              <circle cx="950" cy="450" r="20" fill="#f59e0b" opacity="0.6" filter="url(#glow)" />
              <circle cx="950" cy="450" r="16" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.5" />
              <text x="950" y="455" textAnchor="middle" fontSize="12" fill="#fcd34d" fontWeight="bold"></text>

              {/* Bottom Left Node */}
              <circle cx="300" cy="500" r="20" fill="#ef4444" opacity="0.6" filter="url(#glow)" />
              <circle cx="300" cy="500" r="16" fill="none" stroke="#f87171" strokeWidth="2" opacity="0.5" />

              {/* Top Far Right Node */}
              <circle cx="1000" cy="100" r="18" fill="#06b6d4" opacity="0.6" filter="url(#glow)" />
              <circle cx="1000" cy="100" r="14" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.5" />

              {/* Right Node */}
              <circle cx="900" cy="350" r="22" fill="#7c3aed" opacity="0.6" filter="url(#glow)" />
              <circle cx="900" cy="350" r="18" fill="none" stroke="#a78bfa" strokeWidth="2" opacity="0.5" />

              {/* Top Left Node */}
              <circle cx="450" cy="200" r="18" fill="#ec4899" opacity="0.6" filter="url(#glow)" />
              <circle cx="450" cy="200" r="14" fill="none" stroke="#f472b6" strokeWidth="2" opacity="0.5" />

              {/* Connection node near left */}
              <circle cx="500" cy="250" r="16" fill="#3b82f6" opacity="0.5" filter="url(#glow)" />
              <circle cx="500" cy="250" r="12" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.4" />

              {/* Connection node near left bottom */}
              <circle cx="500" cy="350" r="16" fill="#10b981" opacity="0.5" filter="url(#glow)" />
              <circle cx="500" cy="350" r="12" fill="none" stroke="#6ee7b7" strokeWidth="1" opacity="0.4" />
            </svg>

            {/* Data Labels Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-6xl font-bold text-cyan-400 drop-shadow-lg"></div>
                <div className="text-sm text-slate-400 mt-2"></div>
              </div>
            </div>

            {/* Right Side Info Panels */}
            <div className="absolute right-8 top-1/4 space-y-6 pointer-events-auto">
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 backdrop-blur-sm w-48">
                <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Escalated</div>
                <div className="text-2xl font-bold text-green-400 mt-2">0</div>
              </div>

              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 backdrop-blur-sm w-48">
                <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Autoresolved</div>
                <div className="text-2xl font-bold text-yellow-400 mt-2">302</div>
              </div>
              </div>
            </div>

          </div>
        </div>
      </div>
  );
}

