'use client'

import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <main className="flex min-h-screen flex-col bg-black text-white selection:bg-blue-500/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">M</span>
            </div>
            ManimGen
          </div>
          <div className="flex gap-4">
            <Link 
              href="/sign-in"
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 text-sm bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300 mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Education</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
          Turn Math Concepts into <br />
          <span className="text-white">Motion Video</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Create stunning, animated visualizations for math teaching in seconds. 
          Powered by Manim, Gemini, and Cartesia TTS.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/sign-up"
            className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
          >
            Start Creating Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#demo"
            className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            Watch Demo
          </a>
        </div>

        {/* Floating Abstract Visuals */}
        <div className="mt-20 relative w-full max-w-5xl aspect-video rounded-xl border border-white/10 bg-black/40 shadow-2xl overflow-hidden backdrop-blur-sm group">
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-gray-600 font-mono text-sm">[Demo Video Placeholder]</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 text-left">
            <h3 className="text-xl font-bold">Visualizing Calculus</h3>
            <p className="text-gray-400 text-sm">Generated in 15 seconds</p>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-white/10 text-center text-gray-500 text-sm">
        <p>© 2024 ManimGen Hackathon. AI by Gemini & Cartesia.</p>
      </footer>
    </main>
  );
}
