import { Brain, ExternalLink, Code2, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-violet-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Image Enhancement with Deep Learning</h3>
              <p className="text-slate-500 text-sm">CNN-based Image Quality Enhancement • 2025</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {[
              { icon: Code2, label: 'Source Code', href: '#' },
              { icon: ExternalLink, label: 'Portfolio', href: '#' },
              { icon: Mail, label: 'Email', href: '#' },
            ].map((social, i) => {
              const Icon = social.icon;
              return (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-700 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            Built with Python, TensorFlow, PyTorch & OpenCV
          </p>
          <p className="text-slate-600 text-sm">
            © 2025 Deep Learning Project. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
