"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="text-6xl md:text-7xl mb-6">🤖</div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          IT Helpdesk AI Assistant
        </h1>
        <p className="text-xl md:text-2xl text-blue-200 mb-6">
          Automate 70% of L1 IT Support Tickets
        </p>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          24/7 instant answers for password resets, VPN issues, printer problems, and more.
          Free up your IT team for strategic work.
        </p>
        <Link
          href="/chat"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg"
        >
          🚀 Try Live Demo
        </Link>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          What Our AI Can Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard emoji="🔐" title="Password Reset" description="Instant step-by-step password reset guidance with MFA verification" />
          <FeatureCard emoji="🌐" title="VPN Troubleshooting" description="Quick fixes for Cisco AnyConnect and general VPN issues" />
          <FeatureCard emoji="💻" title="Software Installation" description="Guided installation through Company Portal" />
          <FeatureCard emoji="🖨️" title="Printer Support" description="Complete printer troubleshooting from connections to spooler" />
          <FeatureCard emoji="📡" title="WiFi Connectivity" description="Network diagnostics and connection fixes" />
          <FeatureCard emoji="⚡" title="Performance Optimization" description="Systematic computer slowdown resolution" />
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white/5 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Why Companies Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <BenefitCard value="70%" label="Reduction in L1 tickets" />
            <BenefitCard value="90%" label="Faster resolution time" />
            <BenefitCard value="$126k" label="Annual savings for 500 employees" />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Automate Your IT Helpdesk?
          </h2>
          <p className="text-blue-100 mb-6">
            Get a free 90-day pilot. No credit card required.
          </p>
          <Link
            href="/chat"
            className="inline-block bg-white text-purple-700 px-6 py-2 rounded-full font-bold hover:scale-105 transition-all duration-300"
          >
            Start Free Pilot →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-400 text-sm">
        <p>© 2025 IT Helpdesk AI. Built with ❤️ for IT teams.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
      <div className="text-4xl mb-3">{emoji}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function BenefitCard({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">{value}</div>
      <div className="text-gray-300">{label}</div>
    </div>
  );
}