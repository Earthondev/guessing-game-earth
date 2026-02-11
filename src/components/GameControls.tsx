import AnswerInput from "@/components/AnswerInput";

interface GameControlsProps {
    allRevealed: boolean;
    onCorrectAnswer: () => void;
    onWrongAnswer: () => void;
    onRevealAll: () => void;
    onResetGame: () => void;
    acceptedAnswers: string[];
}

const GameControls = ({
    allRevealed,
    onCorrectAnswer,
    onWrongAnswer,
    onRevealAll,
    acceptedAnswers,
}: GameControlsProps) => {
    return (
        <div className="w-full max-w-xl mx-auto mt-8 px-4 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100">
            <AnswerInput
                onCorrectAnswer={onCorrectAnswer}
                onRevealAnswer={onRevealAll}
                onWrongAnswer={onWrongAnswer}
                acceptedAnswers={acceptedAnswers}
                disabled={allRevealed}
            />
        </div>
    );
};

export default GameControls;
