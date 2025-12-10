"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Brain, Zap, Lightbulb, ThumbsUp, ThumbsDown, ExternalLink 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip } from 'recharts';

const QuestionModal = ({ question, isOpen, onClose }: any) => {
    if (!isOpen || !question) return null;

    const handleViewResource = () => {
        const query = encodeURIComponent(question.q);
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
    };

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div 
                    initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
                    className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/20"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-neutral-100 bg-white flex justify-between items-start sticky top-0 z-20">
                         <div className="flex gap-5">
                            {/* Score Box - Solid Black */}
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black bg-black text-white shadow-lg">
                                {question.score}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900 leading-tight mb-2 max-w-2xl">{question.q}</h2>
                                <div className="flex gap-2">
                                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border border-neutral-200 bg-neutral-50 text-neutral-600">
                                        {question.difficulty}
                                    </span>
                                    {question.tags.map((t: string) => (
                                        <span key={t} className="text-[11px] font-semibold px-2.5 py-1 bg-white border border-neutral-200 rounded-md text-neutral-500">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-black"><X size={20}/></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#FAFAFA]">
                        
                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="space-y-4">
                                {/* User Answer */}
                                <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-neutral-400"></div>
                                    <div className="flex items-center gap-2 mb-3 text-neutral-500 text-xs font-bold uppercase tracking-wider">
                                        <Brain size={14} className="text-black"/> Your Answer
                                    </div>
                                    <p className="text-neutral-800 text-sm leading-relaxed font-medium">"{question.userAnswer}"</p>
                                </div>

                                {/* Optimal Answer */}
                                <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-black"></div>
                                    <div className="flex items-center gap-2 mb-3 text-black text-xs font-bold uppercase tracking-wider">
                                        <Zap size={14} className="fill-black" /> Optimal Answer
                                    </div>
                                    <p className="text-neutral-700 text-sm leading-relaxed">{question.optimalAnswer}</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                     <div className="p-1.5 bg-neutral-100 text-black rounded-md"><Lightbulb size={16} /></div>
                                     <h3 className="text-sm font-bold text-neutral-900 uppercase">AI Analysis</h3>
                                </div>
                                <p className="text-neutral-600 text-sm leading-relaxed mb-6 border-b border-neutral-100 pb-4">
                                    {question.feedback}
                                </p>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 text-emerald-600 text-xs font-bold uppercase">
                                            <ThumbsUp size={12} /> Strengths
                                        </div>
                                        <ul className="space-y-1">
                                            {question.keyConcepts?.slice(0,2).map((s: string, i: number) => (
                                                <li key={i} className="text-xs text-neutral-600 flex gap-2">
                                                    <span className="text-emerald-500">•</span> Demonstrated knowledge of {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 text-rose-500 text-xs font-bold uppercase">
                                            <ThumbsDown size={12} /> Improvements
                                        </div>
                                        <ul className="space-y-1">
                                            <li className="text-xs text-neutral-600 flex gap-2">
                                                <span className="text-rose-500">•</span> Review core concepts
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
                                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-6">Metrics</h3>
                                <div className="h-40 w-full">
                                     <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={question.metrics || []} layout="vertical" margin={{left: 0, right: 0}}>
                                            <XAxis type="number" domain={[0, 100]} hide />
                                            <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 11, fill: '#171717', fontWeight: 600}} axisLine={false} tickLine={false} />
                                            <Tooltip cursor={{fill: '#f5f5f5'}} contentStyle={{borderRadius: '8px', border: '1px solid #e5e5e5'}}/>
                                            {/* Black Bars */}
                                            <Bar dataKey="value" barSize={12} radius={[0, 4, 4, 0]}>
                                                {question.metrics?.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={entry.value > 80 ? '#171717' : '#737373'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-black rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center gap-2 mb-4 text-neutral-400 text-xs font-bold uppercase tracking-wider">
                                    Key Concepts
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {question.keyConcepts?.map((concept: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs font-medium">
                                            {concept}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t border-white/10">
                                    <button 
                                        onClick={handleViewResource}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-neutral-200 transition-colors"
                                    >
                                        <ExternalLink size={14} /> Learn More
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default QuestionModal;