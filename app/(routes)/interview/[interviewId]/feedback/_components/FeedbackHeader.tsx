"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const FeedbackHeader = ({ interviewId = "8291-AB" }) => {
  const router = useRouter();

  const handleShare = async () => {
    // Clean URL without text to prevent concatenation issues
    const shareData = {
      title: 'My Interview Analysis',
      url: window.location.href, // Only sharing the URL ensures clean copying
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      // Fallback for desktop
      navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-white border border-neutral-200 text-neutral-600 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            Report Ready
          </span>
          <span className="text-neutral-400 text-xs font-mono">ID: {interviewId}</span>
        </div>
        <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">
          Interview <span className="text-indigo-600">Analytics</span>
        </h1>
      </div>
      
      <div className="flex gap-3">
        {/* GO BACK BUTTON */}
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard')}
          className="h-9 text-xs font-bold border-neutral-200 bg-white hover:bg-neutral-50 shadow-sm text-neutral-700 transition-all hover:shadow-md"
        >
            <LayoutDashboard className="mr-2 h-3.5 w-3.5 text-neutral-400" /> Go to Dashboard
        </Button>
        
        {/* SHARE BUTTON */}
        <Button 
            onClick={handleShare}
            className="h-9 text-xs font-bold bg-neutral-900 text-white hover:bg-neutral-800 shadow-xl shadow-neutral-900/10 transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          <Share2 className="mr-2 h-3.5 w-3.5" /> Share Report
        </Button>
      </div>
    </div>
  );
};

export default FeedbackHeader;