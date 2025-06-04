
import { ObjectType, Quiz } from "@/types";
import ComponentCard from "../common/ComponentCard";
import Radio from "../form/Radio";
import Checkbox from "../form/Checkbox";

interface QuestionProps {
    quiz: Quiz;
    onSelect: (selectedIdx: number | number[]) => void
}

export default function Question({ quiz, onSelect }: QuestionProps) {
    return (
        <>
            <ComponentCard title={quiz.question}>
                <div className="space-y-6">
                    {quiz.options.map((option, index) => {
                        if (quiz.question_type === "CHOICE") {
                            return (
                                <Radio
                                    key={index}
                                    id={`radio${index}`}
                                    name={`quiz-option-${quiz.uuid}`}
                                    value={option}
                                    checked={quiz.selected_index === index}
                                    onChange={() => onSelect(index)}
                                    label={option}
                                />
                            )
                        } else if (quiz.question_type === "MULTIPLE_CHOICE") {
                            return (
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
                                        onSelect(newSelected as any); // Adjust type if needed
                                    }}
                                    className="w-full"
                                />
                            );
                        }
                    })}
                </div>
            </ComponentCard>
        </>
    )
}