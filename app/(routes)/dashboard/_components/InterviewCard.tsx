import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Calendar, FileText, TrendingUp } from 'lucide-react';

interface InterviewCardProps {
    interview: {
        _id: string;
        _creationTime: number;
        jobTitle?: string;
        jobDescription?: string;
        status: string;
        interviewQuestions: any[];
    };
}

function InterviewCard({ interview }: InterviewCardProps) {
    const router = useRouter();

    return (
        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {interview.jobTitle || 'Interview Session'}
                    </h3>
                    {interview.jobDescription && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {interview.jobDescription}
                        </p>
                    )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${interview.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {interview.status}
                </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{new Date(interview._creationTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                    <FileText size={16} />
                    <span>{interview.interviewQuestions?.length || 0} Questions</span>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={() => router.push(`/interview/${interview._id}/feedback`)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <TrendingUp size={16} />
                    View Feedback
                </Button>
                <Button
                    onClick={() => router.push(`/interview/${interview._id}/start`)}
                    size="sm"
                >
                    Retake Interview
                </Button>
            </div>
        </div>
    );
}

export default InterviewCard;
