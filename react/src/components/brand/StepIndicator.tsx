export function StepIndicator({
  step,
  total,
}: {
  step: number;
  total: number;
}) {
  return (
    <p className="brand-step">
      Step {step} of {total}
    </p>
  );
}
