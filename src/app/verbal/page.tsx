"use client";

import CreateQuiz from "@/components/verbal/CreateQuiz";
import VerbalLogs from "@/components/verbal/VerbalLogs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setActiveTab } from "@/store/reducers/tabSlice";
import { useEffect, useRef, useState } from "react";

export default function Verbal() {
    const dispatch = useDispatch();
    const activeTab = useSelector((state: RootState) => state.verbalTab.activeTab);
    const [contentHeight, setContentHeight] = useState<number>(400); // Default min height
    const logsRef = useRef<HTMLDivElement>(null);
    const createRef = useRef<HTMLDivElement>(null);

    // Calculate the maximum height needed for both tabs
    useEffect(() => {
        const calculateMaxHeight = () => {
            const logsHeight = logsRef.current?.scrollHeight || 0;
            const createHeight = createRef.current?.scrollHeight || 0;
            const maxHeight = Math.max(logsHeight, createHeight, 400); // Minimum 400px
            setContentHeight(maxHeight);
        };

        // Calculate after a small delay to allow rendering
        const timer = setTimeout(calculateMaxHeight, 100);

        // Also calculate on window resize
        window.addEventListener('resize', calculateMaxHeight);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', calculateMaxHeight);
        };
    }, [activeTab]);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            {/* Pill-Style Tab Navigation */}
            <div className="px-6 pt-6">
                <div className="inline-flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                    <button
                        onClick={() => dispatch(setActiveTab('logs'))}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'logs'
                            ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                            }`}
                    >
                        📊 Quiz Logs
                    </button>
                    <button
                        onClick={() => dispatch(setActiveTab('create'))}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'create'
                            ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                            }`}
                    >
                        🎯 Create Quiz
                    </button>
                </div>
            </div>

            {/* Tab Content Container with Fixed Height */}
            <div
                className="px-6 pb-6 transition-all duration-300 ease-in-out"
                style={{ minHeight: `${contentHeight}px` }}
            >
                <div
                    ref={logsRef}
                    className={activeTab === 'logs' ? 'block' : 'hidden'}
                >
                    <VerbalLogs />
                </div>
                <div
                    ref={createRef}
                    className={activeTab === 'create' ? 'block' : 'hidden'}
                >
                    <CreateQuiz />
                </div>
            </div>
        </div>
    );
}