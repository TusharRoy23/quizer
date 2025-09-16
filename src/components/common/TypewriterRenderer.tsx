// components/common/TypewriterRenderer.tsx
import { useState, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface TypewriterRendererProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
}

export default function TypewriterRenderer({ text, speed = 30, onComplete }: TypewriterRendererProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!text || currentIndex >= text.length) {
            onComplete?.();
            return;
        }

        const timer = setTimeout(() => {
            setDisplayedText(prev => prev + text[currentIndex]);
            setCurrentIndex(prev => prev + 1);
        }, speed);

        return () => clearTimeout(timer);
    }, [text, currentIndex, speed, onComplete]);

    return (
        <div className="relative">
            <MarkdownRenderer content={displayedText} />
            {currentIndex < text.length && (
                <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
            )}
        </div>
    );
}