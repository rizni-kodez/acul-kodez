import ULThemeSubtitle from "@/components/ULThemeSubtitle";
import ULThemeTitle from "@/components/ULThemeTitle";

import { useLoginIdManager } from "../hooks/useLoginIdManager";

function Header() {
  const { texts, locales } = useLoginIdManager();

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
