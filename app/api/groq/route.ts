import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

interface ApiRequest {
  userAnswer?: string;
  currentState?: {
    questionCount: number;
    score: number;
  };
}

interface GroqResponse {
  question: string | null;
  feedback: string;
  isCorrect: boolean;
  isComplete: boolean;
  completionMessage: string | null;
  difficulty?: "easy" | "medium" | "hard";
}

interface ApiResponse {
  success: boolean;
  data: GroqResponse;
  newState?: {
    score: number;
    questionCount: number;
    isComplete: boolean;
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const body: ApiRequest = await request.json();
    const { userAnswer, currentState } = body;

    const questionCount = currentState?.questionCount || 0;
    const score = currentState?.score || 0;
    
    const isLastQuestion = questionCount >= 5;
    
    console.log(`Question count: ${questionCount}, Is last question: ${isLastQuestion}`);

    // Determine difficulty based on question number
    let difficulty: "easy" | "medium" | "hard" = "easy";
    if (questionCount >= 4) difficulty = "hard";
    else if (questionCount >= 2) difficulty = "medium";

    const prompt = `
    You are a technical interviewer conducting a web development interview.
    
    ${userAnswer 
      ? `The candidate answered: "${userAnswer}". Evaluate if this answer is correct and provide brief constructive feedback.` 
      : "Ask the next technical question about web development."
    }
    
    Current Progress: Question ${questionCount + 1} of 6
    Difficulty Level: ${difficulty}
    ${isLastQuestion ? "This is the FINAL question. After evaluating the answer, provide a completion message and end the interview." : ""}
    
    Rules:
    - If this is the first request (no userAnswer), provide an EASY question about basic web development
    - If user provided answer, evaluate it honestly and provide the next question
    - Questions should progress in difficulty: easy → medium → hard
    - Technical topics: HTML, CSS, JavaScript, React, Node.js, APIs, etc.
    - After the 6th question, mark as complete
    - Return the difficulty level with each question
    
    Response Format (JSON only):
    {
      "question": "the next question or null if interview is complete",
      "feedback": "brief feedback on the answer if provided, otherwise empty string",
      "isCorrect": true/false,
      "isComplete": ${isLastQuestion ? "true" : "false"},
      "difficulty": "${difficulty}",
      "completionMessage": ${isLastQuestion ? "\"Thank you for completing the technical interview! Your responses have been recorded and will be reviewed by our team.\"" : "null"}
    }`;

    const response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: prompt,
    });

    let responseText = response.output_text ?? "";
    responseText = responseText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let data: GroqResponse;
    try {
      data = JSON.parse(responseText) as GroqResponse;
    } catch (e) {
      console.error("JSON parse error:", e, responseText);
      
      // Fallback questions with proper difficulty progression
      const fallbackQuestions = [
        { question: "What is the difference between let, const, and var in JavaScript?", difficulty: "easy" },
        { question: "Explain how CSS Flexbox works and when you would use it.", difficulty: "easy" },
        { question: "What are React hooks and why were they introduced? Give examples.", difficulty: "medium" },
        { question: "How would you optimize website performance for faster loading?", difficulty: "medium" },
        { question: "Explain the concept of closures in JavaScript with a practical example.", difficulty: "hard" },
        { question: "Describe how you would implement authentication in a React/Node.js application.", difficulty: "hard" }
      ];
      
      const currentIndex = userAnswer ? questionCount : questionCount;
      const fallback = currentIndex < fallbackQuestions.length ? fallbackQuestions[currentIndex] : fallbackQuestions[0];
      
      data = {
        question: isLastQuestion ? null : fallback.question,
        feedback: userAnswer ? "Thank you for your answer. Let's continue with the next question." : "",
        isCorrect: userAnswer ? true : false,
        isComplete: isLastQuestion,
        difficulty: fallback.difficulty as "easy" | "medium" | "hard",
        completionMessage: isLastQuestion ? "Thank you for completing the technical interview! Your responses have been recorded and will be reviewed by our team." : null,
      };
    }

    // Calculate new state
    const newScore = userAnswer && data.isCorrect ? score + 1 : score;
    const newQuestionCount = userAnswer ? questionCount + 1 : questionCount;

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        question: data.question || (data.isComplete ? null : "What are the key features of React?"),
        isComplete: data.isComplete || isLastQuestion,
        difficulty: data.difficulty || difficulty,
      },
      newState: {
        score: newScore,
        questionCount: newQuestionCount,
        isComplete: data.isComplete || isLastQuestion,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      data: {
        question: "What is React and what are its main advantages?",
        feedback: "An error occurred, please continue with the interview",
        isCorrect: false,
        isComplete: false,
        difficulty: "easy",
        completionMessage: null,
      },
    });
  }
}