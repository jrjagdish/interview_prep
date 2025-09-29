"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { useInterviewStore } from "../store/interViewStore";
import { useRouter } from "next/navigation";

interface ExtractedData {
  name: string;
  email: string;
  phone: string;
}

function UploadResume() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const { resumeFile, setResumeFile } = useInterviewStore();
  const { responses, reset } = useInterviewStore();
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [step, setStep] = useState<"upload" | "review" | "complete">("upload");
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  // If you need to check for an active interview, use a different logic or remove this block.
  // For now, we'll just reset if there are responses.
  useEffect(() => {
    if (responses.length > 0) {
      const shouldReset = confirm(
        "There's an active interview in progress. Uploading a new resume will start a fresh interview. Do you want to continue?"
      );
      if (shouldReset) {
        reset(); // safe here
      }
    }
  }, [responses, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (!selectedFile) {
      alert("No file selected");
      return;
    }
    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert("File size must be less than 5MB");
      return;
    }
    setResumeFile(selectedFile);
    setFile(selectedFile);
  };

  async function handleUpload(
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    event.preventDefault();
    setUploading(true);

    if (!file) {
      alert("No file to upload");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    console.log("Uploading file:", file);

    try {
      const response = await fetch(
        "https://interview-prep-backend-1.onrender.com/parse_resume/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Upload result:", result);

      // Fix: Access the data from the correct property based on your Python backend
      const extracted = result.extracted;

      // Determine missing fields
      const missing = [];
      if (extracted.name === "❌ Missing" || !extracted.name)
        missing.push("name");
      if (extracted.email === "❌ Missing" || !extracted.email)
        missing.push("email");
      if (extracted.phone === "❌ Missing" || !extracted.phone)
        missing.push("phone");

      // Clean the data (remove the "❌ Missing" text)
      const cleanedData = {
        name: extracted.name === "❌ Missing" ? "" : extracted.name,
        email: extracted.email === "❌ Missing" ? "" : extracted.email,
        phone: extracted.phone === "❌ Missing" ? "" : extracted.phone,
      };

      setExtractedData(cleanedData);
      setMissingFields(missing);
      setFormData(cleanedData);
      setStep("review");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(
        `Error processing file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setUploading(false);
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert("Please fill in at least name and email fields");
      return;
    }

    const candidateId = `cand_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const candidateInfo = {
      id: candidateId,
      ...formData,
      progress: 0,
      answers: {},
      status: "uploaded" as const,
      createdAt: new Date().toISOString(),
      originalFile: file?.name || "",
    };

    localStorage.setItem("currentCandidate", JSON.stringify(candidateInfo));
    setStep("complete");
    setTimeout(() => {
      router.push("/interView/Dashboard");
    }, 2000);
  };

  function handleReset(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setFile(null);
    setStep("upload");
    setExtractedData(null);
    setMissingFields([]);
    setFormData({ name: "", email: "", phone: "" });
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Step 1: File Upload */}
      {step === "upload" && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="resume-upload"
          />

          <label htmlFor="resume-upload" className="cursor-pointer block">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-lg font-medium text-gray-900">
              {file ? file.name : "Upload your resume (PDF)"}
            </p>
            <p className="text-gray-500 mt-2">Click to select a PDF file</p>
          </label>

          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
            >
              {uploading ? "Processing..." : "Process Resume"}
            </button>
          )}
        </div>
      )}

      {/* Step 2: Review and Edit */}
      {step === "review" && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-green-800 font-medium">
                Resume processed successfully!
              </span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Please review your information below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name{" "}
                {missingFields.includes("name") && (
                  <span className="text-red-500 text-xs">(required)</span>
                )}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email{" "}
                {missingFields.includes("email") && (
                  <span className="text-red-500 text-xs">(required)</span>
                )}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number{" "}
                {missingFields.includes("phone") && (
                  <span className="text-red-500 text-xs">(optional)</span>
                )}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg"
            >
              Upload Different File
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name || !formData.email}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
            >
              Save and Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Complete */}
      {step === "complete" && (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Registration Complete!</h3>
          <p>Redirecting to your interview dashboard...</p>
        </div>
      )}
    </div>
  );
}

export default UploadResume;
