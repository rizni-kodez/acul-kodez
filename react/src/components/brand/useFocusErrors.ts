import { useEffect, useRef } from "react";

export function useFocusErrors<T extends HTMLElement = HTMLFormElement>(
  hasError: boolean
) {
  const formRef = useRef<T>(null);

  useEffect(() => {
    if (!hasError) return;
    const target = formRef.current?.querySelector<HTMLElement>(
      '[role="alert"], [aria-invalid="true"]'
    );
    if (target) {
      if (!target.matches("input, button, a, select, textarea")) {
        target.tabIndex = -1;
      }
      target.focus();
    }
  }, [hasError]);

  return formRef;
}
