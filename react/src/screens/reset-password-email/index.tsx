import { BrandLayout } from "@/components/brand/BrandLayout";
import { applyAuth0Theme } from "@/utils/theme";

import Header from "./components/Header";
import ResendEmail from "./components/ResendEmail";
import { useResetPasswordEmailManager } from "./hooks/useResetPasswordEmailManager";

function ResetPasswordEmailScreen() {
  // Extracting attributes from hook made out of ResetPasswordEmailInstance class of Auth0 React SDK
  const { resetPasswordEmail, texts, locales } = useResetPasswordEmailManager();

  // Apply theme from SDK instance when screen loads
  applyAuth0Theme(resetPasswordEmail);
  document.title = texts?.pageTitle || locales.pageTitle;

  return (
    // Applying UDS theme overrides using the "theme-universal" class
    <BrandLayout
      client={resetPasswordEmail.client}
      organization={resetPasswordEmail.organization}
      transaction={resetPasswordEmail.transaction}
      logoAltText={texts?.logoAltText || locales.header.logoAlt}
    >
      <Header />
      <ResendEmail />
    </BrandLayout>
  );
}

export default ResetPasswordEmailScreen;
