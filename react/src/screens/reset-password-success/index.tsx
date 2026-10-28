import { useErrors } from "@auth0/auth0-acul-react/reset-password-success";

import { BrandLayout } from "@/components/brand/BrandLayout";
import { ErrorBanner } from "@/components/brand/ErrorBanner";
import { useFocusErrors } from "@/components/brand/useFocusErrors";
import ULThemeLink from "@/components/ULThemeLink";
import { applyAuth0Theme } from "@/utils/theme";

import Header from "./components/Header";
import { useResetPasswordSuccessManager } from "./hooks/resetPasswordSuccessManager";

function ResetPasswordSuccessScreen() {
  // Extracting attributes from hook made out of ResetPasswordSuccessInstance class of Auth0 React SDK
  const { resetPasswordSuccess, texts, locales, links } =
    useResetPasswordSuccessManager();
  const loginLink = links?.login || links?.backToLogin || links?.back_to_login;
  const { errors, hasError, dismiss } = useErrors();
  const errorRef = useFocusErrors<HTMLDivElement>(hasError);
  const generalErrors = errors.byType("auth0").filter((error) => !error.field);

  // Apply theme from SDK instance when screen loads
  applyAuth0Theme(resetPasswordSuccess);
  document.title = texts?.pageTitle || locales.pageTitle;

  return (
    // Applying UDS theme overrides using the "theme-universal" class
    <BrandLayout
      client={resetPasswordSuccess.client}
      organization={resetPasswordSuccess.organization}
      transaction={resetPasswordSuccess.transaction}
      logoAltText={texts?.logoAltText || locales.header.logoAlt}
      footer={
        loginLink ? (
          <ULThemeLink href={loginLink}>
            {texts?.backToLoginLinkText || locales.footer.continue}
          </ULThemeLink>
        ) : null
      }
    >
      <div ref={errorRef}>
        {hasError &&
          generalErrors.map((error) => (
            <ErrorBanner
              key={error.id}
              message={error.message}
              onDismiss={() => dismiss(error.id)}
            />
          ))}
      </div>
      <Header />
    </BrandLayout>
  );
}

export default ResetPasswordSuccessScreen;
