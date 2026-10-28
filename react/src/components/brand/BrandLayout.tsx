import { type ReactNode, useState } from "react";

import type {
  ClientMembers,
  OrganizationMembers,
  TransactionMembers,
} from "@auth0/auth0-acul-react/types";
import { Palette, RefreshCw, ShieldCheck } from "lucide-react";

import { BRAND } from "@/brand/brand";

interface BrandLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
  client?: ClientMembers;
  organization?: OrganizationMembers;
  transaction?: TransactionMembers;
  logoAltText: string;
}

const icons = { ShieldCheck, Palette, RefreshCw };

export function BrandLayout({
  children,
  footer,
  client,
  organization,
  transaction,
  logoAltText,
}: BrandLayoutProps) {
  const [failedLogo, setFailedLogo] = useState<string | null>(null);
  return (
    <div className="brand-layout theme-universal">
      <aside className="brand-panel">
        <div className="brand-logo">
          {BRAND.logoSvg ? (
            <span dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }} />
          ) : client?.logoUrl && client.logoUrl !== failedLogo ? (
            <img
              src={client.logoUrl}
              alt={logoAltText}
              onError={() => setFailedLogo(client.logoUrl)}
            />
          ) : (
            BRAND.name
          )}
        </div>
        <span className="brand-mobile-client">{client?.name}</span>
        <div className="brand-panel-content">
          <h1>{BRAND.panel.headline}</h1>
          <ul>
            {BRAND.panel.points.map((point) => {
              const Icon = icons[point.icon];
              return (
                <li key={point.icon}>
                  <Icon aria-hidden="true" size={22} />
                  <span>{point.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="brand-context">
          {client?.name && <span>Signing in to {client.name}</span>}
          {organization?.displayName && (
            <span> · {organization.displayName}</span>
          )}
          {transaction?.locale && <span> · {transaction.locale}</span>}
        </div>
      </aside>
      <main className="brand-main">
        <div className="brand-form-area">
          <div className="brand-card">{children}</div>
          <footer className="brand-footer">
            {footer}
            <p>Protected by Auth0</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
