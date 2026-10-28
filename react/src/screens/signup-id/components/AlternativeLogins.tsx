import { SocialButton } from "@/components/brand/SocialButton";
import type { SocialConnection } from "@/utils/helpers/socialUtils";

import { useSignupIdManager } from "../hooks/useSignupIdManager";

const AlternativeLogins = () => {
  const { alternateConnections, handleFederatedSignup, locales } =
    useSignupIdManager();

  const handleConnectionSignup = (connection: SocialConnection) => {
    const federatedSignupOptions = {
      connection: connection.name,
      // Include any additional metadata if available
      ...(connection.metadata || {}),
    };

    handleFederatedSignup(federatedSignupOptions);
  };

  // Early return if no connections are available
  if (!alternateConnections || alternateConnections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mt-2">
      {alternateConnections.map((connection: SocialConnection) => {
        if (!connection?.name) {
          return null;
        }

        return (
          <SocialButton
            key={connection.name}
            connection={connection}
            continueWith={locales.social.continueWith}
            onClick={() => handleConnectionSignup(connection)}
          />
        );
      })}
    </div>
  );
};

export default AlternativeLogins;
