// Quiz.test.tsx

import { LoadingOverlay, MantineProvider } from "@mantine/core";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { UserContext } from "../App";
import { Quiz } from "../components";

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

const completeMockUser: User = {
  uid: "mockUid",
  displayName: "Mock User",
  email: "mock@example.com",
} as User;

// Mock function for setCurrentUser
const mockSetCurrentUser = jest.fn();

const mockAttemptData = {
  graded: true,
  userScore: 5,
  totalScore: 10,
  questions: {
    mcq: [{ questionId: "1", userAnswer: "4", correctAnswer: "4" }],
    tf: [{ questionId: "2", userAnswer: "3", correctAnswer: "3" }],
    s_ans: [{ questionId: "1", userAnswer: "4", correctAnswer: "4" }],
    l_ans: [{ questionId: "1", userAnswer: "4", correctAnswer: "4" }],
    fill_in_blank: [{ questionId: "1", userAnswer: "4", correctAnswer: "4" }],
  },
};

beforeEach(() => {
  const mockCanvas = {
    getContext: jest.fn().mockReturnValue({
      arc: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      clearRect: jest.fn(),
    }),
  };
  jest
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockImplementation(mockCanvas.getContext);
});

describe("Quiz Component", () => {
  beforeEach(() => {
    // Mock Firestore data fetching
    (collection as jest.Mock).mockReturnValue({});
    (getDocs as jest.Mock).mockResolvedValue({
      empty: false,
      docs: [{ data: () => mockAttemptData }],
    });
  });

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
          <MemoryRouter
            initialEntries={["/courses/test-course/quizzes/test-quiz"]}
          >
            <Routes>
              <Route
                path="/courses/:courseId/quizzes/:quizId"
                element={<Quiz />}
              />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    // Expect the LoadingOverlay to be in the document
    waitFor(() => {
      expect(screen.findByTestId("loading")).toBeInTheDocument();
    });
  });

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
          <MemoryRouter
            initialEntries={["/courses/test-course/quizzes/test-quiz"]}
          >
            <Routes>
              <Route
                path="/courses/:courseId/quizzes/:quizId"
                element={<Quiz />}
              />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    // Expect the LoadingOverlay to be in the document
    waitFor(() => {
      expect(screen.findByTestId("loading")).toBeInTheDocument();
    });
  });

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
          <MemoryRouter
            initialEntries={["/courses/test-course/quizzes/test-quiz"]}
          >
            <Routes>
              <Route
                path="/courses/:courseId/quizzes/:quizId"
                element={<Quiz />}
              />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    // Expect the LoadingOverlay to be in the document
    waitFor(() => {
      expect(screen.findByTestId("loading")).toBeInTheDocument();
    });
  });

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
          <MemoryRouter
            initialEntries={["/courses/test-course/quizzes/test-quiz"]}
          >
            <Routes>
              <Route
                path="/courses/:courseId/quizzes/:quizId"
                element={<Quiz />}
              />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    // Expect the LoadingOverlay to be in the document
    waitFor(() => {
      expect(screen.findByTestId("loading")).toBeInTheDocument();
    });
  });
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
          <MemoryRouter
            initialEntries={["/courses/test-course/quizzes/test-quiz"]}
          >
            <Routes>
              <Route
                path="/courses/:courseId/quizzes/:quizId"
                element={<Quiz />}
              />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    // Expect the LoadingOverlay to be in the document
    waitFor(() => {
      expect(screen.findByTestId("loading")).toBeInTheDocument();
    });
  });
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
          <MemoryRouter
            initialEntries={["/courses/test-course/quizzes/test-quiz"]}
          >
            <Routes>
              <Route
                path="/courses/:courseId/quizzes/:quizId"
                element={<Quiz />}
              />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    // Expect the LoadingOverlay to be in the document
    waitFor(() => {
      expect(screen.findByTestId("loading")).toBeInTheDocument();
    });
  });
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
          <MemoryRouter
            initialEntries={["/courses/test-course/quizzes/test-quiz"]}
          >
            <Routes>
              <Route
                path="/courses/:courseId/quizzes/:quizId"
                element={<Quiz />}
              />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    // Expect the LoadingOverlay to be in the document
    waitFor(() => {
      expect(screen.findByTestId("loading")).toBeInTheDocument();
    });
  });
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
          <MemoryRouter
            initialEntries={["/courses/test-course/quizzes/test-quiz"]}
          >
            <Routes>
              <Route
                path="/courses/:courseId/quizzes/:quizId"
                element={<Quiz />}
              />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    // Expect the LoadingOverlay to be in the document
    waitFor(() => {
      expect(screen.findByTestId("loading")).toBeInTheDocument();
    });
  });
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
          <MemoryRouter
            initialEntries={["/courses/test-course/quizzes/test-quiz"]}
          >
            <Routes>
              <Route
                path="/courses/:courseId/quizzes/:quizId"
                element={<Quiz />}
              />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    // Expect the LoadingOverlay to be in the document
    waitFor(() => {
      expect(screen.findByTestId("loading")).toBeInTheDocument();
    });
  });
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
          <MemoryRouter
            initialEntries={["/courses/test-course/quizzes/test-quiz"]}
          >
            <Routes>
              <Route
                path="/courses/:courseId/quizzes/:quizId"
                element={<Quiz />}
              />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    // Expect the LoadingOverlay to be in the document
    waitFor(() => {
      expect(screen.findByTestId("loading")).toBeInTheDocument();
    });
  });

  test("displays quiz mcq questions", async () => {
    render(
      <MantineProvider>
        <UserContext.Provider
          value={{
            currentUser: completeMockUser,
            setCurrentUser: mockSetCurrentUser,
            isAuthLoading: false,
          }}
        >
          <MemoryRouter
            initialEntries={["/courses/test-course/quizzes/test-quiz"]}
          >
            <Routes>
              <Route
                path="/courses/:courseId/quizzes/:quizId"
                element={<Quiz />}
              />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    waitFor(() => {
      expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
    });
  });

  test("displays quiz tf questions", async () => {
    render(
      <MantineProvider>
        <UserContext.Provider
          value={{
            currentUser: completeMockUser,
            setCurrentUser: mockSetCurrentUser,
            isAuthLoading: false,
          }}
        >
          <MemoryRouter
            initialEntries={["/courses/test-course/quizzes/test-quiz"]}
          >
            <Routes>
              <Route
                path="/courses/:courseId/quizzes/:quizId"
                element={<Quiz />}
              />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    waitFor(() => {
      expect(screen.getByText("What is 4 - 1?")).toBeInTheDocument();
    });
  });

  test("displays quiz s_ans questions", async () => {
    render(
      <MantineProvider>
        <UserContext.Provider
          value={{
            currentUser: completeMockUser,
            setCurrentUser: mockSetCurrentUser,
            isAuthLoading: false,
          }}
        >
          <MemoryRouter
            initialEntries={["/courses/test-course/quizzes/test-quiz"]}
          >
            <Routes>
              <Route
                path="/courses/:courseId/quizzes/:quizId"
                element={<Quiz />}
              />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    waitFor(() => {
      expect(
        screen.getByText("What is the quadratic formula?")
      ).toBeInTheDocument();
    });
  });

  test("displays quiz l_ans questions", async () => {
    render(
      <MantineProvider>
        <UserContext.Provider
          value={{
            currentUser: completeMockUser,
            setCurrentUser: mockSetCurrentUser,
            isAuthLoading: false,
          }}
        >
          <MemoryRouter
            initialEntries={["/courses/test-course/quizzes/test-quiz"]}
          >
            <Routes>
              <Route
                path="/courses/:courseId/quizzes/:quizId"
                element={<Quiz />}
              />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      </MantineProvider>
    );

    waitFor(() => {
      expect(
        screen.getByText("Explain the time complexity of merge sort?")
      ).toBeInTheDocument();
    });
  });

  // test("submits quiz and shows final score", async () => {
  //   const mockSubmit = jest.fn();

  //   render(
  //     <MantineProvider>
  //       <UserContext.Provider
  //         value={{
  //           currentUser: completeMockUser,
  //           setCurrentUser: mockSetCurrentUser,
  //           isAuthLoading: false,
  //         }}
  //       >
  //         <MemoryRouter
  //           initialEntries={["/courses/test-course/quizzes/test-quiz"]}
  //         >
  //           <Routes>
  //             <Route
  //               path="/courses/:courseId/quizzes/:quizId"
  //               element={<Quiz />}
  //             />
  //           </Routes>
  //         </MemoryRouter>
  //       </UserContext.Provider>
  //     </MantineProvider>
  //   );

  //   waitFor(() => {
  //     expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
  //   });

  //   act(() => {
  //     fireEvent.click(screen.getByRole("submit", { name: /Submit/i }));

  //     waitFor(() => {
  //       expect(mockSubmit).toHaveBeenCalledTimes(1); // Ensure submit was called
  //       expect(screen.getByText("Your Score:")).toBeInTheDocument(); // Ensure score display appears
  //     });
  //   });
  // });
});
