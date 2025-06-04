export interface StepProps {
    onNextStep?: () => void,
    onPreviousStep?: () => void
}

export interface Department {
    uuid: string;
    name: string;
}

export interface ObjectType {
    name: string;
    value: string | number;
}

export interface Difficulty {
    name: string;
    value: string;
}

export interface Topic {
    uuid: string;
    name: string;
    description: string;
    department: Department;
}

export interface Quiz {
    uuid: string;
    question: string;
    answer?: string;
    selected_index?: number | number[];
    options: string[];
    question_type: "CHOICE" | "MULTIPLE_CHOICE";
}

export interface UserInfo {
    name: string;
    email: string;
}

export interface QuizRequest {
    department: string | undefined;
    topics: string[];
    difficulty: string | undefined;
    question_count: number | undefined;
    timer: number;
    name: string | undefined;
    email: string | undefined;
}

export interface QuizResult {
    uuid: string;
    department: Department;
    timer: number;
    difficulty: string;
    question_count: number;
    score: boolean;
    total_answers: number;
    total_correct: number;
}