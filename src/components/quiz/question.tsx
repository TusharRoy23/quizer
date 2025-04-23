
import { ObjectType, Quiz } from "@/types";
import ComponentCard from "../common/ComponentCard";
import Radio from "../form/Radio";

interface QuestionProps {
    quiz: Quiz;
    onSelect: (answer: ObjectType) => void
}

export default function Question({ quiz, onSelect }: QuestionProps) {
    return (
        <>
            <ComponentCard title={quiz.question}>
                <div className="space-y-6">
                    {quiz.options.map((option, index) => (
                        <Radio
                            key={index}
                            id={`radio${index}`}
                            name="group1"
                            value={option.value}
                            checked={quiz.answer === option.value}
                            onChange={() => onSelect(option)}
                            label={option.name}
                        />
                    ))}
                </div>
            </ComponentCard>
        </>
    )
}