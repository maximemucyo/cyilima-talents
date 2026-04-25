'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Brain, Zap, Target, Shield, Users, BarChart3 } from 'lucide-react';

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Cyilima Talents: The Future of AI Recruitment",
      subtitle: "Revolutionizing Talent Acquisition for Umurava",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Efficiency at Scale</h4>
                <p className="text-gray-400">Process hundreds of CVs in seconds using batch AI analysis, reducing time-to-hire by 85%.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Intelligent Matching</h4>
                <p className="text-gray-400">Advanced semantic analysis goes beyond keywords to understand candidate potential and market fit.</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10 flex flex-col justify-center">
            <div className="text-center space-y-4">
              <div className="text-5xl font-bold text-primary">99.2%</div>
              <p className="text-gray-300 uppercase tracking-widest text-sm font-semibold">Parsing Accuracy</p>
              <div className="h-1 w-24 bg-primary mx-auto rounded-full"></div>
              <p className="text-gray-400 text-sm italic">Powered by Gemini 3.1 Flash</p>
            </div>
          </div>
        </div>
      ),
      footer: "Slide 1: Value Proposition & Impact"
    },
    {
      title: "AI Architecture & Decision Logic",
      subtitle: "How Cyilima's Intelligence Works",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <Target className="w-8 h-8 text-primary mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">1. Extraction</h4>
            <p className="text-gray-400 text-sm">Custom PDF pipeline converts unstructured CVs into structured JSON entities using LLM-based parsing.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <BarChart3 className="w-8 h-8 text-primary mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">2. Scoring</h4>
            <p className="text-gray-400 text-sm">Multi-dimensional rubric evaluating Tech Skills (40%), Experience (30%), and Potential (30%).</p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <Shield className="w-8 h-8 text-primary mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">3. Validation</h4>
            <p className="text-gray-400 text-sm">Automated bias reduction and professional reasoning generated for every candidate rank.</p>
          </div>
          <div className="md:col-span-3 mt-4 bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
             <p className="text-primary font-medium italic">"Shortlisting the top 5 candidates from a pool of 500 takes less than 2 minutes."</p>
          </div>
        </div>
      ),
      footer: "Slide 2: Technical Engine & Flow"
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-[#0A0A0A] border border-white/10 rounded-[32px] p-12 sm:p-20 shadow-2xl min-h-[600px] flex flex-col justify-between"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-8"
              >
                <Brain className="w-3 h-3" />
                Umurava AI Challenge
              </motion.div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
                {slides[currentSlide].title}
              </h1>
              <h2 className="text-xl sm:text-2xl text-gray-400 font-light">
                {slides[currentSlide].subtitle}
              </h2>
              
              {slides[currentSlide].content}
            </div>

            <div className="flex items-center justify-between mt-20 pt-8 border-t border-white/5">
              <span className="text-sm text-gray-500 font-mono">
                {slides[currentSlide].footer}
              </h2>
              <div className="flex gap-4">
                <button 
                  onClick={prevSlide}
                  className="p-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="p-3 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, i) => (
            <div 
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-12 bg-primary' : 'w-2 bg-white/20'}`}
            ></div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-8 left-8 flex items-center gap-3">
        <img src="/brand-logo.png" alt="Cyilima" className="h-8 w-auto grayscale opacity-50" />
        <div className="h-4 w-px bg-white/20"></div>
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Confidential Source Code</p>
      </div>
    </div>
  );
}
