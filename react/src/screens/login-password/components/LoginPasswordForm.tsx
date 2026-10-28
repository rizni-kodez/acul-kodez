import { useForm } from "react-hook-form";

import { useErrors } from "@auth0/auth0-acul-react/login-password";
import type {
  ErrorItem,
  LoginPasswordOptions,
} from "@auth0/auth0-acul-react/types";

import { BrandButton } from "@/components/brand/BrandButton";
import { ErrorBanner } from "@/components/brand/ErrorBanner";
import { IdentityChip } from "@/components/brand/IdentityChip";
import { PasswordInput } from "@/components/brand/PasswordInput";
import { useFocusErrors } from "@/components/brand/useFocusErrors";
import Captcha from "@/components/Captcha/index";
import { Form, FormField, FormItem } from "@/components/ui/form";
import ULThemeLink from "@/components/ULThemeLink";
import { useCaptcha } from "@/hooks/useCaptcha";

import { useLoginPasswordManager } from "../hooks/useLoginPasswordManager";

function LoginPasswordForm() {
  const {
    texts,
    locales,
    data,
    captcha,
    editIdentifierLink,
    resetPasswordLink,
    passwordPolicy,
    isCaptchaAvailable,
    handleLoginPassword,
    loginPassword,
  } = useLoginPasswordManager();

  const submittedUsername =
    loginPassword.untrustedData?.submittedFormData?.username;
  const username =
    data?.username ||
    (typeof submittedUsername === "string" ? submittedUsername : "");
  const form = useForm<LoginPasswordOptions>({
    defaultValues: {
      username,
      password: "",
      captcha: "",
    },
    reValidateMode: "onBlur",
  });

  const {
    formState: { isSubmitting },
  } = form;

  // Use locales as fallback to SDK texts
  const captchaLabel = texts?.captchaCodePlaceholder
    ? `${texts.captchaCodePlaceholder}*`
    : locales?.loginPasswordForm?.captchaLabel;
  const passwordLabel =
    texts?.passwordPlaceholder || locales?.loginPasswordForm?.passwordLabel;
  const forgotPasswordLinkText =
    texts?.forgotPasswordText ||
    locales?.loginPasswordForm?.forgotPasswordLinkText;
  const continueButtonText =
    texts?.buttonText || locales?.loginPasswordForm?.continueButtonText;

  const { captchaConfig, captchaProps, captchaValue } = useCaptcha(
    captcha || undefined,
    captchaLabel
  );

  const { errors, hasError, dismiss } = useErrors();
  const formRef = useFocusErrors(hasError);

  // Get field-specific SDK errors
  const passwordSDKError = errors.byField("password")[0]?.message;
  const captchaSDKError = errors.byField("captcha")[0]?.message;

  // Get general errors (not field-specific)
  const generalErrors: ErrorItem[] = errors
    .byType("auth0")
    .filter((err) => !err.field);

  // Proper submit handler with form data
  const onSubmit = async (data: LoginPasswordOptions) => {
    await handleLoginPassword({
      username: data.username,
      password: data.password,
      captcha: isCaptchaAvailable && captchaValue ? captchaValue : undefined,
    });
  };

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
        {/* Display general errors */}
        {hasError && generalErrors.length > 0 && (
          <div className="space-y-3 mb-4">
            {generalErrors.map((error) => (
              <ErrorBanner
                key={error.id}
                onDismiss={() => dismiss(error.id)}
                message={error.message || locales?.errors?.errorOccurred}
              />
            ))}
          </div>
        )}

        {/* Username Identifier input field with pre-filled value */}
        <input type="hidden" {...form.register("username")} />
        {username && (
          <IdentityChip
            identity={username}
            editLink={editIdentifierLink}
            editText={
              texts?.editEmailText || locales.loginPasswordForm.editText
            }
          />
        )}

        {/* Password input field */}
        <FormField
          control={form.control}
          name="password"
          rules={{
            required: locales?.errors?.passwordRequired,
            maxLength: {
              value: 200,
              message: locales?.errors?.max200CharsAllowed,
            },
            minLength: passwordPolicy?.minLength
              ? {
                  value: passwordPolicy.minLength,
                  message: `${locales?.errors?.passwordMinLength} ${passwordPolicy.minLength} ${locales?.errors?.charactersText}`,
                }
              : undefined,
          }}
          render={({ field, fieldState }) => (
            <FormItem>
              <PasswordInput
                {...field}
                label={passwordLabel}
                autoFocus={true}
                autoComplete="current-password"
                error={!!fieldState.error || !!passwordSDKError}
                errorMessage={passwordSDKError}
                hasFormError={!!fieldState.error}
              />
            </FormItem>
          )}
        />

        {/* Captcha Field */}
        {isCaptchaAvailable && captchaConfig && (
          <Captcha
            control={form.control}
            name="captcha"
            captcha={captchaConfig}
            {...captchaProps}
            sdkError={captchaSDKError}
            rules={{
              required: locales?.errors?.captchaCompletionRequired,
              maxLength: {
                value: 15,
                message: locales?.errors?.captchaTooLong,
              },
            }}
          />
        )}

        {resetPasswordLink && (
          <div className="mb-4 mt-2 text-left">
            <ULThemeLink href={resetPasswordLink}>
              {forgotPasswordLinkText}
            </ULThemeLink>
          </div>
        )}

        <BrandButton type="submit" fullWidth loading={isSubmitting}>
          {continueButtonText}
        </BrandButton>
      </form>
    </Form>
  );
}

export default LoginPasswordForm;
