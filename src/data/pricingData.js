import { CheckIcon } from "lucide-react";

export const pricingData = [
    {
        title: "Free Tier",
        price: 0,
        features: [
            {
                name: "3 AI Mock Sessions",
                icon: CheckIcon,
            },
            {
                name: "Standard Latency AI",
                icon: CheckIcon,
            },
            {
                name: "Basic Behavioral Analysis",
                icon: CheckIcon,
            },
            {
                name: "Community Support",
                icon: CheckIcon,
            },
        ],
        buttonText: "Start Practicing",
    },
    {
        title: "Professional",
        price: 29,
        mostPopular: true,
        features: [
            {
                name: "Unlimited Interviews",
                icon: CheckIcon,
            },
            {
                name: "Groq LPU™ Acceleration",
                icon: CheckIcon,
            },
            {
                name: "Cartesia Ultra-Realistic Voice",
                icon: CheckIcon,
            },
            {
                name: "LiveKit Real-time Video",
                icon: CheckIcon,
            },
            {
                name: "Deepgram Transcription",
                icon: CheckIcon,
            },
            {
                name: "Advanced Code Review",
                icon: CheckIcon,
            }
        ],
        buttonText: "Go Professional",
    },
    {
        title: "Elite",
        price: 79,
        features: [
            {
                name: "Everything in Pro",
                icon: CheckIcon,
            },
            {
                name: "Unlimited Resume Analysis",
                icon: CheckIcon,
            },
            {
                name: "Personalized Groq Prompting",
                icon: CheckIcon,
            },
            {
                name: "1-on-1 Human Review",
                icon: CheckIcon,
            },
            {
                name: "Priority Server Access",
                icon: CheckIcon,
            }
        ],
        buttonText: "Upgrade to Elite",
    }
];