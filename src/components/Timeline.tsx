import { BookOpen, Database, Cpu, TestTube, BarChart3, Rocket } from 'lucide-react';

const milestones = [
  {
    month: 'Feb 2025',
    title: 'Research & Planning',
    description:
      'Conducted literature review on image super-resolution (SRCNN, EDSR, ESPCN). Defined project scope, objectives, and evaluation metrics.',
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    month: 'Feb–Mar 2025',
    title: 'Data Collection & Preprocessing',
    description:
      'Curated training dataset with paired noisy/clean images. Implemented data augmentation pipeline using OpenCV for diverse degradation patterns.',
    icon: Database,
    color: 'from-cyan-500 to-teal-500',
  },
  {
    month: 'Mar 2025',
    title: 'Model Architecture Design',
    description:
      'Designed deep residual CNN architecture with skip connections and PixelShuffle upsampling. Implemented in both TensorFlow and PyTorch.',
    icon: Cpu,
    color: 'from-teal-500 to-emerald-500',
  },
  {
    month: 'Mar–Apr 2025',
    title: 'Training & Experimentation',
    description:
      'Trained model for 60 epochs on GPU. Experimented with different loss functions (MSE, perceptual loss) and hyperparameter tuning.',
    icon: TestTube,
    color: 'from-emerald-500 to-violet-500',
  },
  {
    month: 'Apr 2025',
    title: 'Evaluation & Optimization',
    description:
      'Evaluated model using PSNR and SSIM metrics. Optimized inference speed and model size for practical deployment.',
    icon: BarChart3,
    color: 'from-violet-500 to-purple-500',
  },
  {
    month: 'May 2025',
    title: 'Final Delivery & Documentation',
    description:
      'Finalized model, prepared comprehensive documentation, and demonstrated results with before/after image comparisons.',
    icon: Rocket,
    color: 'from-purple-500 to-pink-500',
  },
];

export default function Timeline() {
  return (
    <section id="timeline" className="py-24 bg-slate-950">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-rose-400 tracking-widest uppercase">
            Timeline
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-5">
            Project Journey
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            A 4-month journey from initial research to a fully functional image enhancement model.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-violet-500 to-pink-500" />

          <div className="space-y-12">
            {milestones.map((milestone, i) => {
              const Icon = milestone.icon;
              const isLeft = i % 2 === 0;

              return (
                <div
                  key={i}
                  className={`relative flex items-center gap-8 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-row`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'} pl-20 md:pl-0`}>
                    <div
                      className={`bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 ${
                        isLeft ? 'md:mr-8' : 'md:ml-8'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {milestone.month}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2 mb-2">{milestone.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Node */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${milestone.color} shadow-lg flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="flex-1 hidden md:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
