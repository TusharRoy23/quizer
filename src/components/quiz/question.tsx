
import { Quiz } from "@/utils/types";
import ComponentCard from "../common/ComponentCard";
import Radio from "../form/Radio";
import Checkbox from "../form/Checkbox";
import MarkdownRenderer from "../common/MarkdownRenderer";
import { useQuery } from "@tanstack/react-query";
import { QuizService } from "@/services/quizService";

interface QuestionProps {
    quiz: Quiz;
    onSelect: (selectedIdx: number | number[]) => void,
    canSelect?: boolean;
}

export default function Question({ quiz, onSelect, canSelect }: QuestionProps) {
    const { data: explanation, isLoading, isError } = useQuery<string>({
        queryKey: ['explanation', quiz.uuid],
        queryFn: () => QuizService.getExplanationForQuestion(quiz.uuid),
        enabled: !quiz.explanation && !canSelect, // Only fetch if explanation is not already present and user cannot select
    });

    return (
        <>
            <ComponentCard title={quiz.question} hasCode={true} className="max-h-[600px] min-h-[200px] max-w-[600px] min-w-[300px] overflow-y-auto">
                <div className="space-y-6 ">
                    {quiz.options.map((option, index) => {
                        if (quiz.question_type === "CHOICE") {
                            return canSelect ? (
                                <Radio
                                    key={index}
                                    id={`radio${index}`}
                                    name={`quiz-option-${quiz.uuid}`}
                                    value={option}
                                    checked={quiz?.selected_index === index}
                                    onChange={() => onSelect(index)}
                                    label={option}
                                />
                            ) : (
                                <span key={index} className="flex items-start gap-1">
                                    <span className="font-semibold">{index + 1}.</span>
                                    <span className={`inline-flex items-center border-l-4 pl-1 
                                        ${quiz.answer?.join(',') === index.toString() ? 'border-green-500' : ''} 
                                        ${quiz.selected_answer?.join(',') === index.toString()
                                            && quiz.selected_answer?.join(',') !== quiz.answer?.join(',') ? 'border-red-500' : ''}`}
                                    >
                                        {option && <MarkdownRenderer content={option} />}
                                    </span>
                                </span>
                            )
                        } else if (quiz.question_type === "MULTIPLE_CHOICE") {
                            return canSelect ? (
                                <Checkbox
                                    key={index}
                                    id={`checkbox${index}`}
                                    label={option}
                                    checked={Array.isArray(quiz.selected_index) && quiz.selected_index.includes(index)}
                                    onChange={(checked) => {
                                        let newSelected: number[] = Array.isArray(quiz.selected_index) ? [...quiz.selected_index] : [];
                                        if (checked) {
                                            if (!newSelected.includes(index)) {
                                                newSelected.push(index);
                                            }
                                        } else {
                                            newSelected = newSelected.filter(i => i !== index);
                                        }
                                        onSelect(newSelected); // Adjust type if needed
                                    }}
                                    className="w-full"
                                />
                            ) :
                                (
                                    <span key={index} className="flex items-start gap-1">
                                        <span className="font-semibold">{index + 1}.</span>
                                        <span className={`inline-flex items-center border-l-4 pl-1 ${quiz.answer?.includes(index) ? 'border-green-500' : ''} ${quiz.selected_answer?.includes(index) && !quiz.answer?.includes(index) ? 'border-red-500' : ''}`}>
                                            {option && <MarkdownRenderer content={option} />}
                                        </span>
                                    </span>
                                );
                        }
                    })}
                    {
                        (isError || isLoading || quiz.explanation || explanation) &&
                        <div className={`mt-4 p-4 bg-gray-100 rounded-md${isLoading ? " animate-pulse" : ""}`}>
                            {isError && <p className="text-red-500">Failed to load explanation.</p>}
                            {isLoading && <p>Loading explanation...</p>}
                            {
                                <>
                                    {(quiz.explanation || explanation) && <h3 className="font-semibold">Explanation:</h3>}
                                    {quiz.explanation && <MarkdownRenderer content={quiz.explanation} />}
                                    {explanation && <MarkdownRenderer content={explanation} />}
                                </>
                            }
                        </div>
                    }
                </div>
            </ComponentCard>
        </>
    )
}