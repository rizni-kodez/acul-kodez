import { useForm } from "react-hook-form";

import {
  useErrors,
  useLoginIdentifiers,
  usePasskeyAutofill,
} from "@auth0/auth0-acul-react/login-id";
import type {
  ErrorItem,
  IdentifierType,
  LoginOptions,
} from "@auth0/auth0-acul-react/types";

import { BrandButton } from "@/components/brand/BrandButton";
import { BrandInput } from "@/components/brand/BrandInput";
import { ErrorBanner } from "@/components/brand/ErrorBanner";
import { useFocusErrors } from "@/components/brand/useFocusErrors";
import Captcha from "@/components/Captcha/index";
import { Form, FormField, FormItem } from "@/components/ui/form";
import ULThemeCountryCodePicker from "@/components/ULThemeCountryCodePicker";
import ULThemeLink from "@/components/ULThemeLink";
import { useCaptcha } from "@/hooks/useCaptcha";
import {
  isPhoneNumberSupported,
  transformAuth0CountryCode,
} from "@/utils/helpers/countryUtils";
import { getIdentifierDetails } from "@/utils/helpers/identifierUtils";

import { useLoginIdManager } from "../hooks/useLoginIdManager";

function PasskeyAutofill() {
  usePasskeyAutofill();
  return null;
}

function LoginIdForm() {
  const {
    texts,
    locales,
    captcha,
    countryCode,
    countryPrefix,
    resetPasswordLink,
    isCaptchaAvailable,
    isPasskeyEnabled,
    showPasskeyAutofill,
    handleLoginId,
    handlePickCountryCode,
    loginId,
  } = useLoginIdManager();

  const activeIdentifiers = useLoginIdentifiers();

  // Use helper to determine placeholder based on active identifiers
  const identifierDetails = getIdentifierDetails(
    (activeIdentifiers || undefined) as IdentifierType[] | undefined,
    texts
  );

  const form = useForm<LoginOptions>({
    defaultValues: {
      username: loginId.untrustedData?.authorizationParams?.login_hint || "",
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
    : locales?.loginIdForm?.captchaLabel;
  const forgotPasswordLinkText =
    texts?.forgotPasswordText || locales?.loginIdForm?.forgotPasswordLinkText;
  const continueButtonText =
    texts?.buttonText || locales?.loginIdForm?.continueButtonText;

  const { captchaConfig, captchaProps, captchaValue } = useCaptcha(
    captcha || undefined,
    captchaLabel
  );

  const { errors, hasError, dismiss } = useErrors();
  const formRef = useFocusErrors(hasError);

  // Get field-specific SDK errors
  const usernameSDKError = errors.byField("username")[0]?.message;
  const captchaSDKError = errors.byField("captcha")[0]?.message;

  // Get general errors (not field-specific)
  const generalErrors: ErrorItem[] = errors
    .byType("auth0")
    .filter((err) => !err.field);

  const shouldShowCountryPicker = isPhoneNumberSupported(
    activeIdentifiers || []
  );

  // Proper submit handler with form data
  const onSubmit = async (data: LoginOptions) => {
    await handleLoginId({
      username: data.username,
      captcha: isCaptchaAvailable && captchaValue ? captchaValue : undefined,
    });
  };

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
        {isPasskeyEnabled && showPasskeyAutofill && <PasskeyAutofill />}
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

        {/* Country Code Picker - only show if phone numbers are supported */}
        {shouldShowCountryPicker && (
          <div className="mb-4">
            <ULThemeCountryCodePicker
              selectedCountry={transformAuth0CountryCode(
                countryCode,
                countryPrefix
              )}
              onClick={handlePickCountryCode}
              fullWidth
              placeholder={locales?.loginIdForm?.selectCountryPlaceholder}
            />
          </div>
        )}

        {/* Username Identifier input field */}
        <FormField
          control={form.control}
          name="username"
          rules={{
            required: locales?.errors?.identifierRequired,
          }}
          render={({ field, fieldState }) => (
            <FormItem>
              <BrandInput
                {...field}
                label={identifierDetails.label}
                type={identifierDetails.type}
                autoComplete={identifierDetails.autoComplete}
                autoFocus
                error={!!fieldState.error || !!usernameSDKError}
                errorMessage={usernameSDKError}
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

export default LoginIdForm;
