import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import AuthPage from "../pages/AuthPage";

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
});
