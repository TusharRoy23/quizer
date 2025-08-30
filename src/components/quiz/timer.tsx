import React, { useState, useEffect, useCallback, useRef } from "react";
import { Clock } from "@/icons";
import { motion } from "framer-motion";

interface TimerProps {
    duration: number;
    onTimeUp: () => void;
    isActive?: boolean;
    onTick?: (timeLeft: number) => void;
}

export default function Timer({ duration, onTimeUp, isActive = true, onTick }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [hasTimeUpFired, setHasTimeUpFired] = useState(false);
    const [isRunning, setIsRunning] = useState(true);
    const initialDurationRef = useRef(duration);
    const timerIdRef = useRef<NodeJS.Timeout | null>(null);

    const handleTimeUp = useCallback(() => {
        if (!hasTimeUpFired && isActive) {
            setHasTimeUpFired(true);
            setIsRunning(false);
            onTimeUp();
        }
    }, [onTimeUp, hasTimeUpFired, isActive]);

    // Only reset timer if the initial duration changes
    useEffect(() => {
        if (duration !== initialDurationRef.current) {
            initialDurationRef.current = duration;
            setTimeLeft(duration);
            setHasTimeUpFired(false);
            setIsRunning(true);
        }
    }, [duration]);

    // Handle timer ticks - independent of parent re-renders
    useEffect(() => {
        if (!isActive || !isRunning) return;

        if (timeLeft <= 0) {
            handleTimeUp();
            return;
        }

        timerIdRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = prev - 1;
                if (onTick) onTick(newTime);
                return newTime;
            });
        }, 1000);

        return () => {
            if (timerIdRef.current) {
                clearInterval(timerIdRef.current);
            }
        };
    }, [timeLeft, handleTimeUp, isActive, isRunning, onTick]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    if (!isActive) return null;

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