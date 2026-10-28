import { ULThemeAlert, ULThemeAlertTitle } from "@/components/ULThemeError";

export function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <ULThemeAlert
      variant="destructive"
      className="brand-error-banner"
      onDismiss={onDismiss}
    >
      <ULThemeAlertTitle>{message}</ULThemeAlertTitle>
    </ULThemeAlert>
  );
}
