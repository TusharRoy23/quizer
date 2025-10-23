import { AgenticRole } from "./enum";

export interface Authentication {
    authenticated: boolean;
    expiredAt: number;
    user: UserInfo
}
export interface StepProps {
    onNextStep?: () => void,
    onPreviousStep?: () => void,
    isAuthenticated?: boolean;
    isVerbal?: boolean;
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
    difficulty?: string | undefined;
    question_count?: number | undefined;
    timer?: number;
}

export interface QuizResult {
    uuid: string;
    department: Department;
    timer: number;
    difficulty: string;
    question_count: number;
    completed: boolean;
    score: number;
    total_answers: number;
    total_correct: number;
    is_oral: boolean;
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

export interface QuestionKeyword {
    uuid: string;
    keyword: string;
    explanation?: string;
    example?: string;
}
export interface ErrorResponse {
    status: number;
    data: {
        statusCode: number;
        success: boolean;
        message: string;
        error: Record<string, string[]>;
    };
    meta: any;
    message: string;
    __isWrapped: boolean;
}

export type OralQuestion = {
    uuid: string;
    question: string;
    oral_timer?: number; // Timer in minutes
    oral_end_time?: Date; // End time in UTC
    oral_response?: string;
    topic?: string;
    sub_topic?: string;
    expected_points?: string[];
}

export type TAB = 'logs' | 'create';

export interface IForm {
    department: Department | undefined;
    topics: Topic[];
    difficulty: Difficulty | undefined;
    questionCount?: ObjectType;
    timer?: number
}

export interface IStep {
    step: string,
    form: IForm,
    departmentList: Department[],
    topicList: Topic[],
}

export interface QuestionDiscussionMessage {
    uuid?: string;
    role: AgenticRole;
    message: string;
    created_at?: Date;
}