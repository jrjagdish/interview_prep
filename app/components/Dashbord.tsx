"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Clock, 
  MoreHorizontal, 
  Eye, 
  Download,
  Filter,
  Search,
  Plus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useInterviewStore } from "../store/interViewStore";
import { useEffect, useState } from "react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  score: number | null;
  status: "completed" | "in-progress" | "not-started";
  attempted: number;
  totalQuestions: number;
  duration: string;
  submittedAt: string | null;
  sessionId: string;
  responses?: any[];
  totalTimeTaken?: number;
}

interface StoredCandidate {
  name: string;
  email?: string;
  sessionId: string;
  responses: any[];
  score: number;
  questionCount: number;
  totalTimeTaken: number;
  completedAt?: string;
}

export default function InterviewerDashboard() {
  const { reset, resumeFile } = useInterviewStore();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load candidates from localStorage
  useEffect(() => {
    loadCandidatesFromStorage();
  }, []);

  const loadCandidatesFromStorage = () => {
    try {
      const storedCandidates: StoredCandidate[] = [];
      
      console.log("Loading candidates from localStorage...");
      
      // Get current candidate from localStorage
      const currentCandidateData = localStorage.getItem("currentCandidate");
      console.log("currentCandidate data:", currentCandidateData);
      
      if (currentCandidateData) {
        try {
          const candidateInfo = JSON.parse(currentCandidateData);
          console.log("Parsed candidate info:", candidateInfo);
          
          // Check if this candidate has interview data in the store
          const interviewStore = localStorage.getItem("interview-storage");
          console.log("Interview store data:", interviewStore);
          
          if (interviewStore) {
            const storeData = JSON.parse(interviewStore);
            console.log("Parsed store data:", storeData);
            
            const candidateData: StoredCandidate = {
              name: candidateInfo.name || "Unknown Candidate",
              email: candidateInfo.email,
              sessionId: candidateInfo.sessionId || `session_${Date.now()}`,
              responses: storeData.state?.responses || [],
              score: storeData.state?.score || 0,
              questionCount: storeData.state?.questionCount || 0,
              totalTimeTaken: storeData.state?.totalTimeTaken || 0,
              completedAt: storeData.state?.questionCount >= 6 ? new Date().toISOString() : undefined
            };
            
            storedCandidates.push(candidateData);
            console.log("Added candidate:", candidateData);
          }
        } catch (error) {
          console.error("Error parsing current candidate data:", error);
        }
      }
      
      // Also check for any other candidate data in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("candidate_") || key === "interview-storage")) {
          console.log("Found key:", key);
        }
      }

      // Transform stored data to Candidate format
      const formattedCandidates: Candidate[] = storedCandidates.map(candidate => {
        const totalQuestions = 6;
        const attempted = candidate.responses?.length || 0;
        const isComplete = attempted >= totalQuestions;
        const hasResponses = attempted > 0;

        // Calculate duration from totalTimeTaken
        const totalSeconds = candidate.totalTimeTaken || 0;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const duration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // Determine status
        let status: "completed" | "in-progress" | "not-started";
        if (isComplete) {
          status = "completed";
        } else if (hasResponses) {
          status = "in-progress";
        } else {
          status = "not-started";
        }

        // Calculate percentage score
        const scorePercentage = candidate.score && candidate.questionCount > 0 
          ? Math.round((candidate.score / candidate.questionCount) * 100)
          : null;

        return {
          id: candidate.sessionId,
          name: candidate.name,
          email: candidate.email || `${candidate.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
          score: scorePercentage,
          status,
          attempted,
          totalQuestions,
          duration,
          submittedAt: candidate.completedAt || null,
          sessionId: candidate.sessionId,
          responses: candidate.responses || [],
          totalTimeTaken: candidate.totalTimeTaken || 0
        };
      });

      console.log("Formatted candidates:", formattedCandidates);
      setCandidates(formattedCandidates);
      
    } catch (error) {
      console.error("Error loading candidates from storage:", error);
    }
  };

  // Debug function to show all localStorage data
  const debugLocalStorage = () => {
    console.log("=== LOCALSTORAGE DEBUG ===");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        console.log(`Key: ${key}`);
        console.log(`Value:`, value);
        try {
          const parsed = JSON.parse(value || '');
          console.log(`Parsed:`, parsed);
        } catch (e) {
          console.log(`Could not parse as JSON`);
        }
        console.log("---");
      }
    }
    console.log("=== END DEBUG ===");
  };

  // Filter candidates based on search term
  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalCandidates = candidates.length;
  const completedInterviews = candidates.filter(c => c.status === "completed").length;
  const completedWithScores = candidates.filter(c => c.status === "completed" && c.score !== null);
  const averageScore = completedWithScores.length > 0 
    ? completedWithScores.reduce((acc, curr) => acc + (curr.score || 0), 0) / completedWithScores.length
    : 0;
  const inProgressInterviews = candidates.filter(c => c.status === "in-progress").length;

  const handleViewPDF = (candidateId: string, sessionId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
    // Get the resume file from store or recreate it
    const { resumeFile } = useInterviewStore.getState();
    
    if (resumeFile) {
      // Create PDF URL from the file
      const pdfUrl = URL.createObjectURL(resumeFile);
      
      const pdfWindow = window.open();
      if (pdfWindow) {
        pdfWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Resume - ${candidate.name}</title>
              <style>
                body { 
                  margin: 0; 
                  font-family: Arial, sans-serif;
                  background: #f5f5f5;
                }
                .header {
                  background: #2563eb;
                  color: white;
                  padding: 1rem;
                  text-align: center;
                }
                .container {
                  max-width: 100%;
                  margin: 0 auto;
                  padding: 1rem;
                }
                .pdf-viewer {
                  width: 100%;
                  height: 90vh;
                  border: none;
                  background: white;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .download-btn {
                  background: #10b981;
                  color: white;
                  border: none;
                  padding: 0.5rem 1rem;
                  border-radius: 0.375rem;
                  cursor: pointer;
                  margin-bottom: 1rem;
                }
                .download-btn:hover {
                  background: #059669;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Resume - ${candidate.name}</h1>
                <p>Interview Session: ${candidate.sessionId}</p>
              </div>
              <div class="container">
                <button class="download-btn" onclick="downloadPDF()">Download Resume</button>
                <embed 
                  class="pdf-viewer"
                  src="${pdfUrl}" 
                  type="application/pdf"
                />
              </div>
              <script>
                function downloadPDF() {
                  const link = document.createElement('a');
                  link.href = '${pdfUrl}';
                  link.download = 'resume-${candidate.name.replace(/\s+/g, '_')}.pdf';
                  link.click();
                }
                
                // Clean up URL when window closes
                window.addEventListener('beforeunload', function() {
                  URL.revokeObjectURL('${pdfUrl}');
                });
              </script>
            </body>
          </html>
        `);
        pdfWindow.document.close();
      }
    } else {
      // Fallback: Show candidate info if no PDF file
      const pdfWindow = window.open();
      if (pdfWindow) {
        pdfWindow.document.write(`
          <html>
            <head><title>Resume Not Available - ${candidate.name}</title></head>
            <body style="font-family: Arial, sans-serif; padding: 2rem;">
              <h1>Resume Not Available</h1>
              <p>Original resume file is not available for ${candidate.name}.</p>
              <h2>Candidate Information:</h2>
              <pre>${JSON.stringify({
                name: candidate.name,
                email: candidate.email,
                score: candidate.score,
                status: candidate.status,
                questionsAttempted: `${candidate.attempted}/${candidate.totalQuestions}`,
                duration: candidate.duration,
                submittedAt: candidate.submittedAt
              }, null, 2)}</pre>
            </body>
          </html>
        `);
        pdfWindow.document.close();
      }
    }
  }
  };

  const handleDownloadReport = (candidateId: string, sessionId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
      const dataStr = JSON.stringify(candidate, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `interview-report-${candidate.name}-${candidate.sessionId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleViewDetails = (candidateId: string, sessionId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
      sessionStorage.setItem('selectedCandidate', JSON.stringify(candidate));
      alert(`Viewing details for ${candidate.name}\nScore: ${candidate.score}%\nStatus: ${candidate.status}\nCheck console for full data.`);
      console.log('Candidate details:', candidate);
    }
  };

  const handleCreateNewSession = () => {
    reset();
    localStorage.removeItem("currentCandidate");
    window.location.href = '/interview';
  };

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all candidate data? This action cannot be undone.")) {
      localStorage.removeItem("currentCandidate");
      localStorage.removeItem("interview-storage");
      loadCandidatesFromStorage();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "not-started":
        return <Badge variant="outline">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-gray-400";
    if (score >= 90) return "text-green-600 font-bold";
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-yellow-600";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interview Dashboard</h1>
            <p className="text-gray-600">Monitor and manage candidate interviews</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={debugLocalStorage}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Debug Storage
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClearAllData}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Clear All Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCandidates}</div>
              <p className="text-xs text-gray-600">Registered for interviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <FileText className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedInterviews}</div>
              <p className="text-xs text-gray-600">Interviews finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isNaN(averageScore) ? "0" : averageScore.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600">Overall performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressInterviews}</div>
              <p className="text-xs text-gray-600">Active interviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search candidates..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSearchTerm("")}>
                  All Candidates
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("completed")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("in-progress")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("not-started")}>
                  Not Started
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Button className="w-full sm:w-auto" onClick={handleCreateNewSession}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Session
          </Button>
        </div>

        {/* Candidates Table */}
        <Card>
          <CardHeader>
            <CardTitle>Candidates Overview</CardTitle>
            <CardDescription>
              Manage and review candidate interviews and results
              {searchTerm && (
                <span className="ml-2">
                  ({filteredCandidates.length} of {candidates.length} candidates)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {candidates.length === 0 ? (
                  <div>
                    <p>No candidate data found.</p>
                    <p className="text-sm mt-2">
                      Start an interview by uploading a resume to see data here.
                    </p>
                    <Button 
                      onClick={debugLocalStorage} 
                      variant="outline" 
                      className="mt-4"
                    >
                      Check Storage Data
                    </Button>
                  </div>
                ) : (
                  "No candidates match your search criteria."
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-sm text-gray-500">{candidate.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Progress 
                            value={(candidate.attempted / candidate.totalQuestions) * 100} 
                            className="h-2"
                          />
                          <div className="text-xs text-gray-500">
                            {candidate.attempted}/{candidate.totalQuestions} questions
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={getScoreColor(candidate.score)}>
                          {candidate.score ? `${candidate.score}%` : "-"}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{candidate.duration}</TableCell>
                      <TableCell>
                        {candidate.submittedAt ? (
                          new Date(candidate.submittedAt).toLocaleDateString()
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => handleViewDetails(candidate.id, candidate.sessionId)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleViewPDF(candidate.id, candidate.sessionId)}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                View PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDownloadReport(candidate.id, candidate.sessionId)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download Report
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}