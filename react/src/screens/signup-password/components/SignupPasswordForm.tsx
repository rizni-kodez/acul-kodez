import { useForm } from "react-hook-form";

import {
  useErrors,
  usePasswordValidation,
} from "@auth0/auth0-acul-react/signup-password";
import type {
  ErrorItem,
  PasswordValidationResult,
  SignupPasswordOptions,
} from "@auth0/auth0-acul-react/types";

import { BrandButton } from "@/components/brand/BrandButton";
import { ErrorBanner } from "@/components/brand/ErrorBanner";
import { IdentityChip } from "@/components/brand/IdentityChip";
import { PasswordInput } from "@/components/brand/PasswordInput";
import { useFocusErrors } from "@/components/brand/useFocusErrors";
import Captcha from "@/components/Captcha/index";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { ULThemePasswordValidator } from "@/components/ULThemePasswordValidator";
import { useCaptcha } from "@/hooks/useCaptcha";

import { useSignupPasswordManager } from "../hooks/useSignupPasswordManager";

function SignupPasswordForm() {
  const {
    handleSignupPassword,
    isCaptchaAvailable,
    signupPassword,
    texts,
    captcha,
    locales,
    editLink,
    data: screenData,
  } = useSignupPasswordManager();

  const { errors, hasError, dismiss } = useErrors();
  const formRef = useFocusErrors(hasError);

  const form = useForm<SignupPasswordOptions>({
    defaultValues: {
      email: "",
      username: "",
      phoneNumber: "",
      password: "",
      captcha: "",
    },
    reValidateMode: "onBlur",
  });

  const {
    formState: { isSubmitting },
    watch,
  } = form;

  // Get password validation rules from Auth0 SDK
  const passwordValue = watch("password");
  const { results: passwordResults }: PasswordValidationResult =
    usePasswordValidation(passwordValue);

  // Get user data from screen data for readonly fields
  const userEmail = screenData?.email;
  const userPhone = screenData?.phoneNumber;
  const userUsername = screenData?.username;
  const submittedEmail = signupPassword.untrustedData?.submittedFormData?.email;
  const identityEmail =
    userEmail || (typeof submittedEmail === "string" ? submittedEmail : "");

  // Use locale strings with fallback to SDK texts
  const buttonText = texts?.buttonText || locales.form.button;
  const captchaLabel = texts?.captchaCodePlaceholder
    ? `${texts.captchaCodePlaceholder}*`
    : `${locales.form.fields.captcha.label}*`;
  const passwordLabel = texts?.passwordPlaceholder
    ? `${texts.passwordPlaceholder}*`
    : `${locales.form.fields.password.label}*`;
  const passwordSecurityText =
    texts?.passwordSecurityText || locales.form.passwordSecurity;

  // Setup captcha with useCaptcha hook
  const { captchaConfig, captchaProps } = useCaptcha(
    captcha || undefined,
    captchaLabel
  );

  // Get general errors (not field-specific) and errors for hidden fields
  const visibleFields = ["password", "captcha"];

  const generalErrors: ErrorItem[] = errors.byType("auth0").filter((error) => {
    // Include errors with no field or null field
    if (!error.field || error.field === null) return true;

    // Include field errors for non-visible fields
    return !visibleFields.includes(error.field);
  });

  // Get field-specific errors
  const passwordError = errors.byField("password")[0]?.message;
  const captchaSDKError = errors.byField("captcha")[0]?.message;

  // Simplified submit handler
  const onSubmit = async (data: SignupPasswordOptions) => {
    const submitData: SignupPasswordOptions = {
      ...data,
      email: userEmail,
      username: userUsername,
      phoneNumber: userPhone,
    };
    await handleSignupPassword(submitData);
  };

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
        {/* General alerts at the top */}
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

        {/* Readonly email field */}
        {identityEmail && (
          <IdentityChip
            identity={identityEmail}
            editLink={editLink}
            editText={texts?.editEmailText || locales.form.edit}
          />
        )}

        {/* Readonly phone field */}
        {userPhone && (
          <IdentityChip
            identity={userPhone}
            editLink={editLink}
            editText={texts?.editEmailText || locales.form.edit}
          />
        )}

        {/* Readonly username field */}
        {userUsername && (
          <IdentityChip
            identity={userUsername}
            editLink={editLink}
            editText={texts?.editEmailText || locales.form.edit}
          />
        )}

        {/* Password field */}
        <FormField
          control={form.control}
          name="password"
          rules={{
            required: locales.form.fields.password.required,
          }}
          render={({ field, fieldState }) => (
            <FormItem>
              <PasswordInput
                {...field}
                label={passwordLabel}
                error={!!fieldState.error || !!passwordError}
                autoFocus={true}
                errorMessage={passwordError}
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
              required: locales.form.fields.captcha.required,
            }}
          />
        )}

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

export default SignupPasswordForm;
