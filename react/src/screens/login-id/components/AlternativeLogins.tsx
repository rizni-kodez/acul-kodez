import { SocialButton } from "@/components/brand/SocialButton";
import ULThemeSocialProviderButton from "@/components/ULThemeSocialProviderButton";
import { getIcon } from "@/utils/helpers/iconUtils";
import type { SocialConnection } from "@/utils/helpers/socialUtils";

import { useLoginIdManager } from "../hooks/useLoginIdManager";

const AlternativeLogins = () => {
  const {
    texts,
    locales,
    isPasskeyEnabled,
    alternateConnections,
    handleFederatedLogin,
    handlePasskeyLogin,
  } = useLoginIdManager();

  // Handle text fallbacks in component
  const passkeyButtonText =
    texts?.passkeyButtonText || locales?.alternativeLogins?.passkeyButtonText;

  const handleConnectionLogin = (connection: SocialConnection) => {
    const federatedLoginOptions = {
      connection: connection.name,
      ...(connection.metadata || {}),
    };

    handleFederatedLogin(federatedLoginOptions);
  };

  const showPasskeyButton = isPasskeyEnabled;

  return (
    <>
      <div className="space-y-3 mt-2">
        {showPasskeyButton && (
          <ULThemeSocialProviderButton
            key="passkey"
            displayName={locales?.alternativeLogins?.passkeyLabel}
            buttonText={passkeyButtonText}
            iconComponent={<span className="text-primary">{getIcon()}</span>}
            onClick={() => handlePasskeyLogin()}
          />
        )}
        {alternateConnections?.map((connection: SocialConnection) => {
          if (!connection?.name) {
            return null;
          }

          return (
            <SocialButton
              key={connection.name}
              connection={connection}
              continueWith={locales.alternativeLogins.continueWithText}
              onClick={() => handleConnectionLogin(connection)}
            />
          );
        })}
      </div>
    </>
  );
};

export default AlternativeLogins;
