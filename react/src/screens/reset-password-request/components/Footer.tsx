import { useScreen } from "@auth0/auth0-acul-react/reset-password-request";

import { ULThemeButton } from "@/components/ULThemeButton";
import ULThemeLink from "@/components/ULThemeLink";

import { useResetPasswordRequestManager } from "../hooks/resetPasswordRequestManager";
function Footer() {
  const { texts, handleBackToLogin, locales } =
    useResetPasswordRequestManager();
  const { links } = useScreen();
  const backLink = links?.backToLogin || links?.back_to_login;

  const returnToPreviousScreenText =
    texts?.backToLoginLinkText || locales.footer.backButton;

  const handleGoBackAction = async () => {
    await handleBackToLogin();
  };

  return (
    <div>
      {/* Go Back Action */}
      {backLink ? (
        <ULThemeLink href={backLink}>{returnToPreviousScreenText}</ULThemeLink>
      ) : (
        <ULThemeButton onClick={handleGoBackAction} variant="link" size="link">
          {returnToPreviousScreenText}
        </ULThemeButton>
      )}
    </div>
  );
}

export default Footer;
