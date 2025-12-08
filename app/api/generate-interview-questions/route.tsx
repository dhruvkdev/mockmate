import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import axios from 'axios';

var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY as string,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY as string,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT as string,
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if(!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 1. Upload to ImageKit
        const uploadPdf = await imagekit.upload({
            file: buffer,
            fileName: Date.now().toString() + ".pdf", // Fixed: Added () to Date.now
            isPublished: true
        });

        // 2. Call n8n Webhook
        // Note: I recommend using the TEST URL while debugging (see Part 2 below)
        const result = await axios.post('https://n8n-xc2y.onrender.com/webhook/get-interview-questions', {
            resumeURL: uploadPdf.url
        });

        console.log("n8n Response:", result.data);

        // 3. Return the Final Response
        return NextResponse.json(result.data);

    } catch (error: any) {
        console.error("Server Error:", error.message);
        
        // CRITICAL FIX: You must return a JSON response even if it fails!
        return NextResponse.json(
            { error: error.message || "Something went wrong" }, 
            { status: 500 } // Send a 500 status code so the frontend knows it failed
        );
    }
}