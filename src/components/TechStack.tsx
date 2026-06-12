const technologies = [
  {
    name: 'TensorFlow',
    description: 'End-to-end deep learning framework for model training and deployment',
    color: 'from-orange-400 to-orange-600',
    icon: '🔶',
    features: ['Model Training', 'GPU Acceleration', 'TensorBoard Visualization'],
  },
  {
    name: 'PyTorch',
    description: 'Dynamic computation graphs for flexible model experimentation',
    color: 'from-red-400 to-red-600',
    icon: '🔥',
    features: ['Dynamic Graphs', 'Autograd', 'DataLoader Pipeline'],
  },
  {
    name: 'OpenCV',
    description: 'Computer vision library for image preprocessing and augmentation',
    color: 'from-green-400 to-emerald-600',
    icon: '👁️',
    features: ['Image I/O', 'Preprocessing', 'Color Transforms'],
  },
  {
    name: 'Python',
    description: 'Primary programming language for the entire ML pipeline',
    color: 'from-blue-400 to-yellow-500',
    icon: '🐍',
    features: ['NumPy/SciPy', 'Matplotlib', 'Scikit-Image'],
  },
  {
    name: 'CUDA',
    description: 'GPU-accelerated computing for faster training and inference',
    color: 'from-green-500 to-lime-500',
    icon: '⚡',
    features: ['GPU Training', 'Parallel Processing', 'cuDNN'],
  },
  {
    name: 'Jupyter',
    description: 'Interactive notebooks for experimentation and visualization',
    color: 'from-orange-500 to-amber-500',
    icon: '📓',
    features: ['Prototyping', 'Visualization', 'Documentation'],
  },
];

export default function TechStack() {
  return (
    <section id="tech" className="py-24 bg-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-amber-400 tracking-widest uppercase">
            Technology
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-5">
            Tech Stack & Tools
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            A powerful combination of industry-standard deep learning frameworks and
            computer vision libraries.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, i) => (
            <div
              key={i}
              className="group relative bg-slate-950/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{tech.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{tech.name}</h3>
                    <p className="text-slate-500 text-sm">{tech.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tech.features.map((feature, j) => (
                    <span
                      key={j}
                      className="bg-slate-800/80 text-slate-400 text-xs font-medium px-3 py-1 rounded-full border border-slate-700/50"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
