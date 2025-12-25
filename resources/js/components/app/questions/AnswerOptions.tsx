import { Question } from "./types";
import AnswerOptionsEssay from "./answers/AnswerOptionsEssay";
import AnswerOptionsMatching from "./answers/AnswerOptionsMatching";
import AnswerOptionsMultipleChoice from "./answers/AnswerOptionsMultipleChoice";
import AnswerOptionsMultipleSelection from "./answers/AnswerOptionsMultipleSelection";
import AnswerOptionsNumericalInput from "./answers/AnswerOptionsNumericalInput";
import AnswerOptionsOrdering from "./answers/AnswerOptionsOrdering";
import AnswerOptionsTrueFalse from "./answers/AnswerOptionsTrueFalse";

interface AnswerOptionsProps {
    question: Question;
    showKeyAnswer?: boolean;
}

export default function AnswerOptions({ question, showKeyAnswer = true }: AnswerOptionsProps) {
    const { question_type, options = [] } = question;

    if (!options || options.length === 0) {
        // Only warn if not numerical or essay (which might minimal options)
        if (question_type !== 'numerical_input' && question_type !== 'essay') {
            return <div className="text-sm text-muted-foreground italic p-4 text-center border border-dashed rounded-lg">Belum ada opsi jawaban.</div>;
        }
    }

    switch (question_type) {
        case 'multiple_choice':
            return <AnswerOptionsMultipleChoice options={options} showKeyAnswer={showKeyAnswer} />;

        case 'multiple_selection':
            return <AnswerOptionsMultipleSelection options={options} showKeyAnswer={showKeyAnswer} />;

        case 'true_false':
            return <AnswerOptionsTrueFalse options={options} showKeyAnswer={showKeyAnswer} />;

        case 'matching':
            return <AnswerOptionsMatching options={options} showKeyAnswer={showKeyAnswer} />;

        case 'ordering':
            return <AnswerOptionsOrdering options={options} showKeyAnswer={showKeyAnswer} />;

        case 'numerical_input':
            return <AnswerOptionsNumericalInput options={options} showKeyAnswer={showKeyAnswer} />;

        case 'essay':
            return <AnswerOptionsEssay options={options} showKeyAnswer={showKeyAnswer} />;

        default:
            return <div className="text-red-500 text-sm">Tipe soal tidak didukung: {question_type}</div>;
    }
}
