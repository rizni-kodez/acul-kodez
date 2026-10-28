import { BrandLayout } from "@/components/brand/BrandLayout";
import { applyAuth0Theme } from "@/utils/theme/themeEngine";

import Footer from "./components/Footer";
import Header from "./components/Header";
import SignupPasswordForm from "./components/SignupPasswordForm";
import { useSignupPasswordManager } from "./hooks/useSignupPasswordManager";

function SignupPasswordScreen() {
  // Extracting attributes from hook made out of SignupPasswordInstance class of Auth0 React ACUL SDK
  const { signupPassword, texts, locales } = useSignupPasswordManager();

  document.title = texts?.pageTitle || locales.pageTitle;

  // Apply theme from SDK instance when screen loads
  applyAuth0Theme(signupPassword);

  return (
    // Applying UDS theme overrides using the "theme-universal" class
    <BrandLayout
      client={signupPassword.client}
      organization={signupPassword.organization}
      transaction={signupPassword.transaction}
      logoAltText={texts?.logoAltText || locales.header.logoAlt}
      footer={<Footer />}
    >
      <Header />
      <SignupPasswordForm />
    </BrandLayout>
  );
}

export default SignupPasswordScreen;
