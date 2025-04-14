export interface StepProps {
    onNextStep: () => void,
    onPreviousStep?: () => void
}

export interface Department {
    uuid: string;
    name: string;
}