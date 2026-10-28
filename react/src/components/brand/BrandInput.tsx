import {
  ULThemeFloatingLabelField,
  type ULThemeFloatingLabelFieldProps,
} from "@/components/form/ULThemeFloatingLabelField";
import { ULThemeFormMessage } from "@/components/form/ULThemeFormMessage";
import { useFormField } from "@/components/ui/form";

export interface BrandInputProps extends ULThemeFloatingLabelFieldProps {
  errorMessage?: string;
  hasFormError?: boolean;
}

export function BrandInput({
  errorMessage,
  hasFormError,
  error,
  ...props
}: BrandInputProps) {
  const { formMessageId } = useFormField();
  const invalid = !!error || !!errorMessage || !!hasFormError;
  const messageId = `${formMessageId}-brand`;
  return (
    <>
      <ULThemeFloatingLabelField
        {...props}
        error={invalid}
        aria-invalid={invalid}
        aria-describedby={invalid ? messageId : undefined}
      />
      <div id={messageId}>
        <ULThemeFormMessage
          sdkError={errorMessage}
          hasFormError={hasFormError}
        />
      </div>
    </>
  );
}
