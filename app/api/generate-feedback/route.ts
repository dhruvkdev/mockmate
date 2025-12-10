import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { userAnswers, interviewId } = body;

    try {
        // Prepare payload for n8n
        // We expect userAnswers to be an array of objects from the DB or client that has { question, userAnswer }
        const payload = {
            interviewId: interviewId,
            userAnswers: userAnswers.map((item: any) => ({
                question: item.question,
                userAnswer: item.userAnswer
            }))
        };

        console.log("Payload to n8n:", JSON.stringify(payload, null, 2));

        // Call n8n
        // This URL should be set in environment variables
        const n8nUrl = process.env.N8N_FEEDBACK_WEBHOOK_URL || 'https://n8n-xc2y.onrender.com/webhook/get-interview-questions-feedback';
        // Note: User mentioned 'webhook/get-interview-questions-feedback' or similar in testing? 
        // Actually user said: "My webhook expects..." and "gives output...". 
        // User didn't specify URL, but previously used 'https://n8n-xc2y.onrender.com/webhook/get-interview-questions'.
        // I'll assume they might change the slug. Ideally this is env var.

        const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Failed to fetch feedback from n8n");
        }

        const data = await response.json();
        console.log("N8N Response:", data);

        // Return valid JSON
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Error generating feedback:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
