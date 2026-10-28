import { useForm } from "react-hook-form";

import type {
  ErrorItem,
  PasswordValidationResult,
} from "@auth0/auth0-acul-react/types";

import { BrandButton } from "@/components/brand/BrandButton";
import { ErrorBanner } from "@/components/brand/ErrorBanner";
import { PasswordInput } from "@/components/brand/PasswordInput";
import { useFocusErrors } from "@/components/brand/useFocusErrors";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { ULThemePasswordValidator } from "@/components/ULThemePasswordValidator";

import { useResetPasswordManager } from "../hooks/useResetPasswordManager";

interface resetPasswordFormData {
  new_password: string;
  confirm_password: string;
}

/**
 * ResetPasswordForm Component
 *
 * This component renders the form for the resetPassword screen.
 * It includes fields for new password, and confirm new password,
 * along with error handling.
 */
function ResetPasswordForm() {
  // Extract necessary methods and properties from the custom hook
  const {
    handleSubmitPassword,
    texts,
    locales,
    useErrors,
    usePasswordValidation,
  } = useResetPasswordManager();
  const { errors, hasError, dismiss } = useErrors;
  const formRef = useFocusErrors(hasError);

  // Initialize the form using react-hook-form
  const form = useForm<resetPasswordFormData>({
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const {
    formState: { isSubmitting },
    watch,
  } = form;

  // Get password validation rules from Auth0 SDK
  const passwordValue = watch("new_password");

  const { results: passwordResults }: PasswordValidationResult =
    usePasswordValidation(passwordValue);

  // Handle text fallbacks for button and field labels
  const buttonText = texts?.buttonText || locales.form.buttonText;
  const passwordLabel =
    texts?.passwordPlaceholder || locales.form.fields.password.labelText;
  const confirmPasswordLabel =
    texts?.reEnterpasswordPlaceholder ||
    locales.form.fields.confirmPassword.labelText;
  const passwordSecurityText =
    texts?.passwordSecurityText || locales.form.passwordSecurity;

  // Extract general errors (not field-specific) from the SDK
  const generalErrors: ErrorItem[] =
    errors.byType("auth0")?.filter((error) => {
      return !error.field || error.field === null;
    }) || [];

  // Extract field-specific errors for password
  const passwordSDKError =
    errors.byField("password-reset")[0]?.message ||
    errors.byField("password")[0]?.message;
  const confirmSDKError = errors.byField("re-enter-password")[0]?.message;

  /**
   * Handles form submission.
   *
   * @param data - The form data containing password, and confirm password.
   */
  const onSubmit = async (data: resetPasswordFormData) => {
    await handleSubmitPassword(data.new_password, data.confirm_password);
  };

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
        {/* General error messages */}
        {hasError && generalErrors.length > 0 && (
          <div className="space-y-3 mb-4">
            {generalErrors.map((error: ErrorItem) => (
              <ErrorBanner
                key={error.id}
                onDismiss={() => dismiss(error.id)}
                message={error.message}
              />
            ))}
          </div>
        )}

        {/* New Password input field */}
        <FormField
          control={form.control}
          name="new_password"
          rules={{
            required: locales.form.fields.password.required,
          }}
          render={({ field, fieldState }) => (
            <FormItem>
              <PasswordInput
                {...field}
                label={`${passwordLabel}*`}
                autoComplete="new-password"
                error={!!fieldState.error || !!passwordSDKError}
                errorMessage={passwordSDKError}
                hasFormError={!!fieldState.error}
              />
            </FormItem>
          )}
        />

        {/* Re-Enter Password input field */}
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field, fieldState }) => (
            <FormItem>
              <PasswordInput
                {...field}
                label={`${confirmPasswordLabel}*`}
                autoComplete="new-password"
                error={!!fieldState.error || !!confirmSDKError}
                errorMessage={confirmSDKError}
                hasFormError={!!fieldState.error}
              />
            </FormItem>
          )}
        />

        {/* Password Validation Rules */}
        <ULThemePasswordValidator
          validationRules={passwordResults}
          passwordSecurityText={passwordSecurityText}
          className="mb-4"
        />

        {/* Submit button */}
        <BrandButton type="submit" fullWidth loading={isSubmitting}>
          {buttonText}
        </BrandButton>
      </form>
    </Form>
  );
}

export default ResetPasswordForm;
