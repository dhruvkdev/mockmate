"use client";
import React, { useState } from "react";
import { Upload } from "lucide-react";

function ResumeUpload({ setFiles }: any) {
    const [fileName, setFileName] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles(file);
            setFileName(file.name);
            console.log(file);
        }
    };

    return (
        <div className="w-full mx-auto min-h-48 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center h-48 cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                    {fileName || "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500">PDF files only (MAX. 10MB)</p>
                <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </label>
        </div>
    );
}

export default ResumeUpload