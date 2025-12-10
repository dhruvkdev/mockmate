import React from 'react';
// Importing icons related to AI, Data, and Speech
import { FaDatabase, FaMicrophoneAlt } from 'react-icons/fa';
import { SiFramer, SiOpenai } from 'react-icons/si'; 
import { GiArtificialIntelligence } from 'react-icons/gi'; // A good icon for Machine Learning/AI

import { motion } from 'framer-motion';
import Link from 'next/link';

// NOTE: You'll need to install framer-motion and react-icons if you haven't already.

const InterviewHeroAI = () => {
  // Placeholder data for the 'Trusted by' section (kept the same)
  const trustedUsers = [
    { id: 1, avatarUrl: 'https://avatar.iran.liara.run/public', alt: 'Job seeker 1' },
    { id: 2, avatarUrl: 'https://avatar.iran.liara.run/public', alt: 'Job seeker 2' },
    { id: 3, avatarUrl: 'https://avatar.iran.liara.run/public', alt: 'Job seeker 3' },
    { id: 4, avatarUrl: 'https://avatar.iran.liara.run/public', alt: 'Job seeker 4' },
    { id: 5, avatarUrl: 'https://avatar.iran.liara.run/public', alt: 'Job seeker 5' },
    { id: 6, avatarUrl: 'https://avatar.iran.liara.run/public', alt: 'Job seeker 6' },
  ];

  // REVISED: Data for AI/ML/Data technology concepts
  const techConcepts = [
    { name: 'AI/ML Core', icon: <GiArtificialIntelligence className="w-5 h-5 text-indigo-600" />, text: 'Machine Learning' },
    { name: 'NLP/OpenAI', icon: <SiOpenai className="w-5 h-5 text-green-600" />, text: 'NLP Models' },
    { name: 'Data Processing', icon: <FaDatabase className="w-5 h-5 text-red-600" />, text: 'Data Analytics' },
    { name: 'Speech Recognition', icon: <FaMicrophoneAlt className="w-5 h-5 text-blue-600" />, text: 'Voice Analysis' },
  ];

  // Framer Motion variants (kept the same for the animation)
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.6,
        staggerChildren: 0.2, 
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-4 bg-white">
      <motion.header
        className="text-center max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Headline */}
        <motion.h1 
          className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6"
          variants={itemVariants}
        >
          Ace Every Interview with <br className="hidden sm:block" />
          <span className="text-gray-900">AI-Powered Practice</span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          Access <span className='text-black'>tilored questions</span>, get <span className='text-black'>real-time feedback</span> and our unique answers with our mock interview assistant. Your path to confidence and success starts here.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-20"
          variants={itemVariants}
        >
            <Link href="/dashboard">
          <button 
            className="w-full sm:w-auto px-8 py-3 text-lg font-bold rounded-xl text-white bg-[#0F0A1F] hover:bg-[#201b30] transition duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#0F0A1F]"
            aria-label="Start your free mock interview now"
          >
            Start Free Mock Interview
          </button>
          </Link>
          <button 
            className="w-full sm:w-auto px-8 py-3 text-lg font-bold rounded-xl text-[#7C3AED] bg-white border-2 border-[#7C3AED] hover:bg-blue-50 transition duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#7C3AED]"
            aria-label="Learn more about the AI interview practice"
          >
            Learn More
          </button>
        </motion.div>
      </motion.header>
      
      {/* --- Trust and Logo Bar --- */}
      <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-16 pt-10 border-t border-gray-200 w-full max-w-6xl">
        
        {/* Trusted By Avatars (Unchanged) */}
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-3">
            Trusted by job seekers and professionals worldwide
          </p>
          <div className="flex -space-x-3">
            {trustedUsers.map((user, index) => (
              <div 
                key={user.id} 
                className="w-11 h-11 rounded-full bg-gray-300 border-4 border-white overflow-hidden shadow-md"
                style={{ zIndex: trustedUsers.length - index }}
              >
                <img 
                  src={user.avatarUrl} 
                  alt={user.alt} 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                />
              </div>
            ))}
            <div className="w-11 h-11 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center text-gray-500 text-sm font-semibold shadow-md cursor-default">
                +1k
            </div>
          </div>
        </div>

        {/* REVISED: AI/Tech Concepts Logos */}
        <div className="flex items-center space-x-10 text-gray-800">
          {techConcepts.map((tech) => (
            <div 
              key={tech.name} 
              className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition duration-300 cursor-default"
              title={`Powered by ${tech.name}`}
            >
              {/* The icon now has a specific, branding-related color */}
              {tech.icon}
              <span className="text-base font-medium text-gray-700">{tech.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewHeroAI;