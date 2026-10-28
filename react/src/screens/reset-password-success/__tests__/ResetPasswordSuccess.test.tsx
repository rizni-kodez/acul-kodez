import {
  useErrors,
  useScreen,
} from "@auth0/auth0-acul-react/reset-password-success";
import { render, screen } from "@testing-library/react";

import ResetPasswordSuccessScreen from "../index";

describe("ResetPasswordSuccessScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with success message", () => {
    render(<ResetPasswordSuccessScreen />);

    expect(screen.getByText(/Password Changed!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Your password has been changed successfully/i)
    ).toBeInTheDocument();
  });

  it("sets correct document title from SDK", () => {
    render(<ResetPasswordSuccessScreen />);

    expect(document.title).toBe("Password Reset Complete");
  });

  it("shows context-provided login links and focuses general errors", () => {
    const originalScreen = (useScreen as jest.Mock)();
    const originalErrors = (useErrors as jest.Mock)();
    (useScreen as jest.Mock).mockReturnValue({
      ...originalScreen,
      links: { login: "/login-from-context" },
    });
    (useErrors as jest.Mock).mockReturnValue({
      errors: {
        byType: () => [{ id: "error", message: "Please try again." }],
      },
      hasError: true,
      dismiss: jest.fn(),
    });
    render(<ResetPasswordSuccessScreen />);
    expect(
      screen.getByRole("link", { name: "Continue to login" })
    ).toHaveAttribute("href", "/login-from-context");
    expect(screen.getByRole("alert")).toHaveFocus();
    (useScreen as jest.Mock).mockReturnValue(originalScreen);
    (useErrors as jest.Mock).mockReturnValue(originalErrors);
  });

  it("sets fallback title when texts is missing", () => {
    (useScreen as jest.Mock).mockReturnValueOnce({
      name: "reset-password-success",
      texts: undefined,
      isCaptchaAvailable: false,
      captchaProvider: null,
      captchaSiteKey: null,
      captchaImage: null,
      captcha: null,
      links: null,
      data: {},
      backLink: null,
      loginLink: null,
    });

    render(<ResetPasswordSuccessScreen />);

    expect(document.title).toBe("Password reset successful");
  });
});
