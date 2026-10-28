import type { ErrorItem } from "@auth0/auth0-acul-react/types";

import { BrandButton } from "@/components/brand/BrandButton";
import { ErrorBanner } from "@/components/brand/ErrorBanner";
import { useFocusErrors } from "@/components/brand/useFocusErrors";

import { useResetPasswordEmailManager } from "../hooks/useResetPasswordEmailManager";

function ResendEmail() {
  // Extracting attributes from hook made out of ResetPasswordEmailInstance class of Auth0 React SDK
  const { texts, handleResendEmail, useErrors, locales } =
    useResetPasswordEmailManager();
  const { errors, hasError, dismiss } = useErrors;
  const formRef = useFocusErrors(hasError);
  const buttonText = texts?.resendLinkText || locales.button.resendText;

  // Extract general errors (not field-specific) from the SDK
  const generalErrors: ErrorItem[] =
    errors.byType("auth0")?.filter((error) => {
      return !error.field || error.field === null;
    }) || [];

  return (
    <form ref={formRef}>
      {/* General error messages */}
      {hasError && generalErrors.length > 0 && (
        <div className="space-y-3 mb-4">
          {generalErrors.map((error) => (
            <ErrorBanner
              key={error.id}
              onDismiss={() => dismiss(error.id)}
              message={error.message}
            />
          ))}
        </div>
      )}
      <BrandButton
        variant="outline"
        type="button"
        fullWidth
        onClick={handleResendEmail}
      >
        {buttonText}
      </BrandButton>
    </form>
  );
}
export default ResendEmail;
