import React, { useState, useEffect } from 'react';
import Badge from '../ui/badge/Badge';
import { Clock } from '@/icons';

interface TimerProps {
    duration: number; // Duration in seconds
    onTimeUp: () => void; // Callback when the timer ends
}

export default function Timer({ duration, onTimeUp }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [hasTimeUpFired, setHasTimeUpFired] = useState(false);

    useEffect(() => {
        // Reset timer when duration changes (e.g., after page refresh)
        setTimeLeft(duration);
        setHasTimeUpFired(false);
    }, [duration]);

    useEffect(() => {
        if (timeLeft < 0 && !hasTimeUpFired) {
            setHasTimeUpFired(true);
            onTimeUp();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div>
            {timeLeft >= 0 && <Badge variant="light" color="info" startIcon={<Clock />}>
                <h1 className=''>Time Left: {formatTime(timeLeft)}</h1>
            </Badge>}
        </div>
    );
}