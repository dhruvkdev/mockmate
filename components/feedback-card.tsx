import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FeedbackCardProps {
    item: any;
    index: number;
}

function FeedbackCard({ item, index }: FeedbackCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="relative w-full min-h-[400px] cursor-pointer"
            style={{ perspective: '1000px' }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div
                className={cn(
                    "relative w-full h-full transition-all duration-700",
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                )}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front Face */}
                <Card className="absolute inset-0 w-full h-full backface-hidden [backface-visibility:hidden]">
                    <CardHeader className='p-5 bg-secondary rounded-t-lg'>
                        <CardTitle>{item.question}</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-4 p-5 h-[calc(100%-80px)] overflow-y-auto'>
                        <div className='flex justify-between items-center'>
                            <h2 className={cn('text-red-500 p-2 border rounded-lg',
                                Number(item.rating) >= 5 && 'text-green-500 bg-green-50/20'
                            )}><strong>Rating:</strong> {item.rating}</h2>
                            <Button size="sm" variant="outline">Feedback</Button>
                        </div>
                        <div className={cn('p-2 border rounded-lg bg-red-50 text-sm text-red-900',
                            Number(item.rating) >= 5 && 'bg-green-50 text-green-900'
                        )}>
                            <strong>Your Answer: </strong>{item.userAnswer}
                        </div>
                        <div className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'>
                            <strong>Correct Answer: </strong>{item.correctAnswer}
                        </div>
                    </CardContent>
                </Card>

                {/* Back Face */}
                <Card
                    className="absolute inset-0 w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] bg-blue-50/20 border-blue-200"
                >
                    <CardHeader className='p-5 bg-blue-100 rounded-t-lg text-primary'>
                        <CardTitle>Interviewer Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-4 p-5 h-[calc(100%-80px)] overflow-y-auto'>
                        <div className='p-2 text-sm text-primary'>
                            {item.feedback}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default FeedbackCard
