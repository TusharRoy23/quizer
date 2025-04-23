import { Quiz } from "@/types";
const quizList: Quiz[] = [
    {
        uuid: "1",
        question: "What is the capital of France?",
        answer: "",
        options: [
            { name: "Paris", value: "Paris" },
            { name: "London", value: "London" },
            { name: "Berlin", value: "Berlin" },
            { name: "Madrid", value: "Madrid" }
        ],
        difficulty: { name: "easy", value: "easy" }
    },
    {
        uuid: "2",
        question: "What is 2 + 2?",
        answer: "",
        options: [
            { name: "3", value: "3" },
            { name: "4", value: "4" },
            { name: "5", value: "5" },
            { name: "6", value: "6" }
        ],
        difficulty: { name: "easy", value: "easy" }
    }
]
let pageNum = 0;

export const fetchQuizes = async (pageStep: number = 0): Promise<Quiz> => {
    const response = new Promise<Quiz>((resolve) => {
        setTimeout(() => {
            if (pageNum + pageStep < 0 || pageNum + pageStep >= quizList.length) {
                resolve(quizList[pageNum]);
                return;
            }
            resolve(quizList[pageNum + pageStep]);
            pageNum += pageStep;
        }, 1000);
    });
    return response;
}