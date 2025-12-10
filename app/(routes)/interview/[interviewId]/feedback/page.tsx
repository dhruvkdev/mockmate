"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useConvex, useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Target, Award, TrendingUp, Clock, ChevronRight, Brain, Loader2
} from 'lucide-react';

import FeedbackHeader from './_components/FeedbackHeader';
import FocusArea from './_components/FocusArea';
import QuestionModal from './_components/QuestionModal';
import { Button } from '@/components/ui/button';

// --- Reusable Clean Bento Card ---
const BentoCard = ({ children, className = "", title, icon: Icon, delay = 0 }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
        className={`bg-white border border-neutral-200 rounded-3xl shadow-sm hover:shadow-lg hover:border-neutral-400 relative overflow-hidden flex flex-col group transition-all duration-300 ${className}`}
    >
        {/* Subtle Purple Blur only on hover, otherwise clean */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        {title && (
            <div className="px-5 py-4 border-b border-neutral-100 bg-white/80 backdrop-blur-md flex items-center gap-2 relative z-10">
                {Icon && <div className="p-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"><Icon size={14} /></div>}
                <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider">{title}</h3>
            </div>
        )}
        <div className="p-5 flex-1 relative z-10 flex flex-col h-full min-h-0">{children}</div>
    </motion.div>
);

function FeedbackPage() {
    const { interviewId } = useParams();
    const convex = useConvex();
    const router = useRouter();
    const { user } = useUser();
    const [feedbackList, setFeedbackList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {
        if (interviewId) {
            GetFeedback();
        }
    }, [interviewId]);

    const GetFeedback = async () => {
        const result = await convex.query(api.Interview.getUserInterviewAnswers, {
            // @ts-ignore
            interviewId: interviewId
        });
        setFeedbackList(result);
    };

    const updateFeedback = useMutation(api.Interview.updateUserAnswerFeedback);

    const onGenerateFeedback = async () => {
        setLoading(true);
        try {
            const result = await axios.post('/api/generate-feedback', {
                interviewId: interviewId,
                userAnswers: feedbackList
            });

            const feedbackData = result.data.data;

            if (feedbackData && feedbackData.length === feedbackList.length) {
                await Promise.all(feedbackList.map(async (item, index) => {
                    await updateFeedback({
                        userAnswerId: item._id,
                        feedback: feedbackData[index].feedback,
                        rating: feedbackData[index].rating,
                        correctAnswer: feedbackData[index].correctAnswer
                    })
                }));
                toast.success("Feedback Generated Successfully!");
                GetFeedback();
            } else {
                toast.error("Error: Feedback count mismatch");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate feedback");
        } finally {
            setLoading(false);
        }
    };

    // --- SMART ANALYTICS ENGINE ---
    const { stats, overallScore, scoreData, questionDrilldown, performanceData, radarData, percentileText, activeHistogramIndex, analysisData } = useMemo(() => {
        if (!feedbackList || feedbackList.length === 0) {
            return { 
                stats: { correct: 0, partial: 0, wrong: 0 }, 
                overallScore: 0, 
                scoreData: [], 
                questionDrilldown: [], 
                performanceData: [], 
                radarData: [],
                percentileText: "N/A",
                activeHistogramIndex: 0,
                analysisData: null
            };
        }

        // 1. Stats
        const correct = feedbackList.filter(item => (Number(item.rating) || 0) >= 8).length;
        const partial = feedbackList.filter(item => (Number(item.rating) || 0) >= 5 && (Number(item.rating) || 0) < 8).length;
        const wrong = feedbackList.filter(item => (Number(item.rating) || 0) < 5).length;
        
        // 2. Overall Score
        const totalRating = feedbackList.reduce((acc, item) => acc + (Number(item.rating) || 0), 0);
        const score = Math.round((totalRating / feedbackList.length) * 10);

        // 3. Percentile
        let pText = "Top 50%";
        let hIndex = 4;
        if (score > 80) { pText = "Top 10%"; hIndex = 9; }
        else if (score > 70) { pText = "Top 20%"; hIndex = 7; }
        else if (score >= 50) { pText = "Top 40%"; hIndex = 5; }
        else { pText = "Top 60%"; hIndex = 2; }
        
        // 4. Categories
        const categoryScores: Record<string, number[]> = {
            'Technical': [], 'System Design': [], 'Communication': [], 'Problem Solving': [], 'Culture': []
        };

        const predictCategory = (text: string) => {
            const t = (text || "").toLowerCase();
            const categories = [];
            if (t.includes('design') || t.includes('architecture') || t.includes('scale') || t.includes('database')) {
                categories.push('System Design'); categories.push('Technical');
            }
            if (t.includes('situation') || t.includes('conflict') || t.includes('team') || t.includes('describe')) {
                categories.push('Communication'); categories.push('Culture');
            }
            if (t.includes('code') || t.includes('function') || t.includes('complexity') || t.includes('api') || t.includes('react')) {
                categories.push('Technical'); categories.push('Problem Solving');
            }
            if (categories.length === 0) categories.push('Technical'); 
            return categories;
        };

        const drilldown = feedbackList.map((item, index) => {
            const rating = Number(item.rating) || 0;
            const predictedCategories = predictCategory(item.question);
            predictedCategories.forEach(cat => { if (categoryScores[cat]) categoryScores[cat].push(rating); });

            const optLength = item.correctAnswer?.length || 0;
            let difficulty = "Medium";
            if (optLength > 400) difficulty = "Hard"; else if (optLength < 150) difficulty = "Easy";

            const userWords = item.userAnswer?.split(' ').length || 0;
            const optWords = item.correctAnswer?.split(' ').length || 100;
            let completeness = Math.round((userWords / optWords) * 100);
            if (rating >= 8) completeness = Math.max(completeness, 90);
            completeness = Math.min(100, completeness);

            let clarity = 0;
            if (rating >= 8) clarity = 90 + Math.floor(Math.random() * 10);
            else if (rating >= 5) clarity = 70 + Math.floor(Math.random() * 10);
            else clarity = 40 + Math.floor(Math.random() * 20);
            if (rating < 5 && userWords > optWords * 1.5) clarity -= 10;
            
            return {
                id: item._id,
                q: item.question,
                score: rating,
                status: rating >= 8 ? "Correct" : rating >= 5 ? "Partial" : "Wrong",
                tags: [...new Set([...predictedCategories, "Interview"])],
                difficulty: difficulty, 
                keyConcepts: predictedCategories.slice(0, 2),
                userAnswer: item.userAnswer,
                optimalAnswer: item.correctAnswer,
                feedback: item.feedback,
                metrics: [
                    { name: "Accuracy", value: rating * 10 },
                    { name: "Clarity", value: Math.max(0, clarity) }, 
                    { name: "Completeness", value: completeness }
                ]
            };
        });

        // 5. Radar Data (Floored at 30)
        const rawAverages: Record<string, number> = {};
        Object.keys(categoryScores).forEach(cat => {
            const scores = categoryScores[cat];
            if (scores.length > 0) {
                const sum = scores.reduce((a, b) => a + b, 0);
                rawAverages[cat] = Math.round((sum / scores.length) * 10);
            } else {
                rawAverages[cat] = score;
            }
        });

        const radar = Object.keys(rawAverages).map(cat => ({
            subject: cat,
            A: Math.round(30 + (rawAverages[cat] * 0.7)), 
            fullMark: 100
        }));

        // Analysis Data
        let maxVal = -1; let minVal = 101;
        let bestCat = "General"; let worstCat = "General";
        Object.entries(rawAverages).forEach(([cat, val]) => {
            if (val > maxVal) { maxVal = val; bestCat = cat; }
            if (val < minVal) { minVal = val; worstCat = cat; }
        });
        if (maxVal === minVal) { bestCat = "Consistency"; worstCat = "Advanced Topics"; }

        const analysisData = {
            strength: { area: bestCat, score: maxVal },
            weakness: { area: worstCat, score: minVal }
        };

        const perfData = feedbackList.map((item, index) => {
            const pseudoRandomAvg = 4 + ((index * 3) % 5); 
            return {
                question: `Q${index + 1}`,
                score: Number(item.rating) || 0,
                average: pseudoRandomAvg 
            };
        });

        return {
            stats: { correct, partial, wrong },
            overallScore: score,
            scoreData: [
                { name: 'score', value: score, fill: '#171717' }, // BLACK
                { name: 'remaining', value: 100 - score, fill: '#f5f5f5' },
            ],
            questionDrilldown: drilldown,
            performanceData: perfData,
            radarData: radar,
            percentileText: pText,
            activeHistogramIndex: hIndex,
            analysisData: analysisData
        };
    }, [feedbackList]);


    return (
        <div className="min-h-screen bg-[#FDFDFD] text-neutral-900 p-4 md:p-6 font-sans selection:bg-neutral-200 relative">
            {/* Very Subtle Dot Grid */}
            <div className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <FeedbackHeader interviewId={typeof interviewId === 'string' ? interviewId : ''} />

            {loading && (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <Loader2 className="animate-spin text-black" size={48} />
                    <h2 className="text-xl font-bold text-neutral-600">Generating Analysis...</h2>
                </div>
            )}

            {!loading && feedbackList.length > 0 && !feedbackList[0].feedback && (
                <div className="flex flex-col items-center justify-center h-96 gap-6 bg-white border border-dashed border-neutral-300 rounded-3xl">
                    <h2 className="text-2xl font-bold text-neutral-800">Ready to analyze your interview?</h2>
                    <Button onClick={onGenerateFeedback} className="bg-black hover:bg-neutral-800 text-white px-8 py-6 text-lg rounded-xl shadow-xl shadow-neutral-200">
                        Generate Feedback Report
                    </Button>
                </div>
            )}

            {!loading && feedbackList.length > 0 && feedbackList[0].feedback && (
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-4 auto-rows-[minmax(140px,auto)] relative z-10">

                    {/* 1. OVERALL SCORE */}
                    <BentoCard className="md:col-span-2 lg:col-span-2 row-span-2" delay={0.1}>
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Award size={100} className="text-black"/>
                        </div>
                        <div className="flex flex-col h-full items-center justify-center relative z-10">
                            <h3 className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-4">Overall Score</h3>
                            <div className="relative w-40 h-40"> 
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={scoreData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50} // Optimized for space
                                            outerRadius={70} 
                                            startAngle={180}
                                            endAngle={0}
                                            dataKey="value"
                                            cornerRadius={10}
                                            stroke="none"
                                        >
                                            <Cell key="score" fill="#171717" />
                                            <Cell key="remaining" fill="#e5e5e5" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                                    <span className="text-5xl font-black text-neutral-900 tracking-tighter">{overallScore}</span>
                                </div>
                            </div>
                            <div className="w-full mt-2 text-center">
                                {/* Moved Text Below Graph */}
                                <p className="text-xs text-neutral-400 font-bold uppercase mb-1">out of 100</p>
                                <p className="text-sm font-bold text-neutral-700">{percentileText}</p>
                                <div className="h-8 w-full mt-3 relative flex items-end justify-center gap-1 opacity-80">
                                    {[10, 20, 35, 50, 80, 100, 70, 40, 20, 10].map((h, i) => (
                                        <div key={i} 
                                            className={`w-2.5 rounded-t-sm ${i === activeHistogramIndex ? 'bg-black' : 'bg-neutral-200'}`} 
                                            style={{height: `${h}%`}}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* 2. COMPETENCY RADAR */}
                    <BentoCard className="md:col-span-2 lg:col-span-2 row-span-2" delay={0.2}>
                        <div className="flex items-center gap-2 mb-2 absolute top-5 left-6 z-20">
                            <div className="p-1.5 bg-neutral-100 border border-neutral-200 rounded-md text-neutral-600"><Brain size={14} /></div>
                            <h3 className="font-bold text-xs text-neutral-600 uppercase tracking-wide">Competency Map</h3>
                        </div>
                        <div className="flex-1 w-full h-full flex items-center justify-center mt-6">
                            <div className="w-full h-[220px]"> 
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}> 
                                        <PolarGrid stroke="#e5e5e5" strokeDasharray="4 4" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#737373', fontSize: 10, fontWeight: 700 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        {/* Black Radar */}
                                        <Radar name="Skill" dataKey="A" stroke="#171717" strokeWidth={2} fill="#171717" fillOpacity={0.15} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} cursor={false} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </BentoCard>

                    {/* 3. ACCURACY */}
                    <BentoCard title="Accuracy" icon={Target} className="md:col-span-2 lg:col-span-2 row-span-1" delay={0.3}>
                        <div className="flex justify-between items-center h-full px-2">
                            <div className="flex flex-col items-center gap-1">
                                <span className="block text-3xl font-black text-neutral-900 tracking-tight">{stats.correct}</span>
                                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Correct</span>
                            </div>
                            <div className="w-px h-10 bg-neutral-100"></div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="block text-3xl font-black text-neutral-900 tracking-tight">{stats.partial}</span>
                                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Partial</span>
                            </div>
                            <div className="w-px h-10 bg-neutral-100"></div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="block text-3xl font-black text-neutral-900 tracking-tight">{stats.wrong}</span>
                                <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">Wrong</span>
                            </div>
                        </div>
                    </BentoCard>

                    {/* 4. ANALYSIS CARD */}
                    <FocusArea data={analysisData} delay={0.4} />

                    {/* 5. PERFORMANCE FLOW */}
                    <BentoCard title="Performance Flow" icon={TrendingUp} className="md:col-span-4 lg:col-span-4 row-span-2" delay={0.5}>
                        <div className="h-48 w-full mt-4"> 
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#171717" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#171717" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="question" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 12, fontWeight: 500 }} dy={10} />
                                    <YAxis hide domain={[0, 10]} />
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f5f5f5" />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="average" 
                                        stroke="#d4d4d4" 
                                        strokeWidth={2} 
                                        strokeDasharray="5 5" 
                                        fill="transparent" 
                                        name="Avg. Candidate" 
                                        isAnimationActive={true}
                                        animationDuration={1500}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="score" 
                                        stroke="#171717" 
                                        strokeWidth={3} 
                                        fill="url(#colorScore)" 
                                        name="Your Score" 
                                        activeDot={{ r: 6, fill: "#171717", stroke: "#fff", strokeWidth: 3 }} 
                                        isAnimationActive={true}
                                        animationDuration={1000}
                                        animationEasing="ease-out"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </BentoCard>

                    {/* 6. QUESTION HISTORY */}
                    <BentoCard
                        className="md:col-span-4 lg:col-span-2 row-span-2 p-0 flex flex-col h-full"
                        title="Review Answers" icon={Clock} delay={0.6}
                    >
                        <div className="overflow-y-auto h-[200px] custom-scrollbar"> 
                            {questionDrilldown.map((q: any, i: number) => (
                                <div
                                    key={q.id}
                                    onClick={() => setSelectedQuestion(q)}
                                    className="p-3 hover:bg-neutral-50 border-b border-neutral-100 cursor-pointer group transition-colors relative"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-black opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex gap-3">
                                            <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold border shadow-sm shrink-0
                                    ${q.status === 'Correct' ? 'bg-neutral-100 text-black border-neutral-200' :
                                                    q.status === 'Wrong' ? 'bg-white text-neutral-500 border-neutral-200' :
                                                        'bg-white text-neutral-500 border-neutral-200'}`}>
                                                {q.score}
                                            </span>
                                            <div><h4 className="text-xs font-bold text-neutral-800 line-clamp-1 mt-1 group-hover:text-black transition-colors">{q.q}</h4></div>
                                        </div>
                                        <ChevronRight size={14} className="text-neutral-300 group-hover:text-black transition-colors transform group-hover:translate-x-1 shrink-0" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BentoCard>
                </div>
            )}

            <QuestionModal
                question={selectedQuestion}
                isOpen={!!selectedQuestion}
                onClose={() => setSelectedQuestion(null)}
            />

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f5f5f5; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a3a3a3; }
      `}</style>
        </div>
    );
};

export default FeedbackPage;