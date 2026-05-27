"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ── Floating particle background ── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.4,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20,184,166,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      // draw faint connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(20,184,166,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

/* ── 3-D tilt card wrapper ── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(8px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.15s ease-out", willChange: "transform" }}
    >
      {children}
    </div>
  );
}

/* ── Animated counter ── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = target / 60;
      const tick = () => {
        start = Math.min(start + step, target);
        setCount(Math.floor(start));
        if (start < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ════════════════════════════════════════
   PAGE
════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden relative">
      <ParticleField />

      {/* Ambient glows */}
      <div className="fixed -top-40 -right-40 w-[500px] h-[500px] bg-teal-500/8 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 -left-40 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none z-0" />

      {/* ── Nav ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 h-16 border-b border-slate-700/40 bg-slate-900/80 backdrop-blur-sm sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-xl">
            🤖
          </div>
          <span className="font-bold text-white text-base">
            IT Helpdesk<span className="text-teal-400">.</span>AI
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#features" className="hover:text-teal-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-teal-400 transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-teal-400 transition-colors">Pricing</a>
        </div>
        <Link
          href="/chat"
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-teal-900/40"
        >
          🚀 Try Demo
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/25 text-teal-300 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          Enterprise-Grade AI Support
        </div>

        {/* 3D robot icon */}
        <TiltCard className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-slate-800 border border-teal-500/30 shadow-2xl shadow-teal-900/40 flex items-center justify-center text-6xl cursor-default">
          <div className="w-24 h-24 flex items-center justify-center text-5xl">🤖</div>
        </TiltCard>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
          Automate{" "}
          <em className="not-italic bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            70% of L1
          </em>
          <br />IT Support — Instantly
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          24/7 employee self-service for passwords, VPN, printers &amp; more.
          No tickets. No wait times. No frustration.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-16">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-teal-900/50"
          >
            🚀 Try Live Demo
          </Link>
          <a
            href="mailto:your-email@gmail.com?subject=IT%20Helpdesk%20AI%20Pilot%20Request"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600/50 text-slate-200 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            📧 Contact Sales
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { target: 70,  suffix: "%",  label: "L1 tickets automated" },
            { target: 126, suffix: "k",  label: "Avg annual savings ($)" },
            { target: 24,  suffix: "/7", label: "Always available" },
            { target: 10,  suffix: "s",  label: "Avg response time" },
          ].map(({ target, suffix, label }) => (
            <TiltCard
              key={label}
              className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-5 cursor-default"
            >
              <div className="text-3xl font-bold text-teal-400 leading-none mb-1">
                {suffix === "/7" ? "24/7" : suffix === "s" ? "<10s" : <><CountUp target={target} />{suffix}</>}
              </div>
              <div className="text-xs text-slate-500 font-medium">{label}</div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ── Chat preview card ── */}
      <section className="relative z-10 max-w-lg mx-auto px-6 pb-20">
        <TiltCard className="bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl shadow-teal-950/60 cursor-default">
          {/* header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-teal-600/90 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">🤖</div>
            <div>
              <p className="text-sm font-bold text-white">IT Helpdesk AI Assistant</p>
              <p className="text-xs text-teal-100/80">24/7 Support · Instant Answers · Enterprise Grade</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-300 font-medium">Online</span>
            </div>
          </div>
          {/* bubble */}
          <div className="px-5 py-5 bg-gradient-to-br from-slate-900 to-slate-950">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-sm shrink-0 mt-0.5">🤖</div>
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-slate-200 leading-relaxed max-w-xs">
                👋 Hello! I can help you with:<br />
                <span className="text-slate-400">• Password resets &nbsp;• VPN issues</span><br />
                <span className="text-slate-400">• Software install &nbsp;• Printers</span><br />
                <span className="text-slate-400">• WiFi setup &nbsp;• Performance</span><br /><br />
                <strong className="text-white">What can I help you with today?</strong>
              </div>
            </div>
          </div>
          {/* chips */}
          <div className="flex flex-wrap gap-2 px-5 py-3 border-t border-slate-700/40 bg-slate-900/60">
            {["Reset password", "VPN won't connect", "Printer issue", "Slow PC"].map((q) => (
              <span key={q} className="px-3 py-1.5 bg-slate-800 border border-slate-600/50 rounded-full text-xs text-slate-300">
                {q}
              </span>
            ))}
          </div>
          {/* fake input */}
          <div className="flex gap-2 px-5 py-4 border-t border-slate-700/40">
            <div className="flex-1 bg-slate-800 border border-teal-500/40 rounded-xl px-4 py-2.5 text-sm text-slate-500">
              Ask me anything…
            </div>
            <div className="bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-1.5">
              Send →
            </div>
          </div>
        </TiltCard>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="inline-block bg-teal-500/10 border border-teal-500/25 text-teal-300 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Everything your IT team needs — automated
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            From password resets to performance fixes, our AI handles repetitive L1 work so your team focuses on what matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { emoji: "🔐", title: "Password Reset",           desc: "Instant self-service with MFA verification. Resolved in under a minute, no ticket needed." },
            { emoji: "🌐", title: "VPN Troubleshooting",      desc: "Step-by-step fixes for Cisco AnyConnect with guided diagnostics and fallback steps." },
            { emoji: "💻", title: "Software Installation",    desc: "Guided install through Company Portal with automated approval workflows." },
            { emoji: "🖨️", title: "Printer Support",          desc: "Full printer troubleshooting — connections, driver reinstalls, spooler resets." },
            { emoji: "📡", title: "WiFi Connectivity",        desc: "Network diagnostics and guided fixes for corporate and guest WiFi networks." },
            { emoji: "⚡", title: "Performance Optimization", desc: "Systematic resolution for slowdowns, freezes, and high CPU usage — step by step." },
          ].map(({ emoji, title, desc }) => (
            <TiltCard key={title}>
              <div className="h-full bg-slate-900/80 border border-slate-700/50 rounded-2xl p-6 hover:border-teal-500/30 transition-colors cursor-default">
                <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-2xl mb-4">
                  {emoji}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="bg-slate-900/60 border border-slate-700/40 rounded-3xl p-10">
          <div className="text-center mb-12">
            <span className="inline-block bg-teal-500/10 border border-teal-500/25 text-teal-300 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Up and running in 4 simple steps
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              No complex setup. No coding required. Your team is self-sufficient from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: "1", title: "Deploy the Bot",   desc: "Embed our AI in your intranet, Slack, or Teams in under 15 minutes." },
              { num: "2", title: "Employee Asks",    desc: "Staff describe issues in plain language — no forms, no ticket numbers." },
              { num: "3", title: "AI Resolves",      desc: "The assistant guides them to a solution instantly, escalating only when needed." },
              { num: "4", title: "You Save Time",    desc: "Track deflection rates, savings & top issues in your analytics dashboard." },
            ].map(({ num, title, desc }) => (
              <div key={num} className="text-center">
                <div className="w-14 h-14 rounded-full bg-teal-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-900/60">
                  {num}
                </div>
                <h4 className="font-bold text-white mb-2 text-sm">{title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="inline-block bg-teal-500/10 border border-teal-500/25 text-teal-300 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-4">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-400 text-sm">Start free. Scale as you grow. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pilot */}
          <TiltCard>
            <div className="h-full bg-slate-900/80 border border-slate-700/50 rounded-2xl p-7 cursor-default">
              <h3 className="font-bold text-white mb-1">🚀 Pilot Program</h3>
              <div className="text-4xl font-extrabold text-teal-400 my-4">$0</div>
              <p className="text-xs text-slate-500 mb-6">First 90 days — no credit card</p>
              <ul className="space-y-2.5 mb-8">
                {["Full feature access", "24/7 AI support", "Up to 50 employees", "Onboarding assistance"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-teal-400 font-bold">✓</span>{f}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block w-full text-center border border-teal-500/40 text-teal-300 hover:bg-teal-500/10 font-semibold py-3 rounded-xl text-sm transition-colors">
                Request Pilot →
              </a>
              <p className="text-xs text-slate-600 text-center mt-3">⚡ Limited to first 5 companies</p>
            </div>
          </TiltCard>

          {/* Featured */}
          <TiltCard>
            <div className="h-full bg-gradient-to-br from-teal-600 to-cyan-500 rounded-2xl p-7 cursor-default relative shadow-2xl shadow-teal-900/50">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-teal-700 text-xs font-bold uppercase tracking-wide px-4 py-1 rounded-full shadow">
                Most Popular
              </div>
              <h3 className="font-bold text-white mb-1">🏢 Small Business</h3>
              <div className="text-4xl font-extrabold text-white my-4">$199<span className="text-lg font-medium">/mo</span></div>
              <p className="text-xs text-teal-100/75 mb-6">Billed monthly, cancel anytime</p>
              <ul className="space-y-2.5 mb-8">
                {["Up to 50 employees", "Priority email support", "Knowledge base updates", "Usage analytics dashboard"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white">
                    <span className="font-bold">✓</span>{f}
                  </li>
                ))}
              </ul>
              <a href="mailto:your-email@gmail.com?subject=Small%20Business%20Plan" className="block w-full text-center bg-white text-teal-700 hover:bg-teal-50 font-bold py-3 rounded-xl text-sm transition-colors shadow-md">
                Get Started →
              </a>
            </div>
          </TiltCard>

          {/* Enterprise */}
          <TiltCard>
            <div className="h-full bg-slate-900/80 border border-slate-700/50 rounded-2xl p-7 cursor-default">
              <h3 className="font-bold text-white mb-1">🏭 Enterprise</h3>
              <div className="text-4xl font-extrabold text-teal-400 my-4">Custom</div>
              <p className="text-xs text-slate-500 mb-6">Tailored to your organisation</p>
              <ul className="space-y-2.5 mb-8">
                {["Unlimited employees", "Custom integrations", "Dedicated SLA guarantee", "White-label option"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-teal-400 font-bold">✓</span>{f}
                  </li>
                ))}
              </ul>
              <a href="mailto:your-email@gmail.com?subject=Enterprise%20Plan" className="block w-full text-center border border-teal-500/40 text-teal-300 hover:bg-teal-500/10 font-semibold py-3 rounded-xl text-sm transition-colors">
                Talk to Sales →
              </a>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-500 rounded-2xl p-10 text-center shadow-2xl shadow-teal-900/50 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_80%_at_80%_20%,rgba(255,255,255,0.1),transparent)]" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to automate your IT helpdesk?
          </h2>
          <p className="text-teal-100 mb-8 text-sm">
            Get a free 90-day pilot. No credit card required. Full features from day one.
          </p>
          <a
            href="mailto:your-email@gmail.com?subject=IT%20Helpdesk%20AI%20Pilot%20Request"
            className="inline-block bg-white text-teal-700 font-bold px-8 py-3.5 rounded-xl hover:-translate-y-0.5 transition-all duration-200 shadow-md text-sm"
          >
            📧 Request Your Free Pilot →
          </a>
          <p className="text-teal-200 text-xs mt-4">⚡ Limited to first 5 companies</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>© 2025 <span className="font-semibold text-slate-300">IT Helpdesk AI</span> · Built with ❤️ for IT teams ·{" "}
          <a href="#" className="text-teal-400 hover:underline">Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}