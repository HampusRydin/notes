import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AuthForm from "./AuthForm";

describe("AuthForm", () => {
  it("renders email and password inputs and buttons", () => {
    render(
      <AuthForm
        onRegister={vi.fn()}
        onLogin={vi.fn()}
        message="Test message"
      />
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /login/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("calls onLogin with email and password when Login is clicked", () => {
    const handleLogin = vi.fn();

    render(
      <AuthForm
        onRegister={vi.fn()}
        onLogin={handleLogin}
        message=""
      />
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(loginButton);

    expect(handleLogin).toHaveBeenCalledTimes(1);
    expect(handleLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });
});
