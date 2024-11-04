import { Navbar } from "../components"; // Adjust the import according to your file structure
import { UserContext } from "../App"; // Adjust the import according to your file structure
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";

const renderWithUserContext = (user: any) => {
  return render(
    <MantineProvider>
      <MemoryRouter>
        <UserContext.Provider value={{ currentUser: user }}>
          <Navbar />
        </UserContext.Provider>
      </MemoryRouter>
    </MantineProvider>
  );
};

describe("Navbar", () => {
  test("renders logo and links when user is logged in", () => {
    renderWithUserContext({ name: "Test User" }); // Mock logged-in user

    // Check that the logo is present and linked to "/studyspot"
    const logoImage = screen.getByRole("img");
    expect(logoImage).toBeInTheDocument();
  });

  test("renders login and signup buttons when user is not logged in", () => {
    renderWithUserContext(null); // Mock no user logged in

    // Check that the logo is present and linked to "/"
    const logoImage = screen.getByRole("img");
    expect(logoImage).toBeInTheDocument();
    waitFor(() => {
      expect(screen.getByRole("link", { name: /logo/i })).toHaveAttribute(
        "href",
        "/"
      );

      // Check for the Login link
      expect(screen.getByRole("link", { name: /Login/i })).toBeInTheDocument();

      // Check for the Sign Up button
      expect(
        screen.getByRole("button", { name: /Sign up/i })
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Sign up/i })).toHaveAttribute(
        "href",
        "/login"
      );
    });
  });
});
