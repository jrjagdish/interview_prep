// components/Dashboard/CTA.js
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';

export default function CTA() {
  const features = [
    { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and never shared' },
    { icon: Zap, title: 'AI Powered', desc: 'Real-time feedback and analysis' },
    { icon: Globe, title: 'Global Community', desc: 'Join 50,000+ aspiring developers' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-8 md:p-12">
      <div className="relative z-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Interview Skills?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands of successful candidates who aced their interviews with our platform.
            Get personalized coaching, mock interviews, and career guidance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button className="btn-primary flex items-center justify-center space-x-2">
              <span>Start Free Trial</span>
              <ArrowRight size={20} />
            </button>
            <button className="px-8 py-3 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors">
              Schedule Demo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <feature.icon size={20} className="text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/10 to-purple-500/10 rounded-full -translate-y-32 translate-x-32" />
    </div>
  );
}