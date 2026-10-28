import ULThemeLink from "@/components/ULThemeLink";

import { useLoginIdManager } from "../hooks/useLoginIdManager";

function Footer() {
  const { signupLink, isSignupEnabled, texts, locales } = useLoginIdManager();

  if (!signupLink || !isSignupEnabled) {
    return null;
  }

  return (
    <div>
      <span className="pr-1 text-body-text text-(length:--ul-theme-font-body-text-size) font-body">
        {texts?.signupActionText || locales?.footer?.signupActionText}
      </span>
      <ULThemeLink href={signupLink}>
        {texts?.signupActionLinkText || locales?.footer?.signupActionLinkText}
      </ULThemeLink>
    </div>
  );
}

export default Footer;
