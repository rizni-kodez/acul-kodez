import { BrandLayout } from "@/components/brand/BrandLayout";
import { StepIndicator } from "@/components/brand/StepIndicator";
import ULThemeSeparator from "@/components/ULThemeSeparator";
import { extractTokenValue } from "@/utils/helpers/tokenUtils";
import { applyAuth0Theme } from "@/utils/theme/themeEngine";

import AlternativeLogins from "./components/AlternativeLogins";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LoginIdForm from "./components/LoginIdForm";
import { useLoginIdManager } from "./hooks/useLoginIdManager";

function LoginIdScreen() {
  // Extracting attributes from hook made out of LoginIdInstance class of Auth0 React ACUL SDK
  const { loginId, texts, locales, isPasskeyEnabled, alternateConnections } =
    useLoginIdManager();

  // Check whether separator component needs to be rendered based on passkey or other social connections
  const showSeparator =
    isPasskeyEnabled ||
    (alternateConnections && alternateConnections.length > 0);

  // Other Texts
  const separatorText = texts?.separatorText || locales?.page?.orText;
  document.title = texts?.pageTitle || locales.pageTitle;

  applyAuth0Theme(loginId);

  // Extracting Tenant setting for social login component alignment on the layout via theme token
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
      client={loginId.client}
      organization={loginId.organization}
      transaction={loginId.transaction}
      logoAltText={texts?.logoAltText || locales.heading.logoAltText}
      footer={<Footer />}
    >
      <StepIndicator step={1} total={2} />
      <Header />
      {socialLoginAlignment === "top" && renderSocialLogins("top")}
      <LoginIdForm />
      {socialLoginAlignment === "bottom" && renderSocialLogins("bottom")}
    </BrandLayout>
  );
}

export default LoginIdScreen;
