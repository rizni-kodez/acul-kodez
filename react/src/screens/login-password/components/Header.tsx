import ULThemeSubtitle from "@/components/ULThemeSubtitle";
import ULThemeTitle from "@/components/ULThemeTitle";

import { useLoginPasswordManager } from "../hooks/useLoginPasswordManager";

function Header() {
  const { texts, locales } = useLoginPasswordManager();

  return (
    <>
      <ULThemeTitle>{texts?.title || locales?.heading?.title}</ULThemeTitle>
      <ULThemeSubtitle>
        {texts?.description || locales?.heading?.description}
      </ULThemeSubtitle>
    </>
  );
}

export default Header;
