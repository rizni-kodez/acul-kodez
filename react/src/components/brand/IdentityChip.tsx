import ULThemeLink from "@/components/ULThemeLink";

interface IdentityChipProps {
  identity: string;
  editLink?: string | null;
  editText: string;
}

export function IdentityChip({
  identity,
  editLink,
  editText,
}: IdentityChipProps) {
  return (
    <div className="brand-identity">
      <span>{identity}</span>
      {editLink ? (
        <ULThemeLink href={editLink}>{editText}</ULThemeLink>
      ) : (
        <button type="button" onClick={() => window.history.back()}>
          {editText}
        </button>
      )}
    </div>
  );
}
