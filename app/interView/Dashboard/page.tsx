"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Bot, User, Clock, AlertTriangle, Link } from "lucide-react";
import { useInterviewStore } from "@/app/store/interViewStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CandidateInfo {
  name: string;
}

function InterviewPage() {
  const [candidateName, setCandidateName] = useState<string>("Candidate");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    responses,
    currentQuestion,
    score,
    questionCount,
    timeRemaining,
    isTimerRunning,
    currentDifficulty,
    totalTimeTaken,
    getScoreFormatted,
    isComplete,
    saveResponse,
    incrementScore,
    setTimer,
    startTimer,
    stopTimer,
    setCurrentDifficulty,
    addTimeTaken,
    reset,
  } = useInterviewStore();

  // Set timeout based on question difficulty
  const getTimeForDifficulty = (difficulty: string): number => {
    switch (difficulty) {
      case "easy":
        return 20; // 20 seconds
      case "medium":
        return 60; // 60 seconds
      case "hard":
        return 120; // 120 seconds
      default:
        return 30; // default fallback
    }
  };

  // Format time display (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Get time color based on remaining time
  useEffect(() => {
    startTimer();
  }, []);
  const getTimeColor = (): string => {
    if (timeRemaining <= 10) return "text-white-600";
    if (timeRemaining <= 30) return "text-white-500";
    return "text-gray-700";
  };

  useEffect(() => {
    console.log("Store updated:", {
      responses,
      questionCount,
      currentQuestion,
      isComplete: isComplete(),
      timeRemaining,
      isTimerRunning,
    });
  }, [
    responses,
    questionCount,
    currentQuestion,
    isComplete,
    timeRemaining,
    isTimerRunning,
  ]);

  useEffect(() => {
    const candidateData = localStorage.getItem("currentCandidate");
    if (candidateData) {
      try {
        const candidateInfo: CandidateInfo = JSON.parse(candidateData);
        setCandidateName(candidateInfo.name || "Candidate");
      } catch (error) {
        console.error("Error parsing candidate data:", error);
      }
    }
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [responses, loading]);

  // Handle timer expiration
  useEffect(() => {
    if (timeRemaining === 0 && isTimerRunning) {
      stopTimer();
      // Auto-submit empty answer when time expires
      handleTimeExpired();
    }
  }, [timeRemaining, isTimerRunning]);

  const handleTimeExpired = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAnswer: "[Time Expired - No Answer Provided]",
          currentState: { questionCount, score },
        }),
      });

      const result = await response.json();

      if (result.success) {
        const timeTaken = getTimeForDifficulty(currentDifficulty); // Used full time
        saveResponse(result.data);
        addTimeTaken(timeTaken);

        if (result.data.isCorrect) {
          incrementScore(timeTaken, getTimeForDifficulty(currentDifficulty));
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const startInterview = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAnswer: null,
          currentState: { questionCount, score },
        }),
      });

      const result = await response.json();

      if (result.success) {
        saveResponse(result.data);

        // Set up timer for next question
        const difficulty = result.data.difficulty || "easy";
        const timeAllotted = getTimeForDifficulty(difficulty);
        setCurrentDifficulty(difficulty);
        setTimer(timeAllotted);
        setStartTime(Date.now());

        if (result.data.isCorrect) {
          incrementScore();
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const submitAnswer = async (): Promise<void> => {
    if (!answer.trim()) return;

    stopTimer(); // Stop timer when submitting
    const timeTaken = startTime
      ? Math.floor((Date.now() - startTime) / 1000)
      : 0;
    const timeAllotted = getTimeForDifficulty(currentDifficulty);

    setLoading(true);
    try {
      const response = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAnswer: answer,
          currentState: { questionCount, score },
        }),
      });

      const result = await response.json();

      if (result.success) {
        saveResponse({
          ...result.data,
          timeTaken,
          timeAllotted,
          difficulty: currentDifficulty,
        });

        addTimeTaken(timeTaken);

        if (result.data.isCorrect) {
          incrementScore(timeTaken, timeAllotted);
        }

        setAnswer("");
        setStartTime(0);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const resetInterview = (): void => {
    stopTimer();
    reset();
    setAnswer("");
    setStartTime(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !loading) {
      submitAnswer();
    }
  };

  const formatMessage = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  // Helper function to safely access completion message
  const getCompletionMessage = (response: any) => {
    return response.completionMessage || "Thank you for your participation!";
  };

  // Calculate average time per question
  const getAverageTime = (): string => {
    if (questionCount === 0) return "0s";
    const avg = totalTimeTaken / questionCount;
    return `${Math.round(avg)}s`;
  };

  return (
    <div className="w-full h-screen md:mt-8 p-0 bg-gray-50">
      <Card className="w-full h-full flex flex-col rounded-none shadow-none md:rounded-lg md:shadow-lg md:max-w-md md:max-h-[90vh] md:m-auto">
        <CardHeader className="bg-blue-600 text-white p-4 mt-[-24px] md:rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarFallback className="bg-green-500 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  Technical Interview Bot
                  {/* Clock shown at CardTitle */}
                  {isTimerRunning && (
                    <div
                      className={`flex items-center space-x-1 ${getTimeColor()}`}
                    >
                      <Clock className="h-4 w-4 bg-white" />
                      <span className="font-mono font-bold text-sm">
                        {formatTime(timeRemaining)}
                      </span>
                      {timeRemaining <= 10 && (
                        <AlertTriangle className="h-4 w-4 animate-pulse" />
                      )}
                    </div>
                  )}
                </CardTitle>
                <CardDescription className="text-green-100">
                  Interviewing {candidateName}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden">
          <div ref={scrollAreaRef} className="h-full p-4 overflow-y-auto">
            {responses.length === 0 ? (
              <div className="text-center py-8 space-y-4 h-full flex flex-col justify-center">
                <Avatar className="h-16 w-16 mx-auto mb-2 bg-blue-100">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <Bot className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <p className="text-gray-600 mb-4">
                  Ready to start your technical interview?
                </p>
                <Button
                  onClick={startInterview}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md mx-auto"
                >
                  {loading ? "Starting Interview..." : "Start Interview"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Display all questions and responses in chat format */}
                {responses.map((response, index) => (
                  <div key={index} className="space-y-4">
                    {/* AI Questions */}
                    {response.question && (
                      <div className="flex items-start space-x-2">
                        <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%] shadow-sm">
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-medium text-blue-800 text-sm">
                              Question {index + 1}
                            </p>
                            {response.difficulty && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  response.difficulty === "easy"
                                    ? "bg-green-100 text-green-800"
                                    : response.difficulty === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {response.difficulty}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-800 whitespace-pre-wrap text-sm md:text-base">
                            {formatMessage(response.question)}
                          </p>
                          {response.timeTaken && (
                            <p className="text-xs text-gray-500 mt-2">
                              Time taken: {response.timeTaken}s /{" "}
                              {response.timeAllotted}s
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* User Answer */}
                    {index === responses.length - 1 && answer && (
                      <div className="flex items-start justify-end space-x-2">
                        <div className="bg-green-100 border border-green-200 rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%] shadow-sm">
                          <p className="font-medium text-green-800 text-sm mb-1">
                            Your Answer
                          </p>
                          <p className="text-gray-800 whitespace-pre-wrap text-sm md:text-base">
                            {formatMessage(answer)}
                          </p>
                        </div>
                        <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                          <AvatarFallback className="bg-green-100 text-green-600">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Completion message */}
                {isComplete() && (
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                      <AvatarFallback className="bg-green-100 text-green-600">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-green-50 border border-green-200 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                      <p className="font-semibold text-green-800 mb-2 text-sm md:text-base">
                        Interview Completed! 🎉
                      </p>
                      <p className="text-green-700 whitespace-pre-wrap text-sm md:text-base">
                        {getCompletionMessage(responses[responses.length - 1])}
                      </p>
                      <div className="mt-3 p-3 bg-white rounded-lg border space-y-2">
                        <p className="text-center font-semibold text-gray-800 text-sm md:text-base">
                          Final Score: {getScoreFormatted()}
                        </p>
                        <p className="text-center text-xs text-gray-600">
                          Average time per question: {getAverageTime()}
                        </p>
                        <p className="text-center text-xs text-gray-600">
                          Total time: {totalTimeTaken}s
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress display */}
                {responses.length > 0 && (
                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Question {Math.min(questionCount + 1, 6)} of 6
                      {isComplete() && " • Completed!"}
                    </p>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      Score: {getScoreFormatted()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>

        {/* Answer input only if interview started and not complete */}
        {responses.length > 0 && !isComplete() && (
          <CardFooter className="p-2 border-t bg-white">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Type your answer..."
                value={answer}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAnswer(e.target.value)
                }
                onKeyPress={handleKeyPress}
                className="pr-12 py-6 w-full rounded-md border-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-sm md:text-base"
                disabled={loading}
              />
              <Button
                onClick={submitAnswer}
                disabled={loading || !answer.trim()}
                size="icon"
                className="absolute inset-y-1 right-1 m-auto h-8 w-8 bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm"
              >
                <ArrowUp className="h-4 w-4 text-white" />
              </Button>
            </div>
          </CardFooter>
        )}

        {isComplete() && (
          <CardFooter className="bg-white p-4 flex flex-col space-y-2">
            <Button
              variant="outline"
              onClick={resetInterview}
              className="w-full border-2 p-4 border-blue-200 hover:bg-blue-500 text-gray-700 font-medium py-3 rounded-md text-sm md:text-base"
            >
              Start New Interview
            </Button>
            <Link href="/" >
            <Button
              variant="outline"
              onClick={reset}
              className="w-full border-2 p-4 border-black hover:bg-white text-gray-700 font-medium py-3 rounded-md text-sm md:text-base"
            >
               Back To Dashboard
            </Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default InterviewPage;
