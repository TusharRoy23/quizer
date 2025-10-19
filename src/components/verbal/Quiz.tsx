import { OralQuestion } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import { QuizService } from "@/services/quizService";
import TypewriterRenderer from "../common/TypewriterRenderer";
import { useRouter } from "next/navigation";
import { setSearchEnable } from "@/store/reducers/searchSlice";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

export default function Quiz({
    quiz,
    logUUID,
    onNextQuestion,
    isLastQuestion,
    isFirstQuestion = false, // Add this prop to identify first question
}: {
    quiz: OralQuestion;
    logUUID?: string;
    onNextQuestion: () => void;
    isLastQuestion: boolean;
    isFirstQuestion?: boolean;
}) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showNextButton, setShowNextButton] = useState(false);
    const [showQuestionText, setShowQuestionText] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false);
    const [permissionsGranted, setPermissionsGranted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const loadedQuizUuid = useRef<string | null>(null);

    // Format MM:SS
    const formatTime = (seconds: number | null) => {
        if (seconds === null) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Start automatic recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks: Blob[] = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);

            recorder.onstop = async () => {
                setIsSubmitting(true);
                const audioBlob = new Blob(chunks, { type: "audio/mpeg" });

                const formData = new FormData();
                formData.append("audio", audioBlob, "answer.mp3");

                try {
                    await QuizService.uploadAudioAnswer(quiz.uuid, formData);

                    if (isLastQuestion && logUUID) {
                        await submitQuiz(logUUID);
                    } else {
                        setShowQuestionText(false);
                        onNextQuestion();
                    }
                } catch {
                    setError("❌ Failed to upload answer. Please retry.");
                    setShowNextButton(true);
                } finally {
                    stream.getTracks().forEach((t) => t.stop());
                    setIsSubmitting(false);
                }
            };

            recorder.start();
            mediaRecorderRef.current = recorder;
            setIsRecording(true);
            setPermissionsGranted(true);
        } catch {
            setError("🎤 Microphone access denied. Please allow permissions.");
            setShowNextButton(true);
            setIsRecording(false);
            setPermissionsGranted(false);
        }
    };

    const submitQuiz = async (logUUID: string) => {
        try {
            const response = await QuizService.submitVerbalQuiz(logUUID);
            if (response) {
                dispatch(setSearchEnable(true));
                router.push(`/verbal/${logUUID}/feedback`);
            }
        } catch {
            setError("❌ Failed to submit answers. Please retry.");
            setShowNextButton(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        setTimeLeft(null);
    };

    // Call timer API
    const startTimerAndRecording = async () => {
        try {
            const quizTimer = await QuizService.getVerbalQuizTimer(quiz.uuid);

            if (!quizTimer?.remainingSeconds || quizTimer.remainingSeconds <= 0) {
                if (isLastQuestion && logUUID) {
                    await submitQuiz(logUUID);
                } else {
                    onNextQuestion();
                }
                return;
            }

            setTimeLeft(quizTimer.remainingSeconds);
            await startRecording();
        } catch {
            setError("⚠️ Could not start timer.");
            setShowNextButton(true);
        }
    };

    const noAudioCall = async () => {
        setShowQuestionText(true);   // ✅ show text immediately if no audio
        await startTimerAndRecording();
    }

    // Load question audio (but don't play automatically)
    const loadQuestionAudio = async () => {
        if (loadedQuizUuid.current === quiz.uuid) return;
        loadedQuizUuid.current = quiz.uuid;

        setIsLoading(true);
        setError(null);
        setShowNextButton(false);

        try {
            const response = await QuizService.getVerbalQuizAudio(quiz.uuid);
            const url = response?.url || null;
            if (!url) {
                noAudioCall();
                return;
            }
            setAudioUrl(url);

            // For subsequent questions (not first), auto-play if permissions are granted
            if (!isFirstQuestion && permissionsGranted && url) {
                await playAudio(url);
            } else if (!isFirstQuestion && !permissionsGranted) {
                noAudioCall();
            }

            setIsLoading(false);
        } catch {
            setError("❌ Failed to load question audio.");
            setIsLoading(false);
            setShowNextButton(true);
        }
    };

    // Play audio function
    const playAudio = async (url: string) => {
        try {
            if (audioRef.current) {
                audioRef.current.pause();
            }

            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = async () => {
                setIsPlaying(false);
                setShowQuestionText(true);
                setShowNextButton(true);
                await startTimerAndRecording();
            };

            audio.onerror = () => {
                setError("❌ Failed to play audio.");
                setIsPlaying(false);
                setShowNextButton(true);
            };

            await audio.play();
            setIsPlaying(true);
        } catch (error) {
            setError("❌ Please interact with the page to play audio.");
            setIsPlaying(false);
        }
    };

    // Handle user interaction for first question
    const handleUserInteraction = async () => {
        setUserInteracted(true);

        // First, request microphone permissions
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setPermissionsGranted(true);

            // Then play audio if available
            if (audioUrl) {
                await playAudio(audioUrl);
            } else {
                // If no audio, start recording directly
                await startTimerAndRecording();
            }
        } catch (error) {
            setError("🎤 Microphone permission denied. Please allow access.");
        }
    };

    const stopEverything = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        stopRecording();
        setIsPlaying(false);
        setIsRecording(false);
        setTimeLeft(null);
    };

    const handleNext = () => {
        setShowQuestionText(false);
        stopEverything();
        onNextQuestion();
    };

    const completeQuiz = async () => {
        try {
            stopEverything();
            setIsSubmitting(true);
            setShowQuestionText(false);

            if (logUUID) {
                await submitQuiz(logUUID);
            }
        } catch {
            setIsSubmitting(false);
        } finally {
            setIsSubmitting(false);
        }

    }

    // Load audio when question changes
    useEffect(() => {
        if (quiz) {
            loadQuestionAudio();
        }
        return () => stopEverything();
    }, [quiz]);

    // Countdown effect
    useEffect(() => {
        if (timeLeft === null) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null) return null;
                if (prev <= 1) {
                    clearInterval(timer);
                    stopRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
            {/* Hidden audio element */}
            {audioUrl && <audio ref={audioRef} src={audioUrl} />}

            <h2 className="text-2xl text-center font-semibold text-gray-800 mb-4">
                Verbal Question
            </h2>

            {/* Loading */}
            {isLoading && (
                <div className="py-6 text-center text-gray-600">⏳ Loading question...</div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-700 text-center">{error}</p>
                    <div className="flex justify-center mt-3">
                        <button
                            onClick={() => {
                                setError(null);
                                loadedQuizUuid.current = null;
                                loadQuestionAudio();
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mr-2"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Playing */}
            {isPlaying && (
                <div className="bg-blue-50 border border-blue-200 text-center rounded-lg p-3 mb-4">
                    🎵 Playing question audio...
                </div>
            )}
            <AnimatePresence mode="wait">
                {showQuestionText && quiz?.question && (
                    <motion.div
                        key={quiz.uuid} // ensure fresh animation on each question
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-lg text-gray-800 font-medium mb-2">Question:</p>
                            <TypewriterRenderer text={quiz.question} speed={5} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* User Interaction Button (First Question) */}
            {isFirstQuestion && !userInteracted && !isLoading && (
                <div className="text-center mb-6">
                    <button
                        onClick={handleUserInteraction}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg font-semibold"
                    >
                        🎤 Start Question & Grant Permissions
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                        Click to enable audio playback and microphone access
                    </p>
                </div>
            )}

            {/* Recording */}
            {isRecording && timeLeft !== null && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-700 font-semibold mb-2 text-center">
                        ● Recording... {formatTime(timeLeft)}
                    </p>
                </div>
            )}

            {/* Next Button */}
            {showNextButton && !isLastQuestion && (
                <button
                    onClick={handleNext}
                    className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    disabled={isPlaying || isLoading || isSubmitting}
                >
                    Next Question →
                </button>
            )}

            {showNextButton && <button
                onClick={completeQuiz}
                className="w-full mt-3 px-6 py-3 border-2 border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400 rounded-lg hover:bg-purple-50"
                disabled={isPlaying || isLoading || isSubmitting}
            >
                Complete Quiz
            </button>}

        </div>
    );
}