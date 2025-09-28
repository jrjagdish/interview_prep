"use client";
import UploadResume from "@/app/components/UploadResume";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Start Your AI Interview
          </h1>
          <p className="text-gray-600">
            Upload your resume to begin the personalized interview process
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <UploadResume />
        </div>
      </div>
    </div>
  );
}