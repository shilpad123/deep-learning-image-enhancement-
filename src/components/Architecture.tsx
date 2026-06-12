import { useState } from 'react';
import { Database, Cpu, Layers, Zap, BarChart3, ImageIcon, RotateCcw } from 'lucide-react';

const pipelineSteps = [
  {
    icon: Database,
    title: 'Data Input',
    desc: 'Load noisy/degraded image',
    color: 'from-cyan-500 to-blue-500',
    shadowColor: 'shadow-cyan-500/30',
  },
  {
    icon: Layers,
    title: 'Feature Extraction',
    desc: 'Multi-layer CNN extracts features',
    color: 'from-blue-500 to-indigo-500',
    shadowColor: 'shadow-blue-500/30',
  },
  {
    icon: Cpu,
    title: 'Deep Processing',
    desc: 'Residual blocks learn patterns',
    color: 'from-indigo-500 to-violet-500',
    shadowColor: 'shadow-indigo-500/30',
  },
  {
    icon: Zap,
    title: 'Reconstruction',
    desc: 'Upsampling layers rebuild image',
    color: 'from-violet-500 to-purple-500',
    shadowColor: 'shadow-violet-500/30',
  },
  {
    icon: BarChart3,
    title: 'Optimization',
    desc: 'Loss functions refine quality',
    color: 'from-purple-500 to-pink-500',
    shadowColor: 'shadow-purple-500/30',
  },
  {
    icon: ImageIcon,
    title: 'Enhanced Output',
    desc: 'Clean high-resolution result',
    color: 'from-pink-500 to-rose-500',
    shadowColor: 'shadow-pink-500/30',
  },
];

const networkLayers = [
  { name: 'Input', filters: 3, size: '256×256', color: '#06b6d4', height: 80 },
  { name: 'Conv1', filters: 64, size: '256×256', color: '#3b82f6', height: 100 },
  { name: 'Conv2', filters: 128, size: '128×128', color: '#6366f1', height: 120 },
  { name: 'ResBlock×8', filters: 128, size: '128×128', color: '#8b5cf6', height: 140 },
  { name: 'Conv3', filters: 256, size: '64×64', color: '#a855f7', height: 130 },
  { name: 'UpSample1', filters: 64, size: '128×128', color: '#d946ef', height: 110 },
  { name: 'UpSample2', filters: 64, size: '256×256', color: '#ec4899', height: 100 },
  { name: 'Output', filters: 3, size: '256×256', color: '#10b981', height: 80 },
];

export default function Architecture() {
  const [rotateX, setRotateX] = useState(15);
  const [rotateY, setRotateY] = useState(-20);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  // Auto rotation
  useState(() => {
    if (!autoRotate) return;
    let frame: number;
    let angle = -20;
    const animate = () => {
      angle += 0.3;
      setRotateY(Math.sin(angle * 0.02) * 25);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (autoRotate) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateY(x * 40);
    setRotateX(-y * 20 + 10);
  };

  return (
    <section id="architecture" className="py-24 bg-slate-950 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-emerald-400 tracking-widest uppercase">
            Architecture
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-5">
            3D CNN Architecture
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Explore the deep residual network architecture with interactive 3D visualization.
            Inspired by SRCNN and EDSR for image super-resolution.
          </p>
        </div>

        {/* 3D Pipeline View */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Processing Pipeline</h3>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                autoRotate
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
              }`}
            >
              <RotateCcw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
              {autoRotate ? 'Auto-Rotating' : 'Manual Mode'}
            </button>
          </div>

          {/* 3D Pipeline Container */}
          <div
            className="relative h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => !autoRotate && (setRotateX(15), setRotateY(-20))}
            style={{ perspective: '1200px' }}
          >
            {/* 3D Scene */}
            <div
              className="relative flex items-center gap-4 transition-transform duration-100"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              }}
            >
              {pipelineSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="relative" style={{ transformStyle: 'preserve-3d' }}>
                    {/* 3D Card */}
                    <div
                      className={`relative w-32 h-44 rounded-2xl bg-gradient-to-br ${step.color} p-[2px] shadow-2xl ${step.shadowColor} transition-all duration-300 hover:scale-110`}
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: `translateZ(${i * 10}px)`,
                      }}
                    >
                      {/* Card Face */}
                      <div className="w-full h-full bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center text-center"
                        style={{ transformStyle: 'preserve-3d', transform: 'translateZ(2px)' }}>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-3 shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-white font-bold text-sm mb-1">{step.title}</h4>
                        <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
                      </div>

                      {/* 3D Side effect */}
                      <div
                        className={`absolute inset-y-0 -right-2 w-2 bg-gradient-to-b ${step.color} rounded-r-lg opacity-60`}
                        style={{ transform: 'rotateY(90deg) translateZ(64px)' }}
                      />
                      <div
                        className={`absolute inset-x-0 -bottom-2 h-2 bg-gradient-to-r ${step.color} rounded-b-lg opacity-40`}
                        style={{ transform: 'rotateX(-90deg) translateZ(88px)' }}
                      />
                    </div>

                    {/* Connection Arrow */}
                    {i < pipelineSteps.length - 1 && (
                      <div
                        className="absolute top-1/2 -right-4 w-4 h-[2px] bg-gradient-to-r from-white/50 to-white/20"
                        style={{ transform: 'translateZ(20px)' }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-white/50" />
                      </div>
                    )}

                    {/* Floating particles */}
                    <div
                      className="absolute w-2 h-2 rounded-full bg-white/30 animate-pulse"
                      style={{
                        top: '20%',
                        left: '10%',
                        transform: `translateZ(${30 + i * 5}px)`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Floor reflection */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-40 bg-gradient-to-t from-blue-500/5 to-transparent rounded-full blur-3xl"
              style={{ transform: 'rotateX(60deg) translateZ(-100px)' }}
            />
          </div>

          <p className="text-center text-slate-500 text-sm mt-4">
            {autoRotate ? 'Click "Manual Mode" to control rotation with mouse' : 'Move mouse over the pipeline to rotate • Click "Auto-Rotating" to animate'}
          </p>
        </div>

        {/* 3D Neural Network Layers */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Neural Network Layers</h3>

          <div
            className="relative h-[450px] flex items-center justify-center"
            style={{ perspective: '1500px' }}
          >
            {/* 3D Network Visualization */}
            <div
              className="relative flex items-end justify-center gap-3"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(10deg) rotateY(${rotateY * 0.5}deg)`,
              }}
            >
              {networkLayers.map((layer, i) => {
                const isActive = activeLayer === i;
                const width = 50 + (layer.filters / 256) * 40;

                return (
                  <div
                    key={i}
                    className="relative group cursor-pointer"
                    style={{ transformStyle: 'preserve-3d' }}
                    onMouseEnter={() => setActiveLayer(i)}
                    onMouseLeave={() => setActiveLayer(null)}
                  >
                    {/* 3D Layer Block */}
                    <div
                      className={`relative rounded-lg transition-all duration-300 ${isActive ? 'scale-110' : ''}`}
                      style={{
                        width: `${width}px`,
                        height: `${layer.height}px`,
                        transformStyle: 'preserve-3d',
                        transform: `translateZ(${isActive ? 30 : 0}px)`,
                      }}
                    >
                      {/* Front face */}
                      <div
                        className="absolute inset-0 rounded-lg border border-white/10"
                        style={{
                          background: `linear-gradient(135deg, ${layer.color}dd, ${layer.color}88)`,
                          transform: 'translateZ(15px)',
                          boxShadow: isActive ? `0 0 30px ${layer.color}66` : `0 0 15px ${layer.color}33`,
                        }}
                      />

                      {/* Top face */}
                      <div
                        className="absolute inset-x-0 h-[30px] rounded-t-lg origin-bottom"
                        style={{
                          background: `linear-gradient(135deg, ${layer.color}ff, ${layer.color}cc)`,
                          transform: 'rotateX(90deg) translateZ(0px)',
                          top: '-15px',
                        }}
                      />

                      {/* Right face */}
                      <div
                        className="absolute inset-y-0 w-[30px] rounded-r-lg origin-left"
                        style={{
                          background: `linear-gradient(135deg, ${layer.color}99, ${layer.color}66)`,
                          transform: 'rotateY(90deg) translateZ(0px)',
                          right: '-15px',
                        }}
                      />

                      {/* Layer info on hover */}
                      {isActive && (
                        <div
                          className="absolute -top-20 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center whitespace-nowrap z-50 shadow-2xl"
                          style={{ transform: 'translateZ(50px)' }}
                        >
                          <p className="text-white font-bold text-sm">{layer.name}</p>
                          <p className="text-slate-400 text-xs mt-1">{layer.filters} filters</p>
                          <p className="text-slate-500 text-xs">{layer.size}</p>
                          <div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-slate-700"
                          />
                        </div>
                      )}
                    </div>

                    {/* Connection lines */}
                    {i < networkLayers.length - 1 && (
                      <div
                        className="absolute top-1/2 -right-3 w-3 flex items-center"
                        style={{ transform: 'translateZ(15px)' }}
                      >
                        <div className="w-full h-[2px] bg-gradient-to-r from-white/40 to-white/10" />
                        <div className="absolute right-0 w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                      </div>
                    )}

                    {/* Layer label */}
                    <p
                      className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap transition-colors ${isActive ? 'text-white' : 'text-slate-500'}`}
                      style={{ transform: 'translateZ(15px)' }}
                    >
                      {layer.name}
                    </p>
                  </div>
                );
              })}

              {/* Data flow animation */}
              <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white/60 animate-ping"
                    style={{
                      left: `${10 + i * 20}%`,
                      top: '50%',
                      transform: `translateZ(40px)`,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: '2s',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Ground plane */}
            <div
              className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-[200px] rounded-[50%] bg-gradient-radial from-violet-500/10 via-blue-500/5 to-transparent"
              style={{
                transform: 'rotateX(75deg)',
                background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%)',
              }}
            />
          </div>

          <p className="text-center text-slate-500 text-sm mt-4">
            Hover over each layer to see details • Height represents filter count
          </p>
        </div>

        {/* Layer Details Table */}
        <div className="mt-16 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              Layer Specifications
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="text-left text-sm font-semibold text-slate-400 px-6 py-3">#</th>
                  <th className="text-left text-sm font-semibold text-slate-400 px-6 py-3">Layer</th>
                  <th className="text-left text-sm font-semibold text-slate-400 px-6 py-3">Filters</th>
                  <th className="text-left text-sm font-semibold text-slate-400 px-6 py-3">Output Size</th>
                  <th className="text-left text-sm font-semibold text-slate-400 px-6 py-3">Activation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Input Layer', filters: '3 (RGB)', size: '256×256', activation: '—' },
                  { name: 'Conv2D + ReLU', filters: '64', size: '256×256', activation: 'ReLU' },
                  { name: 'Conv2D + BN + ReLU', filters: '128', size: '128×128', activation: 'ReLU' },
                  { name: 'Residual Block ×8', filters: '128', size: '128×128', activation: 'ReLU' },
                  { name: 'Conv2D + BN + ReLU', filters: '256', size: '64×64', activation: 'ReLU' },
                  { name: 'PixelShuffle (2×)', filters: '64', size: '128×128', activation: 'ReLU' },
                  { name: 'PixelShuffle (2×)', filters: '64', size: '256×256', activation: 'ReLU' },
                  { name: 'Conv2D (Output)', filters: '3', size: '256×256', activation: 'Tanh' },
                ].map((layer, i) => (
                  <tr key={i} className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3">
                      <span
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold"
                        style={{ background: `${networkLayers[i]?.color}33`, color: networkLayers[i]?.color }}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-white font-medium">{layer.name}</td>
                    <td className="px-6 py-3 text-slate-400 font-mono text-sm">{layer.filters}</td>
                    <td className="px-6 py-3">
                      <span className="bg-slate-800 text-slate-300 font-mono text-xs px-2.5 py-1 rounded-md">
                        {layer.size}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-400 text-sm">{layer.activation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
