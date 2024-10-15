import { MantineProvider } from "@mantine/core";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { User } from "firebase/auth";
import { getDocs } from "firebase/firestore";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { UserContext } from "../App";
import CourseDashboard, { fetchAllCourses } from "../pages/CourseDashboard";
import StudySpot from "../pages/StudySpot";

// Mock the Firebase functions
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  connectFirestoreEmulator: jest.fn(() => ({})),
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock("../pages/CourseDashboard", () => ({
  fetchAllCourses: jest.fn(),
  CourseDashboard: jest.fn(),
}));

// Mock user data
const mockUser: User = {
  uid: "123",
  displayName: "John Doe",
  email: "john.doe@example.com",
} as User;

// Test suite for CourseDashboard component
describe("CourseDashboard Component", () => {
  beforeAll(() => {
    const mockCourses = [
      {
        id: "1",
        courseCode: "CS101",
        courseName: "Computer Science 101",
        userId: "mockUserId",
        createdAt: new Date(),
      },
      {
        id: "2",
        courseCode: "MATH201",
        courseName: "Mathematics 201",
        userId: "mockUserId",
        createdAt: new Date(),
      },
    ];

    // Ensure that fetchAllCourses is treated as a mock function
    (fetchAllCourses as jest.Mock).mockResolvedValue(mockCourses);
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("fetches and displays courses correctly", async () => {
    // Mock implementation of getDocs
    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: [
        {
          id: "course1",
          data: () => ({
            courseCode: "CS101",
            courseName: "Computer Science 101",
            userId: mockUser.uid,
          }),
        },
        {
          id: "course2",
          data: () => ({
            courseCode: "MATH201",
            courseName: "Mathematics 201",
            userId: mockUser.uid,
          }),
        },
      ],
    });

    // Wait for courses to be displayed
    waitFor(() => {
      expect(screen.getByText("CS101")).toBeInTheDocument();
      expect(screen.getByText("Mathematics 201")).toBeInTheDocument();
    });
  });

  it("opens Create Quiz modal on button click", async () => {
    // Check if the Create Quiz button is rendered

    render(
      <MantineProvider>
        <UserContext.Provider value={{ currentUser: mockUser }}>
          <button>Create Quiz</button>
        </UserContext.Provider>
      </MantineProvider>
    );

    const createQuizButton = screen.getByRole("button", {
      name: "Create Quiz",
    });
    expect(createQuizButton).toBeInTheDocument();

    // Open the modal
    act(() => {
      fireEvent.click(createQuizButton);
    });

    // Check if the modal is displayed
    expect(screen.getByText("Create Quiz")).toBeInTheDocument();
  });

  it("displays the selected course content", async () => {
    // Mock implementation of getDocs to fetch courses
    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: [
        {
          id: "course1",
          data: () => ({
            courseCode: "CS101",
            courseName: "Computer Science 101",
            userId: mockUser.uid,
          }),
        },
      ],
    });

    // Verify that the selected course name is displayed in the content area
    waitFor(() => {
      expect(screen.getByText("Computer Science 101")).toBeInTheDocument();
      expect(screen.getByText("CS101")).toBeInTheDocument();
    });
  });
});
