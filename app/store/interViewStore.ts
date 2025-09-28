import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InterviewResponse {
  question: string;
  feedback: string;
  isCorrect: boolean;
  completionMessage?: string;
  difficulty?: "easy" | "medium" | "hard";
  timeAllotted?: number;
  timeTaken?: number;
}

interface InterviewState {
  responses: InterviewResponse[];
  currentQuestion: string;
  score: number;
  questionCount: number;
  timeRemaining: number;
  isTimerRunning: boolean;
  currentDifficulty: "easy" | "medium" | "hard";
  totalTimeTaken: number;
  timerId: NodeJS.Timeout | null;
  resumeFile: File | null; // Add resume file state
  resumeText: string; // Add resume text state

  // Actions
  setTimer: (time: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  updateTimeRemaining: () => void;
  setCurrentDifficulty: (difficulty: "easy" | "medium" | "hard") => void;
  addTimeTaken: (time: number) => void;
  getScoreFormatted: () => string;
  isComplete: () => boolean;
  saveResponse: (response: InterviewResponse) => void;
  incrementScore: (timeTaken?: number, timeAllotted?: number) => void;
  setResumeFile: (file: File | null) => void; // Add setResumeFile action
  setResumeText: (text: string) => void; // Add setResumeText action
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      responses: [],
      currentQuestion: "",
      score: 0,
      questionCount: 0,
      timeRemaining: 0,
      isTimerRunning: false,
      currentDifficulty: "easy",
      totalTimeTaken: 0,
      timerId: null,
      resumeFile: null, // Initialize resumeFile
      resumeText: "", // Initialize resumeText

      setTimer: (time: number) => {
        const { timerId } = get();
        if (timerId) {
          clearInterval(timerId);
        }

        set({
          timeRemaining: time,
          isTimerRunning: false,
        });
      },

      startTimer: () => {
        const { timerId, isTimerRunning } = get();

        if (isTimerRunning || get().timeRemaining <= 0) return;

        if (timerId) {
          clearInterval(timerId);
        }

        const newTimerId = setInterval(() => {
          const { timeRemaining, isTimerRunning } = get();

          if (timeRemaining > 0 && isTimerRunning) {
            set({ timeRemaining: timeRemaining - 1 });
          } else if (timeRemaining <= 0 && isTimerRunning) {
            get().stopTimer();
            console.log("Time's up!");
          }
        }, 1000);

        set({
          timerId: newTimerId,
          isTimerRunning: true,
        });
      },

      stopTimer: () => {
        const { timerId } = get();
        if (timerId) {
          clearInterval(timerId);
        }

        set({
          isTimerRunning: false,
          timerId: null,
        });
      },

      updateTimeRemaining: () => {
        set((state) => ({
          timeRemaining: state.timeRemaining - 1,
        }));
      },

      setCurrentDifficulty: (difficulty: "easy" | "medium" | "hard") => {
        set({ currentDifficulty: difficulty });
      },

      addTimeTaken: (time: number) => {
        set((state) => ({
          totalTimeTaken: state.totalTimeTaken + time,
        }));
      },

      getScoreFormatted: () => {
        const { score, questionCount } = get();
        return `${score}/${questionCount}`;
      },

      isComplete: () => {
        const { questionCount } = get();
        return questionCount >= 6;
      },

      saveResponse: (response: InterviewResponse) => {
        set((state) => ({
          responses: [...state.responses, response],
          questionCount: state.questionCount + 1,
        }));
      },

      incrementScore: (timeTaken?: number, timeAllotted?: number) => {
        const state = get();

        if (timeTaken && timeAllotted) {
          const timeRatio = timeTaken / timeAllotted;
          let timeBonus = 0;

          if (timeRatio <= 0.5) {
            timeBonus = 0.3;
          } else if (timeRatio <= 0.8) {
            timeBonus = 0.15;
          } else if (timeRatio <= 1) {
            timeBonus = 0;
          } else {
            timeBonus = -0.2;
          }

          const questionScore = Math.max(0, Math.min(1, 1 + timeBonus));

          set({
            score: state.score + questionScore,
            totalTimeTaken: state.totalTimeTaken + timeTaken,
          });
        } else {
          set({ score: state.score + 1 });
        }
      },

      // Add the missing resume file actions
      setResumeFile: (file: File | null) => {
        set({ resumeFile: file });
      },

      setResumeText: (text: string) => {
        set({ resumeText: text });
      },

      reset: () => {
        const { timerId } = get();
        if (timerId) {
          clearInterval(timerId);
        }

        set({
          responses: [],
          currentQuestion: "",
          score: 0,
          questionCount: 0,
          timeRemaining: 0,
          isTimerRunning: false,
          currentDifficulty: "easy",
          totalTimeTaken: 0,
          timerId: null,
          resumeFile: null,
          resumeText: "",
        });
      },

      // Add this action to check if there's an active interview
      hasActiveInterview: () => {
        const state = get();
        return state.responses.length > 0 && !state.isComplete();
      },
    }),
    {
      name: "interview-storage",
      // Only persist certain states, exclude File objects which can't be serialized
      partialize: (state) => ({
        responses: state.responses,
        currentQuestion: state.currentQuestion,
        score: state.score,
        questionCount: state.questionCount,
        timeRemaining: state.timeRemaining,
        isTimerRunning: state.isTimerRunning,
        currentDifficulty: state.currentDifficulty,
        totalTimeTaken: state.totalTimeTaken,
        resumeText: state.resumeText,
        // Note: resumeFile is excluded from persistence as File objects can't be serialized
      }),
    }
  )
);
