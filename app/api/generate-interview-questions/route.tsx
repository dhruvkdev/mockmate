import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import aj from "@/utils/arcjet";
import { currentUser } from "@clerk/nextjs/server";

var imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
});

export async function POST(req: NextRequest) {
    console.log(`🚨 API HIT at: ${new Date().toISOString()}`);

    try {
        const contentType = req.headers.get("content-type") || "";
        const user=await currentUser();
        let file: File | null = null;
        let jobTitle = "";
        let jobDescription = "";
        const decision = await aj.protect(req, { requested: 5 }); // Deduct 5 tokens from the bucket
        console.log("Arcjet decision", decision);

        //@ts-ignore
        if(decision?.reason?.remaining===0){
            return NextResponse.json({ error: "No free tokens left. Try again after 24 Hours or upgrade your plan" }, { status: 429 });
        }

        // 1. Determine how to parse the request (JSON vs FormData)
        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            file = formData.get('file') as File | null;
            jobTitle = formData.get('jobTitle') as string || "";
            jobDescription = formData.get('jobDescription') as string || "";
        } else {
            // Assume JSON if it's not form-data
            const body = await req.json();
            jobTitle = body.jobTitle;
            jobDescription = body.jobDescription;
        }

        // 2. Scenario A: File is provided (Upload -> n8n)
        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Upload to ImageKit
            const uploadPdf = await imagekit.upload({
                file: buffer,
                fileName: Date.now().toString() + ".pdf",
                isPublished: true
            });

            console.log("Sending to n8n with URL:", uploadPdf.url);

            // Call n8n
            const response = await fetch('https://n8n-xc2y.onrender.com/webhook-test/get-interview-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resumeURL: uploadPdf.url,
                    jobTitle: jobTitle,       // Pass these if needed
                    jobDescription: jobDescription
                })
            });

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                data = { error: "Invalid JSON response from n8n", raw: responseText };
            }

            // Return Final Response
            return NextResponse.json({
                questions: data?.output?.[0]?.content?.[0]?.text?.interview_questions || [],
                resumeUrl: uploadPdf.url,
                status:200
            });
        }

        // 3. Scenario B: No File (Direct Text -> n8n)
        else {
            console.log("Sending text-only request to n8n");

            const response = await fetch('https://n8n-xc2y.onrender.com/webhook/get-interview-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resumeURL: null,
                    jobDescription: jobDescription,
                    jobTitle: jobTitle
                })
            });

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error("Failed to parse n8n response:", responseText);
                data = {};
            }

            return NextResponse.json({
                questions: data?.output?.[0]?.content?.[0]?.text?.interview_questions || [],
                resumeUrl: null,
                staus:200
            });
        }

    } catch (error: any) {
        console.error("Server Error:", error.message);
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}