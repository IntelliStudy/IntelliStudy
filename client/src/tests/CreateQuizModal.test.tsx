import { CreateQuizModal } from "../components";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { UserContext } from "../App";
import { User } from "firebase/auth";
import { MemoryRouter } from "react-router-dom";
const mockNavigate = jest.fn();
const completeMockUser: User = {
  uid: "mockUid",
  displayName: "Mock User",
  email: "mock@example.com",
} as User;
const mockSetCurrentUser = jest.fn();
const mockCourseId = "course456"; // Mock course ID

// Mock the Firebase functions used in the component
jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn().mockResolvedValue({ id: "quiz789" }),
  collection: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({ docs: [] }),
  updateDoc: jest.fn(),
}));

// Mock Firebase Firestore functions
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  getFirestore: jest.fn(() => ({})),
  connectFirestoreEmulator: jest.fn(),
}));

// Mock the utilities used in the component
jest.mock("../utilities/quizUtilities", () => ({
  calculateFinalScore: jest.fn(),
  createAttemptDocument: jest.fn(),
  validateAnswers: jest.fn(),
  validateAnswersForAttempt: jest.fn(),
}));

// Mock Firebase Auth functions
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  connectAuthEmulator: jest.fn(),
}));

// Mock Firebase Storage functions
jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(() => ({})),
  connectStorageEmulator: jest.fn(),
}));

// Create a custom render function that wraps the component in MantineProvider and UserContext
const renderWithContext = (ui) =>
  render(
    <MantineProvider>
      <MemoryRouter>
        <UserContext.Provider
          value={{
            currentUser: completeMockUser,
            setCurrentUser: mockSetCurrentUser,
          }}
        >
          {ui}
        </UserContext.Provider>
      </MemoryRouter>
    </MantineProvider>
  );

describe("CreateQuizModal", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous calls to mock functions
  });

  test("renders the modal and form elements", () => {
    renderWithContext(<CreateQuizModal courseId={mockCourseId} />);

    expect(screen.getByLabelText("Quiz Name")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  test("disables the submit button when no question type is selected", () => {
    renderWithContext(<CreateQuizModal courseId={mockCourseId} />);

    expect(screen.getByRole("button", { name: /create/i })).toBeDisabled();
  });
});
