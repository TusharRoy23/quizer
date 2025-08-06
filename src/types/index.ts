export interface Authentication {
    authenticated: boolean;
    expiredAt: number;
    user: UserInfo
}
export interface StepProps {
    onNextStep?: () => void,
    onPreviousStep?: () => void,
    isAuthenticated?: boolean;
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
    answer?: number[];
    selected_index?: number | number[];
    selected_answer?: number[];
    options: string[];
    question_type: "CHOICE" | "MULTIPLE_CHOICE";
    explanation?: string;
}

export interface UserInfo {
    name: string;
    email: string;
    uuid?: string;
}

export interface QuizRequest {
    department: string | undefined;
    topics: string[];
    difficulty: string | undefined;
    question_count: number | undefined;
    timer: number;
}

export interface QuizResult {
    uuid: string;
    department: Department;
    timer: number;
    difficulty: string;
    question_count: number;
    completed: boolean;
    score: boolean;
    total_answers: number;
    total_correct: number;
    created_at: string;
}

export interface QuizTimer {
    remainingSeconds: number;
    expiresAt: string;
    timezoneOffset: number;
    timezoneName: string;
}

export interface PaginationMetadata {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
    page: number;
    totalItems: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMetadata;
}

export interface CustomResponse<T> {
    data: T[];
    meta: PaginationMetadata;
    status?: number;
    message?: string;
}