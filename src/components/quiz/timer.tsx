import React, { useState, useEffect, useCallback } from "react";
import { Clock } from "@/icons";

interface TimerProps {
    duration: number; // Duration in seconds
    onTimeUp: () => void; // Callback when the timer ends
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
        setTimeLeft(duration);
        setHasTimeUpFired(false);
    }, [duration]);

    useEffect(() => {
        if (timeLeft < 0) {
            handleTimeUp();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, handleTimeUp]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <>
            {timeLeft >= 0 && (
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
            )}
        </>
    );
}
