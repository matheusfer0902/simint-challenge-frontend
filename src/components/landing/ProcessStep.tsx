interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}

export function ProcessStep({ number, title, description, isLast }: ProcessStepProps) {
  return (
    <div className="relative flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-poke-red to-poke-dark-red flex items-center justify-center shadow-poke z-10">
          <span className="font-pixel text-white text-sm">{number}</span>
        </div>
        {!isLast && (
          <div className="w-0.5 h-20 bg-gradient-to-b from-poke-red to-poke-cyan mt-2" />
        )}
      </div>
      <div className="flex-1 pt-2">
        <h4 className="font-pixel text-sm text-poke-dark-gray mb-2">{title}</h4>
        <p className="text-poke-dark-gray/70 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
