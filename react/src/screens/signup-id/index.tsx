import { BrandLayout } from "@/components/brand/BrandLayout";
import ULThemeSeparator from "@/components/ULThemeSeparator";
import { extractTokenValue } from "@/utils/helpers/tokenUtils";
import { applyAuth0Theme } from "@/utils/theme/themeEngine";

import AlternativeLogins from "./components/AlternativeLogins";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SignupIdForm from "./components/SignupIdForm";
import { useSignupIdManager } from "./hooks/useSignupIdManager";

function SignupIdScreen() {
  // Extracting attributes from hook made out of SignupIdInstance class of Auth0 React ACUL SDK
  const { signupId, texts, alternateConnections, locales } =
    useSignupIdManager();

  const showSeparator = alternateConnections && alternateConnections.length > 0;

  const separatorText = texts?.separatorText || locales.page.separator;
  document.title = texts?.pageTitle || locales.pageTitle;

  applyAuth0Theme(signupId);

  const socialLoginAlignment = extractTokenValue(
    "--ul-theme-widget-social-buttons-layout"
  );

  const renderSocialLogins = (alignment: "top" | "bottom") => (
    <>
      {alignment === "bottom" && showSeparator && (
        <ULThemeSeparator text={separatorText} />
      )}
      <AlternativeLogins />
      {alignment === "top" && showSeparator && (
        <ULThemeSeparator text={separatorText} />
      )}
    </>
  );

  return (
    // Applying UDS theme overrides using the "theme-universal" class
    <BrandLayout
      client={signupId.client}
      organization={signupId.organization}
      transaction={signupId.transaction}
      logoAltText={texts?.logoAltText || locales.header.logoAlt}
      footer={<Footer />}
    >
      <Header />
      {socialLoginAlignment === "top" && renderSocialLogins("top")}
      <SignupIdForm />
      {socialLoginAlignment === "bottom" && renderSocialLogins("bottom")}
    </BrandLayout>
  );
}

export default SignupIdScreen;
