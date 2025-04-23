export interface StepProps {
    onNextStep: () => void,
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
    answer: string;
    options: ObjectType[];
    difficulty: Difficulty;
}