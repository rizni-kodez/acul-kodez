import { BrandLayout } from "@/components/brand/BrandLayout";
import { applyAuth0Theme } from "@/utils/theme";

import Footer from "./components/Footer";
import Header from "./components/Header";
import ResetPasswordRequestForm from "./components/ResetPasswordRequestForm";
import { useResetPasswordRequestManager } from "./hooks/resetPasswordRequestManager";

function ResetPasswordRequestScreen() {
  // Extracting attributes from hook made out of ResetPasswordRequestInstance class of Auth0 React SDK
  const { resetPasswordRequest, texts, locales } =
    useResetPasswordRequestManager();

  // Apply theme from SDK instance when screen loads
  applyAuth0Theme(resetPasswordRequest);
  // Use locale strings with fallback to SDK texts
  document.title = texts?.pageTitle || locales.pageTitle;

  return (
    // Applying UDS theme overrides using the "theme-universal" class
    <BrandLayout
      client={resetPasswordRequest.client}
      organization={resetPasswordRequest.organization}
      transaction={resetPasswordRequest.transaction}
      logoAltText={texts?.logoAltText || locales.header.logoAlt}
      footer={<Footer />}
    >
      <Header />
      <ResetPasswordRequestForm />
    </BrandLayout>
  );
}

export default ResetPasswordRequestScreen;
