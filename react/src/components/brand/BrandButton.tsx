import type { ComponentProps } from "react";

import { LoaderCircle } from "lucide-react";

import { ULThemeButton } from "@/components/ULThemeButton";

type BrandButtonProps = ComponentProps<typeof ULThemeButton> & {
  loading?: boolean;
  fullWidth?: boolean;
};

export function BrandButton({
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}: BrandButtonProps) {
  return (
    <ULThemeButton
      {...props}
      className={[fullWidth && "w-full", className].filter(Boolean).join(" ")}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading && <LoaderCircle className="animate-spin" aria-hidden="true" />}
      {children}
    </ULThemeButton>
  );
}
