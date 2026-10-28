import ULThemeSubtitle from "@/components/ULThemeSubtitle";
import ULThemeTitle from "@/components/ULThemeTitle";

import { useSignupPasswordManager } from "../hooks/useSignupPasswordManager";

function Header() {
  const { texts, locales } = useSignupPasswordManager();

  // Use locale strings with fallback to SDK texts
  const title = texts?.title || locales.header.title;
  const description = texts?.description || locales.header.description;

  return (
    <>
      <ULThemeTitle>{title}</ULThemeTitle>
      <ULThemeSubtitle>{description}</ULThemeSubtitle>
    </>
  );
}

export default Header;
