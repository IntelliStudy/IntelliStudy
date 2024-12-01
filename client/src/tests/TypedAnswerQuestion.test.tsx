import { TypedAnswerQuestion } from "../components"; // Adjust the import based on your structure
import { AnswerReference } from "../types/quiz";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";

const mockOnAnswerChange = jest.fn();

const answerReference: AnswerReference = {
  fileName: "reference.pdf",
  pageNumber: "5",
};

const defaultProps = {
  question: "What is the capital of France?",
  questionId: "q1",
  answerReference,
  sectionType: "geography",
  ansBoxSize: 4,
  onAnswerChange: mockOnAnswerChange,
  disabled: false,
  isSubmitted: false,
  userAnswer: "",
  correctAnswer: "Paris",
};

// Create a custom render function that wraps the component in MantineProvider
const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe("TypedAnswerQuestion", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous calls to mock functions
  });

  test("renders the question and answer reference", () => {
    renderWithMantine(
      <TypedAnswerQuestion
        attemptData={{
          correctAnswer: "",
          pointsScored: 0,
          question: "",
          questionId: "",
          userAnswer: "",
        }}
        {...defaultProps}
      />
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      defaultProps.question
    );
    expect(
      screen.getByPlaceholderText("Enter your answer")
    ).toBeInTheDocument();
    expect(screen.getByText("reference.pdf")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("handles answer input change", async () => {
    renderWithMantine(
      <TypedAnswerQuestion
        attemptData={{
          correctAnswer: "",
          pointsScored: 0,
          question: "",
          questionId: "",
          userAnswer: "",
        }}
        {...defaultProps}
      />
    );

    const textarea = screen.getByPlaceholderText(
      "Enter your answer"
    ) as HTMLTextAreaElement;
    await waitFor(() => {
      fireEvent.change(textarea, { target: { value: "Paris" } });
    });

    await waitFor(() => {
      expect(mockOnAnswerChange).toHaveBeenCalledWith(
        defaultProps.sectionType,
        defaultProps.questionId,
        "Paris"
      );
    });
  });

  test("sets answerEntered based on isSubmitted prop", async () => {
    const { rerender } = renderWithMantine(
      <TypedAnswerQuestion
        attemptData={{
          correctAnswer: "",
          pointsScored: 0,
          question: "",
          questionId: "",
          userAnswer: "",
        }}
        {...defaultProps}
      />
    );

    // Rerender with isSubmitted set to true
    rerender(
      <MantineProvider>
        <TypedAnswerQuestion
          attemptData={{
            correctAnswer: "",
            pointsScored: 0,
            question: "",
            questionId: "",
            userAnswer: "",
          }}
          {...defaultProps}
          isSubmitted={true}
          userAnswer="Paris"
        />
      </MantineProvider>
    );

    // Check if the textarea shows the userAnswer
    const textarea = screen.getByPlaceholderText(
      "Enter your answer"
    ) as HTMLTextAreaElement;
    await waitFor(() => {
      expect(textarea.value).toBe("Paris");
    });
  });

  test("clears answerEntered when isSubmitted is false", async () => {
    const { rerender } = renderWithMantine(
      <TypedAnswerQuestion
        attemptData={{
          correctAnswer: "",
          pointsScored: 0,
          question: "",
          questionId: "",
          userAnswer: "",
        }}
        {...defaultProps}
        isSubmitted={true}
        userAnswer="Paris"
      />
    );

    // Rerender with isSubmitted set to false
    rerender(
      <MantineProvider>
        <TypedAnswerQuestion
          attemptData={{
            correctAnswer: "",
            pointsScored: 0,
            question: "",
            questionId: "",
            userAnswer: "",
          }}
          {...defaultProps}
          isSubmitted={false}
        />
      </MantineProvider>
    );

    // Ensure the textarea is empty
    const textarea = screen.getByPlaceholderText(
      "Enter your answer"
    ) as HTMLTextAreaElement;
    await waitFor(() => {
      expect(textarea.value).toBe("");
    });
  });

  test("disables the textarea when disabled prop is true", () => {
    renderWithMantine(
      <TypedAnswerQuestion
        attemptData={{
          correctAnswer: "",
          pointsScored: 0,
          question: "",
          questionId: "",
          userAnswer: "",
        }}
        {...defaultProps}
        disabled={true}
      />
    );

    const textarea = screen.getByPlaceholderText(
      "Enter your answer"
    ) as HTMLTextAreaElement;
    expect(textarea).toBeDisabled();
  });
});
