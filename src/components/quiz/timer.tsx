import React, { useState, useEffect } from 'react';
import Badge from '../ui/badge/Badge';
import { Clock } from '@/icons';

interface TimerProps {
    duration: number; // Duration in seconds
    onTimeUp: () => void; // Callback when the timer ends
}

export default function Timer({ duration, onTimeUp }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId); // Cleanup on unmount
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div>
            <Badge variant="light" color="info" startIcon={<Clock />}>
                <h1 className=''>Time Left: {formatTime(timeLeft)}</h1>
            </Badge>
        </div>
    );
}