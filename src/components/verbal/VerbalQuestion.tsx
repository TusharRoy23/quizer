import { OralQuestion } from "@/utils/types";
import ComponentCard from "../common/ComponentCard";

export default function VerbalQuestion({ quiz }: { quiz: OralQuestion }) {
    return (
        <ComponentCard className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 space-y-6">
                {/* Question Section */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        QUESTION
                    </h3>
                    <p className="text-lg text-gray-800 leading-relaxed">
                        {quiz.question}
                    </p>
                </div>

                {/* User's Answer Section */}
                <div className={`rounded-lg p-4 border ${quiz.oral_response
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                    }`}>
                    <h3 className={`text-sm font-semibold mb-2 flex items-center ${quiz.oral_response ? 'text-green-800' : 'text-gray-600'
                        }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${quiz.oral_response ? 'bg-green-500' : 'bg-gray-400'
                            }`}></span>
                        YOUR ANSWER
                    </h3>
                    {quiz.oral_response ? (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {quiz.oral_response}
                        </p>
                    ) : (
                        <p className="text-gray-500 italic text-center py-2">
                            No answer provided
                        </p>
                    )}
                </div>

                {/* Expected Points Section */}
                {quiz.expected_points && quiz.expected_points.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <h3 className="text-sm font-semibold text-purple-800 mb-3 flex items-center">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                            KEY POINTS TO COVER
                        </h3>
                        <ul className="space-y-2">
                            {quiz.expected_points.map((point: string, index: number) => (
                                <li key={index} className="flex items-start">
                                    <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-700 leading-relaxed flex-1">
                                        {point}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </ComponentCard>
    );
}