import { BrandLayout } from "@/components/brand/BrandLayout";
import { applyAuth0Theme } from "@/utils/theme";

import Header from "./components/Header";
import ResetPasswordForm from "./components/ResetPasswordForm";
import { useResetPasswordManager } from "./hooks/useResetPasswordManager";

function ResetPasswordScreen() {
  // Extracting attributes from hook made out of ResetPasswordInstance class of Auth0 React SDK
  const { resetPassword, texts, locales } = useResetPasswordManager();

  // Apply theme from SDK instance when screen loads
  applyAuth0Theme(resetPassword);
  document.title = texts?.pageTitle || locales.pageTitle;

  return (
    // Applying UDS theme overrides using the "theme-universal" class
    <BrandLayout
      client={resetPassword.client}
      organization={resetPassword.organization}
      transaction={resetPassword.transaction}
      logoAltText={texts?.logoAltText || locales.header.logoAltText}
    >
      <Header />
      <ResetPasswordForm />
    </BrandLayout>
  );
}

export default ResetPasswordScreen;
