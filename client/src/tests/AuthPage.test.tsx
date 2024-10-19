import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import AuthPage from "../pages/AuthPage";
import userEvent from "@testing-library/user-event";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>
    <MemoryRouter>{children}</MemoryRouter>
  </MantineProvider>
);

describe("AuthPage", () => {
  beforeEach(() => {
    render(
      <Wrapper>
        <AuthPage />
      </Wrapper>
    );
  });

  test("renders the logo image", () => {
    const logoImage = screen.getByRole("img");
    expect(logoImage).toBeInTheDocument();
  });

  test("renders login form", () => {
    const loginTitle = screen.getByText(/Welcome back/i);
    expect(loginTitle).toBeInTheDocument();

    const emailInputs = screen.getAllByLabelText(/Email/i);
    expect(emailInputs.length).toBeGreaterThan(0);
    expect(emailInputs[0]).toBeInTheDocument();

    const passwordInput = screen.getAllByLabelText(/Password/i);
    expect(passwordInput.length).toBeGreaterThan(0);
    expect(passwordInput[0]).toBeInTheDocument();

    const loginButtons = screen.getAllByRole("button", { name: /Login/i });
    expect(loginButtons.length).toBeGreaterThan(0);
    expect(loginButtons[0]).toBeInTheDocument();
  });

  test("renders sign up form", () => {
    const signUpTitle = screen.getByText(/Sign up now/i);
    expect(signUpTitle).toBeInTheDocument();

    const firstNameInput = screen.getByLabelText(/First Name/i);
    expect(firstNameInput).toBeInTheDocument();

    const lastNameInput = screen.getByLabelText(/Last Name/i);
    expect(lastNameInput).toBeInTheDocument();

    const signUpButton = screen.getAllByRole("button", { name: /Sign Up/i });
    expect(signUpButton.length).toBeGreaterThan(0);
    expect(signUpButton[0]).toBeInTheDocument();
  });

  test("renders toggle link between login and sign up", () => {
    const toggleToSignUp = screen.getByText(/create account/i);
    expect(toggleToSignUp).toBeInTheDocument();

    const toggleToLogin = screen.getByText(/Don't have an account yet?/i);
    expect(toggleToLogin).toBeInTheDocument();
  });

  test("renders 'forgot password?' link", () => {
    const forgotPasswordLink = screen.getByRole("button", {
      name: /forgot password\?/i,
    });
    expect(forgotPasswordLink).toBeInTheDocument();
  });

  test("submits login form", async () => {
    const emailInput = screen.getAllByLabelText(/Email/i);
    const passwordInput = screen.getAllByLabelText(/Password/i);
    const loginButton = screen.getAllByRole("button", { name: /Login/i });

    await userEvent.type(emailInput[0], "testuser@example.com");
    await userEvent.type(passwordInput[0], "password123");
    await userEvent.click(loginButton[0]);

    // You can check for side effects like a navigation call or a success message
    // Add mock or assertion for API call or navigation
    expect(screen.queryByText(/Logging in with:/i)).toBeInTheDocument();
  });

  // Test for sign-up form submission
  test("submits sign-up form", async () => {
    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    const signUpButton = screen.getByRole("button", { name: /Sign up/i });

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.type(confirmPasswordInput, "password123");

    await userEvent.click(signUpButton);

    // Similar to login, check for side effects (like navigation or notification)
    expect(screen.queryByText(/Signing up with:/i)).toBeInTheDocument();
  });
});
