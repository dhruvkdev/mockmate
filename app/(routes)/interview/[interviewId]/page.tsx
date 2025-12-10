"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, TrendingUp, Users, CheckCircle, Play, Shield, BarChart, Sparkles } from 'lucide-react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

function Interview() {
    const { interviewId } = useParams();
    const [countdown, setCountdown] = useState(5);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isReady && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, isReady]);

    const features = [
        { icon: Shield, title: "AI-Powered Analysis", desc: "Get detailed feedback on your answers" },
        { icon: BarChart, title: "Performance Metrics", desc: "Track improvement over time" },
        { icon: Users, title: "Real Interview Simulation", desc: "Experience authentic interview pressure" },
        { icon: CheckCircle, title: "Personalized Tips", desc: "Receive custom improvement suggestions" },
    ];

    const preparationTips = [
        "Find a quiet, well-lit space",
        "Use a good quality microphone",
        "Dress professionally",
        "Have water nearby",
        "Take deep breaths before starting"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Your Interview Journey 
                        <span className="text-primary"> Begins Here</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Get ready for an immersive interview experience powered by AI
                    </p>
                </motion.div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Hero Image & Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 z-10" />
                            <Image 
                                src="/start-interview.png" 
                                alt="AI Interview Preparation" 
                                width={600}
                                height={400}
                                className="w-full h-[400px] object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                            
                            {/* Overlay Stats */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-20">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">30+</div>
                                        <div className="text-sm text-white/80">Minutes</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">AI</div>
                                        <div className="text-sm text-white/80">Powered</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">100%</div>
                                        <div className="text-sm text-white/80">Confidential</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preparation Tips */}
                        <div className="mt-8 p-6 bg-white  rounded-2xl shadow-lg">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Quick Preparation Tips
                            </h3>
                            <ul className="space-y-2">
                                {preparationTips.map((tip, index) => (
                                    <li key={index} className="flex items-center gap-3 text-sm">
                                        <div className="w-2 h-2 bg-primary rounded-full" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* Right Column - Content & CTA */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-8"
                    >
                        {/* Features Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="p-4 bg-white/50  backdrop-blur-sm rounded-xl border hover:border-primary/30 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <feature.icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{feature.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">{feature.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Countdown & CTA */}
                        {!isReady ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="p-6 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl border">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-primary" />
                                            <span className="font-semibold">Interview Duration</span>
                                        </div>
                                        <span className="text-lg font-bold">30 mins</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Preparation</span>
                                            <span>5 minutes</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Questions</span>
                                            <span>5-7 questions</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Feedback</span>
                                            <span>AI analysis after the interview</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center space-y-4">
                                    <p className="text-muted-foreground">
                                        This simulation will help you practice under realistic conditions
                                    </p>
                                    <Button 
                                        size="lg" 
                                        className="w-full py-7 text-lg font-semibold group"
                                        onClick={() => setIsReady(true)}
                                    >
                                        <span className="flex items-center justify-center gap-3">
                                            Begin Interview Journey
                                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Button>
                                    <p className="text-sm text-muted-foreground">
                                        You can pause and resume at any time
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                {/* Countdown Timer */}
                                <div className="text-center space-y-4">
                                    <div className="inline-block p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
                                        <div className="text-6xl font-bold text-primary mb-2">
                                            {countdown}
                                        </div>
                                        <p className="text-muted-foreground">Starting in seconds</p>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <p className="text-lg font-medium">
                                            Get ready to shine! 🚀
                                        </p>
                                        <p className="text-muted-foreground">
                                            Take a deep breath. The interview starts soon.
                                        </p>
                                    </div>

                                    {countdown === 0 ? (
                                        <Link href={`/interview/${interviewId}/start`} className="block">
                                            <Button size="lg" className="w-full py-7 text-lg font-semibold animate-pulse">
                                                <Play className="mr-2 h-5 w-5" />
                                                Start Interview Now!
                                            </Button>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                            i < countdown ? 'bg-primary' : 'bg-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                Auto-starting...
                                            </span>
                                        </div>
                                    )}

                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                            setIsReady(false);
                                            setCountdown(5);
                                        }}
                                        className="mt-4"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Stats Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border"
                        >
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm">92% success rate</span>
                            </div>
                            <div className="h-4 w-px bg-border" />
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-500" />
                                <span className="text-sm">5,000+ interviews</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-12 text-center"
                >
                    <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                        💡 <strong>Tip:</strong> Speak clearly and concisely. Treat this like a real interview. 
                        Your answers will be analyzed for content, clarity, and confidence.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default Interview