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
    
    // Fix: We've already asked 'questionCount' questions, next is questionCount + 1
    // If we're about to ask the 6th question (questionCount === 5), then it's the last one
    const isLastQuestion = questionCount >= 5; // 0-4 = 5 questions asked, next is 6th
    
    console.log(`Question count: ${questionCount}, Is last question: ${isLastQuestion}`);

    const prompt = `
    You are a technical interviewer. Ask technical questions about web development.
    ${userAnswer ? `The user answered: "${userAnswer}". Evaluate if correct or not and provide brief feedback.` : "Ask the first technical question about web development."}
    
    Current: Question ${questionCount + 1} of 6.
    ${isLastQuestion ? "This is the LAST question. After evaluating the answer, mark the interview as complete." : ""}
    
    Rules:
    - If this is the first request (no userAnswer), provide a question
    - If user provided answer, evaluate it and provide the next question unless this was the last question
    - After the 6th question, mark as complete
    
    Return ONLY valid JSON, no code blocks, no extra text:
    {
      "question": "next question or null if done",
      "feedback": "if user answered, say correct/incorrect and why",
      "isCorrect": true/false,
      "isComplete": ${isLastQuestion ? "true" : "false"},
      "completionMessage": ${isLastQuestion ? "\"Thank you for completing the interview! Your final score will be reviewed.\"" : "null"}
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
      // Fallback questions for each stage
      const fallbackQuestions = [
        "What is React and what are its key features?",
        "Explain the difference between let, const, and var in JavaScript.",
        "What are React hooks and why were they introduced?",
        "How does CSS Flexbox work and what are its main properties?",
        "What is the virtual DOM in React and how does it improve performance?",
        "Explain the concept of closures in JavaScript with an example."
      ];
      
      const currentIndex = userAnswer ? questionCount : questionCount - 1;
      const fallbackQuestion = currentIndex < fallbackQuestions.length ? fallbackQuestions[currentIndex] : null;
      
      data = {
        question: isLastQuestion ? null : fallbackQuestion,
        feedback: userAnswer ? "Could not evaluate answer properly" : "",
        isCorrect: false,
        isComplete: isLastQuestion,
        completionMessage: isLastQuestion ? "Thank you for completing the interview! Your final score will be reviewed." : null,
      };
    }

    // Calculate new state - only increment question count if we're asking a new question
    const newScore = userAnswer && data.isCorrect ? score + 1 : score;
    const newQuestionCount = userAnswer ? questionCount + 1 : questionCount;

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        // Ensure we have a question if not complete
        question: data.question || (data.isComplete ? null : "What is React and what are its key features?"),
        isComplete: data.isComplete || isLastQuestion,
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
        question: "What is React and what are its key features?",
        feedback: "Error occurred, please continue",
        isCorrect: false,
        isComplete: false,
        completionMessage: null,
      },
    });
  }
}