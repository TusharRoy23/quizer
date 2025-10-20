export enum STEPS {
    Intro = 'intro',
    UserInfo = 'userinfo',
    Department = 'department',
    Topics = 'topics',
    Difficulty = 'difficulty',
    QuestionCount = 'question_count',
    Timer = 'timer',
    Start = 'start'
}

export enum VERBAL_STEPS {
    Department = 'department',
    Topics = 'topics',
    Difficulty = 'difficulty',
    Start = 'start'
}

export enum LOADER_FOR {
    DEFAULT = 'loading',
    GenerateQuiz = 'generate_quiz',
    QuizResult = 'quiz_result',
    QuizReview = 'quiz_review'
}

export enum AgenticRole {
    USER = 'USER',
    ASSISTANT = 'ASSISTANT',
    SYSTEM = 'SYSTEM'
}