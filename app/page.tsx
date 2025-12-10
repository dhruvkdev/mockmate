"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Play,
  Check,
  Menu,
  X,
  Star,
  Video,
  Mic,
  MoreVertical,
  Globe,
  PhoneOff,
  Settings,
  Github,
  Twitter,
  Linkedin,
  ChevronRight,
  Search,
  Bell,
  LayoutGrid,
  Users,
  User,
  MessageSquare,
  MousePointer2,
  Activity,
} from "lucide-react";

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const prices = {
    basic: billingCycle === "monthly" ? 499 : 4990,
    pro: billingCycle === "monthly" ? 1499 : 14990,
    enterprise: billingCycle === "monthly" ? 4999 : 49990,
  };
  const cycleLabel = billingCycle === "monthly" ? "/mo" : "/yr";

  return (
    <main className="min-h-screen font-sans bg-[#F9FAFB] text-[#111827] overflow-x-hidden selection:bg-purple-200">
      
      {/* ================= HEADER ================= */}
      <header className="absolute top-0 w-full z-50 pt-8 px-6 lg:px-20">
        <nav className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm">
              <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
            </div>
            MockMate
          </div>
          <div className="hidden md:flex items-center gap-10 text-white/90 text-sm font-medium">
            <Link href="#" className="hover:text-white hover:underline decoration-2 underline-offset-4 transition-all">Home</Link>
            <Link href="#" className="hover:text-white transition-opacity">How it works</Link>
            <Link href="#" className="hover:text-white transition-opacity">Plans</Link>
            <Link href="#" className="hover:text-white transition-opacity">Resources</Link>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {isSignedIn ? (
              <Link href="/dashboard">
                <button className="bg-white text-[#6D28D9] px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition transform active:scale-95">
                  Go to Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <button className="text-white text-sm font-semibold hover:opacity-80">Login</button>
                </Link>
                <Link href="/sign-up">
                  <button className="bg-white text-[#6D28D9] px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition transform active:scale-95">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-20 overflow-hidden bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#4C1D95]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#A78BFA] rounded-full mix-blend-screen filter blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#6D28D9] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 -translate-x-1/4 translate-y-1/4"></div>

        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="text-white space-y-8">
            <h1 className="text-5xl lg:text-[4rem] font-bold leading-[1.1] tracking-tight">
              AI-powered mocks to <br />
              <span className="text-purple-200">ace your next interview</span>
            </h1>
            <p className="text-purple-100 text-lg lg:text-xl max-w-lg leading-relaxed opacity-90 font-light">
              Practice real-world interviews with an AI coach that listens, scores, and explains what to fix — before you face the actual recruiter.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                <button className="bg-white text-[#6D28D9] px-8 py-4 rounded-full font-bold text-base shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_35px_rgba(0,0,0,0.2)] hover:bg-gray-50 transition transform hover:-translate-y-1 flex items-center gap-2 group">
                    {isSignedIn ? "Go to Dashboard" : "Start a free mock"} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                </button>
              </Link>
              <div className="flex flex-col">
              <div className="flex flex-raw">

                <div className="flex gap-1 text-yellow-400 mb-1">
                  {[1, 2, 3, 4].map((i) => <Star key={i} size={18} fill="currentColor" className="drop-shadow-sm" />)}
                </div>
                <div className=" gap-1 text-white-400 mb-1 ml-1">
                  {[1].map((i) => <Star key={i} size={18} fill="currentColor" className="drop-shadow-sm" />)}
                </div>
                </div>
                <span className="text-xs text-purple-100 font-medium tracking-wide">LOVED BY 100+ CANDIDATES</span>
              </div>
            </div>
          </div>
          {/* ... (Rest of the Hero Section remains the same) ... */}
          <div className="relative perspective-1000">
            <div className="absolute -left-36 bottom-6 bg-white rounded-2xl p-12 shadow-[0_20px_40px_rgba(0,0,0,0.2)] w-[240px] z-20 hidden lg:block animate-float">
               <div className="flex justify-between items-center mb-3"><span className="text-xs font-bold text-gray-700">Interview Readiness</span><MoreVertical size={14} className="text-gray-400"/></div>
               <div className="relative w-full aspect-square max-w-[180px] mx-auto">
                        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                           {[20, 40, 60, 80].map((r, i) => (
                               <polygon key={i} points="50,10 89,28 97,69 71,98 29,98 3,69 11,28" 
                                   transform={`scale(${r/100})`} className="origin-center"
                                   fill="none" stroke="#E5E7EB" strokeWidth="1" />
                           ))}
                           <line x1="50" y1="50" x2="50" y2="10" stroke="#E5E7EB" strokeWidth="1" />
                           <line x1="50" y1="50" x2="89" y2="28" stroke="#E5E7EB" strokeWidth="1" />
                           <line x1="50" y1="50" x2="97" y2="69" stroke="#E5E7EB" strokeWidth="1" />
                           <line x1="50" y1="50" x2="71" y2="98" stroke="#E5E7EB" strokeWidth="1" />
                           <line x1="50" y1="50" x2="29" y2="98" stroke="#E5E7EB" strokeWidth="1" />
                           <line x1="50" y1="50" x2="3" y2="69" stroke="#E5E7EB" strokeWidth="1" />
                           <line x1="50" y1="50" x2="11" y2="28" stroke="#E5E7EB" strokeWidth="1" />

                           <polygon points="50,20 85,35 80,75 60,90 40,90 15,60 25,35" 
                               fill="rgba(167, 139, 250, 0.2)" stroke="#8B5CF6" strokeWidth="1.5" />
                               
                           <text x="50" y="5" textAnchor="middle" className="text-[5px] fill-gray-900 font-medium">Professionalism</text>
                           <text x="95" y="25" textAnchor="start" className="text-[5px] fill-gray-900 font-medium">Attitude</text>
                           <text x="100" y="70" textAnchor="start" className="text-[5px] fill-gray-900 font-medium">Creativity</text>
                           <text x="75" y="105" textAnchor="middle" className="text-[5px] fill-gray-900 font-medium">Communication</text>
                           <text x="25" y="105" textAnchor="middle" className="text-[5px] fill-gray-900 font-medium">Leadership</text>
                           <text x="0" y="70" textAnchor="end" className="text-[5px] fill-gray-900 font-medium">Teamwork</text>
                           <text x="5" y="25" textAnchor="end" className="text-[5px] fill-gray-900 font-medium">Sociability</text>
                        </svg>
                        <MousePointer2 className="absolute top-1/2 right-0 text-black w-4 h-4 fill-black translate-x-1/2 translate-y-2 drop-shadow-md" />
                    </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-3 shadow-2xl border border-white/50 relative z-10">
              <div className="flex items-center gap-4 mb-4 px-2 py-1 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div><div className="w-2.5 h-2.5 rounded-full bg-green-400"></div></div>
                <div className="flex-1 bg-gray-50 h-6 rounded-md flex items-center px-3 text-[10px] text-gray-400">mockmate.ai/mock/sde-role</div>
              </div>
              <div className="grid grid-cols-12 gap-3 h-[320px]">
                 <div className="col-span-3 bg-gray-50 rounded-xl p-2 hidden sm:flex flex-col gap-2"><div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div><div className="h-20 bg-gray-200 rounded-lg"></div><div className="h-20 bg-gray-200 rounded-lg"></div></div>
                 <div className="col-span-12 sm:col-span-9 bg-gray-900 rounded-xl relative overflow-hidden group">
                    <img src="/interview_landing.png" alt="Candidate" className="w-full h-full object-cover opacity-90"/>
                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> REC 04:22</div>
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white px-3 py-2 rounded-lg text-xs font-mono border border-white/10"><div className="text-gray-300 text-[10px] uppercase">Confidence Score</div><div className="text-xl font-bold text-green-400">94%</div></div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3"><button className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur text-white"><Mic size={16}/></button><button className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur text-white"><Video size={16}/></button><button className="p-2 rounded-full bg-red-500 text-white shadow-lg"><PhoneOff size={16}/></button></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* ... Rest of the landing page sections (Dark Feature Strip, Powerful Features, Pricing, CTA, Footer) remain unchanged ... */}
      <section className="relative bg-[#0F0A1F] pt-32 pb-48 px-6 overflow-visible">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#2E1065] via-[#0F0A1F] to-[#000000] opacity-80"></div>
         
         <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 bg-white/5 text-gray-200 text-sm font-medium mb-12 backdrop-blur-md shadow-lg">
             AI-powered mock interview coach <span className="text-yellow-400">✨</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-[3.25rem] font-medium leading-[1.15] tracking-tight mb-8">
            <span className="text-white">Practice full-length mock interviews with an AI coach that tracks your</span>{" "}
            <span className="text-white/40">clarity, confidence, structure, and technical depth in real time.</span>
          </h2>
         </div>

         <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-20">
            <div className="relative w-32 h-32 md:w-36 md:h-36 bg-[#121212] rounded-full flex items-center justify-center border-[5px] border-[#F9FAFB] shadow-2xl">
               <svg className="absolute w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
                  <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                  <text className="text-[9px] font-bold uppercase tracking-[2.5px] fill-white">
                     <textPath href="#circlePath" startOffset="0%">
                        • WATCH DEMO • START PRACTICING NOW • 
                     </textPath>
                  </text>
               </svg>
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center pl-1 shadow-lg transform transition hover:scale-110 cursor-pointer">
                  <Play fill="black" size={20} className="text-black"/>
               </div>
            </div>
         </div>
      </section>

      {/* ================= POWERFUL FEATURES GRID ================= */}
      <section className="pt-32 pb-24 px-6 lg:px-20 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <h2 className="text-4xl md:text-5xl font-bold text-[#111827] leading-tight tracking-tight">
            Everything you need <br/>to ace the interview
          </h2>
          <p className="text-gray-500 max-w-md text-base leading-relaxed md:text-right">
            From DSA and system design to HR and behavioral rounds, our AI mocks mirror the interviews you&apos;ll actually face.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1: Realistic Simulations (Restored Visuals) */}
          <div className="group relative rounded-3xl overflow-hidden bg-[#7C3AED] text-white flex flex-col h-[500px] shadow-2xl transition hover:-translate-y-2 duration-300">
             <div className="p-6 h-[60%] relative">
               <div className="bg-white rounded-xl overflow-hidden shadow-2xl h-full border border-white/20 relative">
                   <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover"/>
                   <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg text-black border border-gray-100">
                       <div className="flex items-center gap-2 mb-1">
                           <div className="w-1 h-3 bg-purple-500 rounded-full"></div>
                           <span className="text-[10px] font-bold text-gray-500 uppercase">Conversation now</span>
                       </div>
                       <p className="text-xs font-medium leading-snug">&quot;Walk me through your background and tell me why you&apos;re interested in this role.&quot;</p>
                   </div>
               </div>
             </div>
             <div className="p-8 mt-auto relative">
                <h3 className="text-2xl font-bold mb-2">Realistic Simulations</h3>
                <p className="text-purple-100 text-sm leading-relaxed opacity-90">
                  Experience the pressure of a real interview room with adaptive AI mock interviewers that challenge you like real hiring managers.
                </p>
                <MousePointer2 className="absolute bottom-8 right-8 text-white w-8 h-8 drop-shadow-lg fill-white/20" />
             </div>
          </div>

          {/* Card 2: AI Video Analytics (Enhanced) */}
          <div className="group rounded-3xl overflow-hidden bg-white border border-gray-200 flex flex-col h-[500px] shadow-lg hover:shadow-2xl transition hover:-translate-y-2 duration-300">
             <div className="p-6 h-[60%] flex items-center justify-center bg-[#F9FAFB]">
                <div className="w-full h-full bg-[#111827] rounded-xl shadow-2xl p-4 relative overflow-hidden flex items-center justify-center">
                    {/* Header */}
                    <div className="absolute top-4 left-4 text-white text-[10px] font-medium flex items-center gap-2">
                        <Activity size={12} className="text-purple-400"/> AI Video Analytics
                    </div>
                    
                    {/* Radar Chart Visual */}
                    <div className="relative w-56 h-56 mt-4 flex items-center justify-center">
                         {/* Abstract Radar SVG */}
                         <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(167,139,250,0.4)]">
                            <circle cx="50" cy="50" r="40" stroke="#374151" strokeWidth="0.5" fill="none" />
                            <circle cx="50" cy="50" r="25" stroke="#374151" strokeWidth="0.5" fill="none" />
                            <circle cx="50" cy="50" r="10" stroke="#374151" strokeWidth="0.5" fill="none" />
                            
                            <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="#374151" strokeWidth="0.5" />
                            
                            {/* Data Shape */}
                            <path d="M50 15 L80 40 L70 75 L30 75 L20 40 Z" fill="rgba(124, 58, 237, 0.4)" stroke="#8B5CF6" strokeWidth="1.5" />
                         </svg>
                         
                         {/* Center Score */}
                         <div className="absolute inset-0 flex items-center justify-center flex-col">
                             <span className="text-3xl font-bold text-white">94%</span>
                             <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Score</span>
                         </div>
                         
                         {/* Floating Labels */}
                         <div className="absolute top-4 text-[9px] text-gray-400 bg-gray-900/80 px-1.5 rounded">Confidence</div>
                         <div className="absolute bottom-8 right-4 text-[9px] text-gray-400 bg-gray-900/80 px-1.5 rounded">Clarity</div>
                         <div className="absolute bottom-8 left-4 text-[9px] text-gray-400 bg-gray-900/80 px-1.5 rounded">Pacing</div>
                    </div>
                </div>
             </div>
             <div className="p-8 mt-auto">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Performance Reports</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Get detailed breakdowns of your speaking pace, filler words, eye contact, and overall sentiment after every mock.
                </p>
             </div>
          </div>

          {/* Card 3: Skill Analysis (EXACT UI REQUEST) */}
          <div className="group rounded-3xl overflow-hidden bg-white border border-gray-200 flex flex-col h-[500px] shadow-lg hover:shadow-2xl transition hover:-translate-y-2 duration-300">
             <div className="p-6 h-[60%] flex items-center justify-center bg-[#F9FAFB]">
                <div className="w-full h-full bg-[#111827] rounded-xl shadow-2xl p-5 relative overflow-hidden flex flex-col justify-center gap-6">
                    
                    {/* Top Row: Circular Scores */}
                    <div className="flex gap-4">
                        {/* Circle 1 */}
                        <div className="bg-[#1F2937] p-3 rounded-xl flex-1 border border-gray-700 flex flex-col items-center shadow-lg">
                            <div className="w-8 h-8 rounded-full border border-purple-500 flex items-center justify-center text-[10px] text-purple-400 mb-1 bg-purple-500/10 font-bold">AI</div>
                            <div className="text-2xl font-bold text-white">80%</div>
                            <div className="text-[9px] text-gray-500 mt-1 uppercase tracking-wider">AI Video Score</div>
                        </div>
                        {/* Circle 2 */}
                        <div className="bg-[#1F2937] p-3 rounded-xl flex-1 border border-gray-700 flex flex-col items-center shadow-lg">
                             <div className="w-8 h-8 rounded-full border border-orange-500 flex items-center justify-center text-[10px] text-orange-400 mb-1 bg-orange-500/10 font-bold">wk</div>
                            <div className="text-2xl font-bold text-white">75%</div>
                            <div className="text-[9px] text-gray-500 mt-1 uppercase tracking-wider">Workmap Score</div>
                        </div>
                    </div>
                    
                    {/* Bottom Row: Progress Bars */}
                    <div className="space-y-4 px-1">
                        {/* Presentation */}
                        <div>
                            <div className="flex justify-between text-[10px] font-medium text-gray-400 mb-1.5">
                                <span>Presentation</span>
                                <span className="text-white">60%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className="w-[60%] h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                            </div>
                        </div>

                        {/* Opportunistic */}
                        <div>
                            <div className="flex justify-between text-[10px] font-medium text-gray-400 mb-1.5">
                                <span>Opportunistic</span>
                                <span className="text-white">85%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className="w-[85%] h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                            </div>
                        </div>

                        {/* Business Acumen */}
                        <div>
                            <div className="flex justify-between text-[10px] font-medium text-gray-400 mb-1.5">
                                <span>Business Acumen</span>
                                <span className="text-white">40%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className="w-[40%] h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            </div>
                        </div>
                    </div>

                </div>
             </div>
             <div className="p-8 mt-auto">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Skill Gap Analysis</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Our AI breaks down your soft skills and technical answers to highlight exactly what to improve before real interviews.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* ================= PRICING SECTION ================= */}
      <section className="bg-[#F3F4F6] py-24 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-6">
              Choose the Perfect Plan for <br/> Your Interview Prep
            </h2>
            <p className="text-gray-500 mb-8">
              Our Starter plan is ideal for students and working professionals who want structured, affordable mock interview practice.
            </p>
            
            <div className="inline-flex items-center p-1.5 bg-white rounded-full border border-gray-200 shadow-sm mt-4">
              <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-[#7C3AED] text-white shadow' : 'text-gray-500'}`}>Monthly</button>
              <button onClick={() => setBillingCycle('yearly')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-[#7C3AED] text-white shadow' : 'text-gray-500'}`}>Yearly <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 uppercase">-20% OFF</span></button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            {/* Basic */}
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col hover:shadow-2xl transition duration-300">
              <div className="bg-gray-50 p-8 border-b border-gray-100">
                <h3 className="text-gray-900 text-xl font-bold">Starter</h3>
                <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#111827]">₹{prices.basic}</span>
                    <span className="text-gray-400">{cycleLabel}</span>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-4 mb-8 text-sm text-gray-600">
                   {['5 AI mock interviews / month', 'Basic answer-level feedback', 'Overall score & summary', 'Access to student community'].map(i => (
                     <div key={i} className="flex items-center gap-3">
                       <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                         <Check size={12} className="text-[#7C3AED]"/>
                       </div>
                       {i}
                     </div>
                   ))}
                </div>
                <button className="w-full py-3.5 rounded-xl border-2 border-gray-100 text-[#111827] font-bold hover:border-[#7C3AED] hover:text-[#7C3AED] transition">Choose Plan</button>
              </div>
            </div>

            {/* Pro - Enhanced */}
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border-2 border-[#7C3AED] flex flex-col relative transform md:-translate-y-4 z-10 shadow-purple-200/50">
              <div className="bg-[#7C3AED] p-8 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                 <h3 className="text-xl font-bold relative z-10">Pro Learner</h3>
                 <div className="mt-4 relative z-10 flex items-baseline gap-1">
                    <span className="text-5xl font-bold">₹{prices.pro}</span>
                    <span className="text-purple-200">{cycleLabel}</span>
                 </div>
                 <div className="absolute top-6 right-6 bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-white/20">Popular</div>
              </div>
              <div className="p-8">
                <div className="space-y-4 mb-8 text-sm text-gray-600">
                   {['Unlimited AI mock interviews', 'Advanced behavioral & technical analysis', 'AI-powered resume & profile review', 'Priority chat support'].map(i => (
                     <div key={i} className="flex items-center gap-3">
                       <div className="w-5 h-5 rounded-full bg-[#7C3AED] flex items-center justify-center">
                         <Check size={12} className="text-white"/>
                       </div>
                       <span className="font-medium text-gray-700">{i}</span>
                     </div>
                   ))}
                </div>
                <button className="w-full py-3.5 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] shadow-lg shadow-purple-200 transition transform hover:-translate-y-0.5">Start Free Trial</button>
              </div>
            </div>

             {/* Enterprise */}
             <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col hover:shadow-2xl transition duration-300">
              <div className="bg-gray-50 p-8 border-b border-gray-100">
                <h3 className="text-gray-900 text-xl font-bold">Coaching</h3>
                <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#111827]">₹{prices.enterprise}</span>
                    <span className="text-gray-400">{cycleLabel}</span>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-4 mb-8 text-sm text-gray-600">
                   {['1-on-1 interview coaching', 'Role & company-specific mocks', 'Offer negotiation guidance', 'Dedicated mentor access'].map(i => (
                     <div key={i} className="flex items-center gap-3">
                       <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                         <Check size={12} className="text-[#7C3AED]"/>
                       </div>
                       {i}
                     </div>
                   ))}
                </div>
                <button className="w-full py-3.5 rounded-xl border-2 border-gray-100 text-[#111827] font-bold hover:border-[#7C3AED] hover:text-[#7C3AED] transition">Contact Us</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-12 px-6 lg:px-20 mb-12">
        <div className="max-w-[1400px] mx-auto bg-[#7C3AED] rounded-[3rem] p-8 md:px-16 md:py-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-purple-300">
           {/* Decorative Backgrounds */}
           <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
           <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#4C1D95] opacity-40 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

           {/* LEFT SIDE: Text + Input */}
           <div className="relative z-10 w-full md:w-1/2 mb-16 md:mb-0 pr-8">
             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
               Supercharge your interview prep <br/> with MockMate
             </h2>
             <p className="text-purple-100 mb-10 max-w-md text-lg leading-relaxed opacity-90">
               Stop guessing what went wrong in your last interview. Get instant, actionable feedback on every mock so you improve with each attempt.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 max-w-lg bg-white/10 p-2 rounded-full border border-white/20 backdrop-blur-sm">
               <input 
                type="email" 
                placeholder="Enter your email to start practicing" 
                className="bg-transparent text-white placeholder:text-purple-200 px-6 py-3 flex-1 focus:outline-none"
               />
               <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                <button className="bg-white text-[#7C3AED] px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-50 transition transform active:scale-95">
                    Start free mock
                </button>
               </Link>
             </div>
           </div>

           {/* RIGHT SIDE: DASHBOARD */}
           <div className="relative z-10 w-full md:w-1/2 flex justify-end perspective-1000">
             <div className="w-full max-w-xl transform rotate-y-[-12deg] rotate-x-[4deg] transition-all duration-700 hover:rotate-0 hover:rotate-x-0">
               
               {/* Dashboard Window Frame */}
               <div className="bg-[#1F2937] rounded-xl border border-gray-600 shadow-2xl overflow-hidden">
                 
                 {/* 1. Dashboard Header */}
                 <div className="h-10 bg-[#111827] border-b border-gray-700 flex items-center px-4 justify-between">
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <div className="bg-gray-800 text-gray-400 text-[10px] px-3 py-1 rounded-md flex gap-2 w-1/2">
                        <Search size={12}/> app.mockmate.ai
                    </div>
                    <div className="flex gap-2 text-gray-500">
                        <Bell size={12}/> <Settings size={12}/>
                    </div>
                 </div>

                 {/* 2. Dashboard Body */}
                 <div className="flex bg-[#0B0F19] h-[300px]">
                    {/* Sidebar */}
                    <div className="w-14 border-r border-gray-800 flex flex-col items-center py-4 gap-6">
                        <div className="text-purple-500"><LayoutGrid size={20}/></div>
                        <div className="text-gray-600"><Users size={20}/></div>
                        <div className="text-gray-600"><MessageSquare size={20}/></div>
                        <div className="mt-auto text-gray-600"><User size={20}/></div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 p-6">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h4 className="text-white text-lg font-bold">Mock interviews</h4>
                                <p className="text-gray-500 text-xs">Goal: Crack a Senior Developer role</p>
                            </div>
                            <button className="bg-purple-600 text-white text-xs px-3 py-1.5 rounded-lg">New mock</button>
                        </div>

                        {/* List Items */}
                        <div className="space-y-3">
                            {/* Candidate 1 */}
                            <div className="bg-[#1F2937] p-3 rounded-xl border border-gray-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400 font-bold text-xs">JS</div>
                                    <div>
                                        <div className="text-white text-sm font-medium">System Design Round</div>
                                        <div className="text-gray-500 text-[10px]">Completed 2m ago</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <div className="text-white text-xs font-bold">98%</div>
                                        <div className="text-gray-500 text-[10px]">Score</div>
                                    </div>
                                    <button className="text-gray-400 hover:text-white"><MoreVertical size={14}/></button>
                                </div>
                            </div>

                            {/* Candidate 2 */}
                            <div className="bg-[#1F2937] p-3 rounded-xl border border-gray-700 flex items-center justify-between opacity-80">
                                <div className="flex items-center gap-3">
                                    <img src="https://i.pravatar.cc/100?img=5" className="w-10 h-10 rounded-full border border-gray-600"/>
                                    <div>
                                        <div className="text-white text-sm font-medium">Behavioral Round</div>
                                        <div className="text-gray-500 text-[10px]">Completed 1h ago</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <div className="text-white text-xs font-bold">92%</div>
                                        <div className="text-gray-500 text-[10px]">Score</div>
                                    </div>
                                    <button className="text-gray-400 hover:text-white"><MoreVertical size={14}/></button>
                                </div>
                            </div>
                            
                            {/* Graph (Visual Filler) */}
                            <div className="mt-4 h-16 flex items-end gap-1 opacity-50">
                                <div className="bg-purple-500/20 w-full h-[40%] rounded-t"></div>
                                <div className="bg-purple-500/40 w-full h-[60%] rounded-t"></div>
                                <div className="bg-purple-500/60 w-full h-[80%] rounded-t"></div>
                                <div className="bg-purple-500 w-full h-[50%] rounded-t"></div>
                                <div className="bg-purple-500/30 w-full h-[30%] rounded-t"></div>
                            </div>
                        </div>
                    </div>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0B0F19] text-white pt-20 pb-10 px-6 lg:px-20 border-t border-gray-900">
         <div className="max-w-[1400px] mx-auto">
           <div className="flex flex-col lg:flex-row justify-between items-start mb-20">
             
             {/* Left Column: Brand */}
             <div className="max-w-sm mb-12 lg:mb-0">
               <h3 className="text-2xl font-semibold mb-6 leading-tight tracking-tight">
                 Technology that transforms how <br/> you practice interviews
               </h3>
               <div className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <Globe size={14} className="text-purple-400"/>
                  <span>Built for candidates worldwide</span>
               </div>
             </div>
             
             {/* Right Columns: Links */}
             <div className="flex flex-wrap gap-16 lg:gap-24 text-sm text-gray-400">
                <div className="flex flex-col space-y-4">
                  <span className="text-white font-bold tracking-wider uppercase text-[11px] mb-1">Platform</span>
                  <a href="#" className="hover:text-purple-400 transition-colors">Home</a>
                  <a href="#" className="hover:text-purple-400 transition-colors">Features</a>
                  <a href="#" className="hover:text-purple-400 transition-colors">Pricing</a>
                </div>
                <div className="flex flex-col space-y-4">
                  <span className="text-white font-bold tracking-wider uppercase text-[11px] mb-1">Company</span>
                  <a href="#" className="hover:text-purple-400 transition-colors">About Us</a>
                  <a href="#" className="hover:text-purple-400 transition-colors">Careers</a>
                  <a href="#" className="hover:text-purple-400 transition-colors">Contact</a>
                </div>
                <div className="flex flex-col space-y-4">
                  <span className="text-white font-bold tracking-wider uppercase text-[11px] mb-1">Legal</span>
                  <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
                  <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
                </div>
             </div>
           </div>

           {/* Footer Bottom */}
           <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="text-xs text-gray-500 font-medium">
               © 2024 MockMate. All rights reserved.
             </div>
             <div className="flex gap-4">
               {[Github, Twitter, Linkedin].map((Icon, i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center hover:bg-purple-600 hover:border-purple-600 hover:text-white transition-all cursor-pointer text-gray-400 group">
                    <Icon size={16} className="group-hover:scale-110 transition-transform"/>
                </div>
               ))}
             </div>
           </div>
         </div>
      </footer>
    </main>
  );
}