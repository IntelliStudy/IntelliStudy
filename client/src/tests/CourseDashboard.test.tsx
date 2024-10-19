import { MantineProvider, LoadingOverlay, Modal } from "@mantine/core";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { User } from "firebase/auth";
import {
  collection,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { UserContext } from "../App";
import CourseDashboard from "../pages/CourseDashboard";
import { Course } from "../types";

// Mock Firebase Firestore functions
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  getFirestore: jest.fn(() => ({})),
  connectFirestoreEmulator: jest.fn(),
}));

// Mock Firebase Auth functions
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  connectAuthEmulator: jest.fn(),
}));

const completeMockUser: User = {
  uid: "mockUid",
  displayName: "Mock User",
  email: "mock@example.com",
} as User;

const mockCourses: Course[] = [
  {
    id: "course1",
    courseCode: "CS101",
    courseName: "Introduction to Computer Science",
    userId: "mockUid",
    createdAt: "0001-01-01T00:00:00Z" as unknown as Timestamp,
  } as Course,
  {
    id: "course2",
    courseCode: "CS102",
    courseName: "Data Structures",
    userId: "mockUid",
    createdAt: "0001-01-01T00:00:00Z" as unknown as Timestamp,
  } as Course,
];

// Mock setCurrentUser function
const mockSetCurrentUser = jest.fn();

beforeEach(() => {
  // Mock Firestore data fetching
  (collection as jest.Mock).mockReturnValue({});
  (getDocs as jest.Mock).mockResolvedValue({
    empty: false,
    docs: mockCourses.map((course) => ({
      id: course.id,
      data: () => course,
    })),
  });
});

describe("CourseDashboard Component", () => {
  test("renders loading overlay initially", async () => {
    render(
      <MantineProvider>
        <UserContext.Provider
          value={{
            currentUser: completeMockUser,
            setCurrentUser: mockSetCurrentUser,
            isAuthLoading: true,
          }}
        >
          <MemoryRouter initialEntries={["/courses/course1"]}>
            <Routes>
              <Route path="/courses/:courseId" element={<CourseDashboard />} />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    // Check if LoadingOverlay is visible
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  test("displays course content after fetching data", async () => {
    render(
      <MantineProvider>
        <UserContext.Provider
          value={{
            currentUser: completeMockUser,
            setCurrentUser: mockSetCurrentUser,
            isAuthLoading: false,
          }}
        >
          <MemoryRouter initialEntries={["/courses/course1"]}>
            <Routes>
              <Route path="/courses/:courseId" element={<CourseDashboard />} />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Introduction to Computer Science")
      ).toBeInTheDocument();
    });
  });

  test("displays modal for creating quiz", async () => {
    render(
      <MantineProvider>
        <UserContext.Provider
          value={{
            currentUser: completeMockUser,
            setCurrentUser: mockSetCurrentUser,
            isAuthLoading: false,
          }}
        >
          <MemoryRouter initialEntries={["/courses/course1"]}>
            <Routes>
              <Route path="/courses/:courseId" element={<CourseDashboard />} />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    // Simulate opening the quiz modal
    act(() => {
      fireEvent.click(screen.getByText("Create Quiz"));
    });

    await waitFor(() => {
      expect(screen.getByText("Create Quiz")).toBeInTheDocument(); // Modal header
    });
  });

  test("switches to a different course when a new course is selected", async () => {
    render(
      <MantineProvider>
        <UserContext.Provider
          value={{
            currentUser: completeMockUser,
            setCurrentUser: mockSetCurrentUser,
            isAuthLoading: false,
          }}
        >
          <MemoryRouter initialEntries={["/courses/course1"]}>
            <Routes>
              <Route path="/courses/:courseId" element={<CourseDashboard />} />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    // Simulate selecting a different course from the sidebar
    act(() => {
      fireEvent.click(screen.getByText("Data Structures"));
    });

    await waitFor(() => {
      expect(screen.getByText("Data Structures")).toBeInTheDocument();
    });
  });
});
