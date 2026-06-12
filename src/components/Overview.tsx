import { Calendar, Target, Cpu, Layers } from 'lucide-react';

const highlights = [
  {
    icon: Calendar,
    label: 'Duration',
    value: 'Feb 2025 – May 2025',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Target,
    label: 'Objective',
    value: 'Noise Reduction & Super-Resolution',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Cpu,
    label: 'Model',
    value: 'Convolutional Neural Networks',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Layers,
    label: 'Tech Stack',
    value: 'TensorFlow, PyTorch, OpenCV',
    color: 'from-orange-500 to-amber-500',
  },
];

export default function Overview() {
  return (
    <section id="overview" className="py-24 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-400 tracking-widest uppercase">
            Overview
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-5">
            Project at a Glance
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            An end-to-end deep learning pipeline designed to restore and enhance degraded images
            using state-of-the-art convolutional neural network architectures.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="text-white font-semibold text-lg">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Description */}
        <div className="mt-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">What This Project Does</h3>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                This project leverages the power of deep convolutional neural networks to
                automatically enhance image quality. The model learns to map degraded input
                images (noisy, low-resolution, or compressed) to their clean, high-resolution
                counterparts.
              </p>
              <p>
                By training on large datasets of image pairs, the CNN learns complex patterns
                of noise and degradation, enabling it to effectively denoise images, perform
                super-resolution upscaling, and remove compression artifacts — all in a single
                forward pass.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-2xl blur-lg" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Key Achievements
              </h4>
              <ul className="space-y-3">
                {[
                  'Reduced image noise by up to 40% while preserving fine details',
                  'Achieved 2x–4x super-resolution with minimal artifacts',
                  'Real-time inference speed suitable for practical applications',
                  'Robust performance across diverse image types and degradation levels',
                  'Improved PSNR (Peak Signal-to-Noise Ratio) by ~5 dB on test sets',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
