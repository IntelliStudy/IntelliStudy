import { MantineProvider } from "@mantine/core";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { User } from "firebase/auth";
import { addDoc, getDocs } from "firebase/firestore";
import { UserContext } from "../App";
import StudySpot from "../pages/StudySpot";

// Mock the Firebase functions
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  connectFirestoreEmulator: jest.fn(() => ({})),
  addDoc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  serverTimestamp: jest.fn(() => "mockedTimestamp"),
}));

// Mock user data
const mockUser: User = {
  uid: "123",
  displayName: "John Doe",
  email: "john.doe@example.com",
} as User;

// Test suite for StudySpot component
describe("StudySpot Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("renders without crashing", () => {
    render(
      <MantineProvider>
        <UserContext.Provider value={{ currentUser: mockUser }}>
          <StudySpot />
        </UserContext.Provider>
      </MantineProvider>
    );

    expect(screen.getByText(/Study Spot/i)).toBeInTheDocument(); // Check if the title is rendered
  });

  it("allows the user to add a course", async () => {
    // Mock implementation of Firebase functions
    (addDoc as jest.Mock).mockResolvedValueOnce({ id: "course_id" });
    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: [{ id: "course_id", data: () => ({ title: "New Course" }) }],
    });

    render(
      <MantineProvider>
        <UserContext.Provider value={{ currentUser: mockUser }}>
          <StudySpot />
        </UserContext.Provider>
      </MantineProvider>
    );

    // Open the modal
    act(() => {
      fireEvent.click(screen.getByText(/Add Course/i));
    });

    // Wait for modal to appear and fill form
    await waitFor(() =>
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    );
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "New Course" },
    });
    fireEvent.change(screen.getByLabelText(/Course Code/i), {
      target: { value: "NC 123" },
    });

    // Submit the form
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

      // Check if the course was added successfully
      waitFor(() => {
        expect(screen.getByText("NC 123")).toBeInTheDocument();
      });
    });
  });

  it("fetches and displays existing courses", async () => {
    // Mock implementation of getDocs
    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: [
        { id: "course1", data: () => ({ title: "Course 1" }) },
        { id: "course2", data: () => ({ title: "Course 2" }) },
      ],
    });

    render(
      <MantineProvider>
        <UserContext.Provider value={{ currentUser: mockUser }}>
          <StudySpot />
        </UserContext.Provider>
      </MantineProvider>
    );

    // Wait for courses to be displayed
    waitFor(() => {
      expect(screen.getByText(/Course 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Course 2/i)).toBeInTheDocument();
    });
  });
});
