import { useState } from 'react';
import { TrendingUp, Activity, Timer, Award } from 'lucide-react';

const metrics = [
  {
    icon: TrendingUp,
    label: 'Peak PSNR',
    value: 32.5,
    unit: 'dB',
    target: 32.5,
    color: 'from-blue-500 to-cyan-500',
    description: 'Peak Signal-to-Noise Ratio on test dataset',
  },
  {
    icon: Activity,
    label: 'SSIM',
    value: 0.965,
    unit: '',
    target: 0.965,
    color: 'from-emerald-500 to-teal-500',
    description: 'Structural Similarity Index Measure',
  },
  {
    icon: Timer,
    label: 'Inference',
    value: 180,
    unit: 'ms',
    target: 180,
    color: 'from-violet-500 to-purple-500',
    description: 'Average processing time per image (GPU)',
  },
  {
    icon: Award,
    label: 'Accuracy',
    value: 96.5,
    unit: '%',
    target: 96.5,
    color: 'from-amber-500 to-orange-500',
    description: 'Artifact-free reconstruction rate',
  },
];

const trainingData = [
  { epoch: 1, loss: 0.85, psnr: 24.2 },
  { epoch: 5, loss: 0.62, psnr: 26.8 },
  { epoch: 10, loss: 0.45, psnr: 28.5 },
  { epoch: 20, loss: 0.28, psnr: 30.1 },
  { epoch: 30, loss: 0.18, psnr: 31.2 },
  { epoch: 40, loss: 0.12, psnr: 31.8 },
  { epoch: 50, loss: 0.08, psnr: 32.3 },
  { epoch: 60, loss: 0.06, psnr: 32.5 },
];

function AnimatedBar({ value, max, color }: { value: number; max: number; color: string }) {
  const percent = (value / max) * 100;
  return (
    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export default function Results() {
  const [activeTab, setActiveTab] = useState<'metrics' | 'training'>('metrics');

  return (
    <section id="results" className="py-24 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-cyan-400 tracking-widest uppercase">
            Performance
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-5">
            Results & Metrics
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Quantitative evaluation of model performance across standard image quality metrics.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 inline-flex">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'metrics'
                  ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Key Metrics
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'training'
                  ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Training Progress
            </button>
          </div>
        </div>

        {activeTab === 'metrics' ? (
          <div className="grid md:grid-cols-2 gap-6">
            {metrics.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} shadow-lg`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-500 font-medium">{metric.label}</p>
                      <p className="text-3xl font-bold text-white">
                        {metric.value}
                        <span className="text-lg text-slate-500 ml-1">{metric.unit}</span>
                      </p>
                    </div>
                  </div>
                  <AnimatedBar value={metric.value} max={metric.target * 1.1} color={metric.color} />
                  <p className="text-slate-500 text-sm mt-3">{metric.description}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-white font-bold text-lg mb-6">Training Progress (60 Epochs)</h3>
            {/* Chart visualization */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Loss Chart */}
              <div>
                <h4 className="text-slate-400 text-sm font-semibold mb-4 uppercase tracking-wider">
                  Training Loss
                </h4>
                <div className="relative h-48 border-l-2 border-b-2 border-slate-700">
                  <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M ${trainingData.map((d, i) => `${(i / (trainingData.length - 1)) * 400},${200 - (d.loss / 0.9) * 200}`).join(' L ')}`}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d={`M 0,200 L ${trainingData.map((d, i) => `${(i / (trainingData.length - 1)) * 400},${200 - (d.loss / 0.9) * 200}`).join(' L ')} L 400,200 Z`}
                      fill="url(#lossGrad)"
                    />
                    {trainingData.map((d, i) => (
                      <circle
                        key={i}
                        cx={(i / (trainingData.length - 1)) * 400}
                        cy={200 - (d.loss / 0.9) * 200}
                        r="4"
                        fill="#ef4444"
                      />
                    ))}
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-600 mt-2 translate-y-5">
                    <span>0</span>
                    <span>15</span>
                    <span>30</span>
                    <span>45</span>
                    <span>60</span>
                  </div>
                  <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-600">
                    <span>0.9</span>
                    <span>0.0</span>
                  </div>
                </div>
                <p className="text-center text-slate-500 text-xs mt-8">Epochs</p>
              </div>

              {/* PSNR Chart */}
              <div>
                <h4 className="text-slate-400 text-sm font-semibold mb-4 uppercase tracking-wider">
                  PSNR (dB)
                </h4>
                <div className="relative h-48 border-l-2 border-b-2 border-slate-700">
                  <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="psnrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M ${trainingData.map((d, i) => `${(i / (trainingData.length - 1)) * 400},${200 - ((d.psnr - 22) / 12) * 200}`).join(' L ')}`}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d={`M 0,200 L ${trainingData.map((d, i) => `${(i / (trainingData.length - 1)) * 400},${200 - ((d.psnr - 22) / 12) * 200}`).join(' L ')} L 400,200 Z`}
                      fill="url(#psnrGrad)"
                    />
                    {trainingData.map((d, i) => (
                      <circle
                        key={i}
                        cx={(i / (trainingData.length - 1)) * 400}
                        cy={200 - ((d.psnr - 22) / 12) * 200}
                        r="4"
                        fill="#3b82f6"
                      />
                    ))}
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-600 mt-2 translate-y-5">
                    <span>0</span>
                    <span>15</span>
                    <span>30</span>
                    <span>45</span>
                    <span>60</span>
                  </div>
                  <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-600">
                    <span>34</span>
                    <span>22</span>
                  </div>
                </div>
                <p className="text-center text-slate-500 text-xs mt-8">Epochs</p>
              </div>
            </div>

            {/* Training Config */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Optimizer', value: 'Adam' },
                { label: 'Learning Rate', value: '1e-4' },
                { label: 'Batch Size', value: '16' },
                { label: 'Total Epochs', value: '60' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-3 text-center">
                  <p className="text-slate-500 text-xs">{item.label}</p>
                  <p className="text-white font-mono font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
