
import { Quiz } from "@/types";
import ComponentCard from "../common/ComponentCard";
import Radio from "../form/Radio";
import Checkbox from "../form/Checkbox";

interface QuestionProps {
    quiz: Quiz;
    onSelect: (selectedIdx: number | number[]) => void,
    canSelect?: boolean;
}

export default function Question({ quiz, onSelect, canSelect }: QuestionProps) {
    return (
        <>
            <ComponentCard title={quiz.question} className="max-h-[600px] min-h-[200px] max-w-[600px] min-w-[300px] overflow-y-auto">
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
                                <p key={index}>
                                    <span className="font-semibold">{index + 1}.</span> {option}.
                                    {quiz.answer?.join(',') === index.toString() && <span className="text-green-500"> (Correct)</span>}
                                    {quiz.selected_answer?.join(',') === index.toString() && quiz.selected_answer?.join(',') !== quiz.answer?.join(',')
                                        && <span className="text-red-500"> (Incorrect)</span>}
                                </p>
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
                                (<p key={index}>
                                    <span className="font-semibold">{index + 1}.</span> {option}
                                    {quiz.answer?.includes(index) && <span className="text-green-500"> (Correct)</span>}
                                    {quiz.selected_answer?.includes(index) && quiz.selected_answer?.join(',') !== quiz.answer?.join(',')
                                        && <span className="text-red-500"> (Incorrect)</span>}
                                </p>);
                        }
                    })}
                    {quiz.explanation && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-md">
                            <h3 className="font-semibold">Explanation:</h3>
                            <p>{quiz.explanation}</p>
                        </div>
                    )}
                </div>
            </ComponentCard>
        </>
    )
}