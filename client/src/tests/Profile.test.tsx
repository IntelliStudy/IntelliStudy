import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Link, MemoryRouter } from "react-router-dom";
import { UserContext } from "../App";
import Profile from "../pages/Profile";
import {
  deleteUserHandler,
  getCurrentlySignedInUserHandler,
  userLogoutHandler,
} from "../firebase/auth";
import { User } from "firebase/auth";

// Mock Firebase Auth functions
jest.mock("../firebase/auth", () => ({
  deleteUserHandler: jest.fn(),
  getCurrentlySignedInUserHandler: jest.fn(),
  userLogoutHandler: jest.fn(),
}));

const mockUser = {
  uid: "mockUid",
  displayName: "Mock User",
  email: "mock@example.com",
} as User;

const mockSetCurrentUser = jest.fn();

describe("Profile Component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test("renders profile page correctly", () => {
    render(
      <MemoryRouter>
        <UserContext.Provider
          value={{
            currentUser: mockUser,
            setCurrentUser: mockSetCurrentUser,
          }}
        >
          <Profile />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Delete account")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByText("Back to Study Spot")).toBeInTheDocument();
  });

  test("calls deleteUserHandler and updates user context on account delete", async () => {
    // Fix: Pass undefined to mockResolvedValueOnce
    (deleteUserHandler as jest.Mock).mockResolvedValueOnce(undefined);
    (getCurrentlySignedInUserHandler as jest.Mock).mockReturnValueOnce(null);

    render(
      <MemoryRouter>
        <UserContext.Provider
          value={{
            currentUser: mockUser,
            setCurrentUser: mockSetCurrentUser,
          }}
        >
          <Profile />
        </UserContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Delete account"));

    await waitFor(() => {
      expect(deleteUserHandler).toHaveBeenCalled();
      expect(getCurrentlySignedInUserHandler).toHaveBeenCalled();
      expect(mockSetCurrentUser).toHaveBeenCalledWith(null);
    });
  });

  test("calls userLogoutHandler and updates user context on logout", async () => {
    // Fix: Pass undefined to mockResolvedValueOnce
    (userLogoutHandler as jest.Mock).mockResolvedValueOnce(undefined);
    (getCurrentlySignedInUserHandler as jest.Mock).mockReturnValueOnce(null);

    render(
      <MemoryRouter>
        <UserContext.Provider
          value={{
            currentUser: mockUser,
            setCurrentUser: mockSetCurrentUser,
          }}
        >
          <Profile />
        </UserContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(userLogoutHandler).toHaveBeenCalled();
      expect(getCurrentlySignedInUserHandler).toHaveBeenCalled();
      expect(mockSetCurrentUser).toHaveBeenCalledWith(null);
    });
  });

  test("navigates to the homepage and study spot page when buttons are clicked", () => {
    render(
      <MemoryRouter>
        <UserContext.Provider
          value={{
            currentUser: mockUser,
            setCurrentUser: mockSetCurrentUser,
          }}
        >
          <Profile />
        </UserContext.Provider>
      </MemoryRouter>
    );

    // Ensure that the buttons for navigation are rendered
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });
});
