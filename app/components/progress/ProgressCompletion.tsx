interface ProgressCompletionProps {
  index: number;
  stepsLength: number;
}

export default function ProgressCompletion({ index, stepsLength }: ProgressCompletionProps) {
  return (
    <div className={`text-xs`}>
      {index + 1}/{stepsLength}
    </div>
  );
}
