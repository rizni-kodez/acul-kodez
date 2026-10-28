import ULThemeSubtitle from "@/components/ULThemeSubtitle";
import ULThemeTitle from "@/components/ULThemeTitle";

import { useResetPasswordManager } from "../hooks/useResetPasswordManager";

function Header() {
  const { texts, locales } = useResetPasswordManager();

  // Handle text fallbacks in component
  const title = texts?.title || locales.header.title;
  const description = texts?.description || locales.header.description;

  return (
    <>
      <ULThemeTitle>{title}</ULThemeTitle>
      <ULThemeSubtitle className="mb-6">{description}</ULThemeSubtitle>
    </>
  );
}

export default Header;
