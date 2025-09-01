import React, { useState, useEffect, useCallback } from "react";
import { Clock } from "@/icons";

interface TimerProps {
    duration: number;
    onTimeUp: () => void;
}

export default function Timer({ duration, onTimeUp }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [hasTimeUpFired, setHasTimeUpFired] = useState(false);

    const handleTimeUp = useCallback(() => {
        if (!hasTimeUpFired) {
            setHasTimeUpFired(true);
            onTimeUp();
        }
    }, [onTimeUp, hasTimeUpFired]);

    useEffect(() => {
        // Reset timer when duration changes (e.g., after page refresh)
        setTimeLeft(duration);
        setHasTimeUpFired(false);
    }, [duration]);

    useEffect(() => {
        if (timeLeft <= 0) {
            handleTimeUp();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, handleTimeUp]); // Now using the memoized callback

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (minutes < 0 || secs < 0) return "00:00";
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <div
            className={`
                flex items-center justify-center px-4 py-2 rounded-2xl shadow-md 
                bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                font-semibold text-lg tracking-wide transition-all duration-300
                ${timeLeft <= 30 ? "animate-pulse bg-gradient-to-r from-red-500 to-red-600" : ""}
            `}
        >
            <Clock className="w-5 h-5 mr-2" />
            <span>
                {timeLeft <= 30 ? "⏳ Hurry up! " : "Time Left: "} {formatTime(timeLeft)}
            </span>
        </div>
    );
}