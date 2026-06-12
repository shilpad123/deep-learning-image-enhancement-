import { Brain, ChevronDown, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Neural network background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/95" />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-400/20 animate-pulse"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-5 py-2 mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-300 tracking-wide">
            Deep Learning Project • Feb 2025 – May 2025
          </span>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-br from-blue-500 to-violet-600 p-4 rounded-2xl shadow-2xl shadow-blue-500/25">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          Image Enhancement
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Using Deep Learning
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          A CNN-based learning model that enhances image quality by reducing noise,
          removing artifacts, and improving resolution — powered by TensorFlow, PyTorch, and OpenCV.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#demo"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="w-5 h-5 group-hover:animate-spin" />
            View Demo
          </a>
          <a
            href="#architecture"
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-3.5 rounded-xl font-semibold backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            Explore Architecture
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#overview"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white/80 transition-colors animate-bounce"
      >
        <ChevronDown className="w-8 h-8" />
      </a>
    </section>
  );
}
