"use client"
import { api } from '@/convex/_generated/api';
import { useConvex, useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import FeedbackChart from '@/components/feedback-chart';
import FeedbackCard from '@/components/feedback-card';

function Feedback() {
    const { interviewId } = useParams();
    const convex = useConvex();
    const router = useRouter();
    const { user } = useUser();
    const [feedbackList, setFeedbackList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        GetFeedback();
    }, [interviewId])

    const GetFeedback = async () => {
        const result = await convex.query(api.Interview.getUserInterviewAnswers, {
            // @ts-ignore
            interviewId: interviewId
        });
        console.log(result);
        setFeedbackList(result);
    }

    const onGenerateFeedback = async () => {
        setLoading(true);
        try {
            // 1. Call API to get feedback from n8n
            const result = await axios.post('/api/generate-feedback', {
                interviewId: interviewId,
                userAnswers: feedbackList
            });

            console.log("API Result:", result.data);
            const feedbackData = result.data.data; // Access the 'data' array from n8n response

            // 2. Update DB with feedback
            // Assuming feedbackData is ordered same as feedbackList
            if (feedbackData && feedbackData.length === feedbackList.length) {
                // Using Promise.all to update all records
                await Promise.all(feedbackList.map(async (item, index) => {
                    await updateFeedback({
                        userAnswerId: item._id,
                        feedback: feedbackData[index].feedback,
                        rating: feedbackData[index].rating,
                        correctAnswer: feedbackData[index].correctAnswer
                    })
                }));

                toast.success("Feedback Generated Successfully!");
                GetFeedback(); // Refresh data
            } else {
                toast.error("Error: Feedback count mismatch or invalid response");
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to generate feedback");
        } finally {
            setLoading(false);
        }
    }

    const updateFeedback = useMutation(api.Interview.updateUserAnswerFeedback);

    const onDownloadPdf = async () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPos = 20;

        // --- 1. Header (Logo & Title) ---
        // Placeholder for Logo - In a real app, use doc.addImage() with base64 data
        doc.setFontSize(24);
        doc.setTextColor(34, 197, 94); // Green color
        doc.setFont("helvetica", "bold");
        doc.text("MockMate", 14, yPos);
        yPos += 10;

        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.text(`Performance Report for ${user?.firstName || 'User'}`, 14, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.setFont("helvetica", "normal");
        doc.text(`Interview ID: ${interviewId}`, 14, yPos);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 40, yPos);
        yPos += 15;

        // --- 2. Chart Section ---
        const chartElement = document.getElementById('feedback-chart');
        if (chartElement) {
            try {
                // Ensure chart is fully visible before capture
                const canvas = await html2canvas(chartElement, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 180; // Margin 15 on each side
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                doc.addImage(imgData, 'PNG', 15, yPos, imgWidth, imgHeight);
                yPos += imgHeight + 10;
            } catch (err) {
                console.error("Failed to capture chart", err);
            }
        }

        doc.setLineWidth(0.5);
        doc.setDrawColor(200);
        doc.line(14, yPos, pageWidth - 14, yPos);
        yPos += 10;

        // --- 3. Detailed Feedback (Note Format) ---
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("Detailed Feedback", 14, yPos);
        yPos += 10;

        feedbackList.forEach((item, index) => {
            // Check for page break
            if (yPos > pageHeight - 40) {
                doc.addPage();
                yPos = 20;
            }

            // Question Box
            doc.setFillColor(245, 245, 245); // Light Gray bg
            doc.rect(14, yPos - 5, pageWidth - 28, 15, 'F');

            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0);
            const questionLines = doc.splitTextToSize(`${index + 1}. ${item.question}`, pageWidth - 40);
            doc.text(questionLines, 16, yPos);

            // Rating Badge
            const rating = Number(item.rating);
            const ratingColor = rating >= 5 ? [34, 197, 94] : [239, 68, 68];
            doc.setTextColor(ratingColor[0], ratingColor[1], ratingColor[2]);
            doc.text(`Rating: ${item.rating}/10`, pageWidth - 40, yPos);

            yPos += questionLines.length * 7 + 5;

            // Your Answer
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(80);
            doc.text("Your Answer:", 16, yPos);
            yPos += 5;
            doc.setTextColor(40);
            const answerLines = doc.splitTextToSize(item.userAnswer, pageWidth - 32);
            doc.text(answerLines, 16, yPos);
            yPos += answerLines.length * 5 + 3;

            // Feedback
            doc.setTextColor(34, 197, 94); // Green title for feedback
            doc.text("Feedback:", 16, yPos);
            yPos += 5;
            doc.setTextColor(40);
            const feedbackLines = doc.splitTextToSize(item.feedback, pageWidth - 32);
            doc.text(feedbackLines, 16, yPos);
            yPos += feedbackLines.length * 5 + 4;

            // correct answer
            doc.setFont("helvetica", "italic");
            doc.setTextColor(100);
            doc.text("Correct Answer:", 16, yPos);
            yPos += 5;
            const correctLines = doc.splitTextToSize(item.correctAnswer, pageWidth - 32);
            doc.text(correctLines, 16, yPos);
            yPos += correctLines.length * 5 + 10; // Extra spacing between items

            doc.setFont("helvetica", "normal");

            // Separator line
            if (yPos < pageHeight - 20) {
                doc.setDrawColor(230);
                doc.line(14, yPos - 5, pageWidth - 14, yPos - 5);
            }
        });

        doc.save(`feedback_${user?.firstName || 'user'}_${interviewId}.pdf`);
    }

    // Manual trigger for feedback generation (if not auto-generated)
    // Note: The prompt implies using n8n to GET feedback. 
    // If the data isn't in DB, we might want a button to "Generate Feedback"

    return (
        <div className='p-10'>
            <div className='flex justify-between items-center'>
                <h2 className='text-3xl font-bold text-green-500'>Congratulation {user?.firstName}!</h2>
                <div className="flex gap-2">
                    {feedbackList?.length > 0 &&
                        <Button onClick={onDownloadPdf} variant="outline" className="flex gap-2">
                            Download PDF
                        </Button>
                    }
                    {!feedbackList?.[0]?.feedback &&
                        <Button onClick={onGenerateFeedback} disabled={loading}>
                            {loading ? 'Generating...' : 'Generate New Feedback'}
                        </Button>
                    }
                </div>
            </div>
            <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>

            {/* Overall Rating Calculation (Optional) */}
            {feedbackList?.[0]?.rating &&
                <div className='w-full'>
                    <h2 className='text-primary text-lg my-3'>
                        Your overall interview rating: <strong>
                            {(feedbackList.reduce((acc, item) => acc + (Number(item.rating) || 0), 0) / feedbackList.length).toFixed(2)}
                            /10</strong>
                    </h2>

                    <FeedbackChart feedbackList={feedbackList} />
                </div>
            }

            <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, Your answer and feedback for improvement</h2>

            <div className='mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                {feedbackList?.length === 0 ?
                    <h2 className='font-bold text-xl text-gray-500 col-span-full'>No Feedback record found</h2>
                    :
                    <>
                        {feedbackList.map((item, index) => (
                            <FeedbackCard key={index} item={item} index={index} />
                        ))}
                    </>}
            </div>

            <Button onClick={() => router.replace('/')} className='mt-10'>Go Home</Button>

        </div>
    )
}

export default Feedback
