import ULThemeSocialProviderButton from "@/components/ULThemeSocialProviderButton";
import type { SocialConnection } from "@/utils/helpers/socialUtils";
import { getSocialProviderDetails } from "@/utils/helpers/socialUtils";

export function SocialButton({
  connection,
  continueWith,
  onClick,
}: {
  connection: SocialConnection;
  continueWith: string;
  onClick: () => void;
}) {
  const { displayName, iconComponent } = getSocialProviderDetails(connection);
  return (
    <ULThemeSocialProviderButton
      displayName={displayName}
      buttonText={`${continueWith} ${displayName}`}
      iconComponent={iconComponent}
      onClick={onClick}
    />
  );
}
