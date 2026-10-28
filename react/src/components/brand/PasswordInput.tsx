import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { BrandInput, type BrandInputProps } from "./BrandInput";

export function PasswordInput({
  onKeyDown,
  onKeyUp,
  onBlur,
  ...props
}: BrandInputProps) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  return (
    <>
      <BrandInput
        {...props}
        type={visible ? "text" : "password"}
        onKeyDown={(event) => {
          setCapsLock(event.getModifierState("CapsLock"));
          onKeyDown?.(event);
        }}
        onKeyUp={(event) => {
          setCapsLock(event.getModifierState("CapsLock"));
          onKeyUp?.(event);
        }}
        onBlur={(event) => {
          setCapsLock(false);
          onBlur?.(event);
        }}
        endAdornment={
          <button
            type="button"
            className="brand-password-toggle"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            onClick={() => setVisible((previous) => !previous)}
          >
            {visible ? (
              <EyeOff aria-hidden="true" />
            ) : (
              <Eye aria-hidden="true" />
            )}
          </button>
        }
      />
      {capsLock && (
        <p className="brand-caps-warning" role="status">
          Caps Lock is on.
        </p>
      )}
    </>
  );
}
